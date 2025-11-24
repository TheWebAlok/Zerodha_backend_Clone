const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

const app = express();

// Middlewares
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic routes
app.get("/", (req, res) => res.send("Server is running"));
app.get("/test", (req, res) => res.send("Auth route working"));

// Auth Routes
app.use("/api/auth", require("./routes/auth"));

// Holdings
app.get("/allHoldings", async (req, res) => {
  try {
    let data = await HoldingsModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

// Positions
app.get("/allPositions", async (req, res) => {
  try {
    let data = await PositionsModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

// New Order
app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel(req.body);
    await newOrder.save();
    res.json({ message: "Order created", data: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Connect DB and start server
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => console.log("DB Connection Error:", err));
  