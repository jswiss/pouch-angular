angular.module("pouchapp")

.controller("MainController", function($scope, $rootScope, $state, $log, $stateParams, pouchDB) {
	
	var self = this;

	var local  = pouchDB('chickenwaffles');
	var remote = 'localhost://swissjoshua:waurumbekjuba@5984/chickenwaffles';

	local.sync(remote, {
  live: true
	}).on('change', function (change) {
	  // yo, something changed!
	}).on('error', function (err) {
	  // yo, we got an error! (maybe the user went offline?)
	});

	// PouchDB.sync(local, remote, { live: true })
 //  .on('change', function (info) {
 //    // handle change
 //  }).on('complete', function (info) {
 //    // handle complete
 //  }).on('uptodate', function (info) {
 //    // handle up-to-date
 //  }).on('error', function (err) {
 //    // handle error
 //  });
	
	function sync() {
		  syncDom.setAttribute('data-sync-state', 'syncing');
		  var opts = {live: true};
		  local.replicate.to(remote, opts, syncError);
		  local.replicate.from(remote, opts, syncError);
		};

	// local._maxListeners = 10;

	self.items = [];

	self.save = function(firstName, secondName, thirdName, school, village, payam, county, state, geo, photo) {
		// console.log(firstName, lastName, email);

		var jsonDocument = {
        "firstname": firstName,
        "secondname": secondName,
        "thirdname": thirdName,
        "school": school,
        "village": village,
        "payam": payam,
        "county": county,
        "state": state,
        "geo": geo,
        "photo": photo
      };
    console.log(jsonDocument)
    self.items.push(jsonDocument);
    console.log(self.items)

    if($stateParams.documentId) {
      jsonDocument["_id"] = $stateParams.documentId;
      jsonDocument["_rev"] = $stateParams.documentRevision;
    }

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

    local.post(jsonDocument)
    .then(get)
    .then(bind)
    .catch(error);


    // 	.then(function(response) {
    // 		console.log(response)
    //   $state.go("list");
    //   // $pouchDB.stopListening();
    // }, function(error) {
    //     console.log("ERROR -> " + error);
    // });	
	}

})