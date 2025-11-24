require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Models
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Default Test Route
app.get("/", (req, res) => {
  res.send("Backend running on Vercel");
});

// Auth Routes
app.use("/api/auth", require("./routes/auth"));

// HOLDINGS
app.get("/allHoldings", async (req, res) => {
  try {
    const data = await HoldingsModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POSITIONS
app.get("/allPositions", async (req, res) => {
  try {
    const data = await PositionsModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NEW ORDER
app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel(req.body);
    await newOrder.save();
    res.json({ message: "Order created", data: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MONGODB CONNECT (simple)
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log("MongoDB Connected "))
  .catch((err) => console.log("Connection Failed ", err));
  

// Export for Vercel
module.exports = app;
