var express = require('express');
var http    = require('http');
var path    = require('path');
var cookie  = require('cookie');
var nano    = require('nano')('http://swissjoshua:waurumbekjuba@5984');
var cors    = require('cors');
var _users  = nano.use('_users');

var app     = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

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

app.get('/', function(req, res) {

	nano.auth('john', 'secret', function(err, body, headers) {
		if(err) console.log(err);
	  
		//parse cookie
	  var myCookie = cookie.parse(headers['set-cookie'][0]);
		console.log(myCookie);
		res.cookie('AuthSession', cookies.AuthSession);

		//set cookie for client
		res.render('index', {title: 'Express'})
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
