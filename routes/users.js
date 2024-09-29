const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router
.route("/signup")
//sign up form
.get( userController.renderSignupForm)
//user added(form submission)
.post(wrapAsync(userController.signup));



router
.route("/login")
//login route(get form)
.get( userController.renderLoginForm)
//login route(save login form)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

//logout
router.get("/logout", userController.logout);
module.exports = router;
