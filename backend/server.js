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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});