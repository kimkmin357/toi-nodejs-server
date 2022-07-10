const express = require("express");
const router = express.Router();
const User = require("../db/users");

// @route  GET /api/signin
// @desc   Singin page
// @access Public
// router.get('/', (req, res) => {
//     res.render('signin');
// })

// @route  POST /api/signin
// @desc   Singin user
// @access Public
router.post("/", async (req, res) => {
  let responseData;
  try {
    let result = await User.findOne({ useremail: req.body.email });

    if (result == null) {
      // ID가 존재하지 않음
      responseData = { success: false, error: "ID or PW does not match." };
      return res.send(responseData);
    } else {
      const matched = await result.comparePassword(req.body.password);
      if (!matched) {
        // 비밀번호가 맞지 않음
        responseData = { success: false, error: "ID or PW does not match." };
        return res.send(responseData);
      }

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
    }
  } catch (err) {
    responseData = { success: false, error: err };
    return res.status(500).send(responseData);
  }
});

module.exports = router;
