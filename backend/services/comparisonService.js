function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function calculateComparisons(basketItems, stores) {
  const totalItems = basketItems.length;

  return stores.map(store => {
    let subtotal = 0;
    let found = 0;
    const missing = [];
    const itemsBreakdown = [];

    for (const item of basketItems) {
      const pricePerUnit = store.prices[item.productId];

      if (typeof pricePerUnit === "number") {
        const lineTotal = pricePerUnit * item.qty;

        found++;
        subtotal += lineTotal;

        itemsBreakdown.push({
          productId: item.productId,
          qty: item.qty,
          pricePerUnit: round2(pricePerUnit),
          lineTotal: round2(lineTotal),
          found: true
        });
      } else {
        missing.push(item.productId);

        itemsBreakdown.push({
          productId: item.productId,
          qty: item.qty,
          pricePerUnit: null,
          lineTotal: null,
          found: false
        });
      }
    }

    const meetsMinOrder = subtotal >= store.minOrder;

    return {
      storeId: store.id,
      storeName: store.name,
      website: store.website,
      coverageFound: found,
      coverageTotal: totalItems,
      coverageRatio: totalItems === 0 ? 0 : found / totalItems,
      subtotal: round2(subtotal),
      deliveryFee: store.deliveryFee,
      minOrder: store.minOrder,
      meetsMinOrder,
      totalWithDelivery: meetsMinOrder ? round2(subtotal + store.deliveryFee) : null,
      missing,
      itemsBreakdown
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

  if (mode === "bestCoverage") {
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
      label: "כיסוי סל מקסימלי"
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