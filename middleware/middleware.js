const Listing=require("../models/listing");
const Review=require("../models/reviews");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You Must Be Logged To Create Listings !")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Ensure owner is an ObjectId
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isReviewAuthor = async (req,res,next)=>{
let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)){
req.flash("error" ," You are Not Author");
return res.redirect(`/listings/${id}`);
  }
  next();
}
  

