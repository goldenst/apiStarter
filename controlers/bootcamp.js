const Bootcamp = require("../models/Bootcamp");

// @Description       GET all Bootcamps
// @Route             GET api/v1/bootcamps
// @access            Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()

    res.status(200).json({ sucess: true, data: bootcamps})
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @Description       GET Single Bootcamps
// @Route             GET api/v1/bootcamps/:id
// @access            Private
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp) {
     return res.status(400).json({success: false})
    }

    res.status(200).json({ sucess: true, data: bootcamp})
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @Description       POST Create new Bootcamps
// @Route             PST api/v1/bootcamps
// @access            Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @Description       update Single Bootcamps
// @Route             PUT api/v1/bootcamps/:id
// @access            Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update bootcamp with id of ${req.params.id}`
  });
};

// @Description       Delete Single Bootcamps
// @Route             DELETE api/v1/bootcamps/:id
// @access            Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete bootcamp` });
};
