const express = require("express");
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabaseClient");

const router = express.Router();

function isValidPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 6 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, phone, city, password } = req.body;

    if (!name || !email || !phone || !city || !password) {
      return res.status(400).json({ error: "יש למלא את כל השדות." });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: "הסיסמה חייבת להכיל לפחות 6 תווים, אות אחת ומספר אחד."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: existingUser, error: existingError } = await supabase
      .from("app_users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existingUser) {
      return res.status(409).json({ error: "משתמש עם האימייל הזה כבר קיים." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from("app_users")
      .insert({
        name,
        email: normalizedEmail,
        phone,
        city,
        password_hash: passwordHash
      })
      .select("id, name, email, phone, city")
      .single();

    if (error) throw error;

    res.json({ user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "שגיאה בהרשמה." });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "יש להזין אימייל וסיסמה." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: user, error } = await supabase
      .from("app_users")
      .select("id, name, email, phone, city, password_hash")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return res.status(401).json({ error: "אימייל או סיסמה לא נכונים." });
    }

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "אימייל או סיסמה לא נכונים." });
    }

    delete user.password_hash;

    res.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "שגיאה בהתחברות." });
  }
});

module.exports = router;