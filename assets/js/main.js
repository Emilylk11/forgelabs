// Simple, clean JS: renders “Coming Soon” products + handles drawer + email capture + smooth scroll.
const PRODUCTS = [
  {
    id: "p1",
    name: "Reta Trutide",
    priceLabel: "Coming soon",
    tag: "Popular",
    desc: "Launching soon. Join the list for first access and updates.",
    chips: ["Fast ship", "Clear policies", "Support"],
  },
  {
    id: "p2",
    name: "Product 2",
    priceLabel: "Coming soon",
    tag: "Coming soon",
    desc: "Placeholder product. Swap name/copy later.",
    chips: ["Docs", "Tracked", "Discrete"],
  },
  {
    id: "p3",
    name: "Product 3",
    priceLabel: "Coming soon",
    tag: "Coming soon",
    desc: "Placeholder product. Swap name/copy later.",
    chips: ["Docs", "Support", "Simple"],
  }
];

function $(sel){ return document.querySelector(sel); }
function el(tag, cls){ const e=document.createElement(tag); if(cls) e.className=cls; return e; }

function renderProducts(){
  const grid = $("#productGrid");
  if(!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product" data-id="${p.id}">
      <div class="thumb">
        <div class="thumbTag">${p.tag}</div>
        <div class="thumbArt">${p.name}</div>
      </div>
      <div class="pBody">
        <div class="pTitle">
          <div>
            <h3>${p.name}</h3>
            <div class="small" style="margin-top:4px;">${p.priceLabel}</div>
          </div>
          <div class="price">—</div>
        </div>
        <p class="pDesc">${p.desc}</p>
        <div class="chips">${p.chips.map(c => `<span class="chip">${c}</span>`).join("")}</div>
        <div class="pActions">
          <div class="status">Coming Soon</div>
        </div>
      </div>
    </article>
  `).join("");
}

// Drawer (kept minimal for now)
const drawerOverlay = $("#drawerOverlay");
$("#openCartBtn")?.addEventListener("click", () => {
  if(drawerOverlay) drawerOverlay.style.display = "flex";
});
$("#closeCartBtn")?.addEventListener("click", () => {
  if(drawerOverlay) drawerOverlay.style.display = "none";
});
drawerOverlay?.addEventListener("click", (e) => {
  if(e.target === drawerOverlay) drawerOverlay.style.display = "none";
});

// Smooth scroll buttons
document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-scroll");
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Email capture demo
$("#emailBtn")?.addEventListener("click", () => {
  const input = $("#emailInput");
  const msg = $("#emailMsg");
  const v = (input?.value || "").trim();
  if(!msg || !input) return;

  if(!v || !v.includes("@")){
    msg.textContent = "Drop a valid email pls 😌";
    msg.style.color = "var(--warn)";
    return;
  }
  msg.textContent = "You’re on the list. We’ll only email for launches/restocks.";
  msg.style.color = "var(--brand2)";
  input.value = "";
});

// Init
$("#year").textContent = new Date().getFullYear();
renderProducts();
