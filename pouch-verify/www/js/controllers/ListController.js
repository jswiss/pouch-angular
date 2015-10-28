angular.module("pouchapp")

.controller("ListController", function($scope, $rootScope, $state, $log, $stateParams, $location, pouchDB) {

	console.log('list controller')

	var self = this;

	var local  = pouchDB('chickenwaffles');
	var remote = 'localhost://swissjoshua:waurumbekjuba@5984/chickenwaffles';

	self.items = [];

	local.allDocs({ include_docs: true })
	.then(function(res) {
		return self.items = res.rows.map(function(res) {
			return res.doc;
		});
	});

	self.delete = function(documentId, documentRevision) {
    local.remove(documentId, documentRevision).then(function(res) {
    	self.items = self.items.filter(function(item) {
    		return item._id !== res.id
    	});
    })
    .catch(function(res) {
    	// console.error("TODO: Handle doc not deleted error", res);
    });

  };

  self.get = function(documentId) {
  	// console.log("GET");
    local.get(documentId);
  };

})