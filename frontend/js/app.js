import { PRODUCTS as FALLBACK_PRODUCTS } from "./data.js";
import { CITIES } from "./cities.js";
const API_BASE_URL = "https://01-07-2026-production.up.railway.app";
let PRODUCTS = FALLBACK_PRODUCTS;

const el = (id) => document.getElementById(id);

// === מסכים ===
const screenBasket = el("screen-basket");
const screenPrefs = el("screen-prefs");
const screenResults = el("screen-results");
const screenAbout = el("screen-about");
const screenSaved = el("screen-saved");
const screenGoodToKnow = el("screen-good-to-know");
const screenAuth = el("screen-auth");
const screenAuthLogin = el("screen-auth-login");
const screenBusiness = el("screen-business");

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
// === רשימת ערים ===
// === השלמה אוטומטית לערים ===
const authCitySuggestions = el("authCitySuggestions");
const cityInputSuggestions = el("cityInputSuggestions");

function setupCityAutocomplete(input, suggestionsBox) {
  if (!input || !suggestionsBox) return;

  function closeSuggestions() {
    suggestionsBox.classList.add("hidden");
    suggestionsBox.innerHTML = "";
  }

  function openSuggestions(matches) {
    if (!matches.length) {
      closeSuggestions();
      return;
    }

    suggestionsBox.innerHTML = matches
      .map(city => `<button type="button" class="city-suggestion-item">${city}</button>`)
      .join("");

    suggestionsBox.classList.remove("hidden");

    suggestionsBox.querySelectorAll(".city-suggestion-item").forEach(btn => {
      btn.addEventListener("click", () => {
        input.value = btn.textContent;
        closeSuggestions();
        input.dispatchEvent(new Event("input"));
      });
    });
  }

  input.addEventListener("input", () => {
    const value = input.value.trim();

    if (!value) {
      closeSuggestions();
      return;
    }

    const matches = CITIES
      .filter(city => city.startsWith(value))
      .slice(0, 8);

    openSuggestions(matches);
  });

  input.addEventListener("focus", () => {
    const value = input.value.trim();

    const matches = value
      ? CITIES.filter(city => city.startsWith(value)).slice(0, 8)
      : CITIES.slice(0, 8);

    openSuggestions(matches);
  });

  document.addEventListener("click", (event) => {
    if (!input.contains(event.target) && !suggestionsBox.contains(event.target)) {
      closeSuggestions();
    }
  });
}

function initCityAutocomplete() {
  setupCityAutocomplete(authCity, authCitySuggestions);
  setupCityAutocomplete(cityInput, cityInputSuggestions);
}
// === Modal כללי ===
const appModal = el("appModal");
const modalIcon = el("modalIcon");
const modalTitle = el("modalTitle");
const modalText = el("modalText");
const modalInputWrap = el("modalInputWrap");
const modalInputLabel = el("modalInputLabel");
const modalInput = el("modalInput");
const modalInputHint = el("modalInputHint");
const modalError = el("modalError");
const modalCancelBtn = el("modalCancelBtn");
const modalConfirmBtn = el("modalConfirmBtn");

let modalResolve = null;

function closeAppModal(result = null) {
  appModal?.classList.add("hidden");
  appModal?.classList.remove("app-modal--danger");

  if (modalResolve) {
    modalResolve(result);
    modalResolve = null;
  }
}

function openAppModal(options = {}) {
  return new Promise(resolve => {
    modalResolve = resolve;

    const {
      type = "info",
      icon = "🧺",
      title = "",
      text = "",
      confirmText = "אישור",
      cancelText = "ביטול",
      input = false,
      inputLabel = "שם",
      inputPlaceholder = "",
      inputValue = "",
      inputHint = "",
      validate = null
    } = options;

    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalText.textContent = text;
    modalConfirmBtn.textContent = confirmText;
    modalCancelBtn.textContent = cancelText;

    modalError.textContent = "";
    modalError.classList.add("hidden");

    appModal.classList.toggle("app-modal--danger", type === "danger");

    if (input) {
      modalInputWrap.classList.remove("hidden");
      modalInputLabel.textContent = inputLabel;
      modalInput.placeholder = inputPlaceholder;
      modalInput.value = inputValue;
      modalInputHint.textContent = inputHint;
    } else {
      modalInputWrap.classList.add("hidden");
      modalInput.value = "";
      modalInputHint.textContent = "";
    }

    appModal.classList.remove("hidden");

    setTimeout(() => {
      if (input) modalInput.focus();
      else modalConfirmBtn.focus();
    }, 50);

    modalConfirmBtn.onclick = () => {
      const value = input ? modalInput.value.trim() : true;

      if (validate) {
        const error = validate(value);

        if (error) {
          modalError.textContent = error;
          modalError.classList.remove("hidden");
          return;
        }
      }

      closeAppModal(input ? value : true);
    };

    modalCancelBtn.onclick = () => closeAppModal(null);

    appModal.querySelectorAll("[data-modal-close]").forEach(btn => {
      btn.onclick = () => closeAppModal(null);
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && appModal && !appModal.classList.contains("hidden")) {
    closeAppModal(null);
  }
});

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
    if (key === "good-to-know") return showScreen(screenGoodToKnow);
    if (key === "business") return showScreen(screenBusiness);
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

document.querySelector(".brand")?.addEventListener("click", () => {
  showScreen(screenBasket);
});

function showScreen(which) {
  const screens = [
    screenBasket,
    screenPrefs,
    screenResults,
    screenAbout,
    screenSaved,
    screenGoodToKnow,
    screenAuth,
    screenAuthLogin,
    screenBusiness
  ];

  for (const s of screens) s.classList.add("hidden");
  which.classList.remove("hidden");

  if (which === screenSaved) {
    fetchSavedBaskets();
  }

  document.body.classList.toggle("is-results-screen", which === screenResults);

  // עדכון כפתור פעיל בתפריט
  const map = new Map([
    [screenBasket, "basket"],
    [screenResults, "results"],
    [screenAbout, "about"],
    [screenSaved, "saved"],
    [screenGoodToKnow, "good-to-know"],
    [screenAuth, "auth"],
    [screenPrefs, null],
    [screenAuthLogin, "auth-login"],
    [screenBusiness, "business"]
  ]);

  const activeKey = map.get(which);

  navLinks.forEach(btn => {
    btn.classList.toggle(
      "is-active",
      btn.dataset.screen === activeKey
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
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

      <div class="quick-product__approx">
        ${product.approxUnits ? product.approxUnits : ""}
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

async function clearBasket() {
  if (basket.length === 0) return;

  const approved = await openAppModal({
    type: "danger",
    icon: "🧺",
    title: "ניקוי הסל",
    text: "הפעולה תמחק את כל המוצרים מהסל הנוכחי. ניתן יהיה לבנות סל חדש לאחר מכן.",
    confirmText: "נקה סל",
    cancelText: "ביטול"
  });

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

document.querySelectorAll("[data-go-screen]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.goScreen;

    if (target === "basket") showScreen(screenBasket);
    if (target === "prefs") showScreen(screenPrefs);
    if (target === "results") showScreen(screenResults);
    if (target === "about") showScreen(screenAbout);
    if (target === "saved") showScreen(screenSaved);
  });
});

document.querySelector("[data-scroll-top]")?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

calcBtn.addEventListener("click", async () => {
  const mode = document.querySelector('input[name="mode"]:checked')?.value ?? "cheapest";
  const user = getUser();
  const city = cityInput?.value.trim() || user?.city?.trim() || "";

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

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "שגיאה בקבלת תוצאות מהשרת.");
    }

    renderResults(data.results, data.recommendation, mode);
    showScreen(screenResults);


  } catch (error) {
    console.error(error);
    await openAppModal({
      type: "danger",
      icon: "⚠️",
      title: "שגיאה בחישוב ההשוואה",
      text: error.message || "אירעה שגיאה בחיבור לשרת. נסה שוב בעוד רגע.",
      confirmText: "הבנתי",
      cancelText: ""
    });
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
  const breakdown = Array.isArray(storeResult.itemsBreakdown)
    ? storeResult.itemsBreakdown
    : [];

  if (breakdown.length) {
    return breakdown.map(item => {
      const product = findProduct(item.productId);
      const productName = product?.name ?? item.productId;
      const unit = product?.unit ?? "";

      return {
        productId: item.productId,
        name: productName,
        qty: item.qty,
        unit,
        isMissing: !item.found,
        pricePerUnit: item.pricePerUnit,
        lineTotal: item.lineTotal
      };
    });
  }

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
      isMissing,
      pricePerUnit: null,
      lineTotal: null
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
          <span class="summary-coverage-item__price">
            ${item.isMissing ? "אין מחיר" : `${formatPrice(item.pricePerUnit)} ל${escapeHtml(item.unit)}`}
          </span>
          <span class="summary-coverage-item__status">${item.isMissing ? "חסר" : "נמצא"}</span>
        </li>
      `).join("")}
    </ul>
  `;
}

const STORE_LOGOS = {
  shookit: "./assets/stores/shookit-logo.png",
  noy_hasade: "./assets/stores/noyhasade.SuO8xM4_.png",
  freshuk: "./assets/stores/freshuk.png",
  aleh_online: "./assets/stores/alehonline.png",
  moshavnik: "./assets/stores/moshavnik.png",
  zanzuri: "./assets/stores/Logo_Zanzuri-1-2.png",
  asif_market: "./assets/stores/asif.png",
  king_field: "./assets/stores/k-hasade.png",
  fruit_valley: "./assets/stores/fruitvalley.png"
};

function getStoreLogoUrl(storeId) {
  return STORE_LOGOS[storeId] || "";
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
      const storeLogoUrl = getStoreLogoUrl(r.storeId);
      const website = r.website || "#";
      const ctaText = website === "#" ? "לאתר החנות" : "לאתר החנות";

      const card = document.createElement("article");
      card.className = "store-card premium-store-card" + (isRec ? " store-card--recommended premium-store-card--winner" : "");
      card.dataset.storeId = r.storeId;
      card.tabIndex = 0;
      card.innerHTML = `
        ${isRec ? `<span class="premium-winner-badge">👑 הכי משתלם</span>` : `<span class="premium-rank">${index + 1}</span>`}

        <div class="premium-store-card__logo">
          ${storeLogoUrl
          ? `<img src="${storeLogoUrl}" alt="לוגו ${escapeHtml(r.storeName)}">`
          : `<span>${escapeHtml((r.storeName || "ח").trim().charAt(0))}</span>`
        }
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
  if (authPassword) authPassword.value = "";
  authSaveBtn.textContent = "שמור שינויים";
  authLogoutBtn.classList.remove("hidden");
  if (authStatus) authStatus.textContent = `מחובר בתור: ${user.name}`;
}

goToRegisterBtn?.addEventListener("click", () => showScreen(screenAuth));

loginBtn?.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    loginStatus.textContent = "יש להזין אימייל וסיסמה.";
    return;
  }

  try {
    loginBtn.disabled = true;
    loginStatus.textContent = "מתחבר...";

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "שגיאה בהתחברות.");
    }

    saveUser(data.user);

    loginStatus.textContent = rememberMe?.checked
      ? "✅ התחברת והמשתמש ייזכר בדפדפן זה."
      : "✅ התחברת בהצלחה.";

    renderAuthStatus();
    showScreen(screenBasket);
  } catch (error) {
    loginStatus.textContent = error.message || "שגיאה בהתחברות.";
  } finally {
    loginBtn.disabled = false;
  }
});

authSaveBtn?.addEventListener("click", async () => {
  const email = authEmail.value.trim();
  const phone = authPhone.value.trim();
  const name = authName.value.trim();
  const city = authCity.value.trim();
  const password = authPassword.value.trim();

  if (!email || !phone || !name || !city || !password) {
    authStatus.textContent = "יש למלא את כל השדות.";
    return;
  }

  const passwordHasLetter = /[A-Za-z]/.test(password);
  const passwordHasNumber = /\d/.test(password);

  if (password.length < 6 || !passwordHasLetter || !passwordHasNumber) {
    authStatus.textContent = "הסיסמה חייבת להכיל לפחות 6 תווים, אות אחת ומספר אחד.";
    return;
  }

  try {
    authSaveBtn.disabled = true;
    authStatus.textContent = "שומר משתמש...";

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        city,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "שגיאה בהרשמה.");
    }

    saveUser(data.user);

    renderAuthStatus();
    authStatus.textContent = "✅ נרשמת בהצלחה.";
    showScreen(screenBasket);
  } catch (error) {
    authStatus.textContent = error.message || "שגיאה בהרשמה.";
  } finally {
    authSaveBtn.disabled = false;
  }
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
// סלים שמורים מול Supabase דרך Backend
// =================================================
const savedLoginNotice = document.getElementById("savedLoginNotice");
const savedContent = document.getElementById("savedContent");
const savedBasketsList = document.getElementById("savedBasketsList");
const saveCurrentBasketBtn = document.getElementById("saveCurrentBasketBtn");
const saveBasketFromBuilderBtn = document.getElementById("saveBasketFromBuilderBtn");

function getSavedBasketProductLabel(item) {
  const product = findProduct(item.productId);
  const name = product?.name ?? item.productId;
  const unit = product?.unit ?? "";
  return `${name} · ${item.qty} ${unit}`;
}

function requireLoggedUser(messageTarget = savedStatus) {
  const user = getUser();

  if (!user?.id) {
    if (messageTarget) {
      messageTarget.textContent = "יש להתחבר לפני שימוש בסלים שמורים.";
    }
    showScreen(screenAuthLogin);
    return null;
  }

  return user;
}

async function fetchSavedBaskets() {
  const user = getUser();

  if (!user?.id) {
    savedLoginNotice?.classList.remove("hidden");
    savedContent?.classList.add("hidden");
    return;
  }

  savedLoginNotice?.classList.add("hidden");
  savedContent?.classList.remove("hidden");

  if (savedStatus) savedStatus.textContent = "טוען סלים שמורים...";

  try {
    const response = await fetch(`${API_BASE_URL}/api/baskets/${user.id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "שגיאה בטעינת הסלים.");
    }

    renderSavedBaskets(data.baskets || []);

    if (savedStatus) {
      savedStatus.textContent = data.baskets?.length
        ? `נמצאו ${data.baskets.length} סלים שמורים.`
        : "אין עדיין סלים שמורים.";
    }
  } catch (error) {
    if (savedStatus) savedStatus.textContent = error.message || "שגיאה בטעינת הסלים.";
  }
}

function renderSavedBaskets(savedBaskets) {
  if (!savedBasketsList) return;

  if (!savedBaskets.length) {
    savedBasketsList.innerHTML = `
      <div class="empty">
        <div class="empty__icon">🧺</div>
        <p>עדיין לא שמרת סלים.</p>
        <small class="muted">בנה סל, לחץ על “שמור סל”, ותוכל לחזור אליו בכל זמן.</small>
      </div>
    `;
    return;
  }

  savedBasketsList.innerHTML = savedBaskets.map(savedBasket => {
    const items = Array.isArray(savedBasket.items) ? savedBasket.items : [];
    const dateText = savedBasket.updated_at
      ? new Date(savedBasket.updated_at).toLocaleDateString("he-IL")
      : "";

    return `
      <article class="saved-basket-card">
        <div class="saved-basket-card__head">
          <div>
            <h3>${escapeHtml(savedBasket.name)}</h3>
            <p class="muted">${items.length} מוצרים · עודכן בתאריך ${escapeHtml(dateText)}</p>
          </div>

          <div class="saved-basket-card__actions">
            <button class="btn primary" type="button" data-saved-action="load" data-id="${escapeHtml(savedBasket.id)}">טען סל</button>
            <button class="btn danger" type="button" data-saved-action="delete" data-id="${escapeHtml(savedBasket.id)}">מחק</button>
          </div>
        </div>

        <details class="saved-basket-card__details">
          <summary>הצג פריטים בסל</summary>
          <ul>
            ${items.map(item => `<li>${escapeHtml(getSavedBasketProductLabel(item))}</li>`).join("")}
          </ul>
        </details>
      </article>
    `;
  }).join("");

  savedBasketsList.querySelectorAll("[data-saved-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.savedAction;
      const id = btn.dataset.id;
      const selectedBasket = savedBaskets.find(x => x.id === id);

      if (!selectedBasket) return;

      if (action === "load") {
        basket = Array.isArray(selectedBasket.items) ? selectedBasket.items : [];
        renderBasket();
        renderProductOptions();
        updateNavCartCount();
        if (savedStatus) savedStatus.textContent = `✅ הסל "${selectedBasket.name}" נטען לעגלה.`;
        showScreen(screenBasket);
      }

      if (action === "delete") {
        deleteSavedBasket(selectedBasket.id);
      }
    });
  });
}

async function saveCurrentBasket() {
  const user = requireLoggedUser();
  if (!user) return;

  if (!basket.length) {
    await openAppModal({
      type: "danger",
      icon: "🧺",
      title: "שמירת סל",
      text: "לא ניתן לשמור סל ריק. הוסף לפחות מוצר אחד לסל ואז נסה שוב.",
      confirmText: "הבנתי",
      cancelText: "ביטול"
    });
    return;
  }

  const name = await openAppModal({
    icon: "💾",
    title: "שמירת סל",
    text: "בחר שם ברור לסל כדי שתוכל לזהות אותו בקלות בהמשך.",
    confirmText: "שמור סל",
    cancelText: "ביטול",
    input: true,
    inputLabel: "שם הסל",
    inputPlaceholder: "לדוגמה: סל שבועי למשפחה",
    inputValue: "הסל השבועי שלי",
    inputHint: "מומלץ לבחור שם קצר וברור.",
    validate: (value) => {
      if (!value) return "יש להזין שם לסל.";
      if (value.length < 2) return "שם הסל קצר מדי.";
      if (value.length > 40) return "שם הסל יכול להכיל עד 40 תווים.";
      return "";
    }
  });

  if (!name) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/baskets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        name: name.trim(),
        items: basket
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "שגיאה בשמירת הסל.");
    }

    if (savedStatus) savedStatus.textContent = `✅ הסל "${data.basket.name}" נשמר.`;
    await fetchSavedBaskets();
  } catch (error) {
    await openAppModal({
      type: "danger",
      icon: "⚠️",
      title: "שגיאה בשמירת הסל",
      text: error.message || "שגיאה בשמירת הסל.",
      confirmText: "הבנתי",
      cancelText: "ביטול"
    });
  }
}

async function deleteSavedBasket(basketId) {
  const user = requireLoggedUser();
  if (!user) return;

  const approved = await openAppModal({
    type: "danger",
    icon: "🗑️",
    title: "מחיקת סל שמור",
    text: "הפעולה תמחק את הסל מהרשימה שלך. לא ניתן לשחזר את הסל לאחר המחיקה.",
    confirmText: "מחק סל",
    cancelText: "ביטול"
  });

  if (!approved) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/baskets/${basketId}?userId=${encodeURIComponent(user.id)}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "שגיאה במחיקת הסל.");
    }

    if (savedStatus) savedStatus.textContent = "🗑️ הסל נמחק.";
    await fetchSavedBaskets();
  } catch (error) {
    await openAppModal({
      type: "danger",
      icon: "⚠️",
      title: "שגיאה במחיקת הסל",
      text: error.message || "שגיאה במחיקת הסל.",
      confirmText: "הבנתי",
      cancelText: "ביטול"
    });
  }
}

aboutBackBtn?.addEventListener("click", () => showScreen(screenBasket));
savedBackBtn?.addEventListener("click", () => showScreen(screenBasket));
saveCurrentBasketBtn?.addEventListener("click", saveCurrentBasket);
saveBasketFromBuilderBtn?.addEventListener("click", saveCurrentBasket);

document.querySelectorAll("[data-business-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.businessScroll;

    if (target === "pricing") {
      document.getElementById("businessPricing")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    if (target === "contact") {
      document.getElementById("businessContact")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

document.getElementById("businessForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  await openAppModal({
    icon: "🤝",
    title: "הפנייה נקלטה",
    text: "בגרסת ההדגמה הפנייה לא נשלחת עדיין לשרת. בשלב הבא ניתן לחבר את הטופס ל-Backend ולשמור פניות של בעלי עסקים במסד הנתונים.",
    confirmText: "הבנתי",
    cancelText: "ביטול"
  });

  event.target.reset();
});

async function loadProductsFromDb() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "שגיאה בטעינת מוצרים.");
    }

    if (Array.isArray(data.products) && data.products.length > 0) {
      PRODUCTS = data.products;
    }
  } catch (error) {
    console.warn("Using fallback products:", error.message);
    PRODUCTS = FALLBACK_PRODUCTS;
  }
}

// =================================================
// אתחול
// =================================================
async function init() {
  initCityAutocomplete();
  await loadProductsFromDb();
  renderProductOptions();
  renderBasket();
  updateNavCartCount();
  renderAuthStatus();
  showScreen(screenBasket);
}

init();
