const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Creaet Geolocation schema

const userProfileSchema = new Schema({

	userName:{
		type: String
	},
	googleId:{
		type: String
	},
	thumbnail:{
		type: String
	}
});

const UserProfile = mongoose.model('userProfile',userProfileSchema);
module.exports = UserProfile;