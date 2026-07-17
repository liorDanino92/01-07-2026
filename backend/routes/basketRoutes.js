const express = require("express");
const supabase = require("../config/supabaseClient");

const router = express.Router();

router.get("/baskets/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User id is required" });
    }

    const { data, error } = await supabase
      .from("saved_baskets")
      .select("id, name, items, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    res.json({ baskets: data || [] });
  } catch (error) {
    console.error("Get baskets error:", error);
    res.status(500).json({ error: "שגיאה בטעינת הסלים." });
  }
});

router.post("/baskets", async (req, res) => {
  try {
    const { userId, name, items } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "יש להתחבר לפני שמירת סל." });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "יש להזין שם לסל." });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "לא ניתן לשמור סל ריק." });
    }

    const { data, error } = await supabase
      .from("saved_baskets")
      .insert({
        user_id: userId,
        name: name.trim(),
        items,
        updated_at: new Date().toISOString()
      })
      .select("id, name, items, created_at, updated_at")
      .single();

    if (error) throw error;

    res.json({ basket: data });
  } catch (error) {
    console.error("Save basket error:", error);
    res.status(500).json({ error: "שגיאה בשמירת הסל." });
  }
});

router.delete("/baskets/:basketId", async (req, res) => {
  try {
    const { basketId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "יש להתחבר לפני מחיקת סל." });
    }

    const { error } = await supabase
      .from("saved_baskets")
      .delete()
      .eq("id", basketId)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({ ok: true });
  } catch (error) {
    console.error("Delete basket error:", error);
    res.status(500).json({ error: "שגיאה במחיקת הסל." });
  }
});

module.exports = router;