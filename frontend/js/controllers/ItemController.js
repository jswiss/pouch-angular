angular.module("pouchapp")

.controller("ItemController", function($scope, $rootScope, $state, $log, $stateParams, $location, pouchDB) {

	console.log('item controller')

	var self = this;

	console.log($stateParams.documentId)

	// var reader = new FileReader();

	var local  = pouchDB('chickenwaffles');
	var remote = 'localhost://swissjoshua:waurumbekjuba@5984/chickenwaffles';

	if (!!$stateParams.documentId) {
		// is an object
		
		local.get($stateParams.documentId)
			.then(function(response) {
				console.log(response)
				self.record = response;
			})
		} else {
			console.log('no record')
			self.record = {};
		};
})