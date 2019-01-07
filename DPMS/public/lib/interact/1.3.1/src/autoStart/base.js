const utils = require('../utils');

function init (scope) {
  const {
    interact,
    Interactable,
    Interaction,
    defaults,
    Signals,
  } = scope;

  interact.use(require('./InteractableMethods'));

  // set cursor style on mousedown
  Interaction.signals.on('down', function ({ interaction, pointer, event, eventTarget }) {
    if (interaction.interacting()) { return; }

    const actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
    prepare(interaction, actionInfo, scope);
  });

  // set cursor style on mousemove
  Interaction.signals.on('move', function ({ interaction, pointer, event, eventTarget }) {
    if (interaction.pointerType !== 'mouse'
        || interaction.pointerIsDown
        || interaction.interacting()) { return; }

    const actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
    prepare(interaction, actionInfo, scope);
  });

  Interaction.signals.on('move', function (arg) {
    const { interaction, event } = arg;

    if (!interaction.pointerIsDown
        || interaction.interacting()
        || !interaction.pointerWasMoved
        || !interaction.prepared.name) {
      return;
    }

    scope.autoStart.signals.fire('before-start', arg);

    const target = interaction.target;

    if (interaction.prepared.name && target) {
      // check manualStart and interaction limit
      if (target.options[interaction.prepared.name].manualStart
          || !withinInteractionLimit(target, interaction.element, interaction.prepared, scope)) {
        interaction.stop(event);
      }
      else {
        interaction.start(interaction.prepared, target, interaction.element);
      }
    }
  });

  Interaction.signals.on('stop', function ({ interaction }) {
    const target = interaction.target;

    if (target && target.options.styleCursor) {
      target._doc.documentElement.style.cursor = '';
    }
  });

  interact.maxInteractions = maxInteractions;

  Interactable.settingsMethods.push('styleCursor');
  Interactable.settingsMethods.push('actionChecker');
  Interactable.settingsMethods.push('ignoreFrom');
  Interactable.settingsMethods.push('allowFrom');

  defaults.base.actionChecker = null;
  defaults.base.styleCursor = true;

  utils.extend(defaults.perAction, autoStart.defaults.perAction);

  /**
   * Returns or sets the maximum number of concurrent interactions allowed.  By
   * default only 1 interaction is allowed at a time (for backwards
   * compatibility). To allow multiple interactions on the same Interactables and
   * elements, you need to enable it in the draggable, resizable and gesturable
   * `'max'` and `'maxPerElement'` options.
   *
   * @alias module:interact.maxInteractions
   *
   * @param {number} [newValue] Any number. newValue <= 0 means no interactions.
   */
  interact.maxInteractions = newValue => maxInteractions(newValue, scope);
  scope.autoStart = {
    // Allow this many interactions to happen simultaneously
    maxInteractions: Infinity,
    signals: Signals.new(),
    defaults: {
      base: utils.extend({}, module.exports.defaults.base),
      perAction: utils.extend({}, module.exports.defaults.perAction),
    },
    setActionDefaults: function (action) {
      utils.extend(action.defaults, autoStart.defaults.perAction);
    },
  };
}

// Check if the current target supports the action.
// If so, return the validated action. Otherwise, return null
function validateAction (action, interactable, element, eventTarget, scope) {
  if (utils.is.object(action)
      && interactable.testIgnoreAllow(interactable.options[action.name], element, eventTarget)
      && interactable.options[action.name].enabled
      && withinInteractionLimit(interactable, element, action, scope)) {
    return action;
  }

  return null;
}

function validateSelector (interaction, pointer, event, matches, matchElements, eventTarget, scope) {
  for (let i = 0, len = matches.length; i < len; i++) {
    const match = matches[i];
    const matchElement = matchElements[i];
    const action = validateAction(
      match.getAction(pointer, event, interaction, matchElement),
      match,
      matchElement,
      eventTarget,
      scope);

    if (action) {
      return {
        action,
        target: match,
        element: matchElement,
      };
    }
  }

  return {};
}

function getActionInfo (interaction, pointer, event, eventTarget, scope) {
  let matches = [];
  let matchElements = [];

  let element = eventTarget;

  function pushMatches (interactable) {
    matches.push(interactable);
    matchElements.push(element);
  }

  while (utils.is.element(element)) {
    matches = [];
    matchElements = [];

    scope.interactables.forEachMatch(element, pushMatches);

    const actionInfo = validateSelector(interaction, pointer, event, matches, matchElements, eventTarget, scope);

    if (actionInfo.action
      && !actionInfo.target.options[actionInfo.action.name].manualStart) {
      return actionInfo;
    }

    element = utils.parentNode(element);
  }

  return {};
}

function prepare (interaction, { action, target, element }, scope) {
  action = action || {};

  if (interaction.target && interaction.target.options.styleCursor) {
    interaction.target._doc.documentElement.style.cursor = '';
  }

  interaction.target = target;
  interaction.element = element;
  utils.copyAction(interaction.prepared, action);

  if (target && target.options.styleCursor) {
    const cursor = action? scope.actions[action.name].getCursor(action) : '';
    interaction.target._doc.documentElement.style.cursor = cursor;
  }

  scope.autoStart.signals.fire('prepared', { interaction: interaction });
}

function withinInteractionLimit (interactable, element, action, scope) {
  const options = interactable.options;
  const maxActions = options[action.name].max;
  const maxPerElement = options[action.name].maxPerElement;
  const autoStartMax = scope.autoStart.maxInteractions;
  let activeInteractions = 0;
  let targetCount = 0;
  let targetElementCount = 0;

  // no actions if any of these values == 0
  if (!(maxActions && maxPerElement && autoStartMax)) { return; }

  for (const interaction of scope.interactions) {
    const otherAction = interaction.prepared.name;

    if (!interaction.interacting()) { continue; }

    activeInteractions++;

    if (activeInteractions >= autoStartMax) {
      return false;
    }

    if (interaction.target !== interactable) { continue; }

    targetCount += (otherAction === action.name)|0;

    if (targetCount >= maxActions) {
      return false;
    }

    if (interaction.element === element) {
      targetElementCount++;

      if (otherAction !== action.name || targetElementCount >= maxPerElement) {
        return false;
      }
    }
  }

  return autoStartMax > 0;
}

function maxInteractions (newValue, scope) {
  if (utils.is.number(newValue)) {
    scope.autoStart.maxInteractions = newValue;

    return this;
  }

  return scope.autoStart.maxInteractions;
}

const autoStart = module.exports = {
  init,
  maxInteractions,
  withinInteractionLimit,
  defaults: {
    perAction: {
      manualStart: false,
      max: Infinity,
      maxPerElement: 1,
      allowFrom:  null,
      ignoreFrom: null,

      // only allow left button by default
      // see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons#Return_value
      mouseButtons: 1,
    },
  },
  validateAction,
};
