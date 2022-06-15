const express = require('express');
const router = express.Router();
const User = require('../db/users')
 
// @route  GET /signin
// @desc   Singin page
// @access Public
router.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname , '../public/home.html'))
    res.render('signin')
})

// @route  POST /api/signin
// @desc   Singin user
// @access Public
router.post('/', async (req, res) => {
    console.log("This is '/api/signin' post API")
  
    try {
        let result = await User.findOne({useremail: req.body.email});
        
        if(result.useremail == req.body.email)
        {
            const matched = await result.comparePassword(req.body.password);
            if(!matched){
                // 비밀번호가 맞지 않음
                return  res.render('result_login.ejs', {'response' : 'The password is wrong.', 'result' : false});
            }

            result.generateToken()
                .then((user) => {
                    return res.cookie("x_auth", user.token)
                            .status(200)
                            .redirect('/api');
                            //.render('result_login.ejs', {'response' : 'Welcome ' + req.body.email +' !!', 'result' : true});
                })
                .catch((err) => res.status(400).render('result_login.ejs', {'response' : 'Unknown Err', 'result' : false}));
        }
        else
        {
            // ID가 존재하지 않음
            res.render('result_login.ejs', {'response' : 'ID does not exist.', 'result' : false})
        }
    } catch(err) {
        res.status(500).send("Server Error");
    }
})
 
 
module.exports = router;