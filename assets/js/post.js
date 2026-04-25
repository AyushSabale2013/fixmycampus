// post.js

const user = getUser();

if (!user) {
  window.location.href = "login.html";
}

// CLASSIFICATION
function classifyIssue(text) {
  text = text.toLowerCase();

  let matchedCategories = [];
  let priority = "Low";
  let score = 0;

  const categories = {
    Infrastructure: [
      "fan", "water", "electricity", "light", "pipe",
      "leak", "broken", "repair", "maintenance", "washroom"
    ],
    Academics: [
      "exam", "marks", "assignment", "result",
      "lecture", "class", "attendance", "teacher", "professor"
    ],
    Hostel: [
      "hostel", "room", "mess", "warden",
      "bed", "cleaning", "laundry", "wifi", "internet"
    ],
    Security: [
      "security", "theft", "stolen", "fight",
      "harassment", "unsafe", "camera", "cctv", "guard"
    ],
    Health: [
      "food", "mess food", "hygiene", "dirty",
      "sick", "health", "hospital"
    ]
  };

  // FIND ALL MATCHES
  for (let key in categories) {
    if (categories[key].some(word => text.includes(word))) {
      matchedCategories.push(key);
      score += 20;
    }
  }

  // DEFAULT CATEGORY
  if (matchedCategories.length === 0) {
    matchedCategories.push("General");
  }

  // PRIMARY CATEGORY
  let category = matchedCategories[0];

  // PRIORITY
  const highPriority = ["urgent", "danger", "critical", "emergency"];
  const mediumPriority = ["delay", "slow", "problem"];

  if (highPriority.some(word => text.includes(word))) {
    priority = "High";
    score += 40;
  } else if (mediumPriority.some(word => text.includes(word))) {
    priority = "Medium";
    score += 20;
  } else {
    score += 10;
  }

  // CAP
  score = Math.min(score, 100);

  return {
    category,              // primary
    allCategories: matchedCategories, // all matches
    priority,
    score
  };
}

// SUBMIT
function submitIssue() {
  const input = document.getElementById("issueInput");
  const text = input.value.trim();

  if (!text) {
    alert("Please enter issue");
    return;
  }

  const issues = getIssues();
  const result = classifyIssue(text);

  const newIssue = {
    text,
    category: result.category,
    priority: result.priority,
    score: result.score,
    status: "Pending",
    user: user
  };

  issues.push(newIssue);
  saveIssues(issues);

  document.getElementById("resultBox").innerHTML = `
    <div>
      <strong>Issue Submitted!</strong><br>
      Category: ${result.category}<br>
      Priority: ${result.priority}<br>
      Score: ${result.score}
    </div>
  `;

  input.value = "";
}