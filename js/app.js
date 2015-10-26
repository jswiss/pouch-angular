angular.module("pouchapp", ["ui.router"])

.run(function($pouchDB) {

})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
    .state("list", {
      "url": "/list",
      "templateUrl": "templates/list.html",
      "controller": "MainController"
    })
    .state("item", {
      "url": "/item/:documentId/:documentRevision",
      "templateUrl": "templates/item.html",
      "controller": "MainController"
    });
	$urlRouterProvider.otherwise("list");
})

.controller("MainController", function($scope, $rootScope, $state, $stateParams, $pouchDB) {

})

.service("$pouchDB", ["$rootScope", "$q", function($rootScope, $q) {

  var database;
  var changeListener;

  this.setDatabase = function(databaseName) {
    database = new PouchDB(databaseName);
  }

  this.startListening = function() {
    changeListener = database.changes({
      live: true,
      include_docs: true
    }).on("change", function(change) {
      if(!change.deleted) {
        $rootScope.$broadcast("$pouchDB:change", change);
      } else {
        $rootScope.$broadcast("$pouchDB:delete", change);
      }
    });
  }

  this.stopListening = function() {
    changeListener.cancel();
  }

  this.sync = function(remoteDatabase) {
    database.sync(remoteDatabase, {live: true, retry: true});
  }

  this.save = function(jsonDocument) {
    var deferred = $q.defer();
    if(!jsonDocument._id) {
      database.post(jsonDocument).then(function(response) {
        deferred.resolve(response);
      }).catch(function(error) {
        deferred.reject(error);
        });
    } else {
        database.put(jsonDocument).then(function(response) {
          deferred.resolve(response);
        }).catch(function(error) {
          deferred.reject(error);
        });
      }
      return deferred.promise;
  }

  this.delete = function(documentId, documentRevision) {
    return database.remove(documentId, documentRevision);
  }

  this.get = function(documentId) {
    return database.get(documentId);
  }

  this.destroy = function() {
    database.destroy();
  }

}])

.run(function($pouchDB) {
  $pouchDB.setDatabase("nraboy-test");
  $pouchDB.sync("http://localhost:4984/test-database");
})

.controller("MainController", function($scope, $rootScope, $state, $stateParams, $pouchDB) {

    $scope.items = {};

    $pouchDB.startListening();

    $rootScope.$on("$pouchDB:change", function(event, data) {
      $scope.items[data.doc._id] = data.doc;
      $scope.$apply();
    });

    $rootScope.$on("$pouchDB:delete", function(event, data) {
      delete $scope.items[data.doc._id];
      $scope.$apply();
    });

    if($stateParams.documentId) {
      $pouchDB.get($stateParams.documentId).then(function(result) {
        $scope.inputForm = result;
        });
    }

    $scope.save = function(firstname, lastname, email) {
      var jsonDocument = {
        "firstname": firstname,
        "lastname": lastname,
        "email": email
      };
      if($stateParams.documentId) {
          jsonDocument["_id"] = $stateParams.documentId;
          jsonDocument["_rev"] = $stateParams.documentRevision;
      }
      $pouchDB.save(jsonDocument).then(function(response) {
          $state.go("list");
          // $pouchDB.stopListening();
      }, function(error) {
          console.log("ERROR -> " + error);
      });
    }

    $scope.delete = function(id, rev) {
      $pouchDB.delete(id, rev);
    }

});