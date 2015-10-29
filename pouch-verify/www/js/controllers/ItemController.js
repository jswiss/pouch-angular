angular.module("pouchapp")

.controller("ItemController", function($scope, $rootScope, $state, $log, $stateParams, $location, $window, $cordovaCamera, pouchDB) {

	console.log('item controller')

	var self = this;

	console.log($stateParams.documentId)

	// var reader = new FileReader();

	var local  = pouchDB('chickenwaffles');
	var remote = 'localhost://swissjoshua:waurumbekjuba@5984/chickenwaffles';
	var blobUtil = $window.blobUtil;

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

	self.items = [];

	local.allDocs({ include_docs: true }).then(function(res) {
		// console.log(res);
		return self.items = res.rows.map(function(res) {
			return res.doc;
		});
	});

	self.save = function() {

		// var formData = new FormData();
		// formData.append('image', )

		// blobUtil.imgSrcToBlob(self.record.image.src)
		// 	.then(function(blob) {
		// 		console.log(blob);
		// 	}).catch(function(err) {
		// 		console.log(err);
		// 	})

		// var cardId = self._id.substr(self._id.length - 12);

		var jsonDocument = self.record;

		console.log(jsonDocument)

    if($stateParams.documentId) {
      jsonDocument["_id"] = $stateParams.documentId;
      jsonDocument["_rev"] = $stateParams.documentRevision;
    }

    self.items.push(jsonDocument); //kinda cheating, calling before successful response that data is in db	


    function error(err) {
    	$log.error(err);
  	}

	  function get(res) {
	  	console.log('inside get')
	    if (!res.ok) {
	      return error(res);
	    }
	    return local.get(res.id);
	  }

	  function bind(res) {
	  	console.log('inside bind')
	    $scope.doc = res;
	    self.record = {};
	  }

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



})