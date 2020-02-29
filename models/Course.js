const mongoose = require("mongoose");
const slugify = require("slugify");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a Course Title"]
  },
  description: {
    type: String,
    required: [true, "Please Add a Description"]
  },
  weeks: {
    type: String,
    required: [true, "Please add a number of Weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "Please add course Cost"]
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum Skill"],
    enum: ["beginner", "intermediate", "advanced"]
  },
  scholarhipsAvailable: {
    type: Boolean,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "bootcamp",
    required: true
  }
});

module.exports = mongoose.model("course", CourseSchema);
