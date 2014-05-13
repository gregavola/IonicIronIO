// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, PushProcessingService) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      setTimeout(function() {
        StatusBar.styleDefault();
      }, 10);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html",
          controller: 'SettingsCtrl'
        }
      }
    })

    .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "templates/about.html",
          controller: 'AboutCtrl'
        }
      }
    })

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.status', {
      url: "/status",
      views: {
        'menuContent' :{
          templateUrl: "templates/status.html",
          controller: 'StatusCtrl'
        }
      }
    })

    .state('app.activity', {
      url: "/activity",
      views: {
        'menuContent' :{
          templateUrl: "templates/activity.html",
          controller: 'ActivitesCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/activity/:queueName",
      views: {
        'menuContent' :{
          templateUrl: "templates/activity_item.html",
          controller: 'ActivityCtrl'
        }
      }
    })

    .state('app.code', {
      url: "/codes/:codeId/:codeName",
      views: {
        'menuContent' :{
          templateUrl: "templates/codes.html",
          controller: 'CodeCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback

  if (localStorage.getItem("host")) {
    $urlRouterProvider.otherwise('/app/activity');
  }
  else {
    $urlRouterProvider.otherwise('/app/login');    
  }
   
})

.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.class.indexOf('link-out') >= 0){
                elem.on('click', function(e){
                    console.log("CLICKED");
                    e.preventDefault();
                    var ref = window.open(attrs.href, "_blank");  
                });
            }
        }
   };
 });

function handleOpenURL(url) {
    var parts = url.replace("ironstatus://", "").split("/");
    setTimeout(function() {
        console.log("firing");
        console.log(parts);
        var scope = angular.element(document.getElementById("settings-form")).scope();
        scope.$apply(function() {
            scope.settings = {
                project_id: parts[0],
                access_token: parts[1]
            }
        })
    }, 500);
}


