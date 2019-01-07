/**
 * @name AceApp
 * @description
 * # AceApp
 *
 * Main module of the application.
 */

////定义公共service
app.service('dataService', ['$http', '$q', '$uibModal', '$aside', function ($http, $q, $uibModal, $aside) {
    publicDataService($http,$q, this, $uibModal, $aside);
}]);

app.config(function (
      $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, cfpLoadingBarProvider
      ) {     
      //loading加载
      cfpLoadingBarProvider.includeSpinner = true;	
      //页面打开默认访问哪个锚点
      $urlRouterProvider.otherwise(_DefauPage);
      //console.log(_DefauPage);
      angular.forEach(_MenuSource, function (value, key) {
         
          //文件预加载
          if (value.__loadfiles != undefined) {
              value.resolve = {
                  lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(value.__loadfiles);
                  }]
              };
          }
          $stateProvider.state(key, value);
      });
      
      //$stateProvider  
	  //.state('calendar', {
	  //  url: '/calendar',
	  //  title: 'Calendar',

	  //  templateUrl: 'views/pages/calendar.html',
	  //  controller: 'CalendarCtrl',
		
	  //  icon: 'fa fa-calendar',
	  //  badge: '<i class="ace-icon fa fa-exclamation-triangle red bigger-130"></i>',
	  //  'badge-class': 'badge-transparent',
	  //  tooltip: '2&nbsp;Important&nbsp;Events',
	  //  'tooltip-class': 'tooltip-error',
		
	  //  resolve: {
	  //  	lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
	  //  		return $ocLazyLoad.load([				
	  //  		]);
	  //  	}]
	  //  }
      //})

	  //.state('more', {
	  //  'abstract': true,
	  //  //url: '/more',
	  //  title: '更多页面',
	  //  template: '<ui-view/>',
	  //  icon: 'fa fa-tag'
      //})
	  //.state('more.profile', {
	  //  url: '/profile',
	  //  title: '用户中心',
	  //  templateUrl: 'views/pages/profile.html',
	  //  controller: 'ProfileCtrl',		
	  //  resolve: {
	  //  	lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
	  //  		return $ocLazyLoad.load([
		
	  //  		]);
	  //  	}]
	  //  }
      //})
	  //.state('more.even', {
	  //  'abstract': true,
		  
	  //  title: '其他页面',
	  //  template: '<ui-view/>'

      //})	  
	  //.state('more.even.error', {
	  //  url: '/error',
	  //  title: 'Error',
	  //  templateUrl: 'views/pages/error.html'
      //})
	
  })
  .run(function($rootScope) {

  });
