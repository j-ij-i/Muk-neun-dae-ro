const mongoose = require("mongoose");
const Restfood = mongoose.model('Restfood');
const request = require('request-promise');
const pageTitle = "내부 DB 이용"; //고정 상수 타이틀값

console.log('call : /controllers/InternalController.js');


module.exports.info = async function (req, res) {
 const isLogin = req.isAuthenticated();
    var areaname=String(req.params.code); 
    //가장 먼저 원하는 휴게소 이름 받음
    
    console.log(areaname);
    
	const foodhistory = await Restfood.find({  //그 코드와 이름이 맞는 휴게소를 
       //Restfood라는 컬렉션에서 찾음
        //이름이 보통 확실하게 겹치지않기 때문에 regex라는 것 사용
        //휴게소 코드가 동일하지 않은 경우가 존재해 이름으로 비교함
        restname: { $regex : new RegExp(areaname, "i") } 
	});
    
	res.render("external/info", {
        query: req.query,
		roadFoodInfo: foodhistory,
		// 나온 그 결과값을 렌더링할때 roadFoodInfo로 보냄
		isUserLogedIn: req.isAuthenticated(),		
	});
      
};

module.exports.searchinfo = async function (req, res) {
    //원하는 휴게소 이름을 get방식을 통해 받음
    var areaname=String(req.query.question);
    
    console.log(areaname);
    
	const searchRest = await Restfood.find({  //받은 휴게소 이름과 비슷한
        //휴게소를 찾고 그 휴게소의 값을 searchRest에 저장
        restname: { $regex : new RegExp(areaname, "i") } 
	});
    
	res.render("external/searchinfo", {
		roadFoodInfo: searchRest,  //searchRest 데이터를 roadFoodInfo에 전송한 후 렌더링
		isUserLogedIn: req.isAuthenticated(),		
	});
      
};

module.exports.createResult = async function (req, res) {
	//데이터베이스에 저장하는 부분
    //여기서 저장하는 내용은 휴게소에 존재하는 모든 음식 설명 데이터
    const restInfo = await request.get({  //요청
		url: 'http://data.ex.co.kr/exopenapi/restinfo/restBestfoodList',
		timeout: 10000,
		json: true, 
		qs: {
			'serviceKey': 'VnZcXs2mmQGm3pgtzTsqnupGPO2EsiE8NNV3MMEblCv7BRg1T3%2BnqhNBDC0sjShiZLuJTWtx1Ay%2BYmlu1WT7mg%3D%3D',
			'type': 'json',
			'numOfRows': 100,
            'pageNo':21
		},
		qsStringifyOptions: {
			encode: false
		}
    }).then((result) => { 
		return result.list;  //결과의 리스트 리턴
	}).catch(e => {
		/* 에러처리*/
		console.error("request Error : " + e);
		res.status(500).send();
	});

	 for(var i in restInfo)
	{      //각각의 요소에 맞게 다큐먼트 생성하고 값 저장
       		const restfood=new Restfood();
         restfood.restname=restInfo[i].stdRestNm,
		restfood.foodname=restInfo[i].foodNm,
		restfood.foodcost=restInfo[i].foodCost,
		restfood.foodmaterial= restInfo[i].foodMaterial,
		restfood.premiumyn= restInfo[i].premiumyn,
		restfood.recommedyn= restInfo[i].recommendyn,
		restfood.etc= restInfo[i].etc
        restfood.save();
     }
     console.log("성공");
};

