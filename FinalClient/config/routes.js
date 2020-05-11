const marketExternal = require("../app/controllers/ExternalController");
const marketInternal = require("../app/controllers/InternalController");
const posts = require("../app/controllers/posts");
const auth = require("../app/controllers/AuthController");
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function (req, file, cb) {

		/* ObjectId()는 절대로 중복될 수 없도록 고안된 값(저장시 파일명 중복 방지) 
           - ObjectId로 저장하면 저장 시점의 timeStamp + 프로세스값 + 랜덤숫자로 구성*/
		file.uploadedFile = {
			name: mongoose.Types.ObjectId(),
			ext: file.mimetype.split('/')[1]
		};
		//cb(null, 저장파일명)
		cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
	}
});

const uploads = multer({
	storage: storage
});

module.exports = function (app, passport) {

	console.log('call : /config/routes.js');

	/**
	 * comment: 외부에 요청한 데이터를 그대로 파싱하여 리턴합니다.
	 */
	app.get("/", ((req, res) => res.redirect('/external'))); //메인화면으로 외부API로 redirect합니다.
	app.get("/external", auth.requiresLogin, marketExternal.index); //외부 external의 form값
	app.get("/external/result", auth.requiresLogin, marketExternal.result); //외부 
    app.get("/external/search", auth.requiresLogin, marketExternal.search); //외부 
	app.get("/internal/create", marketInternal.createResult);
	app.post("/internal/result", marketInternal.createResult);
	app.get("/postindex", auth.requiresLogin, posts.postindex);
	app.get("/postorderindex", auth.requiresLogin, posts.postorderindex);
	app.get('/postshow/:id', auth.requiresLogin, posts.postshow);
	app.get('/postcreate', auth.requiresLogin, posts.postcreate);
	app.get('/posts/questres', auth.requiresLogin, posts.postsearch);
	app.post('/poststore', auth.requiresLogin, uploads.any(), posts.poststore);
	app.get('/postedit/:id', auth.requiresLogin, posts.postedit);
	app.post('/postupdate', auth.requiresLogin, uploads.any(), posts.postupdate);
	app.get('/postdelete/:id', auth.requiresLogin, posts.postdelete);
    app.get("/external/searchinfo", auth.requiresLogin, marketInternal.searchinfo);
	app.get("/external/info/:code", auth.requiresLogin, marketInternal.info);
	app.get('/login', auth.login);
	app.get('/signup', auth.signup);
	/*유저 로그아웃 */
	app.get('/logout', auth.logout);

	/* 유저로그인 */
	app.post("/login_user", passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}), auth.checkUserLogin);

	/* 유저생성*/
	app.post('/create', auth.create);
};
