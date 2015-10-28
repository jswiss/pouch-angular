var app    = require('express');
var http   = require('http');
var path   = require('path');
var cookie = require('cookie');
var nano   = require('nano')('http://swissjoshua:waurumbekjuba@5984');
var cors   = require('cors');

var _users = nano.use('_users');


//create a new user
var user = {
	name: 'john'
	password: 'password'
	roles: [],
	type: 'user'
}

//add user to db
_users.insert(user, 'org.couchdb.user:john', function(err, body) {
	if (err) console.log(err);
	console.log(body);
});

nano.auth('john', 'secret', function(err, body, headers) {
  var myCookie = cookie.parse(headers['set-cookie'][0]);
	console.log(myCookie);
});

