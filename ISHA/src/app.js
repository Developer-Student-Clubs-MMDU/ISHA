// const path = require("path");
// const express = require("express");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
// const hpp = require("hpp");
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
// const compression = require("compression");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const AppError = require("./utils/appError");

// // Start express app
// const app = express();
// connectDB();
// app.enable("trust proxy");

// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));

// // 1) GLOBAL MIDDLEWARES
// // Implement CORS
// app.use(cors());
// // Access-Control-Allow-Origin *
// // api.natours.com, front-end natours.com
// // app.use(cors({
// //   origin: 'https://www.isha.com'
// // }))

// app.options("*", cors());
// // app.options('/api/v1/tours/:id', cors());

// // Serving static files
// app.use(express.static(path.join(__dirname, "public")));

// // Set security HTTP headers
// app.use(helmet());

// // Development logging
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// // // Limit requests from same API
// // const limiter = rateLimit({
// //   max: 100,
// //   windowMs: 60 * 60 * 1000,
// //   message: "Too many requests from this IP, please try again in an hour!",
// // });
// // app.use("/api", limiter);

// // Body parser, reading data from body into req.body
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use(cookieParser());

// // Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// // Data sanitization against XSS
// app.use(xss());

// // Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       "duration",
//       "ratingsQuantity",
//       "ratingsAverage",
//       "maxGroupSize",
//       "difficulty",
//       "price",
//     ],
//   })
// );

// app.use(compression());

// // Test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   // console.log(req.cookies);
//   next();
// });

// // Import routes
// const homeRoutes = require("./routes/homeRoutes");
// const authRoutes = require("./routes/userRoutes");
// const courseRoutes = require("./routes/courseRoutes");
// const progressRoutes = require("./routes/progressRoutes");
// const recommendationRoutes = require("./routes/recommendationRoutes");

// // Use routes
// app.use("/", homeRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/progress", progressRoutes);
// app.use("/api/recommendations", recommendationRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({
//     message: err.message || "Internal Server Error",
//   });
// });

// module.exports = app;
