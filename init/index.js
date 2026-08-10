const mongoose= require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


main().then(()=>{
    console.log("ok connected with database");
}).catch((err)=>{ console.log(err)});


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderPlace");
}


const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'6a6d87fcaa059d45d3ad7cff'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized:");
}

initDB();