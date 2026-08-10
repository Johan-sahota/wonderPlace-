const express=require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const Review=require("../models/reviews.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing=require("../models/listing");
const {isLoggedIn ,isReviewAuthor}=require("../middleware/middleware.js");
const User=require("../models/user.js");
const reviewController=require("../controllers/reviews.js");

const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el => el.message)

        throw new ExpressError(400,error);
    } 
    next();
}

// ADD reviews route

router.post("/", isLoggedIn, validateReview,wrapAsync(reviewController.addNewReview ));

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports=router;