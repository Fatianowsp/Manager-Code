document.addEventListener("DOMContentLoaded", () => {
  fetchManagerDashboardData();
});

function fetchManagerDashboardData() {
  fetch("/api/manager/active_jobs")
      .then(res => res.json())
      .then(data => {
          const { active_summary, di_summary, totals } = data;

          buildSummaryMetrics(totals, "summary-metrics");      // Active Job Metrics
          buildJobCards(active_summary, "active-jobs");         // Active Job Cards
          buildSidebarMetrics(totals, 'job-summary-sidebar');

          buildSummaryMetrics(totals, "di-summary-metrics", true); // D&I Metrics (can later be separate)
          buildJobCards(di_summary, "di-jobs", true);           // D&I Job Cards
      })
      .catch(err => console.error("Failed to load manager dashboard data:", err));
}
function buildSidebarMetrics(totals, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sidebarMetrics = [
      { label: "Total Jobs", value: totals.total_jobs },
      { label: "Order Value", value: `$${totals.total_order_value}` },
      { label: "Profit Value", value: `$${totals.total_profit_value}` },
      { label: "Avg Profit Margin", value: `${totals.average_profit_margin}%` }
  ];

  sidebarMetrics.forEach(metric => {
      const card = document.createElement("div");
      card.className = "metric-card sidebar";
      card.innerHTML = `
          <div class="metric-value">${metric.value}</div>
          <div class="metric-label">${metric.label}</div>
      `;
      container.appendChild(card);
  });
}

// 🔹 Render Summary Metric Cards
function buildSummaryMetrics(totals, containerId, isDI = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  // Prioritized metrics first
  const metrics = [
      { label: "Planned Hours", value: totals.total_planned_hours, size: "large" },
      { label: "Actual Hours", value: totals.total_actual_hours, size: "large" },
      { label: "Projected Hours", value: totals.total_projected_hours, size: "medium" },
      { label: "Planned Cost", value: `$${totals.total_planned_cost}`, size: "medium" },
      { label: "Actual Cost", value: `$${totals.total_actual_cost}`, size: "medium" },
      { label: "Projected Cost", value: `$${totals.total_projected_cost}`, size: "medium" },
  ];

  metrics.forEach(metric => {
      const card = document.createElement("div");
      card.className = `metric-card ${metric.size} ${isDI ? "di" : ""}`;
      card.innerHTML = `
          <div class="metric-value">${metric.value}</div>
          <div class="metric-label">${metric.label}</div>
      `;
      container.appendChild(card);
  });
}


// 🛠️ Render Job Cards (Active or D&I)
function buildJobCards(jobs, containerId, isDI = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  jobs.forEach(job => {
    const profitMargin = parseFloat((job.profit_margin || "0").replace('%', '')) || 0;
    const actual = parseFloat(job.total_actual_hours.replace(',', '')) || 0;
    const planned = parseFloat(job.total_planned_hours.replace(',', '')) || 0;

    let performanceClass = '';
    if (profitMargin < 5 || actual > planned * 1.2) {
      performanceClass = 'bad';
    } else if (profitMargin < 12 || actual > planned) {
      performanceClass = 'warning';
    } else {
      performanceClass = 'good';
    }

    const card = document.createElement("div");
    card.className = `job-card ${performanceClass}`;

    // Unique IDs for inputs
    const refId = `ref-${job.job_number}`;
    const dateId = `date-${job.job_number}`;

    card.innerHTML = `
      <div class="job-card-body">

        <!-- Reference Title -->
        <div class="job-header">
          <input id="${refId}" class="ref-input" type="text"
            value="${job.reference_name || ''}"
            placeholder="Add Reference Name"
            onchange="saveReferenceName('${job.job_number}', this.value)" />
        </div>

        <!-- Meta Info -->
        <div class="job-meta">
          <div class="job-customer">${job.customer}</div>
          <div class="job-number">#${job.job_number}</div>
        </div>

        <!-- Due Date (editable) -->
        <div class="job-due">
          <label for="${dateId}">Due Date:</label>
          <input id="${dateId}" class="due-input" type="date"
            value="${job.due_date || ''}"
            onchange="saveDueDate('${job.job_number}', this.value)" />
        </div>

        <!-- Performance -->
        <div class="job-profit">
          <span>Profit Margin:</span>
          <strong>${job.profit_margin}</strong>
        </div>

        <!-- Hours Cluster -->
        <div class="job-hours">
          <div><span>Planned:</span> ${job.total_planned_hours} hrs</div>
          <div><span>Actual:</span> ${job.total_actual_hours} hrs</div>
          <div><span>Projected:</span> ${job.projected_hours} hrs</div>
        </div>

        <button class="expand-button" onclick="viewJobDetails('${job.job_number}')">
          View Details
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}
function saveReferenceName(jobNumber, newValue) {
  fetch('/api/save_reference_name', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_number: jobNumber, reference_name: newValue })
  });
}

function saveDueDate(jobNumber, newValue) {
  fetch('/api/save_due_date', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_number: jobNumber, due_date: newValue })
  });
}


// Placeholder for future expansion modal/page
function viewJobDetails(jobNumber) {
  alert(`🛠️ View job details for ${jobNumber} – modal coming soon!`);
}

// 🔗 Navigate to the Job KPI page
function viewJobDetails(jobNumber) {
  if (!jobNumber) {
    console.warn("No job number provided to viewJobDetails()");
    return;
  }
  window.location.href = `/job_kpi/${jobNumber}`;
}
