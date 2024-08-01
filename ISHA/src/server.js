const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const connectDB = require("./config/db");
const AppError = require("./utils/appError");

// Initialize environment variables
dotenv.config({ path: "./config.env" });

// Initialize Express app
const app = express();
connectDB();

// WebSocket setup
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("getProgress", () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10; // Example progress increment
      socket.emit("progress", { progress });
      if (progress >= 100) {
        clearInterval(interval);
        fs.readFile(
          path.join(__dirname, "progress.txt"),
          "utf8",
          (err, data) => {
            if (err) {
              console.error(`Error reading progress file: ${err}`);
              socket.emit("progress", {
                error: "Could not read progress file",
              });
            } else {
              try {
                const progressData = JSON.parse(data);
                socket.emit("progress", progressData);
              } catch (parseErr) {
                console.error(`Error parsing progress data: ${parseErr}`);
                socket.emit("progress", {
                  error: "Error parsing progress data",
                });
              }
            }
          }
        );
      }
    }, 1000);
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});
// Global middlewares
app.use(cors());
app.options("*", cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Import and use routes
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const progressRoutes = require("./routes/progressRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/chat", chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: err.message || "Internal Server Error",
  });
});

// Handle process events
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
