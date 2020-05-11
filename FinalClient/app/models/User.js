// ========== User 모델 ==========//
const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

// ====== UserSchema 설정(4) ========//
const UserSchema = new Schema({
	userId: {type: String, default: '', trim: true}, //아이디
    userEmail: {type: String, default: ''}, //이메일
    hashed_password: {type: String, default: ''}, //해시된 비밀번호
	userName: {type: String, default: '', trim: true}, //닉네임
	salt: {type: String, default: ''}, //해시된 비밀번호에 대한 salt
}, {
    timestamp: true,
});


UserSchema.path('userEmail').validate(async function (userEmail, cb) {
    const User = mongoose.model('User');
    const userCount = await User.count({userEmail: userEmail}).exec();
    return (userCount === 0);
}, '이미 존재하는 이메일주소입니다.');
//회원가입에서 넘어온 이메일값과 User에 있는 이메일 값과 같으면 에러출력
UserSchema.path('userId').validate(async function (userId, cb) {
    const User = mongoose.model('User');
    const userCount = await User.count({userId: userId}).exec();
    return (userCount === 0);
}, '이미 존재하는 아이디입니다.');
//회원가입에서 넘어온 아이디값과 User에 있는 아이디 값과 같으면 에러출력
UserSchema.path('userId').validate(function (userId) {
    return userId.length;
}, "아이디는 빈칸일 수 없습니다.");
UserSchema.path('userEmail').validate(function (userEmail) {
    return userEmail.length;
}, "이메일은 빈칸일 수 없습니다.");
UserSchema.path('hashed_password').validate(function (hashed_password) {
    return hashed_password.length
}, "비밀번호는 빈칸일 수 없습니다.");
//

//============= 비밀번호 대조메소드, 난수발생메소드, 암호화저장 메소드 선언(6) ======//
UserSchema.methods = {
	//authenticate 메소드 - 유저로부터 비밀번호를 받아 대조
    authenticate: function (plainText) {
        const tempEncy = this.encryptPassword(plainText);
        return this.encryptPassword(plainText) === this.hashed_password;
    },
	//makeSalt 메소드 - 비밀번호 암호화를 위한 난수를 만든다.
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
	//만들어진 난수와 입력받은 비밀번호를 통해 공개키 암호화를 한 후 저장한다.
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
	
};

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });
//모델 생성
mongoose.model('User', UserSchema);
