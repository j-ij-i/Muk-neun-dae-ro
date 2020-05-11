const fs = require('fs');
const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const ENV = require("./config/enviroment");

console.log('call : app.js');

const app = express();
const join = require('path').join;
const models = join(__dirname, 'app/models');
app.use(express.static(__dirname + '/public/'));

fs.readdirSync(models)
	.filter(file => ~file.search(/^[^\.].*\.js$/))
	.forEach(file => require(join(models, file)));

require('./config/passport/passport')(passport);
require("./config/express")(app, passport);
require("./config/routes")(app, passport);
module.exports = app;

mongoose.connect(ENV.DATABASE, {}, err => {
	if (err) {
		console.log('DB is not connected');
		console.log(err);
	} else {
		console.log('DB connected');
	}
});


app.listen(ENV.PORT || 3000, () => {
	console.log("server running on " + ENV.PORT || 3000);

});
