const { Router } = require("express");
const router = Router();
//const router = require('express').Router();  note: instead of above 2 line we can use this line as well.
const { check, validationResult } = require("express-validator"); // note : link to know more about express-validator > express-validator.github.io/docs/
const { users } = require("../db");
const bcrypt = require("bcrypt");

router.post(
  "/signup",
  [
    check("email", "please provide a valid email").isEmail(),
    check("password", "please provide password more than 5 character").isLength(
      { min: 6 }
    ),
  ],
  async (req, res) => {
    const { password, email } = req.body;

    // validate the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // validate if user does not exist

    let user = users.find((user) => {
      return user.email === email;
    });
    if (user) {
      res.status(400).json({ message: "user already exist !" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      email,
      password: hashedPassword,
    });
    console.log(hashedPassword);

    res.send("validation pass");
  }
);

router.get('/all', (req, res)=>{
res.json(users)
})




module.exports = router;
