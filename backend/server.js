const express = require("express");
const predict = require("./routes/predict");

const app = express();

// 🔥 THIS IS CRITICAL
app.use(express.json());
app.use((req, res, next) => {
  console.log("HEADERS:", req.headers["content-type"]);
  next();
});

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.use("/api", predict);

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
