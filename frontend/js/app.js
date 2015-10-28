angular.module("pouchapp", ["ui.router", "pouchdb"])

// .run(function($pouchDB) {

// })

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
    .state("list", {
      "url": "/list",
      "templateUrl": "templates/list.html",
      "controller": "ListController as list"
    })
    .state("login", {
      "url": "/",
      "templateUrl": "templates/login.html",
      "controller": "LoginController"
    })
    .state("item", {
      "url": "/item/:documentId/:documentRevision",
      "templateUrl": "templates/item.html",
      "controller": "ItemController as item",
      "params": {objectToPass: null}
    });
	$urlRouterProvider.otherwise("list");
});

window.PouchDB = PouchDB;
