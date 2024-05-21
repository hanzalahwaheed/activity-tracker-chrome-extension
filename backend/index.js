const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Activity = require("./model");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { url, title, time, favicon } = req.body;
    const newActivity = await Activity.create({
      url,
      time,
      title,
      favicon,
    });
    console.log(newActivity);
    res.json(newActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose
  .connect("mongodb://localhost:27017/activity-tracker")
  .then(() => console.log("server running"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
