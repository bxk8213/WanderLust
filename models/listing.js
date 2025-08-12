const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default:    // if image is undefined  
            "https://images.unsplash.com/photo-1567477128804-96c48897f37b?q=80&w=1001&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) =>  // if image is set to null or image exist but in as empty form.
            v === "" 
                ? "https://images.unsplash.com/photo-1567477128804-96c48897f37b?q=80&w=1001&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                : v,
        
    },
    price: {
        type: Number
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
});

const Listing = new mongoose.model("Listing", listingSchema);

module.exports = Listing;
