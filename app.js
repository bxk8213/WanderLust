const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then((res) => {
    console.log("Connection to Database sucessful");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

// Uses ejs as template, that is we don't have to write filename.ejs, .ejs is automatically added, we can only write filename.
app.set("view engine", "ejs");

// Tell express where our ejs file will be at.
app.set("views", path.join(__dirname, "views"));
// Says hey don't look in usual "views" folder to find ejs files instead look in folder mentioned inside path.join() method.
//"views" here is a special Express setting key — not just a folder name.
//This sets the views directory for the Express app.
//It's where Express will look for the template files when you do res.render("filename").

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
    res.send("Hi! I am root");
});

//Index Route
app.get("/listings", 
    wrapAsync(async (req, res) => {
        let allListings = await Listing.find({});
        res.render("./listings/index", { allListings });
    })
);

// New Route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new");
});

//Show Route
app.get("/listings/:id", 
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        const listing = await Listing.findById(id);

        res.render("./listings/show", { listing });
    })
);

// Create Route
app.post("/listings", 
    wrapAsync(async (req, res, next) => {
        console.log(req.body);
    // let {title, description, image, price, country, location} = req.body;
        if(!req.body.listing)
        {
            throw new ExpressError(400, "Please send vaid data");
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

//Edit Route
app.get("/listings/:id/edit", 
    wrapAsync( async (req, res) => {
        let { id } = req.params;

        const listing = await Listing.findById(id);

        console.log(listing);

        res.render("./listings/edit", { listing });
    })
);

// Update Route
app.put("/listings/:id", 
    wrapAsync( async (req, res) => {
        if(!req.body.listing)
        {
            throw new ExpressError(400, "Send valid data");
        }

        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body.listing);
        res.redirect(`/listings/${id}`);
    })
);

//Delete Route
app.delete("/listings/:id", 
    wrapAsync( async (req, res) => {
        let { id } = req.params;

        const deletedListing = await Listing.findByIdAndDelete(id);

        console.log(deletedListing);

        res.redirect("/listings");
    })
);


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new vill",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Sucessful testing");
// });

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", {message});
    // res.status(statusCode).send(message);
});

app.listen("8080", () => {
    console.log("Server is listening in port 8080");
});
