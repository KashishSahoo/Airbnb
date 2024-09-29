const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm=(req,res)=>{
        res.render("./listings/new.ejs");
};

module.exports.showListing=(async (req, res) => {
    let { id } = req.params;
    // id se data we use populate
    //populate reviews then for idividual review ke liya populate author
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
  });


module.exports.createListing=(async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing = new Listing(req.body.listing);
    //req related info in req.user
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    // console.log(url);
    // console.log(filename);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  });

module.exports.renderEditForm=(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      res.redirect("/listings");
    }
    let orgImgUrl=listing.image.url;
    //res.cloudinary.com/demo/image/upload/c_fill,h_200,w_200/docs/camera-640.jpg
  //  orgImgUrl=orgImgUrl.replace("/upload","/upload/w_250");
   orgImgUrl=orgImgUrl.replace("/upload","/upload/c_fill,h_200,w_200");

    res.render("./listings/edit.ejs", { listing ,orgImgUrl});
  });

module.exports.updateListing=(async (req, res) => {
 
    let { id } = req.params;
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //decontruct and turn into individual characters
   if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
   }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  });

module.exports.destroyListing=(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
  });
  //*#9900#