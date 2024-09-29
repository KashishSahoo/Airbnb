const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router
  .route("/")
  //index route
  .get(wrapAsync(listingController.index))
  //Create Route(new form getting saved)
  .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));
  


//New Route(you will get a form)
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router
.route("/:id")
//show route
.get( wrapAsync(listingController.showListing))
//delete route
.delete(
  isLoggedIn,
  isOwner,  
  wrapAsync(listingController.destroyListing)
)
//Update Route(form with updated data)
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
);



//Edit Route(form with existing data)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
