const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @Description       GET all Courses
// @Route             GET api/v1/courses
// @Route             GET api/v1/bootcamps/:bootcampId/courses
// @access            Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamps",
      select: "name description"
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @Description       GET single Courses
// @Route             GET api/v1/courses/:id
// @access            Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamps",
    select: "name, description"
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @Description       POST Add Courses
// @Route             POST api/v1/bootcamps/:bootcampid/courses
// @access            Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  // make sure user is owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `user with id of ${user.id} is not authorized to add a Course`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @Description       PUT Update Courses
// @Route             PUT api/v1/courses/:id
// @access            Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Bootcamp with the id of ${req.params.id}`),
      404
    );
  }
  // make sure user is owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `user with id of ${user.id} is not authorized to update Course`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @Description       DELETE Delete Courses
// @Route             DELETE api/v1/courses/:id
// @access            Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Bootcamp with the id of ${req.params.id}`),
      404
    );
  }

  // make sure user is owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `user with id of ${user.id} is not authorized to delete Course`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
