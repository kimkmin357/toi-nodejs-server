const express = require("express");
const router = express.Router();
const path = require("path");
const User = require(path.join(__dirname, "../db/users"));

// @route  GET /api/signup
// @desc   Signup page
// @access Public
// router.get("/", (req, res) => {
//   res.render("signup");
// });

// @route  POST /api/signup
// @desc   Signup user
// @access Public
router.post("/", async (req, res) => {
  let responseData;

  // 중복 검사
  try {
    const result = await User.findOne({ useremail: req.body.email });

    if (result) {
      responseData = { success: false, error: "The same email exists." };
      return res.send(responseData);
    }
  } catch (err) {
    responseData = { success: false, error: err };
    return res.send(responseData);
  }

  // 회원가입
  try {
    let user = new User({
      username: req.body.name,
      useremail: req.body.email,
      userpw: req.body.password,
    });

    let result = await user.save(); // db에 user 저장

    if (result) {
      console.log("DB Saved Successfully!");
      result
        .generateToken()
        .then((user) => {
          responseData = { success: true };
          return res.cookie("x_auth", user.token).status(200).send(responseData);
        })
        .catch((err) => {
          responseData = { success: false, error: err };
          return res.send(responseData);
        });
    } else {
      responseData = { success: false, error: "DB Saved Error!" };
      return res.send(responseData);
    }
  } catch (err) {
    responseData = { success: false, error: err };
    return res.status(500).send(responseData);
  }

  // let user = new User({
  //     // name: req.body.name,
  //     useremail: req.body.email,
  //     userpw: req.body.password
  // })

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
});

// @route  POST /api/signup/ajax_id_duplicate_check
// @desc   Check duplicate user id
// @access Public
// router.post('/ajax_id_duplicate_check', async (req, res) => {

//     try {
//         const result = await User.findOne({useremail: req.body.email}).exec();

//         let responseData;
//         if(result){
//             responseData = {'result' : 'ng', 'email' : req.body.email};
//         }
//         else{
//             responseData = {'result' : 'ok', 'email' : req.body.email};
//         }
//         res.json(responseData);
//     } catch(err) {
//         res.status(500).send("Server Error");
//     }
// })

module.exports = router;
