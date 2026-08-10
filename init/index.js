const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const mongoose= require("mongoose");
require("dotenv").config({ path:"../.env" });
const initData=require("./data.js");
const Listing=require("../models/listing.js");


const dbUrl = process.env.MONGO_URL;

async function initDB() {
    try {
        // Connect FIRST
        await mongoose.connect(dbUrl);

        console.log("MongoDB Atlas connected!");

        // Delete old data
        await Listing.deleteMany({});

        console.log("Old listings deleted");

        // Insert new data
        await Listing.insertMany(initData.data);

        console.log("Data was initialized successfully!");
    } catch (err) {
        console.log("DATABASE ERROR:");
        console.log(err);
    } 


const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'6a796f6fa113cea42d2f380f'}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized:");
}
}
initDB();