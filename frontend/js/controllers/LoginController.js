angular
	.module("pouchapp")
	.controller("LoginController", LoginController);

	function LoginController() {

	var db = new PouchDB('http://localhost:5984/chickenwaffles', {skipSetup: true});
	
	var local = new PouchDB('local_db');
	local.sync(db, {live: true, retry: true}).on('error', console.log.bind(console));
		
	}





