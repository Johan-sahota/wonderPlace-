const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

require("dotenv").config({
    path: "../.env"
});

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.MONGO_URL;

async function initDB() {
    try {
        // 1. Connect to Atlas
        await mongoose.connect(dbUrl);

        console.log("MongoDB Atlas connected!");

        // 2. Delete old listings
        await Listing.deleteMany({});

        console.log("Old listings deleted");

        // 3. Add owner to every listing
        const dataWithOwner = initData.data.map((obj) => ({
            ...obj,
            owner: "6a796f6fa113cea42d2f380f"
        }));

        // 4. Insert listings
        await Listing.insertMany(dataWithOwner);

        console.log("Data was initialized successfully!");
    } catch (err) {
        console.log("DATABASE ERROR:");
        console.log(err);
    } finally {
        await mongoose.connection.close();
    }
}

initDB();