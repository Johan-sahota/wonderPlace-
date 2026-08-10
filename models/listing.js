const mongoose=require("mongoose");
const reviews = require("./reviews");
const schema=mongoose.Schema;
const Review= require("./reviews.js");
const { string } = require("joi");

const listingSchema=new schema({
    title:{
   type:String,
   required:true,
    },
    description:String,
    img: {
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    latitude: Number,
    longitude: Number,
 category: {
        type:String,
        enum:["Trending","Rooms","Iconic Cities","Mountains","Castles","Amazing" ,"Pools","camping","Farms","Arctic"]
    },
    reviews:[{
        type: schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:schema.Types.ObjectId,
        ref:"User",
    },
   
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
    await Review.deleteMany({_id: {$in:listing.reviews}});
    }
})

 const Listing=mongoose.model("Listing",listingSchema);
 
 module.exports=Listing;