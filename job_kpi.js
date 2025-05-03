document.addEventListener("DOMContentLoaded", () => {
    console.log("📊 Job KPI JS Loaded");
  
    // 🔹 Render Bar Chart
    const data = window.kpiChartData;
    const ctx = document.getElementById("workCenterChart");
    if (data && ctx) {
      new Chart(ctx.getContext("2d"), {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Planned Hours",
              data: data.planned,
              backgroundColor: "rgba(52, 152, 219, 0.7)"
            },
            {
              label: "Actual Hours",
              data: data.actual,
              backgroundColor: "rgba(231, 76, 60, 0.7)"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 2.2,
          plugins: {
            legend: {
              position: "top"
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Hours"
              },
              beginAtZero: true
            },
            x: {
              title: {
                display: true,
                text: "Work Center"
              }
            }
          }
        }
      });
    }
  
    // 🔸 Overrun Panel Slide-out
    const toggleBtn = document.getElementById("toggleOverruns");
    const panel = document.getElementById("overrunPanel");
    const closeBtn = document.getElementById("closeOverruns");
  
    if (toggleBtn && panel && closeBtn) {
      toggleBtn.addEventListener("click", () => {
        console.log("👉 Opening panel...");
        panel.classList.add("visible");
      });
  
      closeBtn.addEventListener("click", () => {
        console.log("👈 Closing panel...");
        panel.classList.remove("visible");
      });
  
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          panel.classList.remove("visible");
        }
      });
    } else {
      console.warn("❌ Panel toggle elements not found.");
    }
  });

  const costBtn = document.getElementById("toggleCostDrivers");
const costPanel = document.getElementById("costDriverPanel");
const closeCostBtn = document.getElementById("closeCostDrivers");

if (costBtn && costPanel && closeCostBtn) {
  costBtn.addEventListener("click", () => {
    console.log("👉 Opening cost driver panel...");
    costPanel.classList.add("visible");
  });

  closeCostBtn.addEventListener("click", () => {
    costPanel.classList.remove("visible");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      costPanel.classList.remove("visible");
    }
  });
}


const wcTrendBtn = document.getElementById("toggleWCTrends");
const wcTrendPanel = document.getElementById("wcTrendPanel");
const closeWCTrendBtn = document.getElementById("closeWCTrends");

if (wcTrendBtn && wcTrendPanel && closeWCTrendBtn) {
  wcTrendBtn.addEventListener("click", () => {
    console.log("👉 Opening Work Center Trends panel...");
    wcTrendPanel.classList.add("visible");
  });

  closeWCTrendBtn.addEventListener("click", () => {
    wcTrendPanel.classList.remove("visible");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      wcTrendPanel.classList.remove("visible");
    }
  });
}
