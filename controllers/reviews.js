const Review=require("../models/reviews.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing=require("../models/listing");
const User=require("../models/user.js");



module.exports.addNewReview=async(req,res)=>{
 let listing=await Listing.findById(req.params.id);
 let newReview=new Review(req.body.review);
 newReview.author = req.user._id;
 listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();
  let reviewOwner=User.findById(newReview.author._id);
  console.log(newReview);
req.flash("success","New Review Created !")
 res.redirect(`/listings/${listing._id}`); 
 console.log(" Review Saved");
};

module.exports.deleteReview=async(req,res)=>{
let{id,reviewId}= req.params;
 await Review.findByIdAndDelete(reviewId);
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
req.flash("success"," Review Deleted !");
 res.redirect(`/listings/${id}`);
}