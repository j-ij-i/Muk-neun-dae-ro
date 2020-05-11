const roadFoodList = require('../../config/roadData');
const mongoose = require("mongoose");

const {
	getroutNameByends
} = require('../../helper/utility');
const {
	API_URL,
	SERVICEKEY
} = require('../../config/enviroment');

const request = require('request-promise');
const pageTitle = "외부 API 호출";
console.log('call : /controllers/ExternalController.js');
var saleP=0;

//화면 구성
module.exports.index = async function (req, res) {
	    const isLogin = req.isAuthenticated();
    //로그인이 인증된 상태에서 수행하며 external/form 화면을 렌더링
    //이 경우 roadFoodList라는 roadData 값 저장 변수를 넘겨줌
	res.render("external/form", {
		roadFoodList: roadFoodList,
		pageTitle: pageTitle,
		isUserLogedIn: req.isAuthenticated()});
};

module.exports.search = async function (req, res) {
	const isLogin = req.isAuthenticated();
	res.render("external/search",{
        isUserLogedIn: req.isAuthenticated()
    })
};


module.exports.result = async function (req, res) {
	var EXPCODE = "";     //루트코드선언
      if(!req.query.price)     //원하는 가격이 없을 경우 제한금액이 없으므로 큰 가격으로 판단
            {
                saleP=10000;
            }
		else      //있다면 가격을 saleP에 저장
            saleP=Number(req.query.price.replace(/[^(0-9)]/gi,""));
    
	for (var i in roadFoodList) {
         //가장 먼저 요청하는 고속도로 routeCode 받음
		var roadstart = roadFoodList[i].start;  //시작
		var roadend = roadFoodList[i].end;       //도착
		if ((JSON.stringify(req.query.start) == JSON.stringify(roadstart)) && (JSON.stringify(req.query.end) == JSON.stringify(roadend))) {
            //시작 도착이 원래 있던 값과 맞다면 그에 맞는 루트코드 저장
			EXPCODE = roadFoodList[i].routeCode;
		}

	}

	const roadFoodResult = await request.get({  //API 요청
		url: API_URL,
		timeout: 10000,
		json: true, 
		qs: {
			'serviceKey': SERVICEKEY,
			'type': 'json',
			'routeCode': EXPCODE,
		},
		qsStringifyOptions: {
			encode: false,
		}
	}).then((result) => {    //결과값 받음
        console.log("성공");
		
        for(var i in result.list){    
            //가격 비교해서 원하는 가격보다 큰 높은 경우 null 값 줌, 이를 통해 가격높은건
            //결과화면에 나오지 못함
            if(result.list[i].salePrice!=null){
           var sp=Number(result.list[i].salePrice.replace(/[^(0-9)]/gi,""));
            if(sp>saleP)
               result.list[i].salePrice=null;
            }
        }
		return result.list;  //가격 정리한 최종값 리턴
	}).catch(e => {
		/* 에러처리*/
		console.error("request Error : " + e)
	});
   
    	res.render("external/result", {  //result 화면 렌더링
		routeName: getroutNameByends(EXPCODE), //그 코드에 맞는 이름 출력
		roadFoodResult: roadFoodResult,  //결과값을 roadFoodResult에 보냄
		query: req.query,
		pageTitle: pageTitle,
		isUserLogedIn: req.isAuthenticated(),
	});
    
};

