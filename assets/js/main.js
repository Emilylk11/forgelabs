// Forge Labs — main.js
(function(){
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Simple email capture (demo only). Replace with your provider later.
  const form = document.getElementById("emailForm");
  const input = document.getElementById("emailInput");
  const msg = document.getElementById("emailMsg");

  if(form && input && msg){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (input.value || "").trim();
      if(!v || !v.includes("@")){
        msg.textContent = "Drop a valid email pls 😌";
        msg.style.color = "var(--brand2)";
        return;
      }
      msg.textContent = "You’re on the list. We’ll only email for restocks/launches.";
      msg.style.color = "var(--brand2)";
      input.value = "";
    });
  }
})();

// Focus cards: mouse-follow glow (+ optional tilt)
(() => {
  const cards = document.querySelectorAll("#focus .focus-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;

      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);

      // Optional tilt (comment out if you don’t want it)
      const rotateY = ((x - 50) / 50) * 5;
      const rotateX = ((50 - y) / 50) * 5;
      card.style.transform = `translateY(-4px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
      card.style.transform = "";
    });
  });
})();

// Optional: subtle mouse-follow glow on the lab card
(() => {
  const card = document.querySelector(".lab-card");
  if (!card) return;

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.removeProperty("--mouse-x");
    card.style.removeProperty("--mouse-y");
  });
})();

(function () {
  const variant = document.getElementById("retaVariant");
  const priceEl = document.getElementById("retaPriceDisplay");

  const ppItemName = document.getElementById("ppItemName");
  const ppItemNumber = document.getElementById("ppItemNumber");
  const ppAmount = document.getElementById("ppAmount");
  const ppCustom = document.getElementById("ppCustom");

  if (!variant || !priceEl || !ppItemName || !ppItemNumber || !ppAmount || !ppCustom) return;

  function money(v){
    const n = Number(v);
    if (Number.isNaN(n)) return v;
    return n.toFixed(2);
  }

  function sync() {
    const opt = variant.options[variant.selectedIndex];
    const price = opt.dataset.price || "0.00";
    const sku = opt.dataset.sku || "";
    const label = opt.dataset.label || opt.textContent.trim();

    priceEl.textContent = `$${money(price)}`;

    // Update what PayPal receives
    ppItemName.value = `Retatrutide – Research Product (${label})`;
    ppItemNumber.value = sku || "FL-RT";
    ppAmount.value = money(price);
    ppCustom.value = `Variant: ${label} • Includes essentials`;
  }

  variant.addEventListener("change", sync);
  sync(); // initialize on load
})();

(() => {
  const select = document.getElementById("retaVariant");
  const priceEl = document.getElementById("retaPriceDisplay");
  const titleEl = document.getElementById("retaTitle");

  if (!select || !priceEl) return;

  const baseName = (titleEl?.textContent || "Product").split("(")[0].trim();

  const fmt = (n) => {
    const num = Number(n);
    return Number.isFinite(num) ? `$${num.toFixed(2)}` : `$${n}`;
  };

  const sync = () => {
    const opt = select.options[select.selectedIndex];
    const price = opt.dataset.price;
    const label = opt.dataset.label || opt.textContent.trim();

    // Update the visible price
    priceEl.textContent = fmt(price);

    // Optional: update the title to match selection
    if (titleEl) titleEl.textContent = `${baseName} (${label})`;
  };

  select.addEventListener("change", sync);
  sync(); // set correct price on page load
})();

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("retaVariant");
  const priceEl = document.getElementById("retaPriceDisplay");
  const titleEl = document.getElementById("retaTitle");

  if (!select) return console.warn("Missing #retaVariant");
  if (!priceEl) return console.warn("Missing #retaPriceDisplay");

  const baseName = titleEl ? titleEl.textContent.trim() : "Product";

  const fmt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : `$${v}`;
  };

  function sync(){
    const opt = select.options[select.selectedIndex];
    const price = opt.dataset.price || "0.00";
    const label = opt.dataset.label || opt.textContent.trim();

    priceEl.textContent = fmt(price);
    if (titleEl) titleEl.textContent = `${baseName} (${label})`;
  }

  select.addEventListener("change", sync);
  sync();
});

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("retaVariant");
  const priceEl = document.getElementById("retaPriceDisplay");
  const titleEl = document.getElementById("retaTitle");

  // PayPal hidden fields
  const ppAmount = document.getElementById("ppAmount");
  const ppItemNumber = document.getElementById("ppItemNumber"); // optional
  const ppCustom = document.getElementById("ppCustom");         // optional

  if (!select || !priceEl) return;

  const baseName = titleEl ? titleEl.textContent.trim() : "Product";

  const fmt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : `$${v}`;
  };

  const money = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : String(v);
  };

  function sync(){
    const opt = select.options[select.selectedIndex];
    const price = opt.dataset.price || "0.00";
    const label = opt.dataset.label || opt.textContent.trim();
    const sku = opt.dataset.sku || "";

    // Update UI
    priceEl.textContent = fmt(price);
    if (titleEl) titleEl.textContent = `${baseName} (${label})`;

    // Update PayPal
    if (ppAmount) ppAmount.value = money(price);
    if (ppItemNumber && sku) ppItemNumber.value = sku;
    if (ppCustom) ppCustom.value = `Size: ${label}`;
  }

  select.addEventListener("change", sync);
  sync();

