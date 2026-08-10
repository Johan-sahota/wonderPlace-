const { number } = require("joi");
const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema.js");


module.exports.index = async (req, res) => {

    const { category, location } = req.query;

    console.log("Category:", category);
    console.log("Location:", location);

    let allListing;

    if (category) {

        allListing = await Listing.find({
            category: category
        });

        console.log("Selected category:", category);
        console.log("Listings:", allListing);

    } else if (location) {

        allListing = await Listing.find({
            location: {
                $regex: location,
                $options: "i"
            }
        });

        console.log("Searched location:", location);
        console.log("Listings:", allListing);

    } else {

        allListing = await Listing.find({});

    }

    res.render("listings/index", {
        allListing,
        selectedCategory: category
    });
};
// create new listing form 
module.exports.renderNewForm = (req, res) => {
    // to check was your is loginnec or not
    res.render("listings/create.ejs");
};
// store new listing
module.exports.storeNewListing = async (req, res, next) => {

    let result = listingSchema.validate(req.body);

    let url = req.file.path;
    let filename = req.file.filename;

    console.log(`url = ${url}, filename = ${filename}`);
    
    // Create listing
    let newListing = new Listing(req.body.listing);
   newListing.category = req.body.listing.category;
    newListing.owner = req.user._id;
    newListing.img = {
        url,
        filename
    };

      // Address entered by user
    const place = `${newListing.location}, ${newListing.country}`;

    // Convert address to coordinates
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(place)}`,
        {
            headers: {
                "User-Agent": "WonderPlace/1.0"
            }
        }
    );

    const data = await response.json();

    console.log("Nominatim result:", data);

    if (data.length > 0) {

        newListing.latitude = Number(data[0].lat);
        newListing.longitude = Number(data[0].lon);

        console.log("Latitude:", newListing.latitude);
        console.log("Longitude:", newListing.longitude);

    } else {

        console.log("Location not found");

    }

    await newListing.save();

    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
};
// show listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let result = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }
    ).populate("owner");
    // console.log(result);
    if (!result) {
        req.flash("error", "Listing Not found Or Deleted!");
        return res.redirect("/listings");
    }

    if(result.latitude== null && result.longitude== null){
        console.log("cordinates not found!");
        let place=`${result.location},${result.country}`;
        try{
        
            const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(place)}`,
        {
            headers: {
                "User-Agent": "WonderPlace/1.0"
            }
        }
    );
    let data= await response.json();
    console.log(data);

    // after found 
    if(data.length>0){
        result.latitude=(data[0].lat);
        result.longitude=(data[0].lon);
        await result.save();
        console.log("cordinates saved");
    }else{
        console.log("can't find cordinates");
    }

        }catch(err){
            console.log(err);
        }
    }else{
        console.log("Coordinates already exist in database.");
    }

    res.render("listings/show", { result });
};
// edit form
module.exports.sendEditForm = async (req, res) => {
    let { id } = req.params;
    let oldData = await Listing.findById(id);
    if (!oldData) {
        req.flash("error", "Listing Not found Or Deleted!");
        return res.redirect("/listings");
    }
    const originalUrl = oldData.img.url.replace(
        "/upload/",
        "/upload/w_250/"
    );
    // console.log(oldData);
    res.render("listings/edit.ejs", { oldData, originalUrl });
    // res.send("ok it will works");
};
// update
module.exports.UpdateListing = async (req, res) => {
    let { id } = req.params;
    let newData = req.body.listing;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    // Update
    let update = await Listing.findByIdAndUpdate(id, newData, { returnDocument: "after" });
    if (req.file) {


        let url = req.file.path;
        let filename = req.file.filename;
        update.img = { url, filename };
        await update.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};
// delete 
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);
    console.log("delete listing");
    req.flash("success", "Listing Deleted !")

    res.redirect("/listings");
};