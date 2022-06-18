const express = require('express');
const router = express.Router();
const User = require('../db/users')

// @route  GET /api/signin
// @desc   Singin page
// @access Public
router.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname , '../public/home.html'))
    res.render('signin');
})

// @route  POST /api/signin
// @desc   Singin user
// @access Public
router.post('/', async (req, res) => {
  
    try {
        let result = await User.findOne({useremail: req.body.email});
        
        if(result == null){
            // ID가 존재하지 않음
            return  res.render('result_login.pug', {'response' : 'ID or PW does not match.', 'result' : false})
        }
        else(result.useremail == req.body.email)
        {
            const matched = await result.comparePassword(req.body.password);
            if(!matched){
                // 비밀번호가 맞지 않음
                return  res.render('result_login.pug', {'response' : 'ID or PW does not match.', 'result' : false});
            }

            result.generateToken()
                .then((user) => {
                    return res.cookie("x_auth", user.token)
                            .status(200)
                            .redirect('/api');
                })
                .catch((err) => res.status(400).render('result_login.pug', {'response' : 'Unknown Err', 'result' : false}));
        }
    } catch(err) {
        res.status(500).send("Server Error");
    }
})
 
 
module.exports = router;