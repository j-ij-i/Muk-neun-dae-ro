const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const hbsHelper = require('handlebars-helpers');
const ENV = require("../config/enviroment");


//쿠키모듈
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

//세션모듈
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

const flash = require('connect-flash'); 

module.exports = function (app, passport) {

    console.log('call : /config/express.js');
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


    app.use(express.static('public')); //Resource 용으로 사용할 static router 정의


    //ejs,hbs등 사용할 view template을 설정합니다.
    const hbs = exphbs.create({
        extname: '.hbs', //사용할 확장자
        partialsDir: __dirname + '/../app/views/partials', // sidebar등 부분적으로 사용할 디렉토리
        defaultLayout: __dirname + '/../app/views/layouts/default.hbs', // 기본으로 항상 렌더링되는 layout으로 일반적으로 header/footer
        layoutsDir: __dirname + '/../app/views/layouts', // 사용할 view들의 위치이며 res.render를 통해 호출하는 디렉토리의 주소
        helpers: 
        {
             hbsHelper,
             isPrice: function(a,b,opts){
                 var P=Number(a.replace("/[^(0-9)]/gi",""));
                if(P>=b)
                    return opts.fn(this)
            }
        }
    });
    require('handlebars-helpers')(hbs);
    app.engine('.hbs', hbs.engine); //사용할 뷰 엔진의 option 설정
	
	app.use(cookieParser()); //쿠키사용을 설정합니다.
    app.use(cookieSession({secret: ENV.SESSION_SECRET}));
	
	   app.use(session({
        secret: ENV.SESSION_SECRET, //자신에 맞게 secret을 설정
        store: new mongoStore({ //세션데이터를 몽고에 저장하기때문에 mongo 접속정보
            url: ENV.DATABASE,
            collection: ENV.MONGO_SESSION_COLLECTION_NAME,
        }),
    }));
	
    app.use(passport.initialize()); //패스포트 초기화
    app.use(passport.session()); //패스포트 세션설정    
    //flash 메세지 미들웨어 등록
    app.use(flash());

    app.set('view engine', '.hbs'); //사용할 뷰 엔진을 정의
    app.set('views', path.join(__dirname, '/../app/views')); //뷰가 있는 디렉토리를 정의
};
