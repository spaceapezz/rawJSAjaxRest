/*
Brian Reza Smith
*/


rawJSAjaxRest is an experiment to teach myself how web frameworks work by writing a web app 
in raw js and php that allows asynchronous front-end functionality and 
database operations based on a RESTful architecture. 
It uses the native js xmlHttpRequest object and promises to do asynchronous http requests which, 
based on uri and request method, are interpreted by a php backend as CRUD operations on mysql db. 
Uses apache .htaccess for uri redirects and application layer uri parsing to distinguish REST resource and document. 
As of now there is only one resource: "users" and the primary keys are "name" and "id", but 
the project is meant to be able to extended.

	-all request payloads and responses are encoded as JSON
	-you retrieve all documents in the resource "users" by going to url "users/"
	-you can read a single document by going to url "users/<primary key>/" 
	-php handles requests based on http request method and the parsed url  
