angular.module("pouchapp")

.controller("MainController", function($scope, $rootScope, $state, $log, $stateParams, pouchDB) {

	var self = this;

	// var reader = new FileReader();

	var local  = pouchDB('chickenwaffles');
	var remote = 'localhost://swissjoshua:waurumbekjuba@5984/chickenwaffles';

	if ($stateParams.objectToPass === undefined) {
		self.record = {};
	} else {
		self.record = $stateParams.objectToPass;
		console.log(self.record.firstname);
	};

	// self.record = {};

	// console.log(self.record);

	self.items = [];

	local.allDocs({ include_docs: true }).then(function(res) {
		// console.log(res);
		return self.items = res.rows.map(function(res) {
			return res.doc;
		});
	});



	self.save = function() {

		var jsonDocument = self.record;

    if($stateParams.documentId) {
      jsonDocument["_id"] = $stateParams.documentId;
      jsonDocument["_rev"] = $stateParams.documentRevision;
    }

    // console.log(jsonDocument)
    self.items.push(jsonDocument); //kinda cheating, calling before successful response that data is in db	
    // console.log(self.items)

    function error(err) {
    	$log.error(err);
  	}

	  function get(res) {

	    if (!res.ok) {
	      return error(res);
	    }
	    return local.get(res.id);
	  }

	  function bind(res) {
	    $scope.doc = res;
	    self.record = {};
	  }

	  // function put()//image attachment stuffs here

    local.post(jsonDocument)
    .then(get)
    .then(bind)
    .catch(error);

   	var rep = function() {
   		PouchDB.replicate(local, remote, {
		  	live: true,
		  	retry: true
			})
   			.on('change', function (change) {
			  // yo, something changed!
				}).on('paused', function (info) {
			  // replication was paused, usually because of a lost connection
				}).on('active', function (info) {
			  // replication was resumed
				}).on('error', function (err) {
			  // totally unhandled error (shouldn't happen)
				});
		}

		rep();
	}

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

   //  $rootScope.$on("$pouchDB:change", function(event, data) {
   //  	$scope.items[data.doc._id] = data.doc;
   //  	$scope.$apply();
 	 // });
  };

})