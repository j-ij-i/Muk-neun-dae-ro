const mongoose = require("mongoose");
const User = mongoose.model('User');

console.log('call : /controllers/Authcontroller.js');

module.exports.login = async function (req, res) {
    res.render("user/login", {alert: req.flash()});
}; //로그인 화면을 랜더링함.

module.exports.signup = async function (req, res) {
    res.render("user/signup", { alert: req.flash()});
}; //회원가입 화면을 랜더링함.


module.exports.logout = async function (req, res) {
    req.logout();
    res.redirect('/login');
}; //사용자가 로그아웃되고 login화면이 랜더링됨.

module.exports.create = async function (req, res) {
    const user = new User();
    user.userId = req.body.userId;
    user.password = req.body.user_password;
	user.userEmail= req.body.userEmail;
	user.userName = req.body.userName; 
	//view로부터 받은 아이디, 비밀번호, 이메일, 닉네임이 New User로 생성된다.
    new User({
        userId: req.body.userId,
        password: req.body.user_password,
		userEmail: req.body.userEmail,
		userName: req.body.userName,
    }).save((err) => {
        if (err) {
			//에러시 메세지와 함께 회원가입창으로 넘어감
            req.flash('message', err.message);
            res.redirect('/signup');
        } else {
			//성공시 회원가입 성공메세지가 뜨고 login됨
            req.flash('message', "회원가입성공");
            res.redirect('/login');
        }
    });
};

module.exports.requiresLogin = async (req, res, next) => {
    if (req.isAuthenticated())
		return next();
	//로그인 정보가 인증된 경우, 다음 화면으로 넘어가게 된다.
    else
		res.redirect('/login');
	//로그인 화면으로 가게된다.
};


module.exports.checkUserLogin = async function (req, res) {
	// 세션에 redirect가 저장되어 있다면 해당 페이지를 보여주고, sessions에 returnTo가 설정되어있다면 해당주소로 없다면 rootpath('/')로 이동한다.
    const redirectTo = req.session.returnTo
        ? req.session.returnTo
        : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
};


