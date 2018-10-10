const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Creaet Geolocation schema

const fileUploadSchema = new Schema({

	name:{
		type: String
	},
	productVideo:{
		type: String
	}
});

const UploadedFile = mongoose.model('uploadedFile',fileUploadSchema);
module.exports = UploadedFile;