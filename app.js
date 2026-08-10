const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);


require("dotenv").config();
const express= require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const port=8080;

const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema.js");
//  Database link 
const dbUrl=process.env.MONGO_URL;

main().then(()=>{
    console.log("ok connected with database");
}).catch((err)=>{ console.log(err)});

// database connection 
async function main(){
    await mongoose.connect(dbUrl);
}

const Review=require("./models/reviews.js");
// requiring routers
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")
// requireing passport
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");
// session 
const session=require("express-session");

const flash=require("connect-flash");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo").default;
 const store = MongoStore.create({
        client: mongoose.connection.getClient(),
        touchAfter: 24 * 3600
    });

store.on("error", (error) => {
    console.log("Error in MongoDB session store:", error);
});
const sessionOPtions={
    store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};


app.use(session(sessionOPtions));

app.use(flash());
// initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})

 
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



// Catch-all for undefined routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

//  for error handling
app.use((err,req,res,next)=>{
    let{ status = 500, message = "Something went wrong" }=err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{err});
})

app.listen(port,()=>{
    console.log("server started:");
})