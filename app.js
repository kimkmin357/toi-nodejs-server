const express = require('express');
const path = require('path');
const mainRouter = require('./routes/main');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const requestIp = require('request-ip');

const app = express();
// Client로부터의 데이터를 body로 접근하기 위한 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser()); // cookieParser(secretKey, optionObj)
app.use(cors());
// view 엔진 설정 views폴더 하위의 파일을 사용하도록 설정, 서버쪽 확인용 페이지
app.set("views", path.join(__dirname, "./views"));
// app.set('view engine', 'ejs')
app.set('view engine', 'pug');


// public 폴더를 static으로 설정하여 Client가 Server의 데이터를(html, img 등) 다이렉트로 접근 할 수 있도록 설정
// ex) localhost:3000/home.html   => 라우팅 없이도 접근가능
// 이미지 파일을 추가할때마다 일일이 router 설정을 해줘야 하는 번거로움 없앰
//app.use(express.static(path.join(__dirname, '/public')));
app.use('/public', express.static(path.join(__dirname,'./public')))

app.use('*', (req, res, next) => {
    let date_ob = new Date();
    let method = req.method;
    let baseUrl = req.baseUrl;
    let clientIP = requestIp.getClientIp(req);

    const getTime = () => {
        //let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        let date_ob = new Date();
        let year = date_ob.getFullYear();
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let date = ("0" + date_ob.getDate()).slice(-2);
        let hours = ("0" + date_ob.getHours()).slice(-2);
        let minutes = ("0" + date_ob.getMinutes()).slice(-2);
        let seconds = ("0" + date_ob.getSeconds()).slice(-2);
        
        let result = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        return result;
    }
    
    
    let time = getTime();

    let strLog = time + " - ";
    strLog += clientIP + ":" + process.env.PORT + baseUrl;
    strLog += "(" + method + ")";
    console.log(strLog);

    next();
});
  
app.get('/', (req, res) => {
    res.send("Hello World!");
});

// routing 설정
app.use('/api', mainRouter);

// @ts-ignore
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    res.statusCode = err.statusCode || 500;
    res.send(err.message);
})

module.exports = app;