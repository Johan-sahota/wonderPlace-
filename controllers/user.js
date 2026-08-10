const User=require("../models/user.js");


module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signUp=async(req,res)=>{
try{
let {username,email,password}=req.body;
   const newUser= new User({
    email,username
   });
  const  registereduser=await User.register(newUser,password);
  req.login(registereduser,(err)=>{
    if(err){
        return next(err);
    }console.log(registereduser);
  req.flash("success","Registration Was Completed !")
  res.redirect ("/listings");
  })
}catch(e){
req.flash( "error",e.message);
res.redirect("/signup");
}
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
};

module.exports.verifyLoginAndRedirect=async (req, res) => {
    req.flash("success", "Welcome back to WonderPlace! You are logged in!");
    res.redirect(res.locals.redirectUrl||"/listings"); 
  };

module.exports.logOut=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success"," You Are Logged Out Now ! ")
        res.redirect("/listings")
    })
};