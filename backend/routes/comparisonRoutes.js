const express = require("express");
const router = express.Router();

const { STORES } = require("../data/mockData");
const {
  calculateComparisons,
  pickRecommendation
} = require("../services/comparisonService");

router.post("/compare", (req, res) => {
  try {
    const { basket, mode, city } = req.body;

    if (!Array.isArray(basket) || basket.length === 0) {
      return res.status(400).json({
        error: "Basket is required"
      });
    }

    const normalizedCity = typeof city === "string" ? city.trim() : "";

    let filteredStores = STORES;

    if (normalizedCity) {
      filteredStores = STORES.filter(store =>
        store.areas?.some(area => area.trim() === normalizedCity)
      );
    }

    const results = calculateComparisons(basket, filteredStores);

    if (results.length === 0) {
      return res.json({
        results: [],
        recommendation: {
          type: "none",
          reason: "לא נמצאו חנויות שמבצעות משלוחים לעיר שנבחרה."
        }
      });
    }

    const recommendation = pickRecommendation(results, mode);

    res.json({
      results,
      recommendation
    });

  } catch (error) {
    console.error("Compare API error:", error);

    res.status(500).json({
      error: "שגיאה בחישוב תוצאות ההשוואה"
    });
  }
});

module.exports = router;