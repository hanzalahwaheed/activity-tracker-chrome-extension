const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  url: String,
  time: Date,
  title: String,
  key: String,
  favicon: String,
});

const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = Activity;
