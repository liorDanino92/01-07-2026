import { QUALITY_WEIGHT } from "./data.js";

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateComparisons(basketItems, stores) {
  const totalItems = basketItems.length;

  return stores.map(store => {
    let subtotal = 0;
    let found = 0;
    const missing = [];

    for (const item of basketItems) {
      const pricePerUnit = store.prices[item.productId];
      if (typeof pricePerUnit === "number") {
        found += 1;
        subtotal += pricePerUnit * item.qty;
      } else {
        missing.push(item.productId);
      }
    }

    const meetsMinOrder = subtotal >= store.minOrder;
    const delivery = meetsMinOrder ? store.deliveryFee : null;

    return {
      storeId: store.id,
      storeName: store.name,
      quality: store.quality,
      qualityWeight: QUALITY_WEIGHT[store.quality] ?? 1,
      coverageFound: found,
      coverageTotal: totalItems,
      coverageRatio: totalItems === 0 ? 0 : found / totalItems,
      subtotal: round2(subtotal),
      deliveryFee: store.deliveryFee,
      minOrder: store.minOrder,
      meetsMinOrder,
      totalWithDelivery: meetsMinOrder ? round2(subtotal + store.deliveryFee) : null,
      missing
    };
  });
}

export function pickRecommendation(results, mode) {
  const nonEmpty = results.slice();

  if (mode === "oneStore") {
    const full = nonEmpty.filter(r => r.coverageFound === r.coverageTotal);
    if (full.length === 0) return { type: "none", reason: "אין חנות אחת שמכסה את כל הסל." };

    // בחר את הזולה ביותר מבין אלו שמכסות הכול (לפי totalWithDelivery אם עומד במינימום, אחרת subtotal)
    full.sort((a, b) => {
      const aPrice = a.totalWithDelivery ?? a.subtotal;
      const bPrice = b.totalWithDelivery ?? b.subtotal;
      return aPrice - bPrice;
    });

    return { type: "store", storeId: full[0].storeId, label: "חנות אחת מומלצת" };
  }

  if (mode === "bestValue") {
    // ניקוד פשוט: כיסוי (0-1) + איכות (1-3) + מחיר נמוך
    const minPrice = Math.min(...nonEmpty.map(r => (r.totalWithDelivery ?? r.subtotal)));
    const maxPrice = Math.max(...nonEmpty.map(r => (r.totalWithDelivery ?? r.subtotal)));

    const norm = (p) => {
      if (maxPrice === minPrice) return 1;
      return 1 - (p - minPrice) / (maxPrice - minPrice); // גבוה יותר טוב
    };

    const scored = nonEmpty.map(r => {
      const price = r.totalWithDelivery ?? r.subtotal;
      const score = (r.coverageRatio * 0.5) + ((r.qualityWeight / 3) * 0.3) + (norm(price) * 0.2);
      return { ...r, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return { type: "store", storeId: scored[0].storeId, label: "הכי משתלם" };
  }

  // cheapest
  nonEmpty.sort((a, b) => {
    const aPrice = a.totalWithDelivery ?? a.subtotal;
    const bPrice = b.totalWithDelivery ?? b.subtotal;
    return aPrice - bPrice;
  });

  return { type: "store", storeId: nonEmpty[0].storeId, label: "הכי זול" };
}
