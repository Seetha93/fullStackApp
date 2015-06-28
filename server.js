var http = require('http');
var dispatcher = require('httpdispatcher');
var connect = require('connect');
var qs = require('querystring');
var url = require('url');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var dburl = 'mongodb://localhost:27017/test_db1';

var app = connect()
	.use(function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	console.log("its coming here");
    //res.end('hello world\n');
 });

const PORT  = 8080;

function handleRequest(request, response) {
	try{
		console.log("Request url "+ request.url);
		console.log(request.method);
		//console.log(JSON.parse(request.body));
		response.setHeader('Access-Control-Allow-Origin', '*');
		response.setHeader('Access-Control-Allow-Headers', 'Content-Type, application/json');
		//response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE', OPTIONS);
		
		console.log("req "+request.params);
		if(request.method=='GET')
		{
			response.writeHead(200, {'Content-Type': 'text/plain'});
			var theUrl = url.parse( request.url );
			console.log(theUrl);
			var queryObj = qs.parse( theUrl.query );
			console.log(queryObj);
			
			MongoClient.connect(dburl, function (err, db) {
			  if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			  } else {
				console.log('Connection established to', url);
				var collection = db.collection('childCount');
				
				collection.insert(queryObj, function (err, result) {
				  if (err) {
					console.log(err);
				  } else {
					response.end('Data is saved for future reference in childCount Database');
					console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
				  }
			  
					db.close();
					});
				console.log("Entering "+request.method);
			  }
			});
		}
		if(request.method=='OPTIONS')
		{
			response.writeHead(200, {'Content-Type': 'text/plain'});
			response.end(request.lname+" "+request.fname);
			console.log("Entering "+request.method);
			console.log("Request is"+request);
		}
		if(request.method=='POST')
		{
			response.writeHead(200, {'Content-Type': 'text/plain'});
			console.log("Entering "+request.method);
			var body = '';
			request.on('fname', function (data) {
            body += data;
				if (body.length > 1e6)
					request.connection.destroy();
			});
			request.on('end', function () {
				var post = qs.parse(body);
			});

			console.log("Request is "+request);
			response.end(request.body);
		}
		console.log("Response is "+response)
		return response;
	} catch(err) {
		console.log(err);
	}
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
	console.log("Server listening on ", PORT);
});