// @ts-check


// Entry Point

// db/db.js 파일의 connect 함수 실행 DB연결 안되면 프로그램 종료
const db = require('./db/db');
db.connect()

const { PORT } = require('./config/configOption');

// express 관련 설정 부분을 따로 분리(라우팅, 파서, 뷰, 스태틱 설정 등)
const app = require('./app')

app.listen(PORT, () => {
  console.log(`The Express server is listening at port: ${PORT}`)
})
