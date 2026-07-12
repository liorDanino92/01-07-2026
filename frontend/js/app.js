import { PRODUCTS } from "./data.js";
const API_BASE_URL = "https://01-07-2026-production.up.railway.app";

const el = (id) => document.getElementById(id);

// === מסכים ===
const screenBasket = el("screen-basket");
const screenPrefs = el("screen-prefs");
const screenResults = el("screen-results");
const screenAbout = el("screen-about");
const screenSaved = el("screen-saved");
const screenAuth = el("screen-auth");
const screenAuthLogin = el("screen-auth-login");

// === ניווט ===
const navLinks = Array.from(document.querySelectorAll(".navlink"));
const navCartCount = el("navCartCount");
const basketCounter = el("basketCounter");

// === בחירת מוצרים וסל ===
const productSearch = el("productSearch");
const categorySelect = el("categorySelect");
const quickProductsList = el("quickProductsList");

// === עוזר AI / עוזר סל חכם ===
const aiToggleBtn = el("aiToggleBtn");
const aiPanel = el("aiPanel");
const aiPromptInput = el("aiPromptInput");
const aiSuggestBtn = el("aiSuggestBtn");
const aiStatus = el("aiStatus");
const aiSuggestionsList = el("aiSuggestionsList");
const aiAddSelectedBtn = el("aiAddSelectedBtn");
const aiQuery = null;
const aiSuggestions = null;

const basketTable = el("basketTable");
const basketTbody = basketTable.querySelector("tbody");
const basketEmpty = el("basketEmpty");
const toPrefsBtn = el("toPrefsBtn");
const clearBasketBtn = el("clearBasketBtn");

// === ניווט בין מסכים ===
const backToBasketBtn = el("backToBasketBtn");
const calcBtn = el("calcBtn");
const backToPrefsBtn = el("backToPrefsBtn");
const backToBasketBtn2 = el("backToBasketBtn2");
const aboutBackBtn = el("aboutBackBtn");

const cityInput = el("cityInput");
const cityError = el("cityError");

// === תוצאות ===
const resultsTable = el("resultsTable");
const resultsTbody = resultsTable.querySelector("tbody");
const resultsSummary = el("resultsSummary");
const storeCards = el("storeCards");

// === סלים שמורים ===
const saveBasketBtn = el("saveBasketBtn");
const loadBasketBtn = el("loadBasketBtn");
const clearSavedBtn = el("clearSavedBtn");
const savedBackBtn = el("savedBackBtn");
const savedStatus = el("savedStatus");

// === הרשמה/התחברות ===
const authEmail = el("authEmail");
const authPhone = el("authPhone");
const authName = el("authName");
const authCity = el("authCity");
const authPassword = el("authPassword");
const authSaveBtn = el("authSaveBtn");
const authLogoutBtn = el("authLogoutBtn");
const authBackBtn = el("authBackBtn");
const authStatus = el("authStatus");
const authTitle = el("authTitle");

const loginEmail = el("loginEmail");
const loginPassword = el("loginPassword");
const rememberMe = el("rememberMe");
const loginBtn = el("loginBtn");
const goToRegisterBtn = el("goToRegisterBtn");
const loginStatus = el("loginStatus");

// סל בזיכרון: [{ productId, qty }]
let basket = [];
const hebrewCollator = new Intl.Collator("he", {
  sensitivity: "base",
  numeric: true,
});

// =================================================
// כללי: ניווט בין מסכים + עדכון מונה סל בתפריט
// =================================================
function getBasketCount() {
  return basket.length;
}

function updateNavCartCount() {
  const n = getBasketCount();
  if (navCartCount) navCartCount.textContent = String(n);
  if (basketCounter) basketCounter.textContent = `${n} פריטים`;
}

navLinks.forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.screen;
    if (key === "basket") return showScreen(screenBasket);
    if (key === "results") return showScreen(screenResults);
    if (key === "about") return showScreen(screenAbout);
    if (key === "saved") return showScreen(screenSaved);
    if (key === "auth") return showScreen(screenAuth);
    if (key === "auth-login") {
      const user = getUser();
      return showScreen(user ? screenAuth : screenAuthLogin);
    }
  });
});

// כפתור סל בתפריט מחזיר לבניית סל
document.querySelectorAll('.cartbtn[data-screen="basket"]').forEach(btn => {
  btn.addEventListener("click", () => showScreen(screenBasket));
});

function showScreen(which) {
  const screens = [screenBasket, screenPrefs, screenResults, screenAbout, screenSaved, screenAuth, screenAuthLogin];
  for (const s of screens) s.classList.add("hidden");
  which.classList.remove("hidden");

  document.body.classList.toggle("is-results-screen", which === screenResults);

  // עדכון כפתור פעיל בתפריט
  const map = new Map([
    [screenBasket, "basket"],
    [screenResults, "results"],
    [screenAbout, "about"],
    [screenSaved, "saved"],
    [screenAuth, "auth"],
    [screenPrefs, null],
    [screenAuthLogin, "auth-login"],
  ]);
  const activeKey = map.get(which);
  navLinks.forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.screen === activeKey);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =================================================
// בחירת מוצר + סינון לפי קטגוריה וחיפוש
// =================================================
function findProduct(pid) {
  return PRODUCTS.find(p => p.id === pid);
}

function getFilteredProducts() {
  const searchText = (productSearch?.value || "").trim().toLowerCase();
  const selectedCategory = categorySelect?.value || "הכל";

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().startsWith(searchText);
    const matchesCategory =
      selectedCategory === "הכל" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!searchText) return filteredProducts;

  return filteredProducts.sort((a, b) => hebrewCollator.compare(a.name, b.name));
}

function getBasketItemQty(productId) {
  const item = basket.find(x => x.productId === productId);
  return item ? item.qty : 0;
}

function renderProductOptions() {
  const filteredProducts = getFilteredProducts();

  if (!quickProductsList) return;

  quickProductsList.innerHTML = "";

  if (filteredProducts.length === 0) {
    quickProductsList.innerHTML = `
      <div class="empty">
        <div class="empty__icon">🔍</div>
        <p>לא נמצאו מוצרים מתאימים לחיפוש.</p>
      </div>
    `;
    return;
  }

  for (const product of filteredProducts) {
    const qty = getBasketItemQty(product.id);

    const row = document.createElement("div");
    row.className = "quick-product";
    row.innerHTML = `
      <div class="quick-product__info">
        <b>${product.name}</b>
        <span class="muted">${product.category} · ${product.unit}</span>
      </div>

      <div class="quick-product__actions">
        <button class="btn" type="button" data-action="quick-dec" data-id="${product.id}">−</button>
        <span class="quick-product__qty">${qty > 0 ? qty : 0}</span>
        <button class="btn primary" type="button" data-action="quick-add" data-id="${product.id}">+</button>
      </div>
    `;

    quickProductsList.appendChild(row);
  }
}



// =================================================
// סל: רינדור, הוספה, שינוי כמות, הסרה
// =================================================
function renderBasket() {
  basketTbody.innerHTML = "";

  if (basket.length === 0) {
    basketEmpty.classList.remove("hidden");
    basketTable.classList.add("hidden");
    toPrefsBtn.disabled = true;
    updateNavCartCount();
    return;
  }

  basketEmpty.classList.add("hidden");
  basketTable.classList.remove("hidden");
  toPrefsBtn.disabled = false;

  for (const item of basket) {
    const p = findProduct(item.productId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><b>${p?.name ?? item.productId}</b></td>
      <td>${item.qty}</td>
      <td>${p?.unit ?? ""}</td>
      <td>
        <button class="btn" data-action="dec" data-id="${item.productId}">−</button>
        <button class="btn" data-action="inc" data-id="${item.productId}">+</button>
        <button class="btn danger" data-action="remove" data-id="${item.productId}">הסר</button>
      </td>
    `;
    basketTbody.appendChild(tr);
  }
  updateNavCartCount();
}

function addToBasket(productId, qty) {
  const product = PRODUCTS.find(p => p.id === productId);
  const minQty = product?.unit === "יח'" ? 1 : 0.5;

  const existing = basket.find(x => x.productId === productId);

  if (existing) {
    existing.qty = Math.max(minQty, Math.round((existing.qty + qty) * 10) / 10);
  } else {
    basket.push({ productId, qty });
  }

  renderBasket();
}

function adjustItem(productId, delta) {
  const item = basket.find(x => x.productId === productId);
  if (!item) return;
  const product = PRODUCTS.find(p => p.id === productId);
  const step = product?.unit === "יח'" ? 1 : 0.5;
  item.qty = Math.max(step, Math.round((item.qty + (delta * step)) * 10) / 10);
  renderBasket();
}

function removeItem(productId) {
  basket = basket.filter(x => x.productId !== productId);
  renderBasket();
}

function clearBasket() {
  if (basket.length === 0) return;

  const approved = confirm("לנקות את כל הסל?");
  if (!approved) return;

  basket = [];
  renderBasket();
  renderProductOptions();
  updateNavCartCount();
}

basketTbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const productId = btn.dataset.id;
  if (action === "remove") removeItem(productId);
  if (action === "inc") adjustItem(productId, 1);
  if (action === "dec") adjustItem(productId, -1);
});

clearBasketBtn?.addEventListener("click", clearBasket);

productSearch?.addEventListener("input", () => renderProductOptions());
categorySelect?.addEventListener("change", () => { renderProductOptions(); productSearch?.focus(); });

quickProductsList?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const productId = btn.dataset.id;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const step = product.unit === "יח'" ? 1 : 0.5;

  if (action === "quick-add") {
    addToBasket(productId, step);
  }

  if (action === "quick-dec") {
    const item = basket.find(x => x.productId === productId);
    if (!item) return;

    item.qty = Math.round((item.qty - step) * 10) / 10;

    if (item.qty <= 0) {
      removeItem(productId);
    } else {
      renderBasket();
    }
  }

  renderProductOptions();
});

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderServerAiSuggestions(suggestions) {
  if (!aiSuggestionsList) return;

  aiSuggestionsList.innerHTML = suggestions.map(suggestion => {
    const product = findProduct(suggestion.productId);
    const name = suggestion.name || product?.name || suggestion.productId;
    const unit = suggestion.unit || product?.unit || "";
    const qty = Number(suggestion.qty) || 1;
    const reason = suggestion.reason || "";

    return `
      <label class="ai-suggestion">
        <input type="checkbox" checked data-product-id="${escapeHtml(suggestion.productId)}" data-qty="${qty}">
        <span class="ai-suggestion__main">
          <b>${escapeHtml(name)}</b>
          <small>${escapeHtml(reason)}</small>
        </span>
        <span class="ai-suggestion__qty">${escapeHtml(qty)} ${escapeHtml(unit)}</span>
      </label>
    `;
  }).join("");
}

async function requestAiBasketSuggestions() {
  const promptText = (aiPromptInput?.value || "").trim();

  if (!promptText) {
    if (aiStatus) aiStatus.textContent = "כתוב קודם רעיון לסל.";
    return;
  }

  if (aiSuggestBtn) aiSuggestBtn.disabled = true;
  if (aiStatus) aiStatus.textContent = "מחפש מוצרים מתאימים...";
  if (aiSuggestionsList) aiSuggestionsList.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE_URL}/api/ai-basket-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: promptText,
        products: PRODUCTS,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.error) {
      throw new Error(data.error || "לא ניתן לקבל הצעות כרגע.");
    }

    const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];

    if (suggestions.length === 0) {
      if (aiStatus) aiStatus.textContent = "לא נמצאו מוצרים מתאימים מתוך הרשימה.";
      return;
    }

    renderServerAiSuggestions(suggestions);
    if (aiStatus) aiStatus.textContent = "בחר מוצרים מהרשימה והוסף לסל.";
  } catch (error) {
    const message = error instanceof TypeError
      ? "לא ניתן להתחבר לעוזר הסל כרגע. ודא שהשרת פעיל."
      : error?.message || "לא ניתן להתחבר לעוזר הסל כרגע. ודא שהשרת פעיל.";
    if (aiStatus) aiStatus.textContent = message;
  } finally {
    if (aiSuggestBtn) aiSuggestBtn.disabled = false;
  }
}

aiToggleBtn?.addEventListener("click", () => {
  if (!aiPanel) return;
  aiPanel.classList.toggle("hidden");
  if (!aiPanel.classList.contains("hidden")) {
    aiPromptInput?.focus();
  }
});

aiSuggestBtn?.addEventListener("click", requestAiBasketSuggestions);

aiPromptInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    requestAiBasketSuggestions();
  }
});

aiAddSelectedBtn?.addEventListener("click", () => {
  const selected = Array.from(aiSuggestionsList?.querySelectorAll('input[type="checkbox"]:checked') || []);

  if (selected.length === 0) {
    if (aiStatus) aiStatus.textContent = "בחר לפחות מוצר אחד להוספה.";
    return;
  }

  selected.forEach(checkbox => {
    const productId = checkbox.dataset.productId;
    const qty = Number(checkbox.dataset.qty) || 1;
    if (productId) addToBasket(productId, qty);
  });

  renderBasket();
  renderProductOptions();
  if (aiStatus) aiStatus.textContent = "המוצרים נוספו לסל.";
});


// =================================================
// עוזר הסל החכם — גרסה מקומית בלי API חיצוני
// =================================================
const AI_BASKET_IDEAS = [
  {
    keys: ["סלט", "ישראלי", "ירקות", "קליל", "בריא"],
    title: "סל לסלט ישראלי",
    ids: ["tomato", "cucumber", "onion", "pepper", "lettuce", "lemon"]
  },
  {
    keys: ["פירות", "ילדים", "מתוק", "נשנוש"],
    title: "פירות לילדים",
    ids: ["apple", "banana", "strawberry", "peach", "loquat"]
  },
  {
    keys: ["שבוע", "בסיסי", "זול", "בית", "חסכוני"],
    title: "סל בסיסי לשבוע",
    ids: ["tomato", "cucumber", "potato", "onion", "carrot", "apple", "banana"]
  },
  {
    keys: ["מרק", "חורף", "בישול", "חם"],
    title: "סל למרק ירקות",
    ids: ["potato", "carrot", "onion", "zucchini", "pumpkin", "sweet_potato"]
  },
  {
    keys: ["ירק", "עשבי", "תיבול", "עלים"],
    title: "ירוקים ותיבול",
    ids: ["parsley", "cilantro", "dill", "mint", "lettuce", "lemon"]
  }
];

function getAiSuggestion(promptText) {
  const text = (promptText || "").trim().toLowerCase();
  if (!text) return AI_BASKET_IDEAS[0];

  let best = AI_BASKET_IDEAS[0];
  let bestScore = -1;
  for (const idea of AI_BASKET_IDEAS) {
    const score = idea.keys.reduce((sum, key) => sum + (text.includes(key) ? 1 : 0), 0);
    if (score > bestScore) {
      best = idea;
      bestScore = score;
    }
  }
  return best;
}

function renderAiSuggestions(promptText) {
  if (!aiSuggestions) return;
  const idea = getAiSuggestion(promptText);
  const products = idea.ids.map(findProduct).filter(Boolean);

  aiSuggestions.innerHTML = `
    <div class="ai-suggestions__title">${idea.title}</div>
    <div class="ai-products">
      ${products.map(p => `
        <button class="ai-product" type="button" data-ai-add="${p.id}">
          <span>${p.name}</span>
          <small>${p.unit}</small>
          <b>+</b>
        </button>
      `).join("")}
    </div>
    <button class="btn primary btn--block ai-add-all" type="button" data-ai-add-all="${idea.ids.join(",")}">הוסף את כל ההצעה לסל</button>
  `;

  if (aiStatus) aiStatus.textContent = "אפשר להוסיף מוצר בודד או את כל ההצעה.";
}

aiSuggestBtn?.addEventListener("click", () => renderAiSuggestions(aiQuery?.value || ""));
aiQuery?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    renderAiSuggestions(aiQuery.value);
  }
});

document.querySelectorAll(".ai-chip").forEach(btn => {
  btn.addEventListener("click", () => {
    if (aiQuery) aiQuery.value = btn.dataset.aiPrompt || "";
    renderAiSuggestions(aiQuery?.value || "");
  });
});

aiSuggestions?.addEventListener("click", (e) => {
  const single = e.target.closest("[data-ai-add]");
  const all = e.target.closest("[data-ai-add-all]");

  if (single) {
    addToBasket(single.dataset.aiAdd, 1);
    if (aiStatus) aiStatus.textContent = "המוצר נוסף לסל.";
  }

  if (all) {
    const ids = (all.dataset.aiAddAll || "").split(",").filter(Boolean);
    ids.forEach(id => addToBasket(id, 1));
    if (aiStatus) aiStatus.textContent = "כל המוצרים שהוצעו נוספו לסל.";
  }
});

// =================================================
// ניווט בין שלבים + חישוב תוצאות
// =================================================
toPrefsBtn.addEventListener("click", () => showScreen(screenPrefs));
backToBasketBtn.addEventListener("click", () => showScreen(screenBasket));
backToBasketBtn2.addEventListener("click", () => showScreen(screenBasket));
backToPrefsBtn.addEventListener("click", () => showScreen(screenPrefs));

calcBtn.addEventListener("click", async () => {
  const mode = document.querySelector('input[name="mode"]:checked')?.value ?? "cheapest";
  const user = getUser();
  const city = user?.city?.trim() || cityInput?.value.trim() || "";

  if (!city) {
    cityInput?.classList.add("input-error");
    cityError?.classList.remove("hidden");
    cityInput?.focus();
    return;
  }

  cityInput?.classList.remove("input-error");
  cityError?.classList.add("hidden");

  try {
    calcBtn.disabled = true;
    calcBtn.textContent = "מחשב תוצאות...";

    const response = await fetch(`${API_BASE_URL}/api/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        basket,
        mode,
        city
      })
    });

    if (!response.ok) {
      throw new Error("שגיאה בקבלת תוצאות מהשרת");
    }

    const data = await response.json();

    renderResults(data.results, data.recommendation, mode);
    showScreen(screenResults);

  } catch (error) {
    console.error(error);
    alert("אירעה שגיאה בחיבור לשרת. ודא שה-Backend פועל.");
  } finally {
    calcBtn.disabled = false;
    calcBtn.textContent = "חשב תוצאות ←";
  }
});

cityInput?.addEventListener("input", () => {
  cityInput.classList.remove("input-error");
  cityError?.classList.add("hidden");
});

document.getElementById("cityInput")?.addEventListener("input", (e) => {
  e.target.classList.remove("input-error");
});

// =================================================
// תוצאות: כרטיס סיכום + רשת כרטיסי חנות + טבלה מפורטת
// =================================================
function qualityBadge(q) {
  if (q === "פרימיום") return `<span class="badge ok">פרימיום</span>`;
  if (q === "מובחר") return `<span class="badge warn">מובחר</span>`;
  return `<span class="badge bad">מוזל</span>`;
}

function productNameById(productId) {
  return findProduct(productId)?.name ?? productId;
}

function formatPrice(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${Number(value).toLocaleString("he-IL", { maximumFractionDigits: 2 })} ₪`;
}

function getMissingNames(missing = []) {
  return missing.map(productNameById);
}

function getBasketCoverageItems(storeResult) {
  const missingSet = new Set(storeResult.missing ?? []);

  return basket.map(item => {
    const product = findProduct(item.productId);
    const productName = product?.name ?? item.productId;
    const unit = product?.unit ?? "";
    const isMissing = missingSet.has(item.productId);

    return {
      productId: item.productId,
      name: productName,
      qty: item.qty,
      unit,
      isMissing
    };
  });
}

function renderCoverageItemsList(storeResult, type = "all") {
  const items = getBasketCoverageItems(storeResult);

  const filteredItems = type === "missing"
    ? items.filter(item => item.isMissing)
    : items;

  if (filteredItems.length === 0) {
    return `
      <div class="summary-details-empty">
        אין פריטים להצגה.
      </div>
    `;
  }

  return `
    <ul class="summary-coverage-list">
      ${filteredItems.map(item => `
        <li class="summary-coverage-item ${item.isMissing ? "summary-coverage-item--missing" : "summary-coverage-item--found"}">
          <span class="summary-coverage-item__icon">${item.isMissing ? "❌" : "✅"}</span>
          <span class="summary-coverage-item__name">${escapeHtml(item.name)}</span>
          <span class="summary-coverage-item__qty">${escapeHtml(item.qty)} ${escapeHtml(item.unit)}</span>
          <span class="summary-coverage-item__status">${item.isMissing ? "חסר" : "נמצא"}</span>
        </li>
      `).join("")}
    </ul>
  `;
}

function getSummaryModeLabel(storeResult, modeLabel) {
  if (storeResult.coverageFound === storeResult.coverageTotal) {
    return "כיסוי סל מלא";
  }

  return modeLabel;
}

function recommendationReason(store, modeLabel) {
  if (!store) return "";
  const parts = [];
  parts.push(modeLabel === "הכי זול" ? "המחיר הכולל הנמוך ביותר" : "שילוב טוב בין מחיר, איכות וכיסוי סל");
  if (store.meetsMinOrder) parts.push("עומדת במינימום הזמנה");
  if (store.coverageFound === store.coverageTotal) parts.push("כל פריטי הסל נמצאו");
  else parts.push(`${store.coverageFound}/${store.coverageTotal} פריטים נמצאו`);
  return parts.join(" · ");
}

function renderResults(results, rec, mode) {
  const modeLabel = mode === "cheapest" ? "הכי זול" : "הכי משתלם";
  const basketCount = basket.length;

  const sortedResults = results.slice().sort((a, b) => {
    if (rec.type === "store") {
      if (a.storeId === rec.storeId) return -1;
      if (b.storeId === rec.storeId) return 1;
    }
    const pa = a.totalWithDelivery ?? a.subtotal ?? Number.MAX_SAFE_INTEGER;
    const pb = b.totalWithDelivery ?? b.subtotal ?? Number.MAX_SAFE_INTEGER;
    return pa - pb;
  });

  const validPrices = sortedResults
    .map(r => r.totalWithDelivery ?? r.subtotal)
    .filter(v => typeof v === "number");
  const avgPrice = validPrices.length
    ? validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length
    : null;

  function renderSummaryCard(storeResult, isRecommended = false) {
    const selectedPrice = storeResult?.totalWithDelivery ?? storeResult?.subtotal;
    const saving = avgPrice && typeof selectedPrice === "number"
      ? Math.max(0, avgPrice - selectedPrice)
      : 0;

    const missingNames = getMissingNames(storeResult?.missing ?? []);
    const selectedModeLabel = getSummaryModeLabel(storeResult, modeLabel);

    resultsSummary.innerHTML = `
        <div class="premium-summary__content">
          <span class="premium-summary__eyebrow">
            ${isRecommended ? "מצאנו עבורך את הבחירה המתאימה ביותר" : "פרטי החנות שבחרת"}
          </span>

          <h3 class="premium-summary__title">${storeResult?.storeName ?? ""}</h3>

          <p class="premium-summary__text">
            ${isRecommended
        ? recommendationReason(storeResult, modeLabel)
        : `סקירת מחיר וכיסוי סל עבור ${storeResult?.storeName ?? "החנות שנבחרה"}`}
          </p>

          <div class="premium-summary__badges">
            <span class="premium-pill premium-pill--green">🏆 ${selectedModeLabel}</span>

            <button class="premium-pill premium-pill--button" type="button" data-summary-action="coverage">
              🛒 ${storeResult.coverageFound}/${storeResult.coverageTotal || basketCount} נמצאו
            </button>

            <span class="premium-pill">🚚 משלוח ${formatPrice(storeResult.deliveryFee)}</span>

            <button class="premium-pill premium-pill--button ${missingNames.length ? "premium-pill--warn" : "premium-pill--green"}" type="button" data-summary-action="missing">
              ${missingNames.length ? `חסרים ${missingNames.length}` : "כל הסל נמצא"}
            </button>
          </div>

          <div id="summaryDetailsPanel" class="summary-details-panel hidden"></div>
        </div>

        <div class="premium-summary__priceBox">
          <span class="premium-summary__priceLabel">סה״כ כולל משלוח</span>
          <strong>${formatPrice(selectedPrice)}</strong>
          ${saving > 0
        ? `<span class="premium-summary__saving">חיסכון משוער ${formatPrice(saving)}</span>`
        : `<span class="premium-summary__saving">${isRecommended ? "הבחירה המומלצת לסל שלך" : "החנות שנבחרה להצגה"}</span>`
      }
        </div>
      `;

    const detailsPanel = resultsSummary.querySelector("#summaryDetailsPanel");

    resultsSummary.querySelector('[data-summary-action="coverage"]')?.addEventListener("click", () => {
      detailsPanel.classList.toggle("hidden");
      detailsPanel.innerHTML = `
          <div class="summary-details-title">פירוט פריטי הסל בחנות ${escapeHtml(storeResult.storeName)}</div>
          <div class="summary-details-subtitle">מוצרים שנמצאו ומוצרים שחסרים בחנות זו</div>
          ${renderCoverageItemsList(storeResult, "all")}
        `;
    });

    resultsSummary.querySelector('[data-summary-action="missing"]')?.addEventListener("click", () => {
      detailsPanel.classList.toggle("hidden");
      detailsPanel.innerHTML = `
          <div class="summary-details-title">מוצרים חסרים בחנות ${escapeHtml(storeResult.storeName)}</div>
          <div class="summary-details-subtitle">אלו פריטים מהסל שלא נמצאו בחנות שנבחרה</div>
          ${renderCoverageItemsList(storeResult, "missing")}
        `;
    });
  }

  // ----- כרטיס סיכום עליון -----
  resultsSummary.className = "summary-card premium-results-summary";

  if (rec.type === "none" || results.length === 0) {
    resultsSummary.classList.add("summary-card--empty");
    resultsSummary.innerHTML = `
      <div class="premium-summary__content">
        <span class="premium-summary__eyebrow">מצב השוואה</span>
        <h3 class="premium-summary__title">לא נמצאה המלצה מתאימה</h3>
        <p class="premium-summary__text">${rec.reason ?? "לא נמצאו תוצאות מתאימות. נסה לשנות עיר או להסיר מוצרים קריטיים."}</p>
      </div>
    `;
  } else {
    const recStore = sortedResults.find(r => r.storeId === rec.storeId) ?? sortedResults[0];

    renderSummaryCard(recStore, true);
  }

  // ----- כרטיסי חנות -----
  storeCards.innerHTML = "";
  storeCards.classList.add("store-grid--premium");

  if (sortedResults.length === 0) {
    storeCards.innerHTML = `<div class="empty"><div class="empty__icon">🏪</div><p>אין חנויות מתאימות לאזור שלך. נסה עיר אחרת.</p></div>`;
  } else {
    sortedResults.forEach((r, index) => {
      const isRec = rec.type === "store" && rec.storeId === r.storeId;
      const totalValue = r.meetsMinOrder ? r.totalWithDelivery : r.subtotal;
      const missingNames = getMissingNames(r.missing ?? []);
      const coveragePercent = r.coverageTotal ? Math.round((r.coverageFound / r.coverageTotal) * 100) : 0;
      const storeLogoUrl = "./assets/noyhasade.SuO8xM4_.png";
      const website = r.website || "#";
      const ctaText = website === "#" ? "לאתר החנות" : "לאתר החנות";

      const card = document.createElement("article");
      card.className = "store-card premium-store-card" + (isRec ? " store-card--recommended premium-store-card--winner" : "");
      card.dataset.storeId = r.storeId;
      card.tabIndex = 0;
      card.innerHTML = `
        ${isRec ? `<span class="premium-winner-badge">👑 הכי משתלם</span>` : `<span class="premium-rank">${index + 1}</span>`}

        <div class="premium-store-card__logo">
          <img src="${storeLogoUrl}" alt="לוגו ${escapeHtml(r.storeName)}">
        </div>

        <div class="premium-store-card__main">
          <div class="premium-store-card__head">
            <h3 class="store-card__name">${r.storeName}</h3>
            ${qualityBadge(r.quality)}
          </div>

          <div class="premium-price">
            <span>המחיר הסופי</span>
            <strong>${formatPrice(totalValue)}</strong>
          </div>
          <div class="coverage-line" title="כיסוי סל">
            <span class="coverage-line__label">כיסוי סל</span>
            <div class="coverage-line__track"><span style="width:${coveragePercent}%"></span></div>
            <span class="coverage-line__value">${r.coverageFound}/${r.coverageTotal || basketCount}</span>
          </div>

          <div class="premium-store-card__miniMetrics">
            <span>🚚 משלוח ${formatPrice(r.deliveryFee)}</span>
            <span>📦 מינימום ${formatPrice(r.minOrder)}</span>
          </div>

          <div class="premium-missing ${missingNames.length ? "" : "premium-missing--ok"}">
            ${missingNames.length
          ? `<b>חסרים:</b> ${missingNames.slice(0, 3).join(", ")}${missingNames.length > 3 ? " ועוד" : ""}`
          : `✓ כל פריטי הסל קיימים בחנות`}
          </div>
        </div>

        <div class="premium-store-card__actions">
          <button class="btn ghost premium-details-btn" type="button">פרטים</button>
          <a class="btn primary premium-cta" href="${website}" ${website === "#" ? "aria-disabled=\"true\"" : "target=\"_blank\" rel=\"noopener noreferrer\""}>${ctaText}</a>
        </div>
      `;
      storeCards.appendChild(card);
      card.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;

        renderSummaryCard(r, false);

        document.querySelectorAll(".premium-store-card").forEach(c => {
          c.classList.remove("premium-store-card--selected");
        });

        card.classList.add("premium-store-card--selected");

        resultsSummary.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });

    });
  }

  // ----- טבלה מפורטת (מתוך ה-details) -----
  resultsTbody.innerHTML = "";
  for (const r of sortedResults) {
    const isRec = rec.type === "store" && rec.storeId === r.storeId;
    const tr = document.createElement("tr");
    if (isRec) tr.style.background = "rgba(47,156,74,.06)";
    const total = r.meetsMinOrder ? formatPrice(r.totalWithDelivery) : "—";
    const status = r.meetsMinOrder
      ? `<span class="badge ok">עומד</span>`
      : `<span class="badge bad">לא עומד</span>`;
    tr.innerHTML = `
      <td><b>${r.storeName}</b>${isRec ? ' <span class="chip">מומלץ</span>' : ""}</td>
      <td>${qualityBadge(r.quality)}</td>
      <td>${r.coverageFound}/${r.coverageTotal || basketCount}</td>
      <td>${formatPrice(r.subtotal)}</td>
      <td>${formatPrice(r.deliveryFee)}</td>
      <td>${formatPrice(r.minOrder)}</td>
      <td>${total}</td>
      <td>${status}</td>
    `;
    resultsTbody.appendChild(tr);
  }
}

// =================================================
// משתמש: שמירה ב-localStorage (הרשמה/התחברות)
// =================================================
const STORAGE_KEY = "basket_v1";
const USER_KEY = "user_v1";

function saveUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function getUser() { return JSON.parse(localStorage.getItem(USER_KEY)); }
function clearUser() { localStorage.removeItem(USER_KEY); }

function renderAuthStatus() {
  const user = getUser();
  const authNavBtn = document.querySelector('.navlink[data-screen="auth-login"]');

  if (!user) {
    if (authNavBtn) authNavBtn.textContent = "התחברות";
    if (authTitle) authTitle.textContent = "הרשמה";
    if (authStatus) authStatus.textContent = "לא מחובר כרגע.";
    authEmail.value = ""; authPhone.value = ""; authName.value = ""; authCity.value = "";
    if (authPassword) authPassword.value = "";
    authSaveBtn.textContent = "שמור והירשם";
    authLogoutBtn.classList.add("hidden");
    return;
  }

  const firstName = user.name?.trim().split(" ")[0] || "משתמש";
  if (authNavBtn) authNavBtn.textContent = firstName;
  if (authTitle) authTitle.textContent = `אזור אישי · ${firstName}`;
  authEmail.value = user.email || "";
  authPhone.value = user.phone || "";
  authName.value = user.name || "";
  authCity.value = user.city || "";
  if (authPassword) authPassword.value = user.password || "";
  authSaveBtn.textContent = "שמור שינויים";
  authLogoutBtn.classList.remove("hidden");
  if (authStatus) authStatus.textContent = `מחובר בתור: ${user.name}`;
}

goToRegisterBtn?.addEventListener("click", () => showScreen(screenAuth));

loginBtn?.addEventListener("click", () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  if (!email || !password) {
    loginStatus.textContent = "יש להזין אימייל וסיסמה."; return;
  }
  const existingUser = getUser();
  if (!existingUser || existingUser.email !== email || existingUser.password !== password) {
    loginStatus.textContent = "המשתמש לא נמצא. ניתן לעבור להרשמה."; return;
  }
  loginStatus.textContent = rememberMe?.checked
    ? "✅ התחברת והמשתמש ייזכר בדפדפן זה."
    : "✅ התחברת בהצלחה.";
  renderAuthStatus();
  showScreen(screenBasket);
});

authSaveBtn?.addEventListener("click", () => {
  const email = authEmail.value.trim();
  const phone = authPhone.value.trim();
  const name = authName.value.trim();
  const city = authCity.value.trim();
  const password = authPassword.value.trim();
  if (!email || !phone || !name || !city || !password) {
    authStatus.textContent = "יש למלא את כל השדות."; return;
  }
  saveUser({ email, phone, name, city, password });
  renderAuthStatus();
  authStatus.textContent = "✅ הפרטים נשמרו.";
  showScreen(screenBasket);
});

authLogoutBtn?.addEventListener("click", () => {
  clearUser();
  renderAuthStatus();
  loginStatus.textContent = "";
  authStatus.textContent = "התבצעה התנתקות.";
  showScreen(screenBasket);
});

authBackBtn?.addEventListener("click", () => showScreen(screenBasket));

// =================================================
// סלים שמורים
// =================================================
function saveBasketToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
  if (savedStatus) savedStatus.textContent = "✅ הסל נשמר בהצלחה.";
}
function loadBasketFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { if (savedStatus) savedStatus.textContent = "אין סל שמור עדיין."; return; }
  try {
    basket = JSON.parse(raw) || [];
    renderBasket();
    updateNavCartCount();
    if (savedStatus) savedStatus.textContent = "✅ סל נטען בהצלחה.";
  } catch {
    if (savedStatus) savedStatus.textContent = "שגיאה בטעינת סל שמור.";
  }
}
function clearBasketFromStorage() {
  localStorage.removeItem(STORAGE_KEY);
  if (savedStatus) savedStatus.textContent = "🗑️ סל שמור נמחק.";
}

aboutBackBtn?.addEventListener("click", () => showScreen(screenBasket));
savedBackBtn?.addEventListener("click", () => showScreen(screenBasket));
saveBasketBtn?.addEventListener("click", saveBasketToStorage);
loadBasketBtn?.addEventListener("click", loadBasketFromStorage);
clearSavedBtn?.addEventListener("click", clearBasketFromStorage);

// =================================================
// אתחול
// =================================================
function init() {
  renderProductOptions();
  renderBasket();
  updateNavCartCount();
  renderAuthStatus();
  showScreen(screenBasket);
}
init();
