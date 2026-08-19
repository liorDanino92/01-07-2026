require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const comparisonRoutes = require("./routes/comparisonRoutes");
const aiBasketRoutes = require("./routes/aiBasketRoutes");
const authRoutes = require("./routes/authRoutes");
const basketRoutes = require("./routes/basketRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", comparisonRoutes);
app.use("/api", aiBasketRoutes);
app.use("/api", authRoutes);
app.use("/api", basketRoutes);
app.use("/api", productRoutes);

const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});