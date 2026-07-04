require("dotenv").config();

const express = require("express");
const cors = require("cors");

const comparisonRoutes = require("./routes/comparisonRoutes");
const aiBasketRoutes = require("./routes/aiBasketRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api", comparisonRoutes);
app.use("/api", aiBasketRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});