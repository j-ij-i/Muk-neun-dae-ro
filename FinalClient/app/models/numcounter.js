'use strict';
var mongoose = require('mongoose');
var numcounterSchema = mongoose.Schema({
  totalCount: {type:Number,required:true}
});
//
var numcounter = mongoose.model('numcounter',numcounterSchema);
module.exports = numcounter;
//