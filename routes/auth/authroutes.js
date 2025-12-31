const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logoutUser,authMiddleware,checkAuth} = require("../../controllers/auth/authController");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware,checkAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User authenticated!",
    user: req.user,
  });
});

module.exports = router;
