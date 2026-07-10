const { QUALITY_WEIGHT } = require("../data/mockData");

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function calculateComparisons(basketItems, stores) {
  const totalItems = basketItems.length;

  return stores.map(store => {
    let subtotal = 0;
    let found = 0;
    const missing = [];

    for (const item of basketItems) {
      const pricePerUnit = store.prices[item.productId];

      if (typeof pricePerUnit === "number") {
        found++;
        subtotal += pricePerUnit * item.qty;
      } else {
        missing.push(item.productId);
      }
    }

    const meetsMinOrder = subtotal >= store.minOrder;

    return {
      storeId: store.id,
      storeName: store.name,
      storeName: store.name,
      website: store.website,
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

function pickRecommendation(results, mode) {
  const list = results.filter(r => r.coverageFound > 0);

  if (!list.length) {
    return {
      type: "none",
      reason: "לא נמצאו חנויות שמחזיקות מוצרים מתוך הסל."
    };
  }

  if (mode === "bestValue") {
    const minPrice = Math.min(...list.map(r => r.totalWithDelivery ?? r.subtotal));
    const maxPrice = Math.max(...list.map(r => r.totalWithDelivery ?? r.subtotal));

    const norm = (p) => {
      if (maxPrice === minPrice) return 1;
      return 1 - (p - minPrice) / (maxPrice - minPrice);
    };

    const scored = list.map(r => {
      const price = r.totalWithDelivery ?? r.subtotal;
      const score =
        r.coverageRatio * 0.5 +
        (r.qualityWeight / 3) * 0.3 +
        norm(price) * 0.2;

      return { ...r, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
      type: "store",
      storeId: scored[0].storeId,
      label: "הכי משתלם"
    };
  }

  list.sort((a, b) => {
    if (a.coverageRatio !== b.coverageRatio) {
      return b.coverageRatio - a.coverageRatio;
    }

    const aPrice = a.totalWithDelivery ?? a.subtotal;
    const bPrice = b.totalWithDelivery ?? b.subtotal;

    return aPrice - bPrice;
  });

  return {
    type: "store",
    storeId: list[0].storeId,
    label: "הכי זול"
  };
}

module.exports = {
  calculateComparisons,
  pickRecommendation
};