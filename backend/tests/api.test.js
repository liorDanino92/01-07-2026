const test = require("node:test");
const assert = require("node:assert/strict");

const API_BASE_URL =
  process.env.API_BASE_URL || "https://01-07-2026-production.up.railway.app";

test("GET / returns backend status", async () => {
  const response = await fetch(`${API_BASE_URL}/`);

  assert.equal(response.status, 200);

  const text = await response.text();
  assert.match(text, /Backend is running/);
});

test("POST /api/compare rejects empty basket", async () => {
  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      basket: [],
      mode: "cheapest",
      city: "תל אביב"
    })
  });

  assert.equal(response.status, 400);

  const data = await response.json();
  assert.ok(data.error);
});

test("POST /api/compare returns comparison results for valid basket", async () => {
  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      basket: [
        { productId: "tomato", qty: 1 },
        { productId: "cucumber", qty: 1 }
      ],
      mode: "cheapest",
      city: "תל אביב"
    })
  });

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.ok(Array.isArray(data.results));
  assert.ok(data.recommendation);
});

test("GET /api/products returns products list", async () => {
  const response = await fetch(`${API_BASE_URL}/api/products`);

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.ok(Array.isArray(data.products));
});

test("POST /api/compare returns no stores for unsupported city", async () => {
  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      basket: [
        { productId: "tomato", qty: 1 }
      ],
      mode: "cheapest",
      city: "עיר בדיקה שלא קיימת"
    })
  });

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.ok(Array.isArray(data.results));
  assert.equal(data.results.length, 0);
  assert.equal(data.recommendation.type, "none");
});

test("POST /api/compare returns missing products for partial store coverage", async () => {
  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      basket: [
        { productId: "tomato", qty: 1 },
        { productId: "pineapple", qty: 1 },
        { productId: "asparagus", qty: 1 }
      ],
      mode: "cheapest",
      city: "תל אביב"
    })
  });

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.ok(Array.isArray(data.results));
  assert.ok(data.results.length > 0);

  const storeWithMissingItems = data.results.find(result =>
    Array.isArray(result.missing) &&
    result.missing.length > 0 &&
    result.coverageFound < result.coverageTotal
  );

  assert.ok(storeWithMissingItems, "Expected at least one store with missing products");
});

test("POST /api/auth/register creates a new user", async () => {
  const email = `auto_test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;

  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "משתמש בדיקה",
      email,
      phone: "0500000000",
      city: "תל אביב",
      password: "Test1234"
    })
  });

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.ok(data.user);
  assert.equal(data.user.email, email);
  assert.equal(data.user.name, "משתמש בדיקה");
  assert.ok(!data.user.password_hash);
});

test("POST /api/auth/login rejects wrong password", async () => {
  const email = `auto_test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;

  const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "משתמש בדיקה",
      email,
      phone: "0500000000",
      city: "תל אביב",
      password: "Test1234"
    })
  });

  assert.equal(registerResponse.status, 200);

  const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password: "Wrong1234"
    })
  });

  assert.equal(loginResponse.status, 401);

  const data = await loginResponse.json();
  assert.ok(data.error);
});

test("Saved baskets can be created, loaded and deleted", async () => {
  const email = `auto_test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;

  const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "משתמש בדיקה",
      email,
      phone: "0500000000",
      city: "תל אביב",
      password: "Test1234"
    })
  });

  assert.equal(registerResponse.status, 200);

  const registerData = await registerResponse.json();
  const userId = registerData.user.id;

  const saveResponse = await fetch(`${API_BASE_URL}/api/baskets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      name: "סל בדיקה אוטומטי",
      items: [
        { productId: "tomato", qty: 1 },
        { productId: "cucumber", qty: 1 }
      ]
    })
  });

  assert.equal(saveResponse.status, 200);

  const saveData = await saveResponse.json();

  assert.ok(saveData.basket);
  assert.ok(saveData.basket.id);

  const basketId = saveData.basket.id;

  const loadResponse = await fetch(`${API_BASE_URL}/api/baskets/${userId}`);
  assert.equal(loadResponse.status, 200);

  const loadData = await loadResponse.json();

  assert.ok(Array.isArray(loadData.baskets));
  assert.ok(loadData.baskets.some(basket => basket.id === basketId));

  const deleteResponse = await fetch(`${API_BASE_URL}/api/baskets/${basketId}?userId=${userId}`, {
    method: "DELETE"
  });

  assert.equal(deleteResponse.status, 200);

  const deleteData = await deleteResponse.json();
  assert.equal(deleteData.ok, true);
});
