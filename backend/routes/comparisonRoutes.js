const express = require("express");
const router = express.Router();

const { STORES } = require("../data/mockData");
const { getStoresFromDb } = require("../services/storeService");

const {
  calculateComparisons,
  rankComparisons,
  pickRecommendation
} = require("../services/comparisonService");

router.post("/compare", async (req, res) => {
  try {
    const { basket, mode, city } = req.body;

    if (!Array.isArray(basket) || basket.length === 0) {
      return res.status(400).json({
        error: "Basket is required"
      });
    }

    const normalizedCity = typeof city === "string" ? city.trim() : "";

    let stores = STORES;

    try {
      stores = await getStoresFromDb();
    } catch (dbError) {
      console.error("Database error, using mock data:", dbError.message);
    }

    let filteredStores = stores;

    if (normalizedCity) {
      filteredStores = stores.filter(store =>
        store.areas?.some(area => area.trim() === normalizedCity)
      );
    }

    const rawResults = calculateComparisons(
      basket,
      filteredStores,
      stores
    );

    const results = rankComparisons(
      rawResults,
      mode
    );

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