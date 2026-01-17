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