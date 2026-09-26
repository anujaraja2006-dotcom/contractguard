// MARS Calendar Interactive Engine

document.addEventListener("DOMContentLoaded", function () {
  // Navigation & State
  let currentView = "Week";
  let activeWorkspace = "all";
  let activeCategory = "all";
  let currentDayOffset = 0;

  const drawer = document.getElementById("eventDetailDrawer");
  const drawerCloseBtn = document.getElementById("closeDrawerBtn");
  const modal = document.getElementById("addEventModal");
  const openModalBtn = document.getElementById("openAddEventBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const searchInput = document.getElementById("calendarSearchInput");
  const refreshBtn = document.getElementById("calendarRefreshBtn");

  // Open Drawer with Event Data
  window.openEventDetails = function (cardElement) {
    const title = cardElement.getAttribute("data-title") || "Contract Event";
    const type = cardElement.getAttribute("data-type") || "Review";
    const contract = cardElement.getAttribute("data-contract") || "Enterprise Contract";
    const time = cardElement.getAttribute("data-time") || "10:00 AM";
    const owner = cardElement.getAttribute("data-owner") || "Anuja";
    const status = cardElement.getAttribute("data-status") || "Active";
    const desc = cardElement.getAttribute("data-desc") || "Contract milestone and renewal tracking item.";
    const days = cardElement.getAttribute("data-days") || "30";

    document.getElementById("drawerTitle").textContent = title;
    document.getElementById("drawerType").textContent = type;
    document.getElementById("drawerContract").textContent = contract;
    document.getElementById("drawerTime").textContent = time;
    document.getElementById("drawerOwner").textContent = owner;
    document.getElementById("drawerStatus").textContent = status;
    document.getElementById("drawerDesc").textContent = desc;
    document.getElementById("drawerDays").textContent = `${days} days`;

    drawer.classList.add("open");
  };

  // Close Drawer
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener("click", function () {
      drawer.classList.remove("open");
    });
  }

  // Open Add Event Modal
  if (openModalBtn) {
    openModalBtn.addEventListener("click", function () {
      modal.classList.add("open");
    });
  }

  // Close Modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      modal.classList.remove("open");
    });
  }

  // View Selector (Month, Week, Day, Year)
  document.querySelectorAll(".view-option").forEach((opt) => {
    opt.addEventListener("click", function () {
      document.querySelectorAll(".view-option").forEach((o) => o.classList.remove("active"));
      this.classList.add("active");
      currentView = this.getAttribute("data-view");
      const url = new URL(window.location.href);
      url.searchParams.set("view", currentView);
      window.location.href = url.toString();
    });
  });

  // Filter: Workspace Nav Items
  document.querySelectorAll(".sidebar-nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      const ws = this.getAttribute("data-workspace");
      const url = new URL(window.location.href);
      if (ws === activeWorkspace) {
        url.searchParams.delete("workspace");
      } else {
        url.searchParams.set("workspace", ws);
      }
      window.location.href = url.toString();
    });
  });

  // Filter: Category Items
  document.querySelectorAll(".sidebar-category-item").forEach((item) => {
    item.addEventListener("click", function () {
      const cat = this.getAttribute("data-category");
      const url = new URL(window.location.href);
      if (cat === activeCategory) {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", cat);
      }
      window.location.href = url.toString();
    });
  });

  // Live Search Filtering
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll(".event-card").forEach((card) => {
        const text = (
          card.getAttribute("data-title") +
          " " +
          card.getAttribute("data-contract") +
          " " +
          card.getAttribute("data-owner")
        ).toLowerCase();
        if (!q || text.includes(q)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Refresh Button Simulation
  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      refreshBtn.style.transform = "rotate(360deg)";
      refreshBtn.style.transition = "transform 0.5s ease";
      setTimeout(() => {
        refreshBtn.style.transform = "none";
        window.location.reload();
      }, 500);
    });
  }

  // Today Button
  const todayBtn = document.getElementById("btnToday");
  if (todayBtn) {
    todayBtn.addEventListener("click", function () {
      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      url.searchParams.set("view", "Week");
      window.location.href = url.toString();
    });
  }

  // Live Clock Ticker
  const liveClockEl = document.getElementById("liveTimeText");
  if (liveClockEl) {
    function updateLiveClock() {
      const now = new Date();
      liveClockEl.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
  }

  // Multi-Year Switcher chips
  const yearChips = document.querySelectorAll(".year-chip");
  yearChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      yearChips.forEach((c) => {
        c.style.background = "none";
        c.style.color = "#64748B";
        c.style.fontWeight = "normal";
      });
      chip.style.background = "#C84B31";
      chip.style.color = "#FFFFFF";
      chip.style.borderRadius = "4px";
      chip.style.fontWeight = "bold";
    });
  });
});
