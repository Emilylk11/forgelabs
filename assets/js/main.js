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

// Mouse-follow glow (and optional tilt)
(() => {
  const cards = document.querySelectorAll("#categories .card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);

      // Optional: subtle tilt
      const rotateY = ((x - 50) / 50) * 6; // -6 to 6
      const rotateX = ((50 - y) / 50) * 6; // -6 to 6
      card.classList.add("tilt-active");
      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("tilt-active");
      card.style.transform = ""; // fall back to your CSS hover transform
    });
  });
})();

// Interactive card glow (mouse-follow highlight)
(function cardGlow() {
  const cards = document.querySelectorAll("#categories .card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;

      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });

    card.addEventListener("mouseleave", () => {
      // Optional: reset so it doesn't "freeze" at last position
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    });
  });
})();
