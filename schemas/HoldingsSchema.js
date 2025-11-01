const mongoose = require('mongoose');

const holdingsSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
  isLoss: {
    type: Boolean,
    default: false
  }
});

const HoldingsModel = mongoose.model("holding", holdingsSchema);  // ✅ Yeh important hai

module.exports = { HoldingsModel };
