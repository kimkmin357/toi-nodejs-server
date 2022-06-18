// routing 만 관리하는 js 파일
const express = require('express');
const router = express.Router();
const path = require('path');
const User = require(path.join(__dirname , '../db/users'));

const signin = require('./signin');
const signup = require('./signup');
const auth = require('./auth/auth');
const authorization = require('./auth/authorization');
const resetPw = require('./requestResetPw');


// @route  GET /api
// @desc   Routing Root
// @access Public
router.get('/', authorization.authorization, (req,res) => {
    //res.sendFile(path.join(__dirname, '../public/home.html'))
    //res.render('signin')

    if (req.user) {
        res.render('result_login.pug', {'response' : 'Welcome ' + req.user.useremail +' !!', 'result' : true});
    } else {
        res.render('signin');
    }
})

// @route  GET /api/logout
// @desc   Logout
// @access Public
router.get("/logout", authorization.authorization, (req, res) => {

    // auth를 통해 인증과정을 거치고 리턴된 사용자 정보(req.user)를 활용하여
    // db에에서 useremail 해당하는 토큰값을 비워준다.
    User.findOneAndUpdate({ useremail: req.user.useremail }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        res.clearCookie("x_auth");
        res.redirect('/api');
    });
});

// @route  GET /api/verify-email
// @desc   Verify email
// @access Public
router.get('/verify-email', async (req, res) => {
    const { code } = req.query
    if (!code) {
      res.status(400).end()
      return
    }
  
    const users = await getUsersCollection()
    // TODO
})

router.use('/signin', signin)
router.use('/signup', signup)
router.use('/auth', auth)
router.use('/request-reset-password', resetPw)


module.exports = router;