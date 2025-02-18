require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/dbConnect");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const app = express(); // Create an express app
app.use(logger("tiny")); // Log http requests to the console
app.use(helmet()); // Secure the app by setting various HTTP headers
// Parse incoming requests to JSON
app.use(bodyParser.json());

// Connect to the database and start the server
dbConnect().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Cors
const whitelist = ["http://localhost:3000", process.env.FRONTEND_URL]; // Array of allowed origins
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});
// dsada
const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown); // Listen for the SIGINT signal (Ctrl+C)
process.on("SIGTERM", gracefulShutdown); // Listen for the SIGTERM which is the signal sent by the process manager to shut down the process
