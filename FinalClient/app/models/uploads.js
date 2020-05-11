/* mongoose, Schema 모듈 참조 */
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

console.log('call : /models/uploads.js');

// Upload스키마 정의
const UploadSchema = new Schema({
	relatedId: { type : Schema.ObjectId}, 
	type: { type : String},
	filename: { type : String},
	originalname: { type : String},
	size: { type : Number},
	createdAt  : { type : Date, default : Date.now }
});

UploadSchema.path('relatedId').required(true, 'Article title cannot be blank');
UploadSchema.path('filename').required(true, 'Article body cannot be blank');
UploadSchema.path('originalname').required(true, 'Article body cannot be blank');
UploadSchema.path('size').required(true, 'Article body cannot be blank');


mongoose.model('Upload', UploadSchema);
