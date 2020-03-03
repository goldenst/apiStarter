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

const { protect } = require('../middleware/auth')

// re route into other resource router
router.use("/:bootcampId/Courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(protect, bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "Courses"), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
