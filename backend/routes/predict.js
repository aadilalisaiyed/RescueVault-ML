const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "../../ml_server/data/data1.json");
    const reports = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    if (!Array.isArray(reports) || reports.length === 0) {
      return res.status(400).json({ error: "Dataset is invalid or empty" });
    }

    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict",
      reports,
      { headers: { "Content-Type": "application/json" } }
    );

    res.json(mlResponse.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "Prediction failed",
      details: err.message
    });
  }
});

module.exports = router;
