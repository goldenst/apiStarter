const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetpassword,
  updatedetails,
  updatePassword
} = require("../controlers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetpassword);
router.put("/updatedetails", protect, updatedetails);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
