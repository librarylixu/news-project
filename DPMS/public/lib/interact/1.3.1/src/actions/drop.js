const utils = require('../utils');

function init (scope) {
  const {
    actions,
    /** @lends module:interact */
    interact,
    InteractEvent,
    /** @lends Interactable */
    Interactable,
    Interaction,
    defaults,
  } = scope;

  let dynamicDrop = false;

  Interaction.signals.on('action-start', function ({ interaction, event }) {
    if (interaction.prepared.name !== 'drag') { return; }

    // reset active dropzones
    interaction.activeDrops = null;
    interaction.dropEvents = null;

    if (!interaction.dynamicDrop) {
      interaction.activeDrops = getActiveDrops(scope, interaction.element);
    }

    const dragEvent = interaction.prevEvent;
    const dropEvents = getDropEvents(interaction, event, dragEvent);

    if (dropEvents.activate) {
      fireActivationEvents(interaction.activeDrops, dropEvents.activate);
    }
  });

  InteractEvent.signals.on('new', function ({ interaction, iEvent, event }) {
    if (iEvent.type !== 'dragmove' && iEvent.type !== 'dragend') { return; }

    if (dynamicDrop) {
      interaction.activeDrops = getActiveDrops(scope, interaction.element);
    }

    const dragEvent = iEvent;
    const dropResult = getDrop(interaction, dragEvent, event);

    interaction.dropTarget  = dropResult && dropResult.dropzone;
    interaction.dropElement = dropResult && dropResult.element;

    interaction.dropEvents = getDropEvents(interaction, event, dragEvent);
  });

  Interaction.signals.on('action-move', function ({ interaction }) {
    if (interaction.prepared.name !== 'drag') { return; }

    fireDropEvents(interaction, interaction.dropEvents);
  });

  Interaction.signals.on('action-end', function ({ interaction }) {
    if (interaction.prepared.name === 'drag') {
      fireDropEvents(interaction, interaction.dropEvents);
    }
  });

  Interaction.signals.on('stop-drag', function ({ interaction }) {
    interaction.activeDrops = null;
    interaction.dropEvents = null;
  });

  /**
   * ```js
   * interact(target)
   * .dropChecker(function(dragEvent,         // related dragmove or dragend event
   *                       event,             // TouchEvent/PointerEvent/MouseEvent
   *                       dropped,           // bool result of the default checker
   *                       dropzone,          // dropzone Interactable
   *                       dropElement,       // dropzone elemnt
   *                       draggable,         // draggable Interactable
   *                       draggableElement) {// draggable element
   *
   *   return dropped && event.target.hasAttribute('allow-drop');
   * }
   * ```
   *
   * ```js
   * interact('.drop').dropzone({
   *   accept: '.can-drop' || document.getElementById('single-drop'),
   *   overlap: 'pointer' || 'center' || zeroToOne
   * }
   * ```
   *
   * Returns or sets whether draggables can be dropped onto this target to
   * trigger drop events
   *
   * Dropzones can receive the following events:
   *  - `dropactivate` and `dropdeactivate` when an acceptable drag starts and ends
   *  - `dragenter` and `dragleave` when a draggable enters and leaves the dropzone
   *  - `dragmove` when a draggable that has entered the dropzone is moved
   *  - `drop` when a draggable is dropped into this dropzone
   *
   * Use the `accept` option to allow only elements that match the given CSS
   * selector or element. The value can be:
   *
   *  - **an Element** - only that element can be dropped into this dropzone.
   *  - **a string**, - the element being dragged must match it as a CSS selector.
   *  - **`null`** - accept options is cleared - it accepts any element.
   *
   * Use the `overlap` option to set how drops are checked for. The allowed
   * values are:
   *
   *   - `'pointer'`, the pointer must be over the dropzone (default)
   *   - `'center'`, the draggable element's center must be over the dropzone
   *   - a number from 0-1 which is the `(intersection area) / (draggable area)`.
   *   e.g. `0.5` for drop to happen when half of the area of the draggable is
   *   over the dropzone
   *
   * Use the `checker` option to specify a function to check if a dragged element
   * is over this Interactable.
   *
   * @param {boolean | object | null} [options] The new options to be set.
   * @return {boolean | Interactable} The current setting or this Interactable
   */
  Interactable.prototype.dropzone = function (options) {
    if (utils.is.object(options)) {
      this.options.drop.enabled = options.enabled === false? false: true;

      if (utils.is.function(options.ondrop)          ) { this.events.ondrop           = options.ondrop          ; }
      if (utils.is.function(options.ondropactivate)  ) { this.events.ondropactivate   = options.ondropactivate  ; }
      if (utils.is.function(options.ondropdeactivate)) { this.events.ondropdeactivate = options.ondropdeactivate; }
      if (utils.is.function(options.ondragenter)     ) { this.events.ondragenter      = options.ondragenter     ; }
      if (utils.is.function(options.ondragleave)     ) { this.events.ondragleave      = options.ondragleave     ; }
      if (utils.is.function(options.ondropmove)      ) { this.events.ondropmove       = options.ondropmove      ; }

      if (/^(pointer|center)$/.test(options.overlap)) {
        this.options.drop.overlap = options.overlap;
      }
      else if (utils.is.number(options.overlap)) {
        this.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
      }
      if ('accept' in options) {
        this.options.drop.accept = options.accept;
      }
      if ('checker' in options) {
        this.options.drop.checker = options.checker;
      }


      return this;
    }

    if (utils.is.bool(options)) {
      this.options.drop.enabled = options;

      if (!options) {
        this.ondragenter = this.ondragleave = this.ondrop
          = this.ondropactivate = this.ondropdeactivate = null;
      }

      return this;
    }

    return this.options.drop;
  };

  Interactable.prototype.dropCheck = function (dragEvent, event, draggable, draggableElement, dropElement, rect) {
    let dropped = false;

    // if the dropzone has no rect (eg. display: none)
    // call the custom dropChecker or just return false
    if (!(rect = rect || this.getRect(dropElement))) {
      return (this.options.drop.checker
        ? this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement)
        : false);
    }

    const dropOverlap = this.options.drop.overlap;

    if (dropOverlap === 'pointer') {
      const origin = utils.getOriginXY(draggable, draggableElement, 'drag');
      const page = utils.getPageXY(dragEvent);

      page.x += origin.x;
      page.y += origin.y;

      const horizontal = (page.x > rect.left) && (page.x < rect.right);
      const vertical   = (page.y > rect.top ) && (page.y < rect.bottom);

      dropped = horizontal && vertical;
    }

    const dragRect = draggable.getRect(draggableElement);

    if (dragRect && dropOverlap === 'center') {
      const cx = dragRect.left + dragRect.width  / 2;
      const cy = dragRect.top  + dragRect.height / 2;

      dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
    }

    if (dragRect && utils.is.number(dropOverlap)) {
      const overlapArea  = (Math.max(0, Math.min(rect.right , dragRect.right ) - Math.max(rect.left, dragRect.left))
                            * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top , dragRect.top )));

      const overlapRatio = overlapArea / (dragRect.width * dragRect.height);

      dropped = overlapRatio >= dropOverlap;
    }

    if (this.options.drop.checker) {
      dropped = this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement);
    }

    return dropped;
  };

  Interactable.signals.on('unset', function ({ interactable }) {
    interactable.dropzone(false);
  });

  Interactable.settingsMethods.push('dropChecker');

  Interaction.signals.on('new', function (interaction) {
    interaction.dropTarget      = null; // the dropzone a drag target might be dropped into
    interaction.dropElement     = null; // the element at the time of checking
    interaction.prevDropTarget  = null; // the dropzone that was recently dragged away from
    interaction.prevDropElement = null; // the element at the time of checking
    interaction.dropEvents      = null; // the dropEvents related to the current drag event
    interaction.activeDrops     = null; // an array of { dropzone, element, rect }
  });

  Interaction.signals.on('stop', function ({ interaction }) {
    interaction.dropTarget = interaction.dropElement =
      interaction.prevDropTarget = interaction.prevDropElement = null;
  });

  /**
   * Returns or sets whether the dimensions of dropzone elements are calculated
   * on every dragmove or only on dragstart for the default dropChecker
   *
   * @param {boolean} [newValue] True to check on each move. False to check only
   * before start
   * @return {boolean | interact} The current setting or interact
   */
  interact.dynamicDrop = function (newValue) {
    if (utils.is.bool(newValue)) {
      //if (dragging && dynamicDrop !== newValue && !newValue) {
        //calcRects(dropzones);
      //}

      dynamicDrop = newValue;

      return interact;
    }
    return dynamicDrop;
  };

  utils.merge(Interactable.eventTypes, [
    'dragenter',
    'dragleave',
    'dropactivate',
    'dropdeactivate',
    'dropmove',
    'drop',
  ]);
  actions.methodDict.drop = 'dropzone';

  defaults.drop = module.exports.defaults;
}

function collectDrops ({ interactables }, draggableElement) {
  const drops = [];

  // collect all dropzones and their elements which qualify for a drop
  for (const dropzone of interactables) {
    if (!dropzone.options.drop.enabled) { continue; }

    const accept = dropzone.options.drop.accept;

    // test the draggable draggableElement against the dropzone's accept setting
    if ((utils.is.element(accept) && accept !== draggableElement)
        || (utils.is.string(accept)
        && !utils.matchesSelector(draggableElement, accept))) {

      continue;
    }

    // query for new elements if necessary
    const dropElements = utils.is.string(dropzone.target)
      ? dropzone._context.querySelectorAll(dropzone.target)
      : [dropzone.target];

    for (const dropzoneElement of dropElements) {
      if (dropzoneElement !== draggableElement) {
        drops.push({
          dropzone,
          element: dropzoneElement,
        });
      }
    }
  }

  return drops;
}

function fireActivationEvents (activeDrops, event) {
  let prevElement;

  // loop through all active dropzones and trigger event
  for (const { dropzone, element } of activeDrops) {

    // prevent trigger of duplicate events on same element
    if (element !== prevElement) {
      // set current element as event target
      event.target = element;
      dropzone.fire(event);
    }
    prevElement = element;
  }
}

// return a new array of possible drops. getActiveDrops should always be
// called when a drag has just started or a drag event happens while
// dynamicDrop is true
function getActiveDrops (scope, dragElement) {
  // get dropzones and their elements that could receive the draggable
  const activeDrops = collectDrops(scope, dragElement);

  for (const activeDrop of activeDrops) {
    activeDrop.rect = activeDrop.dropzone.getRect(activeDrop.element);
  }

  return activeDrops;
}

function getDrop ({ activeDrops, target: draggable, element: dragElement }, dragEvent, pointerEvent) {
  const { interaction } = dragEvent;

  const validDrops = [];

  // collect all dropzones and their elements which qualify for a drop
  for (const { dropzone, element: dropzoneElement, rect } of activeDrops) {
    validDrops.push(dropzone.dropCheck(dragEvent, pointerEvent, draggable, dragElement, dropzoneElement, rect)
      ? dropzoneElement
      : null);
  }

  // get the most appropriate dropzone based on DOM depth and order
  const dropIndex = utils.indexOfDeepestElement(validDrops);

  return interaction.activeDrops[dropIndex] || null;
}

function getDropEvents (interaction, pointerEvent, dragEvent) {
  const dropEvents = {
    enter     : null,
    leave     : null,
    activate  : null,
    deactivate: null,
    move      : null,
    drop      : null,
  };

  const tmpl = {
    dragEvent,
    interaction,
    target       : interaction.dropElement,
    dropzone     : interaction.dropTarget,
    relatedTarget: dragEvent.target,
    draggable    : dragEvent.interactable,
    timeStamp    : dragEvent.timeStamp,
  };

  if (interaction.dropElement !== interaction.prevDropElement) {
    // if there was a prevDropTarget, create a dragleave event
    if (interaction.prevDropTarget) {
      dropEvents.leave = utils.extend({ type: 'dragleave' }, tmpl);

      dragEvent.dragLeave    = dropEvents.leave.target   = interaction.prevDropElement;
      dragEvent.prevDropzone = dropEvents.leave.dropzone = interaction.prevDropTarget;
    }
    // if the dropTarget is not null, create a dragenter event
    if (interaction.dropTarget) {
      dropEvents.enter = {
        dragEvent,
        interaction,
        target       : interaction.dropElement,
        dropzone     : interaction.dropTarget,
        relatedTarget: dragEvent.target,
        draggable    : dragEvent.interactable,
        timeStamp    : dragEvent.timeStamp,
        type         : 'dragenter',
      };

      dragEvent.dragEnter = interaction.dropElement;
      dragEvent.dropzone = interaction.dropTarget;
    }
  }

  if (dragEvent.type === 'dragend' && interaction.dropTarget) {
    dropEvents.drop = utils.extend({ type: 'drop' }, tmpl);

    dragEvent.dropzone = interaction.dropTarget;
    dragEvent.relatedTarget = interaction.dropElement;
  }
  if (dragEvent.type === 'dragstart') {
    dropEvents.activate = utils.extend({ type: 'dropactivate' }, tmpl);

    dropEvents.activate.target   = null;
    dropEvents.activate.dropzone = null;
  }
  if (dragEvent.type === 'dragend') {
    dropEvents.deactivate = utils.extend({ type: 'dropdeactivate' }, tmpl);

    dropEvents.deactivate.target   = null;
    dropEvents.deactivate.dropzone = null;
  }
  if (dragEvent.type === 'dragmove' && interaction.dropTarget) {
    dropEvents.move = utils.extend({
      dragmove     : dragEvent,
      type         : 'dropmove',
    }, tmpl);

    dragEvent.dropzone = interaction.dropTarget;
  }

  return dropEvents;
}

function fireDropEvents (interaction, dropEvents) {
  const {
    activeDrops,
    prevDropTarget,
    dropTarget,
    dropElement,
  } = interaction;

  if (dropEvents.leave) { prevDropTarget.fire(dropEvents.leave); }
  if (dropEvents.move ) {     dropTarget.fire(dropEvents.move ); }
  if (dropEvents.enter) {     dropTarget.fire(dropEvents.enter); }
  if (dropEvents.drop ) {     dropTarget.fire(dropEvents.drop ); }

  if (dropEvents.deactivate) {
    fireActivationEvents(activeDrops, dropEvents.deactivate);
  }

  interaction.prevDropTarget  = dropTarget;
  interaction.prevDropElement = dropElement;
}

module.exports = {
  init,
  getActiveDrops,
  getDrop,
  getDropEvents,
  fireDropEvents,
  defaults: {
    enabled: false,
    accept : null,
    overlap: 'pointer',
  },
};
