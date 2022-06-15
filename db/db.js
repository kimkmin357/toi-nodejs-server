const { MONGO_URI, NODE_ENV } = require("../config/configOption")

// mongoose 모듈 가져오기
const mongoose = require('mongoose');

const connect = async () => {

    // 개발 환경이 아닐 때 mongoose가 생성하는 쿼리 내용을 콘솔에 출력
    if (NODE_ENV !== 'DEV') {
        console.log("This is not DEV");
        mongoose.set('debug', true);
    }

    try {
        await mongoose.connect(MONGO_URI, { 
            dbName: "test" // 연결할 DB명(존재하지 않을 경우 해당 이름으로 생성)
        });

        console.log("MongoDB Connected...");
    } catch(error) {
        console.error(error.message);
        process.exit(1);
    }
}

// 다른 모듈에서 connect 함수를 사용할 수 있도록 설정
exports.connect = connect;
module.exports = { connect };