const express=require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing=require("../models/listing");
const {isLoggedIn,isOwner,}=require("../middleware/middleware.js");
const reviews = require("../models/reviews.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");

const upload=multer({storage});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg); 
  }
  next();
};


router.route("/")
.get(wrapAsync(listingController.index)) // index route
.post(validateListing,upload.single("listing[img]"),wrapAsync(listingController.storeNewListing)); // create new listing


// new and create route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
  .get(wrapAsync(listingController.showListing)) //show route
  .put(isLoggedIn, isOwner, upload.single("listing[img]"),validateListing, wrapAsync(listingController.UpdateListing))// update route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));// for delete route
//  edit and update route
router.get("/:id/edit" ,isLoggedIn,isOwner, wrapAsync(listingController.sendEditForm));


module.exports=router;

