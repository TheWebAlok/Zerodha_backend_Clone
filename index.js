// Load environment variables
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

// -----------------------
//  Middlewares
// -----------------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://zerodha-frontend-clone.vercel.app", // change to your real frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

// -----------------------
//  Default route
// -----------------------
app.get("/", (req, res) => {
  res.send("Backend running successfully on Vercel!");
});

// -----------------------
//  AUTH ROUTES
// -----------------------
app.use("/api/auth", require("./routes/auth"));


// -----------------------
//  HOLDINGS ROUTE
// -----------------------
app.get("/api/allHoldings", async (req, res) => {
  try {
    const data = await HoldingsModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
//  POSITIONS ROUTE
// -----------------------
app.get("/api/allPositions", async (req, res) => {
  try {
    const data = await PositionsModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
//  NEW ORDER ROUTE
// -----------------------
app.post("/api/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel(req.body);
    await newOrder.save();
    res.json({ message: "Order created", data: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
//  MONGO DB CONNECT
// -----------------------
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Failed:", err.message));


// VERY IMPORTANT FOR VERCEL
module.exports = app;
