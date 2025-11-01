// const authRoute = require("./Routes/AuthRoute");
// const cookieParser = require("cookie-parser");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const { positions } = require("../dashboard/src/data/data");

const PORT = process.env.PORT || 3002;
// const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Zerodha";
const MONGO_URL = "mongodb://127.0.0.1:27017/Zerodha";

const app = express();
app.use(express.json());
// app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(require("cookie-parser")());

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});
app.post("/newOrder", async (req, res) => {
  console.log("Request body:", req.body);

  try {
    let newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created", data: newOrder });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
