const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");

// @Description       GET all Bootcamps
// @Route             GET api/v1/bootcamps
// @access            Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // making copy of request . query
  const reqQuery = { ...req.query };

  // create a aray of fields to remove to match
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over fields to remove
  removeFields.forEach(param => delete reqQuery[param]);

  // creates a query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators $gte, $gt, $lt ect
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // finding resources
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortby = req.query.sort.split(",").join(" ");
    query = query.sort(sortby);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // executing query
  const bootcamps = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res
    .status(200)
    .json({ sucess: true, count: bootcamps.length, pagination, data: bootcamps });
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
