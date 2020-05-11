/* ==== 게시판 정보 스키마 선언[1]  ===== */

/* mongoose, Schema 모듈 참조 */
const mongoose = require('mongoose');
const Schema   = require('mongoose').Schema;
var cookieSession = require('cookie-session')
var express = require('express')
var app = express()

var count =0;
console.log('call : /models/post.js');

//Post 스키마 정의
const PostSchema = new Schema({
	title: {type: String, default: '', trim: true},//이름
	content: {type: String, default: '', trim: true},//학번
	author: {type: String, default: '', trim: true},//학번
	views: {type: Number, default: '0', trim: true},//나이
    //외래키(uploads 컬렉션 ObjectId) 형식으로 데이터를 맵핑시킴
	numId: {type: Number, default:'0'},
	isNotice:{type: Number, default: ''}, 
	isPost:{type: Number, default: '1'}, 
	//게시판에서 글을 작성하면 값이 isPost가 1로 들어가서 공지글인지 일반글인지 구분을 준다.
	photo: { type : Schema.ObjectId, ref: 'Upload'},//사진(Upload(모델명)참조, ObjectId )
	createdAt: {type: Date, default: Date.now},//작성시간
});


PostSchema.statics = {
  
	load: function (_id, cb) {
        //id에 맞는 게시물을 찾고 photo에서 가지고 온 뒤 콜백함수 실행
		this.findOne({_id})
		    .populate('photo')
		    .exec(function (err, post) {
			    cb(post)
		    });
	},


    // list 메서드 : 전체 리스트를 생성일 순으로 조회하는 메서드
	list: function (cb) {
		this.find({}).sort({createdAt: -1}).exec(function (err, posts) {
            //조건에 맞는 애들을 만들어진 순서 기존으로 찾고 콜백함수 실행
			cb(posts)
		});
	},
    
    orderlist: function (cb) {
		this.find({}).sort({views: -1}).exec(function (err, posts) {
            //조건에 맞는 애들을 조회순 기존으로 찾고 콜백함수 실행
			cb(posts)
		});
	},
	
	    findcontentlist: function (fcontent,cb) {
            //내용이 비슷한 애들을 날짜 순으로 찾고 콜백함수 실행
		this.find({content: { $regex : new RegExp(fcontent, "i") } }).sort({createdAt: -1}).exec(function (err, posts) {
			cb(posts)
		});
	},
    
    findauthorlist: function (fauthor,cb) {
          //작성자가 비슷한 애들을 날짜 순으로 찾고 콜백함수 실행
		this.find({author: { $regex : new RegExp(fauthor, "i") } }).sort({createdAt: -1}).exec(function (err, posts) {
			cb(posts)
		});
	},
    
    findtitlelist: function (ftitle,cb) {
          //제목이 비슷한 애들을 날짜 순으로 찾고 콜백함수 실행
		this.find({title: { $regex : new RegExp(ftitle, "i") } }).sort({createdAt: -1}).exec(function (err, posts) {
			cb(posts)
		});
	}
}

PostSchema.path('title').required(true, '제목은 필수사항입니다');
PostSchema.path('content').required(true, '내용은 필수사항입니다');
PostSchema.path('author').required(true, '작성자는 필수사항입니다.');


module.exports = mongoose.model('Post', PostSchema);
