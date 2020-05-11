/* 인증 후 사용자 정보를 세션에 저장하거나 사용자 정보를 복원하는 모듈 */

const local = require('./local');//로컬 스트래티지
const LocalStrategy = require('passport-local').Strategy;

console.log('call : /config/passport/passport.js');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        console.log('passport.serializeUser()  호출 : ' + user.userId);
        done(null, user.userId)
    });

    /* 사용자 인증 이후 사용자 요청이 있을 때마다 호출됨 - 로그인 상태인 경우 */
    /* 사용자로부터 받은 세션정보와 실제 DB의 데이터와 비교하여줍니다.*/
    /* 세션값과 나의 값을 체크해줌으로써 보안을 위한 기능입니다. */
    passport.deserializeUser(function (userId, done) {
        console.log('passport.deserializeUser()  호출 : ' + userId);
        const profile = {userId: userId};
        done(null, profile);
    });
    passport.use(local);

};
