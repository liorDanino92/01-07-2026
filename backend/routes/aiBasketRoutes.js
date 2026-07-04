const express = require("express");
const router = express.Router();

const { suggestBasketItems } = require("../services/aiBasketService");

router.post("/ai-basket-suggestions", async (req, res) => {
  try {
    const { prompt, products } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "יש להזין רעיון לסל, למשל: סלט יווני או פלטת פירות."
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "לא התקבלה רשימת מוצרים זמינה."
      });
    }

    const suggestions = await suggestBasketItems(prompt.trim(), products);

    return res.json({
      suggestions
    });

  } catch (error) {
    console.error("AI basket suggestions error:", error.message);

    return res.status(500).json({
      error: "לא הצלחתי להציע סל כרגע. נסה שוב בעוד רגע."
    });
  }
});

module.exports = router;