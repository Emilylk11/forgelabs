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
