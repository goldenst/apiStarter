const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controlers/courses");

const courses = require('../models/Course')

const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth')

router
  .route("/")
  .get(getCourses)
  .post(protect, addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
