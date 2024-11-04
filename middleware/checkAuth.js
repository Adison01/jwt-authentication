const JWT = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({
      message: "access denied",
    });
  }
  try {
    let user = await JWT.verify(token, "aaa");
    req.user = user.email; //did not understand it properly, need discussion. 
    next();
  } catch (e) {
    return res.json({message: "Token not valid"})
  }
};

// (req, res, next) => {
//     let userValid = false;
//     if (userValid) {
//       next();
//     } else {
//       return res.json({ message: "Access denied" });
//     }
//   },
