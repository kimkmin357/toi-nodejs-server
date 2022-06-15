const express = require('express');
const router = express.Router();
const path = require('path')
const User = require(path.join(__dirname , '../db/users'))

// @route  GET /signup
// @desc   Signup page
// @access Public
router.get('/', (req, res) => { 
    //res.sendFile(path.join(__dirname , '../public/join_form.html'))
    res.render('signup');
})

// @route  POST /signup
// @desc   Signup user
// @access Public
router.post('/', async (req, res) => {
    console.log("This is '/signup' post API");

    if(req.body.checkDuplicate != 'ok'){
        res.write("<script>alert('Please check duplicate email.')</script>");
        res.write("<script>window.location=\"../api/signup\"</script>");
        return;
    }

    if(req.body.name == ''){
        res.write("<script>alert('Please enter a name.')</script>");
        res.write("<script>window.location=\"../api/signup\"</script>");
        return;
    }

    if(req.body.email == ''){
        res.write("<script>alert('Please enter a email.')</script>");
        res.write("<script>window.location=\"../api/signup\"</script>");
        return;
    }

    if(req.body.password == '' || req.body.password2 == ''){
        res.write("<script>alert('Please enter a password.')</script>");
        res.write("<script>window.location=\"../api/signup\"</script>");
        return;
    }

    if(req.body.password != req.body.password2){
        res.write("<script>alert('Passwords do not match.')</script>");
        res.write("<script>window.location=\"../api/signup\"</script>");
        return;
    }

    // 중복 검사
    try {
        const result = await User.findOne({useremail: req.body.email});

        if(result){
            res.write("<script>alert('Duplicate email.')</script>");
            res.write("<script>window.location=\"../api/signup\"</script>");
            return;
        }
    } catch(err) {
        return res.status(500).send("Server Error");
    }

    // 회원가입
    try {
        let user = new User({
            username: req.body.name,
            useremail: req.body.email,
            userpw: req.body.password
        })

        let result = await user.save(); // db에 user 저장
        console.log('DB Saved Successfully!');

        if(result){

            result.generateToken()
                .then((user) => {
                    return res.cookie("x_auth", user.token)
                            .status(200)
                            .redirect('/api');
                            //.render('result_login.ejs', {'response' : 'Welcome ' + req.body.email +' !!', 'result' : true});
                })
                .catch((err) => res.status(400).render('result_login.ejs', {'response' : 'Unknown Err', 'result' : false}));
        }
        else{
            return res.status(200).send(err);
        }

        
    } catch(err) {
        console.log('DB Saved Error!');
        res.send(err);
    }
    
    // let user = new User({
    //     // name: req.body.name,
    //     useremail: req.body.email,
    //     userpw: req.body.password
    // })


    // //TO DO : email 형식 검사
    // User.findOne({useremail: req.body.email})
    //     .then((result) => {
    //         if(result){
    //             res.write("<script>alert('Duplicate email.')</script>");
    //             res.write("<script>window.location=\"../signup\"</script>");
    //             return;
    //         }
    //         else{
    //             // post로 넘어온 데이터를 받아서 DB에 저장하고 가입완료 화면을 띄워준다.
    //             user.save()
    //             .then(() => {
    //                 return res.render('success_join.ejs', {'name' : req.body.email});
    //             })
    //             .catch((err) => {
    //                 return res.status(200).send(err);
    //             })
                
    //         }
    //     })
    //     .catch((err) => res.status(500).send("Server Error"));

})

// @route  POST /signup/ajax_id_duplicate_check
// @desc   Check duplicate user id
// @access Public
router.post('/ajax_id_duplicate_check', async (req, res) => {
    console.log("This is '/api/signup/ajax_id_duplicate_check' post API")

    try {
        const result = await User.findOne({useremail: req.body.email}).exec();

        let responseData;
        if(result){
            responseData = {'result' : 'ng', 'id' : req.body.email};
        }
        else{
            responseData = {'result' : 'ok', 'id' : req.body.email};
        }
        res.json(responseData);
    } catch(err) {
        res.status(500).send("Server Error");
    }
    
    
})

module.exports = router;