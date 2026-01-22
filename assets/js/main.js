/* =========================
   Site JS — clean + reliable
   ========================= */

(() => {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const money = (v) => {
    const n = toNumber(v);
    return n === null ? String(v) : n.toFixed(2);
  };

  const displayMoney = (v) => {
    const n = toNumber(v);
    return n === null ? `$${v}` : `$${n.toFixed(2)}`;
  };

  // ---------- 1) Footer year ----------
  function initYear() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------- 2) Email capture (demo) ----------
  function initEmailCapture() {
    const form = $("#emailForm");
    const input = $("#emailInput");
    const msg = $("#emailMsg");

    if (!form || !input || !msg) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (input.value || "").trim();

      if (!v || !v.includes("@")) {
        msg.textContent = "Please enter a valid email.";
        msg.style.color = "var(--brand2)";
        return;
      }

      msg.textContent = "You’re on the list. We’ll only email for restocks/launches.";
      msg.style.color = "var(--brand2)";
      input.value = "";
    });
  }

  // ---------- 3) Mouse-follow glow + optional tilt ----------
  function attachMouseGlow(card, { tilt = false } = {}) {
    if (!card) return;

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;

      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);

      if (tilt) {
        const rotateY = ((x - 50) / 50) * 5;
        const rotateX = ((50 - y) / 50) * 5;
        card.style.transform = `translateY(-4px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
      if (tilt) card.style.transform = "";
    });
  }

  function initCardGlows() {
    // Focus cards
    $$("#focus .focus-card").forEach((c) => attachMouseGlow(c, { tilt: true }));

    // Lab card (glow only)
    const labCard = $(".lab-card");
    if (labCard) attachMouseGlow(labCard, { tilt: false });
  }

  // ---------- 4) Variant -> UI + PayPal sync ----------
  /**
   * This supports both patterns:
   * - Select with id="retaVariant" (legacy)
   * - Select with class="variant-select" (recommended)
   *
   * It will update price text AND PayPal hidden fields, using whichever exist:
   * - By name: input[name="amount"], input[name="item_number"], input[name="custom"], input[name="item_name"]
   * - By ids: #ppAmount, #ppItemNumber, #ppCustom, #ppItemName
   * - By data-pp attrs: [data-pp="amount"], [data-pp="sku"], [data-pp="custom"]
   */
  function initVariantPaypalSync() {
    // Find selects (support both)
    const selects = [
      ...$$('select.variant-select'),
      ...($$("#retaVariant").length ? $$("#retaVariant") : []),
    ];

    // If both exist, de-dupe
    const uniqueSelects = Array.from(new Set(selects));
    if (!uniqueSelects.length) return;

    uniqueSelects.forEach((select) => {
      // Prefer scoping to a product container if present
      const scope =
        select.closest(".product-card") ||
        select.closest(".card") ||
        select.closest("section") ||
        document;

      // Price element: prefer exact id, otherwise any .product-price inside same scope
      const priceEl = $("#retaPriceDisplay", scope) || $(".product-price", scope);

      // Optional title element (only if you have it)
      const titleEl = $("#retaTitle", scope);

      // PayPal form (scoped)
      const form = $("form.paypal-form", scope) || $("form[action*='paypal.com']", scope);

      // Resolve PayPal inputs (try multiple conventions)
      const ppAmount =
        (form && $('input[name="amount"]', form)) ||
        $("#ppAmount", scope) ||
        (form && $('[data-pp="amount"]', form));

      const ppSku =
        (form && $('input[name="item_number"]', form)) ||
        $("#ppItemNumber", scope) ||
        (form && $('[data-pp="sku"]', form));

      const ppCustom =
        (form && $('input[name="custom"]', form)) ||
        $("#ppCustom", scope) ||
        (form && $('[data-pp="custom"]', form));

      const ppItemName =
        (form && $('input[name="item_name"]', form)) ||
        $("#ppItemName", scope);

      // If no priceEl, we can still sync PayPal — but ideally you have one
      const baseTitle = titleEl ? titleEl.textContent.trim() : null;

      function sync() {
        const opt = select.options[select.selectedIndex];
        if (!opt) return;

        const price = opt.dataset.price || "0.00";
        const sku = opt.dataset.sku || "";
        const label = opt.dataset.label || opt.textContent.trim();

        // UI updates
        if (priceEl) priceEl.textContent = displayMoney(price);

        // Optional title update (keeps your old behavior, but safer)
        if (titleEl && baseTitle) {
          const cleanBase = baseTitle.split("(")[0].trim();
          titleEl.textContent = `${cleanBase} (${label})`;
        }

        // PayPal updates
        if (ppAmount) ppAmount.value = money(price);
        if (ppSku && sku) ppSku.value = sku;
        if (ppCustom) ppCustom.value = `Variant: ${label}`;

        // Optional: show selected variant in PayPal checkout name
        if (ppItemName) {
          // If you're selling shoes, rename this to match your product:
          // e.g., `Shoe Model – Size ${label}`
          ppItemName.value = `${label}`;
        }
      }

      // If your HTML changes selection via other UI later, this still works
      select.addEventListener("change", sync);
      sync(); // initialize
    });
  }

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initEmailCapture();
    initCardGlows();
    initVariantPaypalSync();
  });
})();

// ===========================
// Age + Research Use Gate
// ===========================
(function gateInit(){
  const KEY = "forge_gate_v1"; // bump version if you ever want to re-show it

  const gate = document.getElementById("gate");
  if(!gate) return;

  const age = document.getElementById("gateAge");
  const research = document.getElementById("gateResearch");
  const accept = document.getElementById("gateAccept");
  const leave = document.getElementById("gateLeave");
  const err = document.getElementById("gateError");

  const openGate = () => {
    gate.classList.add("is-open");
    document.body.classList.add("gate-open");
    // put focus on first checkbox for accessibility
    setTimeout(() => age && age.focus(), 0);
  };

  const closeGate = () => {
    gate.classList.remove("is-open");
    document.body.classList.remove("gate-open");
  };

  // If already accepted, don't show
  try{
    if(localStorage.getItem(KEY) === "1"){
      closeGate();
      return;
    }
  }catch(e){
    // If storage is blocked, still show gate (best effort)
  }

  openGate();

  const validate = () => {
    const ok = !!(age && age.checked && research && research.checked);
    if(err) err.textContent = ok ? "" : "Please confirm both checkboxes to continue.";
    return ok;
  };

  if(age) age.addEventListener("change", validate);
  if(research) research.addEventListener("change", validate);

  if(accept){
    accept.addEventListener("click", () => {
      if(!validate()) return;
      try{ localStorage.setItem(KEY, "1"); }catch(e){}
      closeGate();
    });
  }

  if(leave){
    leave.addEventListener("click", () => {
      // send them away (you can change this to any URL you want)
      window.location.href = "about:blank";
    });
  }

  // Optional: prevent closing with ESC (keeps it a true gate)
  document.addEventListener("keydown", (e) => {
    if(gate.classList.contains("is-open") && e.key === "Escape"){
      e.preventDefault();
    }
  });
})();

function initVariantPillsPaypalSync() {
  const groups = document.querySelectorAll(".variant-pills[data-variants]");
  if (!groups.length) return;

  groups.forEach((group) => {
    const scope = group.closest(".product-card") || document;

    const priceEl = scope.querySelector(".product-price");
    const form = scope.querySelector("form.paypal-form") || scope.querySelector("form[action*='paypal.com']");

    const ppAmount = form && (form.querySelector('input[name="amount"]') || form.querySelector('[data-pp="amount"]'));
    const ppSku    = form && (form.querySelector('input[name="item_number"]') || form.querySelector('[data-pp="sku"]'));
    const ppCustom = form && (form.querySelector('input[name="custom"]') || form.querySelector('[data-pp="custom"]'));

    const hiddenValue = scope.querySelector("[data-variant-value]");

    const pills = Array.from(group.querySelectorAll(".variant-pill"));
    if (!pills.length) return;

    const money = (v) => String(v || "0").replace(/[^\d.]/g, "");
    const displayMoney = (v) => {
      const n = Number(money(v) || 0);
      return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
    };

    const setActive = (pill) => {
      pills.forEach((p) => p.classList.toggle("is-active", p === pill));

      const price = pill.dataset.price || "0.00";
      const sku = pill.dataset.sku || "";
      const label = pill.dataset.label || pill.textContent.trim();

      if (priceEl) priceEl.textContent = displayMoney(price);
      if (ppAmount) ppAmount.value = money(price);
      if (ppSku && sku) ppSku.value = sku;
      if (ppCustom) ppCustom.value = `Variant: ${label}`;
      if (hiddenValue) hiddenValue.value = label;
    };

    pills.forEach((pill) => pill.addEventListener("click", () => setActive(pill)));

    // initialize (use existing active pill or first)
    setActive(pills.find((p) => p.classList.contains("is-active")) || pills[0]);
  });
}

function initVariantSyncUniversal() {
  // Helper: money formatting
  const money = (v) => String(v || "0").replace(/[^\d.]/g, "");
  const displayMoney = (v) => {
    const n = Number(money(v) || 0);
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  };

  const updateScope = (scope, { price, sku, label }) => {
    const priceEl = scope.querySelector(".product-price");
    const form = scope.querySelector("form.paypal-form") || scope.querySelector("form[action*='paypal.com']");

    const ppAmount = form && (form.querySelector('input[name="amount"]') || form.querySelector('[data-pp="amount"]'));
    const ppSku    = form && (form.querySelector('input[name="item_number"]') || form.querySelector('[data-pp="sku"]'));
    const ppCustom = form && (form.querySelector('input[name="custom"]') || form.querySelector('[data-pp="custom"]'));

    const hiddenValue = scope.querySelector("[data-variant-value]");

    if (priceEl) priceEl.textContent = displayMoney(price);
    if (ppAmount) ppAmount.value = money(price);
    if (ppSku && sku) ppSku.value = sku;
    if (ppCustom) ppCustom.value = `Size: ${label}`; // matches your HTML wording
    if (hiddenValue) hiddenValue.value = label;
  };

  // -------------------------
  // 1) PILL GROUPS
  // -------------------------
  const pillGroups = document.querySelectorAll(".variant-pills[data-variants]");
  pillGroups.forEach((group) => {
    const scope = group.closest(".product-card") || document;
    const pills = Array.from(group.querySelectorAll(".variant-pill"));
    if (!pills.length) return;

    const setActive = (pill) => {
      pills.forEach((p) => p.classList.toggle("is-active", p === pill));
      updateScope(scope, {
        price: pill.dataset.price || "0.00",
        sku: pill.dataset.sku || "",
        label: pill.dataset.label || pill.textContent.trim()
      });
    };

    pills.forEach((pill) => pill.addEventListener("click", () => setActive(pill)));
    setActive(pills.find((p) => p.classList.contains("is-active")) || pills[0]);
  });

  // -------------------------
  // 2) DROPDOWNS
  // -------------------------
  const selects = document.querySelectorAll("select.variant-select");
  selects.forEach((select) => {
    const scope = select.closest(".product-card") || document;

    const applySelected = () => {
      const opt = select.options[select.selectedIndex];
      if (!opt) return;

      updateScope(scope, {
        price: opt.dataset.price || "0.00",
        sku: opt.dataset.sku || "",
        label: opt.dataset.label || opt.textContent.trim()
      });
    };

    select.addEventListener("change", applySelected);
    applySelected(); // init
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initEmailCapture();
  initCardGlows();

  initVariantSyncUniversal(); // ✅ handles pills + dropdowns
});

