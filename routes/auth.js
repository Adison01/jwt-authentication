const { Router } = require("express");
const router = Router();
//const router = require('express').Router();  note: instead of above 2 line we can use this line as well.
const { check, validationResult } = require("express-validator"); // note : link to know more about express-validator > express-validator.github.io/docs/
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

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
      return res.status(400).json({ message: "user already exist !" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      email,
      password: hashedPassword,
    });
    const token = await JWT.sign({ email }, "aaa", { expiresIn: 3600000 });

    res.send({
      token,
    });
  }
);

router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  let user = users.find((user) => {
  return  user.email === email;
  });
  if (!user) {
  return  res.status(400).json({
      message: "Invalid Credentials email!",
    });
  }
  let isMatch = await bcrypt.compare(password, user.password);

  console.log(password, user.password)

  if (!isMatch) {
   return  res.status(400).json({
      message: "Invalid Credentials password",
    });
  }
  const token = await JWT.sign({ email }, "aaa", { expiresIn: 3600000 });
  res.send({
    token,
  });
});

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
