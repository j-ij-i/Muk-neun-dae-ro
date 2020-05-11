'use strict';
//strict 모드 선언 : 엄격한 문법 검사 키워드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
console.log('call : /models/RestFood.js');

const Restfood = new Schema({
        restname:{type: String, require: true},
		foodname: {type: String, required: true},
		foodcost: {type: Number, required: true},
		foodmaterial: {type: String},
		premiumyn: {type: String},
		recommedyn: {type: String},
		etc: {type: String}
});

module.exports = mongoose.model('Restfood', Restfood);
