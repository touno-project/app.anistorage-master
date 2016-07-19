const mongoose 	= require('mongoose');

mongoose.connect('mongodb://touno-k.com:27017/sessions');

const Schema = {
	OAuth: mongoose.Schema({
	  code: String,
	  author: String
	})
}


module.exports = {
	OAuth: mongoose.model('oauth-3rd', Schema.OAuth),
}