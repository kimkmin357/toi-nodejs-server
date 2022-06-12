const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const User = require('../../db/users')

const { KAKAO_REST_KEY, KAKAO_SECRET, KAKAO_REDIRECT_URI } = require('../../config/configOption')

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

// @route  GET /auth/kakao
// @desc   kakao login
// @access Public
router.get('/kakao', (req,res)=>{
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
        client_id: KAKAO_REST_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        response_type: "code",
    };
    const params = new URLSearchParams(config).toString();

    const finalUrl = `${baseUrl}?${params}`;
    console.log(finalUrl);
    return res.redirect(finalUrl);
})

// @route  GET /auth/kakao/callback
// @desc   kakao login redirect url
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
        res.render('result_login.ejs', {'response' : '카카오 서버로부터 Access Tocken 획득 실패', 'result' : false});
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
        res.render('result_login.ejs', {'response' : '카카오 서버로부터 사용자 정보 조회 실패', 'result' : false});
    }
    

    try {
        // 카카오 이메일 정보로 회원가입이 되어있는지 확인
        let result = await User.findOne({useremail: userInfos.kakao_account.email}).exec();
        
        if(result == null)
        {
            // 가입이 되어있지 않으면 카카오 사용자 정보로 회원가입 진행
            // 토큰 발급 후 로그인 진행
            let newUser = new User({
                username: userInfos.properties.nickname,
                useremail: userInfos.kakao_account.email,
                userpw: userInfos.kakao_account.email
            })

            newUser
            .generateToken()
            .then((user) => {
                return res.cookie("x_auth", user.token)
                        .status(200)
                        .redirect('/api');
                        //.render('result_login.ejs', {'response' : 'Welcome ' + user.useremail +' !!', 'result' : true});
            })
            .catch((err) => {
                console.log(err);
                res.status(400).render('result_login.ejs', {'response' : '토큰 생성 실패', 'result' : false})
            }); 
        }
        else
        {
            // 가입이 되어있으면 토큰 발급하고 로그인 처리
            result
            .generateToken()
            .then((user) => {
                return res.cookie("x_auth", user.token)
                        .status(200)
                        .redirect('/api');
                        // .render('result_login.ejs', {'response' : 'Welcome ' + result.useremail +' !!', 'result' : true});
            })
            .catch((err) => {
                console.log(err);
                res.status(400).render('result_login.ejs', {'response' : '토큰 생성 실패', 'result' : false})
            }); 
        }
    } catch(err) {
        console.log(err);
        res.render('result_login.ejs', {'response' : '카카오 정보에 맞는 DB정보 조회 문제발생', 'result' : false});
    }
  })

module.exports = router;