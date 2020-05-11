console.log('call : /config/environment.js');
module.exports = {
    PORT:3000,//포트번호
    DATABASE:"mongodb://localhost:27017/ServiceArea",//Database 주소
	SERVICEKEY:'VnZcXs2mmQGm3pgtzTsqnupGPO2EsiE8NNV3MMEblCv7BRg1T3%2BnqhNBDC0sjShiZLuJTWtx1Ay%2BYmlu1WT7mg%3D%3D', 
	//오픈 API에서 발급받은 server key 값
    MONGO_SESSION_COLLECTION_NAME:"sessions",
   	SESSION_SECRET:"1234", //세션 암호화에 사용할 값
    API_URL:"http://data.ex.co.kr/exopenapi/business/representFoodServiceArea"
};
