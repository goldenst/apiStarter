const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// load .env variables
dotenv.config({ path: "./config/config.env" });

// connect to db
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");

const app = express();

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File upload
app.use(fileupload());

// sanatize data
app.use(mongoSanitize());
// set securety headders
app.use(helmet());
// prevent xxs attacks
app.use(xss());
// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// prevent http polution
app.use(hpp());
// enable cores
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  )
);

// handle unhandled promis rejection
process.on("unhandledRejection", (err, Promise) => {
  console.log(`error ${err.message}`.red);
  // close server and exit
  server.close(() => process.exit(1));
});
