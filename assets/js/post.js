// post.js

const user = getUser();

if (!user) {
  window.location.href = "login.html";
}

// CLASSIFICATION
function classifyIssue(text) {
  text = text.toLowerCase();

  let categoryScores = {};
  let priority = "Low";
  let score = 0;

  const categories = {

    infra: [
      "fan","ceiling","light","bulb","tube","electricity","power","voltage",
      "switch","socket","wire","short circuit","fuse","generator","backup",
      "water","tap","pipe","leak","seepage","drain","sewer","overflow",
      "washroom","toilet","flush","bathroom","geyser","heater",
      "broken","repair","maintenance","damage","crack","wall","ceiling leak",
      "floor","tiles","door","window","lock","handle",
      "lift","elevator","stairs","corridor","classroom","lab equipment"
    ],

    acad: [
      "exam","marks","grades","result","cgpa","assignment","submission",
      "deadline","quiz","midsem","endsem","paper","evaluation","rechecking",
      "lecture","class","attendance","proxy","syllabus","curriculum",
      "professor","teacher","faculty","mentor","hod",
      "notes","slides","ppt","material","course","subject",
      "lab","practical","viva","project","internal","external",
      "timetable","schedule","reschedule","slot","registration",
      "credit","backlog","supplementary","reappear","portal issue"
    ],

    hostel: [
      "hostel","room","bed","mattress","pillow","cupboard","locker",
      "mess","canteen","food","meal","breakfast","lunch","dinner",
      "warden","caretaker","cleaning","housekeeping","laundry",
      "wifi","internet","lan","network","router",
      "noise","disturbance","roommate","sharing",
      "water supply","hot water","cold water","bathroom issue",
      "garbage","dustbin","smell","hygiene",
      "curfew","entry","exit","gate timing",
      "electricity hostel","power hostel"
    ],

    security: [
      "security","guard","cctv","camera","surveillance",
      "theft","stolen","robbery","snatching","lost item",
      "fight","violence","harassment","bullying","ragging",
      "unsafe","danger","risk","threat",
      "unauthorized","intruder","outsider","trespass",
      "gate","entry","exit","id check","verification",
      "night patrol","monitoring",
      "complaint","report incident","emergency","alert",
      "security breach","missing","suspicious"
    ],

    health: [
      "health","sick","ill","fever","infection","disease",
      "doctor","hospital","clinic","medical","checkup",
      "medicine","pharmacy","first aid","ambulance",
      "injury","accident","pain","headache","vomiting",
      "food poisoning","allergy","hygiene","dirty food",
      "unclean","contamination","spoiled food",
      "sanitation","clean water","drinking water",
      "fitness","wellness","mental health","stress","anxiety",
      "counseling","therapy","support","health center"
    ],

    clubs: [
      "club","society","event","fest","competition",
      "technical club","coding club","robotics","ai club",
      "cultural club","dance","music","drama","art",
      "registration club","join club","membership",
      "event delay","event cancel","event management",
      "organizer","coordinator","team",
      "practice","rehearsal","performance",
      "funding","budget","sponsorship",
      "poster","promotion","announcement",
      "club room","meeting","session","workshop"
    ],

    sports: [
      "sports","game","match","tournament","practice",
      "football","cricket","basketball","badminton","tennis",
      "volleyball","table tennis","kabaddi","athletics",
      "ground","field","court","stadium",
      "equipment","bat","ball","net","racket",
      "coach","training","fitness","gym","workout",
      "injury sports","team selection","trial",
      "sports quota","league","scoreboard",
      "practice time","schedule sports"
    ],

    placements: [
      "placement","job","internship","offer","company",
      "recruitment","drive","campus drive","hiring",
      "resume","cv","interview","hr round","technical round",
      "aptitude","coding test","assessment",
      "package","salary","ctc","stipend",
      "ppo","pre placement offer",
      "shortlist","selection","rejection",
      "training","prep","placement cell",
      "company visit","on campus","off campus",
      "job portal","registration placement"
    ]
  };

  // 🔹 COUNT MATCHES
  for (let category in categories) {
    let count = 0;

    categories[category].forEach(word => {
      if (text.includes(word)) count++;
    });

    if (count > 0) {
      categoryScores[category] = count;
    }
  }

  // DEFAULT
  if (Object.keys(categoryScores).length === 0) {
    categoryScores["general"] = 1;
  }

  // 🔹 PRIMARY CATEGORY (MOST MATCHES)
  let category = Object.keys(categoryScores).reduce((a, b) =>
    categoryScores[a] > categoryScores[b] ? a : b
  );

  let allCategories = Object.keys(categoryScores);

  // 🔹 PRIORITY
  const high = ["urgent","emergency","danger","critical","fire","shock"];
  const medium = ["delay","slow","problem","issue","not working"];

  if (high.some(w => text.includes(w))) {
    priority = "High";
    score += 40;
  } else if (medium.some(w => text.includes(w))) {
    priority = "Medium";
    score += 20;
  } else {
    score += 10;
  }

  // 🔹 SCORE BASED ON MATCH COUNT
  score += categoryScores[category] * 10;

  if (text.length > 50) score += 5;

  score = Math.min(score, 100);

  return {
    category,
    allCategories,
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