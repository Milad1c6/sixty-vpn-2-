(function () {
  const tg = window.Telegram && window.Telegram.WebApp;

  if (tg) {
    tg.ready();
    tg.expand();
  }

  // ---------- Tabs ----------
  const tabButtons = document.querySelectorAll(".tab-btn");
  const screens = document.querySelectorAll(".screen");

  function showScreen(name) {
    screens.forEach((s) => s.classList.toggle("active", s.dataset.screen === name));
    tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.target === name));
    updateMainButton(name);
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => showScreen(btn.dataset.target));
  });

  // ---------- Plans ----------
  const plansContainer = document.getElementById("plans-list");
  let selectedPlanId = null;

  function toFa(n) {
    return n.toLocaleString("fa-IR");
  }

  function formatPrice(toman) {
    return toFa(toman) + " تومان";
  }

  function renderPlans() {
    const plans = window.VPN_PLANS || [];
    plansContainer.innerHTML = "";

    plans.forEach((plan) => {
      const card = document.createElement("div");
      card.className = "plan-card" + (plan.badge ? " has-badge" : "");
      card.dataset.planId = plan.id;

      const volumeLabel = plan.gb > 0 ? `${toFa(plan.gb)} گیگ` : "نامحدود";

      card.innerHTML = `
        ${plan.badge ? `<span class="plan-badge">${plan.badge}</span>` : ""}
        <div class="plan-info">
          <h3>${plan.title}</h3>
          <div class="plan-meta">
            <span>⏱ ${toFa(plan.days)} روز</span>
            <span>📶 ${volumeLabel}</span>
          </div>
        </div>
        <div class="plan-price">
          <b>${toFa(plan.price_toman)}</b>
          <span>تومان</span>
        </div>
      `;

      card.addEventListener("click", () => selectPlan(plan.id));
      plansContainer.appendChild(card);
    });
  }

  function selectPlan(planId) {
    selectedPlanId = planId;
    document.querySelectorAll(".plan-card").forEach((el) => {
      el.classList.toggle("selected", el.dataset.planId === planId);
    });
    updateMainButton("plans");
  }

  // ---------- Telegram MainButton wiring ----------
  function updateMainButton(activeScreen) {
    if (!tg) return;

    if (activeScreen === "plans" && selectedPlanId) {
      const plan = (window.VPN_PLANS || []).find((p) => p.id === selectedPlanId);
      if (plan) {
        tg.MainButton.setText(`خرید — ${formatPrice(plan.price_toman)}`);
        tg.MainButton.show();
        return;
      }
    }

    if (activeScreen === "account") {
      tg.MainButton.setText("مشاهده سرویس‌های من در چت");
      tg.MainButton.show();
      return;
    }

    tg.MainButton.hide();
  }

  function currentActiveScreen() {
    const el = document.querySelector(".screen.active");
    return el ? el.dataset.screen : "plans";
  }

  if (tg) {
    tg.MainButton.onClick(() => {
      const screen = currentActiveScreen();

      if (screen === "plans" && selectedPlanId) {
        tg.sendData(JSON.stringify({ action: "buy", plan_id: selectedPlanId }));
        tg.close();
        return;
      }

      if (screen === "account") {
        tg.sendData(JSON.stringify({ action: "account" }));
        tg.close();
      }
    });
  }

  // ---------- Live status hero: count-up (one orchestrated entrance moment) ----------
  function countUp(el, target, duration) {
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = toFa(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const usersStat = document.getElementById("stat-users");
  const serversStat = document.getElementById("stat-servers");
  if (usersStat) countUp(usersStat, 12480, 1100);
  if (serversStat) countUp(serversStat, 42, 900);

  // ---------- Urgency countdown ----------
  const countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    const STORAGE_KEY = "vpnbot_offer_deadline";
    let deadline = Number(sessionStorage.getItem(STORAGE_KEY));
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + 24 * 60 * 60 * 1000;
      sessionStorage.setItem(STORAGE_KEY, String(deadline));
    }

    function renderCountdown() {
      const diff = Math.max(0, deadline - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = (n) => String(n).padStart(2, "0");
      countdownEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    renderCountdown();
    setInterval(renderCountdown, 1000);
  }

  // ---------- Support tab ----------
  const supportLink = document.getElementById("support-link");
  if (supportLink) {
    supportLink.addEventListener("click", (e) => {
      e.preventDefault();
      const url = supportLink.getAttribute("href");
      if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(url);
      } else {
        window.open(url, "_blank");
      }
    });
  }

  renderPlans();
  showScreen("plans");
})();
