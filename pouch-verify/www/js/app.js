// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'pouchdb'])

  .config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("list", {
      "url": "/list",
      "templateUrl": "../templates/list.html",
      "controller": "ListController as list"
    })
    .state("login", {
      "url": "/",
      "templateUrl": "../templates/login.html",
      "controller": "LoginController as login"
    })
    .state("item", {
      "url": "/item/:documentId/:documentRevision",
      "templateUrl": "../templates/item.html",
      "controller": "ItemController as item",
      "params": {objectToPass: null}
    });
  $urlRouterProvider.otherwise("list");
  })
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
  });
})

window.PouchDB = PouchDB;