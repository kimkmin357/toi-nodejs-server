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

// express server ip와 port를 활용하여 react에서 만든 page를 접근하기 위한 설정
app.use('/react/', express.static(path.join(__dirname, '/build')));
app.use('/react/*', express.static(path.join(__dirname, '/build')));

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