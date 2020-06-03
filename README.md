/*
Brian Reza Smith
*/


rawJSAjaxRest is an experiment to teach myself how web frameworks work by writing an app from scratch that allows asynchronous database operations based on a RESTful architecture. it uses the native js xmlHttpRequest object and promises to do asynchronous CRUD operations on sql database. Uses .htaccess for uri redirects and application layer uri parsing to distinguish REST resource and document. 
	
	-all request payloads and responses are encoded as JSON
	-you retrieve all documents in the resource "users" by going to url "users/"
	-you can read a single document by going to url "users/<primary key>"
	-php handles requests based on http request method and the parsed url  
