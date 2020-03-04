const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");

// @Description       GET all Bootcamps
// @Route             GET api/v1/bootcamps
// @access            Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  // Add user to body
  req.body.user = req.user.id;

  // check for published bootcamp
  const publishedBootcamp = Bootcamp.findOne({ user: req.user.id });

  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with id of ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @Description       update Single Bootcamps
// @Route             PUT api/v1/bootcamps/:id
// @access            Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }

  // make sure user is owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `user with id of ${req.user.id} is not authorized to update`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ sucess: true, data: bootcamp });
});

// @Description       Delete Single Bootcamps
// @Route             DELETE api/v1/bootcamps/:id
// @access            Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }
  // make sure user is owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `user with id of ${req.user.id} is not authorized to Delete`,
        401
      )
    );
  }

  bootcamp.remove();

  res.status(200).json({ sucess: true, data: {} });
});

// @Description       Get bootcamp within radius
// @Route             GET api/v1/bootcamps/radiud/:zipcode/:distance
// @access            Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  const { zipcode, distance } = req.params;

  // get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc reaius
  // dividing did byradius of earth
  // earth radius = 3,963 miles
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    date: bootcamps
  });
});

// @Description       Upload photo for bootcamp
// @Route             PUT api/v1/bootcamps/:id/photo
// @access            Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of: ${req.params.id}`, 404)
    );
  }
  // make sure user is owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `user with id of ${req.user.id} is not authorized to update`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  console.log("1", req.files);
  let file = req.files.file;

  console.log("file", file);
  // make sure it is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload a Photo Image", 400));
  }

  // check File Size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a Smaller Photo Image less than ${prossess.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custome file name
  file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`process.env.UPLOAD_FILE_PATH/${file.name}`, async err => {
    if (err) {
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    console.log(file);
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ sucess: true, data: file.name });
  });
});
