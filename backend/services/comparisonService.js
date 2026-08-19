const PRICE_MODE_CONFIG = {
  maxMissing: 2,
  minCoverageRatio: 0.75,
  minSavingNis: 10,
  minSavingPercent: 0.05,
  minEstimateSamples: 2
};

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function median(values) {
  if (!values.length) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[middle];
  }

  return (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * הערכת מחיר למוצר שחסר בחנות.
 * ההערכה מתבצעת רק אם המוצר קיים לפחות בשתי חנויות אחרות.
 */
function estimateMissingItem(item, allStores) {
  const prices = allStores
    .map(store => store.prices?.[item.productId])
    .filter(price =>
      typeof price === "number" &&
      Number.isFinite(price)
    );

  if (prices.length < PRICE_MODE_CONFIG.minEstimateSamples) {
    return {
      productId: item.productId,
      qty: item.qty,
      available: false,
      estimatedPricePerUnit: null,
      estimatedLineTotal: null,
      sampleSize: prices.length
    };
  }

  const estimatedPricePerUnit = round2(median(prices));
  const estimatedLineTotal = round2(
    estimatedPricePerUnit * item.qty
  );

  return {
    productId: item.productId,
    qty: item.qty,
    available: true,
    estimatedPricePerUnit,
    estimatedLineTotal,
    sampleSize: prices.length
  };
}

function calculateComparisons(basketItems, stores, allStores = stores) {
  const totalItems = basketItems.length;

  return stores.map(store => {
    let subtotal = 0;
    let found = 0;

    const missing = [];
    const itemsBreakdown = [];
    const missingEstimates = [];

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

        missingEstimates.push(
          estimateMissingItem(item, allStores)
        );
      }
    }

    subtotal = round2(subtotal);

    const coverageRatio =
      totalItems === 0 ? 0 : found / totalItems;

    const missingCount = missing.length;

    // מינימום ההזמנה נבדק רק לפי מה שקונים בפועל בחנות הזאת.
    const meetsMinOrder = subtotal >= store.minOrder;

    const totalWithDelivery = meetsMinOrder
      ? round2(subtotal + store.deliveryFee)
      : null;

    /*
     * אפשר לחשב הערכת חוסרים רק אם הצלחנו
     * להעריך את כל המוצרים החסרים.
     */
    const missingEstimateAvailable =
      missingCount === 0 ||
      missingEstimates.every(item => item.available);

    const estimatedMissingCost =
      missingEstimateAvailable
        ? round2(
          missingEstimates.reduce(
            (sum, item) =>
              sum + (item.estimatedLineTotal || 0),
            0
          )
        )
        : null;

    /*
     * העלות המשוערת לסל:
     * מה שמשלמים בחנות + משלוח + הערכת החוסרים.
     */
    const estimatedBasketTotal =
      totalWithDelivery !== null &&
        missingEstimateAvailable
        ? round2(
          totalWithDelivery +
          (estimatedMissingCost || 0)
        )
        : null;

    return {
      storeId: store.id,
      storeName: store.name,
      website: store.website,

      coverageFound: found,
      coverageTotal: totalItems,
      coverageRatio,

      subtotal,
      deliveryFee: store.deliveryFee,
      minOrder: store.minOrder,
      meetsMinOrder,
      totalWithDelivery,

      missing,
      missingCount,
      missingEstimates,
      missingEstimateAvailable,
      estimatedMissingCost,
      estimatedBasketTotal,

      itemsBreakdown
    };
  });
}

/**
 * האם חנות יכולה להיות מומלצת במצב מחיר.
 *
 * חשוב:
 * חנויות שלא עומדות בתנאים עדיין יוצגו למשתמש.
 * התנאים האלה משפיעים רק על ההמלצה והדירוג.
 */
function isPriceCandidate(store) {
  return (
    store.coverageFound > 0 &&
    store.meetsMinOrder &&
    store.missingCount <= PRICE_MODE_CONFIG.maxMissing &&
    store.coverageRatio >= PRICE_MODE_CONFIG.minCoverageRatio &&
    typeof store.estimatedBasketTotal === "number"
  );
}

function isCoverageCandidate(store) {
  return (
    store.coverageFound > 0 &&
    store.meetsMinOrder
  );
}

/**
 * בודק האם פער המחיר משמעותי מספיק
 * כדי להצדיק כיסוי נמוך יותר.
 *
 * הרף הוא:
 * 10 ש"ח או 5% מהחלופה היקרה יותר,
 * לפי הגבוה מביניהם.
 */
function isSignificantSaving(cheaperPrice, higherPrice) {
  const difference = higherPrice - cheaperPrice;

  const requiredSaving = Math.max(
    PRICE_MODE_CONFIG.minSavingNis,
    higherPrice * PRICE_MODE_CONFIG.minSavingPercent
  );

  return difference >= requiredSaving;
}

/**
 * בחירת החנות הטובה ביותר מתוך קבוצת חנויות
 * במצב "האפשרות החסכונית ביותר".
 */
function chooseBestPriceCandidate(candidates) {
  if (!candidates.length) return null;

  const cheapestPrice = Math.min(
    ...candidates.map(store => store.estimatedBasketTotal)
  );

  /*
   * אם הפרש המחיר אינו משמעותי,
   * הכיסוי מקבל עדיפות.
   */
  const closePriceCandidates = candidates.filter(store => {
    if (store.estimatedBasketTotal === cheapestPrice) {
      return true;
    }

    return !isSignificantSaving(
      cheapestPrice,
      store.estimatedBasketTotal
    );
  });

  closePriceCandidates.sort((a, b) => {
    // פחות חוסרים קודם
    if (a.missingCount !== b.missingCount) {
      return a.missingCount - b.missingCount;
    }

    // אחר כך כיסוי גבוה יותר
    if (a.coverageRatio !== b.coverageRatio) {
      return b.coverageRatio - a.coverageRatio;
    }

    // אחר כך מחיר
    if (a.estimatedBasketTotal !== b.estimatedBasketTotal) {
      return a.estimatedBasketTotal - b.estimatedBasketTotal;
    }

    return a.storeName.localeCompare(b.storeName, "he");
  });

  return closePriceCandidates[0];
}

/**
 * יוצר דירוג מלא במצב מחיר.
 *
 * אחרי בחירת המקום הראשון מסירים אותו
 * ומפעילים שוב את אותם כללים על שאר החנויות.
 */
function rankPriceCandidates(candidates) {
  const remaining = [...candidates];
  const ranked = [];

  while (remaining.length > 0) {
    const best = chooseBestPriceCandidate(remaining);

    if (!best) break;

    ranked.push(best);

    const index = remaining.findIndex(
      store => store.storeId === best.storeId
    );

    remaining.splice(index, 1);
  }

  return ranked;
}

function fallbackSort(a, b) {
  // חנות שעומדת במינימום לפני אחת שלא
  if (a.meetsMinOrder !== b.meetsMinOrder) {
    return a.meetsMinOrder ? -1 : 1;
  }

  // כיסוי גבוה יותר
  if (a.coverageRatio !== b.coverageRatio) {
    return b.coverageRatio - a.coverageRatio;
  }

  // פחות חוסרים
  if (a.missingCount !== b.missingCount) {
    return a.missingCount - b.missingCount;
  }

  const aPrice =
    a.totalWithDelivery ?? a.subtotal ?? Number.MAX_SAFE_INTEGER;

  const bPrice =
    b.totalWithDelivery ?? b.subtotal ?? Number.MAX_SAFE_INTEGER;

  return aPrice - bPrice;
}

/**
 * מחזיר את כל החנויות בסדר שבו הן צריכות
 * להופיע בכרטיסים.
 */
function rankComparisons(results, mode) {
  if (mode === "bestCoverage") {
    const eligible = results
      .filter(isCoverageCandidate)
      .sort((a, b) => {
        if (a.coverageRatio !== b.coverageRatio) {
          return b.coverageRatio - a.coverageRatio;
        }

        const aPrice =
          a.totalWithDelivery ?? Number.MAX_SAFE_INTEGER;

        const bPrice =
          b.totalWithDelivery ?? Number.MAX_SAFE_INTEGER;

        return aPrice - bPrice;
      });

    const others = results
      .filter(store => !isCoverageCandidate(store))
      .sort(fallbackSort);

    return [...eligible, ...others].map((store, index) => ({
      ...store,
      recommendationRank: index + 1
    }));
  }

  const eligible = results.filter(isPriceCandidate);
  const others = results.filter(store => !isPriceCandidate(store));

  const rankedEligible = rankPriceCandidates(eligible);
  const rankedOthers = others.sort(fallbackSort);

  return [...rankedEligible, ...rankedOthers].map(
    (store, index) => ({
      ...store,
      recommendationRank: index + 1
    })
  );
}

function pickRecommendation(rankedResults, mode) {
  if (!rankedResults.length) {
    return {
      type: "none",
      reason: "לא נמצאו חנויות שמחזיקות מוצרים מתוך הסל."
    };
  }

  if (mode === "bestCoverage") {
    const store = rankedResults.find(isCoverageCandidate);

    if (!store) {
      return {
        type: "none",
        reason:
          "לא נמצאה חנות שעומדת בתנאי מינימום ההזמנה."
      };
    }

    return {
      type: "store",
      storeId: store.storeId,
      label: "הסל המלא ביותר",
      reason:
        "החנות עם הכיסוי הגבוה ביותר לסל. במקרה של כיסוי זהה, המחיר משמש כשובר שוויון."
    };
  }

  let store = rankedResults.find(isPriceCandidate);
  let fallback = false;

  /*
   * אם לא הצלחנו לבצע הערכה מלאה לחוסרים,
   * עדיין לא מעלימים את החנויות.
   * נבחר את החלופה הראשונה שעומדת במינימום.
   */
  if (!store) {
    store = rankedResults.find(
      item =>
        item.meetsMinOrder &&
        item.coverageFound > 0
    );

    fallback = true;
  }

  if (!store) {
    return {
      type: "none",
      reason:
        "לא נמצאה חנות שעומדת בתנאי מינימום ההזמנה."
    };
  }

  let reason;

  if (fallback) {
    reason =
      "לא ניתן היה להעריך את כל החוסרים. הדירוג מבוסס על כיסוי הסל והמחיר הקיים בחנות.";
  } else if (store.missingCount === 0) {
    reason =
      "הסל זמין במלואו והמחיר שלו הוא המשתלם ביותר לפי כללי ההשוואה.";
  } else {
    reason =
      `החנות נבחרה למרות ${store.missingCount} ` +
      `מוצר${store.missingCount === 1 ? " חסר" : "ים חסרים"}, ` +
      "משום שגם לאחר הערכת עלות החוסרים מתקבל חיסכון משמעותי.";
  }

  return {
    type: "store",
    storeId: store.storeId,
    label: "האפשרות החסכונית ביותר",
    reason
  };
}

module.exports = {
  calculateComparisons,
  rankComparisons,
  pickRecommendation
};