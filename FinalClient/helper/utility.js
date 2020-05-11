const roadFoodList = require('../config/roadData');//마켓데이터를 가져옵니다
/* 코드명을 넣어 과일 이름을 반환합니다.*/
// 단축형으로 사용한다면
//module.exports.getNameByCode11 = code => marketList.filter(data => data.mcode == code)[0].name;

console.log('call : /helper/utlity.js');

module.exports.getroutNameByends = function(code){
    return roadFoodList.filter(function(data){
       return data.routeCode == code;
    })[0].routeName;
};
                                  


