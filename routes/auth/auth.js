const express = require('express');
const fetch = require('node-fetch');
const request = require('request-promise');
const router = express.Router();
const User = require('../../db/users');

const { KAKAO_REST_KEY, KAKAO_SECRET, KAKAO_REDIRECT_URI, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_REDIRECT_URI } = require('../../config/configOption')


const checkRegistrationAndLogin = async (name, email, res) => {

    try {
        // SNS 이메일 정보로 회원가입이 되어있는지 확인
        let result = await User.findOne({useremail: email}).exec();
        
        if(result == null)
        {
            // 가입이 되어있지 않으면 SNS 사용자 정보로 회원가입 진행
            // 토큰 발급 후 로그인 진행
            let newUser = new User({
                username: name,
                useremail: email,
                userpw: email
            })

            newUser
            .generateToken()
            .then((user) => {
                res.cookie("x_auth", user.token)
                    .status(200)
                    .redirect('/api');
            })
            .catch((err) => {
                console.log(err);
                res.status(400).render('result_login.pug', {'response' : '토큰 생성 실패', 'result' : false})
            }); 
        }
        else
        {
            // 가입이 되어있으면 토큰 발급하고 로그인 처리
            result
            .generateToken()
            .then((user) => {
                res.cookie("x_auth", user.token)
                    .status(200)
                    .redirect('/api');
            })
            .catch((err) => {
                console.log(err);
                res.status(400).render('result_login.pug', {'response' : '토큰 생성 실패', 'result' : false})
            }); 
        }
    } catch(err) {
        console.log(err);
        res.render('result_login.pug', {'response' : 'SNS 사용자 정보에 맞는 DB정보 조회 문제발생', 'result' : false});
    }
}


// @route  GET /auth
// @desc   Auth
// @access Public
router.get('/', (req, res) => { 
    //auth 미들웨어를 정상적으로 수행했으므로
    //req.user에 사용자 정보가 있다.
    res.status(200).json({
        // name: req.user.name,
        useremail: req.user.useremail,
        isAuth: true, 
    });
})

// @route  GET /auth/kakao_login
// @desc   Request Kakao login
// @access Public
router.get('/kakao_login', (req,res)=>{
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
        client_id: KAKAO_REST_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        response_type: "code",
    };
    const params = new URLSearchParams(config).toString();

    const finalUrl = `${baseUrl}?${params}`;
    console.log(finalUrl);
    res.redirect(finalUrl);
})

// @route  GET /auth/kakao/callback
// @desc   Kakao login redirect url
// @access Public
router.get('/kakao/callback', async (req, res) => {
    const { code } = req.query

    if (!code || typeof code !== 'string') {
      res.status(400).end()
      return
    }

    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
        client_id: KAKAO_REST_KEY,
        client_secret: KAKAO_SECRET,
        grant_type: "authorization_code",
        redirect_uri: KAKAO_REDIRECT_URI,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    let kakaoTokenRes = undefined;
    try {
        kakaoTokenRes = await fetch(finalUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/json", // 이 부분을 명시하지않으면 text로 응답을 받게됨
            },
        })
       
    } catch(err) {
        console.log(err);
        res.render('result_login.pug', {'response' : '카카오 서버로부터 Access Tocken 획득 실패', 'result' : false});
    }

    let userInfos = undefined;
    try {
        const accessToken = (await kakaoTokenRes.json()).access_token

        const userInfoRes = await fetch('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
        })

        userInfos = await userInfoRes.json()
    } catch(err) {
        console.log(err);
        res.render('result_login.pug', {'response' : '카카오 서버로부터 사용자 정보 조회 실패', 'result' : false});
    }
    
    checkRegistrationAndLogin(userInfos.properties.nickname, userInfos.kakao_account.email, res);
})

// @route  GET /auth/naver_login
// @desc   Request Naver login
// @access Public
router.get('/naver_login', (req, res) => {
    const naver_api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + NAVER_CLIENT_ID 
                + '&redirect_uri=' + NAVER_REDIRECT_URI 
                + '&state=RAMDOM_STATE';

    res.redirect(naver_api_url);
})

// @route  GET /auth/naver/callback
// @desc   Naver login redirect url
// @access Public
router.get('/naver/callback', async (req, res) => {
    // 토큰을 발급받으려면 query string으로 넘겨야 할 정보들이다.
    const state = req.query.state;
    const code = req.query.code;

  	// 로그인 API를 사용해 access token을 발급받는다.
    const naver_api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&response_type=code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&redirect_uri=${NAVER_REDIRECT_URI}&code=${code}&state=${state}`;
    const options = {
        url: naver_api_url,
        headers: {
          'X-Naver-Client-Id': NAVER_CLIENT_ID, 
          'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
    }
    const result = await request.get(options);
  	// string 형태로 값이 담기니 JSON 형식으로 parse를 해줘야 한다.
    const token = JSON.parse(result).access_token;
  
    // 발급 받은 access token을 사용해 회원 정보 조회 API를 사용한다.
    const userInfos = {
        url: 'https://openapi.naver.com/v1/nid/me',
        headers: {'Authorization': 'Bearer ' + token}
    };

    const userInfosJson = await request.get(userInfos);
  	// string 형태로 값이 담기니 JSON 형식으로 parse를 해줘야 한다.
    const userProfile = JSON.parse(userInfosJson).response;

    checkRegistrationAndLogin(userProfile.name, userProfile.email, res);
})

module.exports = router;