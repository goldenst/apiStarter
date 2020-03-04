const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// Routes ___________________________________

// @Description       GET all Users
// @Route             GET api/v1/auth/Users
// @access            Private / Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @Description       GET single Users
// @Route             GET api/v1/auth/Users/:id
// @access            Private / Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

// @Description       Create Users
// @Route             POST api/v1/auth/Users/
// @access            Private / Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @Description       Update Users
// @Route             PUT api/v1/auth/Users/:id
// @access            Private / Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(201).json({ success: true, data: user });
});

// @Description       Delete User
// @Route             Delete api/v1/auth/Users/:id
// @access            Private / Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(201).json({ success: true, data: {} });
});