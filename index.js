// Load Environment Variables
const dotenv = require("dotenv");
dotenv.config();

// Import Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import Models
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

// Config Vars
const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

// Express App
const app = express();

// Middlewares
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/test", (req, res) => {
  res.send("Auth route working");
});

// Auth Routes
app.use("/api/auth", require("./routes/auth"));

// ===============================
// HOLDINGS
// ===============================
app.get("/allHoldings", async (req, res) => {
  try {
    const data = await HoldingsModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch holdings",
      details: err.message
    });
  }
});

// ===============================
// POSITIONS
// ===============================
app.get("/allPositions", async (req, res) => {
  try {
    const data = await PositionsModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch positions",
      details: err.message
    });
  }
});

// ===============================
// CREATE NEW ORDER
// ===============================
app.post("/newOrder", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const newOrder = new OrdersModel(req.body);
    await newOrder.save();

    res.json({
      message: "Order created successfully",
      data: newOrder
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while creating order",
      error: err.message
    });
  }
});

// ===============================
// CONNECT DB & START SERVER
// ===============================
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => console.log("DB Connection Error:", err));
  