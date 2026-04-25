// dashboard.js

const user = getUser();

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("user").innerText = "Welcome, " + user;

function loadDashboard() {
  const issues = getIssues();
  const container = document.getElementById("dashboard");

  container.innerHTML = "";

  if (issues.length === 0) {
    container.innerHTML = "<p>No issues yet</p>";
    return;
  }

  issues.slice(-10).reverse().forEach(issue => {
    container.innerHTML += `
      <div class="issue-card">
        <strong>${issue.text}</strong><br>

        <small>
          ${issue.category} | ${issue.priority} | ${issue.status}
        </small><br>

        <small>Score: ${issue.score}</small>
      </div>
    `;
  });
}

loadDashboard();