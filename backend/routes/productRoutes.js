const express = require("express");
const supabase = require("../config/supabaseClient");

const router = express.Router();

router.get("/products", async (req, res) => {
  console.log("GET /api/products was called");

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, unit, category")
      .order("name", { ascending: true });

    if (error) throw error;

    const products = (data || []).map(product => ({
      id: product.id,
      name: product.name,
      unit: product.unit,
      category: product.category,
      approxUnits: ""
    }));

    res.json({ products });
  } catch (error) {
    console.error("Products API error:", error);

    res.status(500).json({
      error: "שגיאה בטעינת המוצרים."
    });
  }
});

module.exports = router;