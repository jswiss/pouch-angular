angular.module("pouchapp")

.controller("MainController", function($scope, $rootScope, $state, $log, $stateParams, pouchDB) {

	var self = this;

	// var reader = new FileReader();

	var local  = pouchDB('chickenwaffles');
	var remote = 'localhost://swissjoshua:waurumbekjuba@5984/chickenwaffles';

	// local.sync(remote, {
 //  	live: true
	// })
	// .on('change', function (change) {
	//   // yo, something changed!
	// })
	// .on('error', function (err) {
	//   // yo, we got an error! (maybe the user went offline?)
	// });

	// function push(){
 //        Pouch.replicate(local, remote,
 //        function(err,resp){
 //            if(err){
 //                alert("Push failed!")
 //            }
 //        })
 //        console.log('pushed!')
 //    };

	self.record;
	console.log(self.record);

	
	// function sync() {
	// 	  syncDom.setAttribute('data-sync-state', 'syncing');
	// 	  var opts = {live: true};
	// 	  console.log(opts)
	// 	  console.log(syncError)
	// 	  local.replicate.to(remote, opts, syncError);
	// 	  local.replicate.from(remote, opts, syncError);
	// 	};

	self.items = [];

	local.allDocs({ include_docs: true }).then(function(res) {
		// console.log(res);
		return self.items = res.rows.map(function(res) {
			return res.doc;
		});
	});

	self.save = function() {

		var jsonDocument = self.record;
		// console.log($stateParams);

    if($stateParams.documentId) {
      jsonDocument["_id"] = $stateParams.documentId;
      jsonDocument["_rev"] = $stateParams.documentRevision;
    }

    console.log(jsonDocument)
    self.items.push(jsonDocument);
    console.log(self.items)

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
	  }

	  // function put()//image attachment stuffs here

    local.post(jsonDocument)
    .then(get)
    .then(bind)
    .catch(error);

   var rep = PouchDB.replicate(local, remote, {
		  live: true,
		  retry: true
			}).on('change', function (change) {
			  // yo, something changed!
				}).on('paused', function (info) {
			  // replication was paused, usually because of a lost connection
					}).on('active', function (info) {
			  // replication was resumed
						}).on('error', function (err) {
			  // totally unhandled error (shouldn't happen)
				});

	}

	self.delete = function(documentId, documentRevision) {
    local.remove(documentId, documentRevision).then(function(res) {
    	self.items = self.items.filter(function(item) {
    		return item._id !== res.id
    	});
    })
    .catch(function(res) {
    	console.error("TODO: Handle doc not deleted error", res);
    });

  };

  self.get = function(documentId) {
  	console.log("GET");
    local.get(documentId);

   //  $rootScope.$on("$pouchDB:change", function(event, data) {
   //  	$scope.items[data.doc._id] = data.doc;
   //  	$scope.$apply();
 	 // });
  };

})