const express = require('express');

const router = express.Router();
const User = require('../models/user');
const File = require('../models/uploadedFile');
const fs = require('fs');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

const passport = require('passport');

const multer = require('multer');

const storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,'./uploadedFiles/');
	},
	filename: function(req,file,cb){
		cb(null, (new Date().toISOString())+file.originalname);
	}
});

const fileFilter = function (req,file,cb){
	if(file.mimetype ==='image/jpeg' || file.mimetype ==='video/mp4'){
		cb(null,true);
	}
	else{
		cb(null,false);
	}
}


const upload = multer({storage: storage,fileFilter:fileFilter});


let conn = mongoose.connection;
Grid.mongo=mongoose.mongo;
let gfs;


// This is for Login - Oauth 
router.get('/login',(req,res) =>{
	res.render('home');

});

// This is for Logout - User 
router.get('/logout',(req,res) =>{
	req.logout();
	res.redirect('/api/login');

});

// ------------- Facebook Section --------------------------------

// This is for Login using Google - Using Passport library
router.get('/facebook',passport.authenticate('facebook',{
	scope:['email']
}));

router.get('/facebook/redirect',passport.authenticate('facebook'),(req,res) =>{
	console.log(req.user);
	res.send('You have been authenticated with Facebook + '+ req.user);
});


// ------------- Google Section --------------------------------

// This is for Login using Google - Using Passport library
router.get('/google',passport.authenticate('google',{
	scope:['profile']
}));

//Call Back route for google to redirect

router.get('/google/redirect',passport.authenticate('google'),(req,res) =>{
	
	//res.send('You have been authenticated with Google + '+ req.user);
	res.redirect('/profile');

});


router.get('/video',function(req,res){
	console.log("------ Inside Video Stream----");
	res.writeHead(200,{'content-type':'video/mp4'});
	var rs = fs.createReadStream("./views/video.mp4");
	rs.pipe(res);
});



// Post the file to Mongo DB

router.post("/upload",upload.single('productImage'),function(req,res){

	console.log(req.file);
	const fileModel = new File({
		name:req.file.path,
		videoImage:req.file.path

	});
	File.create(fileModel).then(function(file){
		res.send(file);
	});

});

router.get("/getFile",function(req,res){
	File.find({}).then(function(files){
		console.log(files);
		res.writeHead(200,{'content-type':'video/mp4'});
		var path = './'+files[0].name;
		console.log(" FIle Name ---"+ path);
		var rs = fs.createReadStream(path);
		rs.pipe(res);
		
	});

});

// browser
// Create storage engine
const storageforBrowse = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const uploadBrowse = multer({ storageforBrowse });
router.post("/uploadBrowseFile",uploadBrowse.single('file'),function(req,res){
	console.log(req.file);

});

// Get list of Ninjas from Database
router.get('/ninjas',function(req,res){
	/*Ninja.find({}).then(function(ninjas){
		res.send(ninjas);
	});*/
	

	User.geoNear(
		{type:'Point',coordinates:[parseFloat(req.query.lng),parseFloat(req.query.lat)]},
		{maxDistance:1000000,spherical:true}
		).then(function(ninjas){
			res.send(ninjas);
		});

});

//Add New Ninjas to DB , Next paramter tell to go for next availbe Middleware, in this case next will be used to catch teh error and go to error handling middle ware
router.post('/ninjas',function(req,res,next){
	//console.log(req.body);
	//var ninja = new Ninja(req.body);
	//ninja.save();
	User.create(req.body).then(function(ninja){
		res.send(ninja);
		//Next Keywork below is used to indincate, Go and Execute the NExt Middleware. In this case current Middleware is "ROUTER" and next middleware
		// in Index.js after ROUTER is 'Error Handling Method'
	}).catch(next);
	//res.send({
	//	type:'POST',
	//	name: req.body.name,
	//	rank: req.body.rank
	//});

});

//Update a Ninjas in Databse
router.put('/ninjas/:id',function(req,res){
	console.log(req.body);
	User.findOneAndUpdate({_id:req.params.id},req.body).then(function(){
		//To display updated record, retrive record back from DB
		Ninja.findOne({_id:req.params.id}).then(function(ninja){
			res.send(ninja);

		});
	});
});

// Delete a existing Ninja
router.delete('/ninjas/:id',function(req,res){
	User.findOneAndDelete({_id:req.params.id}).then(function(ninja){
		res.send("Delected Object"+ ninja);
	});
	//res.send({type:'DELETE'});

});

module.exports = router;