const express = require('express');
const router = express.Router();
const fs = require("fs");


const authCheck = (req,res,next) => {
	if(!req.user){
		// This execute if user is ot logged in
		res.redirect('/api/login');
	}else{
		//if User Logged in , call Next middleware function which is below mthod.
		next();
	}

};
router.get('/',authCheck,(req,res) => {
	//res.send('you are logged in, this is your profile-'+req.user.userName)
	res.render('profile',{user: req.user});
});


module.exports = router;