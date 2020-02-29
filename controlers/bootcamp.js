const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @Description       GET all Bootcamps
// @Route             GET api/v1/bootcamps
// @access            Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res
    .status(200)
    .json({ sucess: true, count: bootcamps.length, data: bootcamps });
});

// @Description       GET Single Bootcamps
// @Route             GET api/v1/bootcamps/:id
// @access            Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ sucess: true, data: bootcamp });
});

// @Description       POST Create new Bootcamps
// @Route             PST api/v1/bootcamps
// @access            Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @Description       update Single Bootcamps
// @Route             PUT api/v1/bootcamps/:id
// @access            Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ sucess: true, data: bootcamp });
});

// @Description       Delete Single Bootcamps
// @Route             DELETE api/v1/bootcamps/:id
// @access            Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ sucess: true, data: {} });
});
