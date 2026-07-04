const express = require("express");
const router = express.Router();

const { STORES } = require("../data/mockData");
const {
  calculateComparisons,
  pickRecommendation
} = require("../services/comparisonService");

router.post("/compare", (req, res) => {
  const { basket, mode, city } = req.body;

  let filteredStores = STORES;

  if (city) {
    filteredStores = STORES.filter(store =>
      store.areas?.includes(city)
    );
  }

  const results = calculateComparisons(basket, filteredStores);
  const recommendation = pickRecommendation(results, mode);

  res.json({
    results,
    recommendation
  });
});

module.exports = router;