const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Creaet Geolocation schema

const GeoSchema = new Schema({

	type:{
		type: String,
		default: "Point"
	},
	coordinates:{
		type:[Number],
		index:"2dsphere"
	}
});
//Ninja Schema and Model
const NinjaSchema = new Schema({
	name:{
		type: String,
		required:[true,"Name Field is required"]
	},
	rank:{
		type:String
	},
	available:{
		type: Boolean,
		default:false
	},
	// Add in Geo Location
	geometry: GeoSchema
});

const Ninja = mongoose.model('ninja',NinjaSchema);

module.exports =Ninja;