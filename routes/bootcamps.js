const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require("../controlers/bootcamp");

const Bootcamp = require("../models/Bootcamp");
const Courses = require('../models/Course')
const advancedResults = require("../middleware/advancedResults");

// Include other resourses routers
const courseRouter = require("./courses");

const router = express.Router();

// re route into other resource router
router.use("/:bootcampId/Courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "Courses"), getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
