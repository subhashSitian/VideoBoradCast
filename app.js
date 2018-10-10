const express = require('express');
const socket = require('socket.io');
const routes = require('./routes/api');
const profileRoute = require('./routes/profile-route');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passportSetup= require('./config/passport-setup');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const passport=require('passport');
const fs = require("fs");
const path = require("path");

//setup Express App

const app = express();



//Conet to MongoDB
mongoose.connect('mongodb://localhost/ninjago',()=>{
	console.log('connected to Mongoose DB...')
});
mongoose.Promise = global.Promise;

// Static Pages  []
app.set('view engine','ejs');
app.use(express.static('views'));
app.use('/uploadedFiles',express.static('uploadedFiles'));

//Setup cookie
app.use(cookieSession({
	maxAge:24*60*60*1000,
	keys:[keys.session.cookieKey]
}));

//Initialize passport for cookies
app.use(passport.initialize());
app.use(passport.session());


// This Body Parser will parse the request and convert to JSON and attach it back toReq object. This JSON req has been used into Routes 
app.use(bodyParser.json());

// '/api' in use method to server any reuquest having /api will be route to routes below.
app.use('/api',routes);
app.use('/profile',profileRoute);

//Error Handling Middleware 
app.use(function(err,req,res,next){
	res.status(411).send({error:err.message});

});

//Listen for reqeust

var server = app.listen(process.env.port||4000,function(){
	console.log("Listening to request on port 4000");
});
var io = socket(server);
io.on('connection', function(socket){
	console.log("Made Socket Connection..",socket.id);


	socket.on('video',function(data){

		//socket.broadcast.emit('video',data);
		io.sockets.emit('video',data);
	});

	// Reac Image FIle

	var readStream = fs.createReadStream('aa.jpg',{ encoding: 'binary'});
	var chunks =[];
	readStream.on('image-chunk',function(chunk){
		chunks.push(chunk);
		io.sockets.emit('image-chunk',chunk);
	});


});








