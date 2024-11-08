const { Router } = require("express");
const router = Router();
const { privatePosts, publicPosts } = require("../db");
const checkAuth = require('../middleware/checkAuth')

router.get("/public", (req, res) => {
  res.json(publicPosts);
});
router.get(
  "/private",
  checkAuth,
  (req, res) => {
    res.json(privatePosts);
  }
);

module.exports = router;
