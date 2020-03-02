const mongoose = require("mongoose");


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
    ref: "Bootcamp",
    required: true
  }
});

// staticmethod to calculate average course costs
CourseSchema.statics.getAverageCost = async function(bootcampId) {

  
  console.log("Calculating cost ....".blue);

  const obj = await this.aggregate([
    {
      $match: { Bootcamp: bootcampId }
    },
    {
      $group: {
        _id: "$Bootcamp",
        averageCost: { $avg: "$tuition" }
      }
    }
  ]);

  console.log(obj)

  try {
    await this.model("Bootcamp").findByIdAndupdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {
    console.error(err)
  }
};

// call get acerage cost after save
CourseSchema.post("save", function() {
  this.constructor.getAverageCost(this.Bootcamp);
});

// call get acerage cost before remove
CourseSchema.pre("remove", function() {
  this.constructor.getAverageCost(this.Bootcamp);
});

module.exports = mongoose.model("course", CourseSchema);
