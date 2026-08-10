const express=require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware/middleware.js");
const userController=require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)//render a signup form
.post( wrapAsync(userController.signUp));//signup

//  login

router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  userController.verifyLoginAndRedirect
);

// log out route

router.get("/logout",userController.logOut);


module.exports=router;