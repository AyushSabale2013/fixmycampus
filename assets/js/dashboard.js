function getIssues() {
  return JSON.parse(localStorage.getItem("issues")) || [];
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

const user = getCurrentUser();

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("userName").innerText = user.name;
document.getElementById("userEmail").innerText = user.email;

let issues = getIssues();

// sort by score
issues.sort((a, b) => b.score - a.score);

// keep only top 10
issues = issues.slice(0, 10);

function render(list) {
  const box = document.getElementById("dashboard");

  if (list.length === 0) {
    box.innerHTML = "No issues found";
    return;
  }

  box.innerHTML = list.map(i => `
    <div class="issue-card">
      <strong>${i.text}</strong><br>
      ${i.category} | ${i.priority}<br>
      Score: ${i.score}
    </div>
  `).join("");
}

render(issues);

// search
document.getElementById("searchInput").addEventListener("input", function () {
  const q = this.value.toLowerCase();

  const filtered = issues.filter(i =>
    i.text.toLowerCase().includes(q) ||
    i.category.toLowerCase().includes(q) ||
    i.priority.toLowerCase().includes(q)
  );

  render(filtered);
});