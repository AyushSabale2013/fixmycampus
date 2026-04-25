// activity.js

const user = getUser();

if (!user) {
  window.location.href = "login.html";
}

function loadActivity() {
  const issues = getIssues();
  const container = document.getElementById("activity");

  container.innerHTML = "";

  const myIssues = issues.filter(issue => issue.user === user);

  if (myIssues.length === 0) {
    container.innerHTML = "<p>No activity yet</p>";
    return;
  }

  myIssues.forEach((issue, index) => {
    container.innerHTML += `
      <div class="issue-card">
        <strong>${issue.text}</strong><br>

        <small>
          ${issue.category} | ${issue.priority}
        </small><br>

        <small>Status: ${issue.status}</small><br>
        <small>Score: ${issue.score}</small><br>

        ${
          issue.status === "Pending"
            ? `<button onclick="resolveIssue(${index})">Mark Resolved</button>`
            : ""
        }
      </div>
    `;
  });
}

function resolveIssue(index) {
  let issues = getIssues();

  // only user's filtered list index → map correctly
  let userIssues = issues
    .map((issue, i) => ({ issue, i }))
    .filter(obj => obj.issue.user === user);

  let realIndex = userIssues[index].i;

  issues[realIndex].status = "Resolved";

  saveIssues(issues);
  loadActivity();
}

loadActivity();