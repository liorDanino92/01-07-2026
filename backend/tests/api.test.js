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