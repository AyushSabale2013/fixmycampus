// ===============================
// FILE PREVIEW
// ===============================
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

if (fileInput) {
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      if (preview) {
        preview.innerHTML = "";

        if (file.type.startsWith("image")) {
          preview.innerHTML = `<img src="${e.target.result}">`;
        } else {
          preview.innerHTML = `<p>${file.name}</p>`;
        }
      }
    };

    reader.readAsDataURL(file);
  });
}


// ===============================
// PRIORITY DETECTION - v3.0
// ===============================
function detectPriority(text) {
  text = text.toLowerCase();

  const priorityKeywords = {
    Critical: [
      "fire", "electric shock", "short circuit", "explosion", "emergency",
      "danger", "life threat", "injury", "accident", "bleeding", "collapse",
      "unsafe", "harassment", "attack", "violence", "fight", "robbery",
      "threat", "assault", "panic", "critical condition", "severe injury",
      "hospital emergency", "medical emergency", "gas leak", "blast",
      "fatal", "serious hazard", "security breach", "urgent help", "stabbed",
      "shot", "poisoning", "drowning", "electrocution", "catastrophic"
    ],
    High: [
      "urgent", "immediately", "asap", "serious", "not working", "broken",
      "failure", "down", "no power", "no water", "no internet", "leak",
      "overflow", "damage", "issue persists", "not available",
      "malfunction", "stopped working", "critical delay", "service down",
      "unusable", "blocked", "major issue", "high priority",
      "system failure", "unresponsive", "error repeatedly", "severe",
      "hospitalized", "emergency room", "icu admission"
    ],
    Medium: [
      "delay", "inconvenience", "irregular", "unstable", "slow",
      "wifi issue", "attendance issue", "marks issue", "assignment issue",
      "maintenance required", "not proper", "moderate issue",
      "inconsistent", "temporary problem", "needs fixing",
      "partially working", "lag", "performance issue",
      "minor damage", "cleaning issue", "timing issue",
      "not teaching", "not explaining", "bad teaching", "poor teaching",
      "uncomfortable", "inconvenient", "problematic"
    ],
    Minor: [
      "suggestion", "request", "improvement", "better", "upgrade",
      "enhancement", "recommendation", "feedback", "optional",
      "small issue", "cosmetic", "appearance issue",
      "not urgent", "low impact", "can be improved",
      "nice to have", "minor inconvenience", "would be nice",
      "prefer", "consider", "maybe"
    ]
  };

  const scores = { Critical: 0, High: 0, Medium: 0, Minor: 0 };

  for (let level in priorityKeywords) {
    priorityKeywords[level].forEach(word => {
      if (text.includes(word)) scores[level] += 10;
    });
  }

  // Suggestion Booster
  const suggestionWords = ["can we", "could we", "should we", "i think we should", "it would be great if", "would be nice", "i would like to"];
  if (suggestionWords.some(w => text.includes(w))) {
    scores.Minor += 10;
  }

  let final = "Informational";
  let max = 0;

  for (let level in scores) {
    if (scores[level] > max) {
      max = scores[level];
      final = level;
    }
  }

  return final;
}


// ===============================
// BASE SCORE
// ===============================
function getBaseScore(priority) {
  switch (priority) {
    case "Critical": return 70;
    case "High": return 50;
    case "Medium": return 30;
    case "Minor": return 15;
    default: return 5;
  }
}


// ===============================
// CATEGORY CLASSIFICATION - v3.0
// NEW: Context-Aware Classification with Relationship Detection
// ===============================
function classifyIssue(text) {
  text = text.toLowerCase();

  // -------------------------------------------------------
  // v3.0: UNIFIED CATEGORY DATA MAP + CONTEXT RELATIONSHIPS
  // -------------------------------------------------------
  const categoryData = {
    security: {
      phrases: [
        "ragging happens", "ragging with me", "ragging done", "ragging incident",
        "being ragged", "got ragged", "someone ragged", "security breach",
        "i was attacked", "i was harassed", "i was threatened", "faculty misbehaving",
        "someone attacked", "someone harassed", "someone threatened", "teacher misbehaving",
        "bullying happens", "bullying with me", "violence happened",
        "feeling unsafe", "being harassed", "theft reported", "fight broke out",
        "unauthorized person", "intruder found", "cctv not working",
        "security guard missing", "gate unsecured", "item stolen",
        "physical abuse", "verbal abuse", "sexual harassment",
        "threatening message", "stalking complaint", "eve teasing",
        "mob attack", "gang fight", "personal threat", "poorly lit", "dark area",
        "laptop disappeared", "bike stolen", "vandalism", "threatening messages"
      ],
      words: [
        "ragging", "theft", "stolen", "robbery", "fight", "violence", "harassment",
        "unsafe", "threat", "attack", "abuse", "bullying", "assault", "molest",
        "stalking", "teasing", "eve teasing", "blackmail", "extortion",
        "guard", "security guard", "watchman", "cctv", "camera", "surveillance",
        "unauthorized", "intruder", "trespassing", "police", "fir", "complaint",
        "patrolling", "incident", "crime", "danger", "panic", "intimidation",
        "discrimination", "prejudice", "hate", "targeted", "cyberbullying"
      ],
      penalties: {},
      contextRules: [
        { keyword: "parking", context: "poorly lit", boost: 15 },
        { keyword: "laptop", context: "disappeared", boost: 20 },
        { keyword: "wall", context: "threatening", boost: 20 }
      ]
    },

    health: {
      phrases: [
        "feeling sick", "got injured", "need doctor", "need medicine", "clinic closed",
        "health issue", "mental health", "feeling stressed", "anxiety issue", "first aid needed",
        "not feeling well", "having fever", "chest pain", "difficulty breathing",
        "panic attack", "suicidal thoughts", "need counseling", "psychologist needed",
        "therapy needed", "blood pressure issue", "diabetic issue", "allergic reaction",
        "eye problem", "ear problem", "body ache", "severe pain", "vomiting continuously",
        "unconscious", "chronic", "illness", "disease", "infection", "injury"
      ],
      words: [
        "sick", "ill", "fever", "cold", "cough", "infection", "injury", "pain",
        "headache", "stomach ache", "nausea", "vomiting", "diarrhea", "hospital",
        "clinic", "doctor", "medicine", "treatment", "checkup", "mental health",
        "stress", "anxiety", "depression", "fatigue", "weakness", "virus", "disease",
        "first aid", "ambulance", "icu", "blood", "allergy", "rash", "swelling",
        "fracture", "sprain", "counseling", "psychiatrist", "psychologist", "therapy",
        "burnout", "insomnia", "migraine", "dizzy", "dizziness", "unconscious", "faint",
        "emergency", "sanitation", "hygiene", "paramedic", "nurse", "ward"
      ],
      penalties: { food: 10, infrastructure: 5 },
      contextRules: [
        { keyword: "food", context: "poisoning", penalize: "food", value: -15 },
        { keyword: "hostel", context: "mental health", penalize: "hostel", value: -10 },
        { keyword: "tap water", context: "sick", penalize: "infrastructure", value: -10 }
      ]
    },

    academics: {
      phrases: [
        "not teaching", "doesn't teach", "not explain", "doesn't explain", "not teaching well",
        "teaching badly", "bad teaching", "poor teaching", "teaching style", "teaching method",
        "bad teacher", "poor teacher", "teacher is not", "faculty is not", "professor is not",
        "not coming to class", "skipping class", "cancels class", "class not happening",
        "no lecture", "no class today", "missed class", "class cancelled", "lecture cancelled",
        "attendance problem", "attendance issue", "attendance not updated",
        "marks not updated", "marks not given", "result not declared",
        "assignment not graded", "wrong marks", "marks deducted", "grade issue",
        "cgpa problem", "sgpa issue", "syllabus not covered", "syllabus incomplete",
        "notes not shared", "lecture not recorded", "doubt not cleared", "no feedback",
        "exam postponed", "exam cancelled", "exam date changed", "internal marks issue",
        "practical marks missing", "not getting understood", "not able to understand",
        "course not updated", "outdated syllabus", "no study material",
        "letter of recommendation", "assignment extension", "online class attendance",
        "academic pressure"
      ],
      words: [
        "teacher", "faculty", "professor", "lecturer", "instructor", "sir", "ma'am", "mam",
        "hod", "dean", "principal", "coordinator", "teaching", "teaches", "taught",
        "explain", "explaining", "explanation", "lecture", "lectures", "lesson", "lessons",
        "session", "sessions", "class", "classes", "tutorial", "practicals", "lab session",
        "exam", "examination", "test", "marks", "score", "result", "grade", "assignment",
        "project", "submission", "deadline", "due date", "attendance", "proxy", "grading",
        "evaluation", "internal", "external", "quiz", "midsem", "endsem", "semester",
        "viva", "oral exam", "practical exam", "lab exam", "rechecking", "revaluation",
        "backlog", "ktkt", "atkt", "credit", "cgpa", "sgpa", "gpa", "course", "subject",
        "syllabus", "curriculum", "module", "unit", "notes", "study material",
        "textbook", "reference book", "timetable", "schedule", "reschedule", "cancel",
        "doubt", "clarification", "understanding", "confusing", "unclear", "boring",
        "difficult", "too fast", "not clear", "hard to follow", "recording",
        "online class", "offline class", "hybrid class", "absent", "bunked",
        "proxy attendance", "academic calendar", "extension"
      ],
      penalties: { technical: 8 },
      contextRules: [
        { keyword: "portal", context: "lectures", penalize: "technical", value: -15 },
        { keyword: "internet", context: "class", penalize: "technical", value: -12 },
        { keyword: "schedule", context: "sports", penalize: "sports", value: -15 }
      ]
    },

    food: {
      phrases: [
        "food not good", "food is bad", "food quality poor", "mess food bad",
        "canteen food bad", "stale food", "dirty food", "food poisoning",
        "meal not available", "mess timing issue", "menu issue", "portion small",
        "food undercooked", "food overcooked", "food has insects",
        "found hair in food", "found stone in food", "worms in food",
        "no vegetarian option", "no vegan option", "food too spicy",
        "food too oily", "food tasteless", "food smells bad",
        "water not clean", "drinking water issue", "mess closed",
        "canteen closed", "no breakfast today", "no dinner served",
        "food poisoning", "rotten food", "contaminated food"
      ],
      words: [
        "food", "mess", "canteen", "cafeteria", "dhaba", "tuck shop", "meal",
        "breakfast", "lunch", "dinner", "snacks", "tiffin", "taste", "tasteless",
        "tasty", "quality", "hygiene", "dirty", "spoiled", "stale", "rotten",
        "uncooked", "overcooked", "raw", "oil", "oily", "spicy", "bland",
        "cold food", "hot food", "water quality", "drinking water", "mess staff",
        "cook", "menu", "variety", "portion", "quantity", "serving",
        "food poisoning", "insects", "cockroach in food", "hair in food",
        "kitchen", "utensils", "plate", "dirty plate", "thali", "vegetarian",
        "non-veg", "vegan", "halal", "mess timing", "mess fee", "mess bill", "rebate"
      ],
      penalties: {},
      contextRules: [
        { keyword: "canteen", context: "unhygienic", boost: 15 },
        { keyword: "delivery", context: "hygiene", boost: 10 }
      ]
    },

    hostel: {
      phrases: [
        "room not clean", "room is dirty", "roommate issue", "roommate problem",
        "warden not responding", "warden misbehaving", "hostel gate closed",
        "entry not allowed", "hostel timing issue", "late entry problem",
        "hostel noise issue", "hostel room problem", "hostel allocation issue",
        "bed not available", "mattress issue", "locker broken",
        "no hot water in hostel", "geyser not working", "hostel washroom dirty",
        "hostel pest problem", "hostel wi-fi issue", "hostel curfew issue",
        "laundry not working", "washing machine broken", "hostel light issue",
        "power cut in hostel", "hostel fan broken", "mosquito in room",
        "cockroach in room", "rat in room", "hostel food issue",
        "no blanket provided", "no pillow given", "hostel furniture broken"
      ],
      words: [
        "hostel", "dorm", "dormitory", "pgroom", "paying guest", "room", "bed",
        "mattress", "pillow", "blanket", "bedsheet", "cupboard", "wardrobe",
        "locker", "almirah", "warden", "caretaker", "hostel staff", "matron",
        "roommate", "flatmate", "co-occupant", "batchmate", "allocation",
        "allotment", "shift", "room change", "cleaning", "sweeper",
        "housekeeping", "dust", "pest", "insect", "cockroach", "mosquito",
        "rat", "lizard", "laundry", "washing machine", "dryer", "clothes",
        "ironing", "common room", "tv room", "recreation room", "corridor",
        "passage", "floor", "wing", "noise", "disturbance", "loud music",
        "curfew", "entry time", "exit time", "hostel gate", "night pass",
        "geyser", "water heater", "hot water", "bucket", "mess card",
        "hostel fee", "hostel bill"
      ],
      penalties: { food: 15, infrastructure: 8, health: 10 },
      contextRules: [
        { keyword: "heater", context: "broken", penalize: "infrastructure", value: -15 },
        { keyword: "furniture", context: "uncomfortable", penalize: "infrastructure", value: -12 },
        { keyword: "roommate", context: "sick", penalize: "health", value: -15 }
      ]
    },

    infrastructure: {
      phrases: [
        "fan not working", "light not working", "ac not working",
        "water not coming", "tap not working", "flush not working",
        "door not closing", "window broken", "desk broken", "bench broken",
        "projector not working", "bulb fused", "socket broken",
        "lift not working", "elevator not working", "stairs broken",
        "pipe leaking", "water leaking", "washroom dirty", "toilet blocked",
        "classroom dirty", "lab equipment broken", "no electricity in class",
        "power cut in college", "seepage in wall", "roof leaking",
        "paint peeling", "floor broken", "ramp not available",
        "no wheelchair access", "fire extinguisher missing",
        "emergency exit blocked", "dustbin not emptied", "garbage not collected",
        "drinking water not available", "water cooler broken",
        "no water in washroom"
      ],
      words: [
        "fan", "light", "tube light", "led light", "electricity", "power",
        "switch", "wire", "wiring", "socket", "plug", "bulb", "cfl",
        "water", "leak", "pipeline", "pipe", "drain", "sewage", "overflow",
        "tank", "broken", "repair", "maintenance", "damage", "crack",
        "wall", "ceiling", "roof", "floor", "ramp", "railing", "washroom",
        "restroom", "bathroom", "toilet", "flush", "basin", "tap", "geyser",
        "mirror", "tiles", "lift", "elevator", "escalator", "stairs",
        "staircase", "door", "window", "glass", "lock", "hinge", "bench",
        "desk", "chair", "table", "furniture", "blackboard", "whiteboard",
        "classroom", "lab", "library", "seminar hall", "auditorium",
        "canteen building", "equipment", "projector", "screen", "ac", "cooler",
        "heater", "fire extinguisher", "cctv bracket", "notice board", "clock",
        "dustbin", "garbage", "cleaning", "sweeping", "mopping", "sound system"
      ],
      penalties: {},
      contextRules: [
        { keyword: "projector", context: "crashing", penalize: "technical", value: -15 },
        { keyword: "desk", context: "pain", penalize: "health", value: -12 },
        { keyword: "projector", context: "presentation", penalize: "technical", value: -12 }
      ]
    },

    technical: {
      phrases: [
        "wifi not working", "internet not working", "no internet access",
        "portal not opening", "portal down", "server down", "website not loading",
        "login issue", "cannot login", "password reset", "account locked",
        "app crashing", "network issue", "slow internet speed",
        "otp not received", "email not working", "college email issue",
        "erp not working", "attendance portal issue", "result portal issue",
        "marks not showing", "certificate not downloading",
        "online form not submitting", "fees payment failed",
        "library portal issue", "id card issue", "smartcard issue",
        "computer lab issue", "printer not working", "projector cable missing",
        "software not installed", "antivirus expired", "system hanging",
        "cloud storage vulnerability", "security vulnerability"
      ],
      words: [
        "wifi", "wi-fi", "internet", "network", "broadband", "lan", "ethernet",
        "slow internet", "no internet", "connection", "hotspot", "server",
        "portal", "erp", "website", "webpage", "link", "login", "logout",
        "sign in", "sign out", "username", "password", "otp", "verification",
        "authentication", "2fa", "error", "bug", "glitch", "crash", "freeze",
        "hang", "app", "application", "software", "program", "system", "os",
        "database", "data", "access", "permission", "account", "email",
        "college mail", "id card", "smartcard", "barcode", "computer",
        "laptop", "desktop", "pc", "monitor", "printer", "scanner",
        "photocopy", "xerox", "keyboard", "mouse", "usb", "pendrive",
        "charger", "it support", "helpdesk", "tech support", "it cell",
        "zoom", "google meet", "teams", "lms", "moodle", "google classroom",
        "office 365", "github", "vulnerability"
      ],
      penalties: {},
      contextRules: []
    },

    transport: {
      phrases: [
        "bus late", "bus not available", "shuttle not coming",
        "bus timing issue", "bus overcrowded", "driver not coming",
        "bus route issue", "no bus today", "bus cancelled", "missed bus",
        "bus full", "standing in bus", "bus breakdown on road",
        "bus drop issue", "no pickup today", "pickup point changed",
        "bus pass issue", "bus fee issue", "route not covered",
        "new stop requested", "unsafe driving", "rash driving",
        "driver misbehaving", "conductor misbehaving"
      ],
      words: [
        "bus", "college bus", "transport", "shuttle", "van", "auto", "route",
        "pickup", "drop", "driver", "conductor", "delay", "late", "timing",
        "schedule", "timetable", "stop", "bus stop", "boarding point",
        "vehicle", "travel", "commute", "pass", "bus pass", "ticket",
        "availability", "overcrowded", "seat", "standing", "breakdown",
        "accident", "puncture", "maintenance", "parking", "traffic",
        "signal", "highway", "fuel", "diesel", "petrol", "refuel"
      ],
      penalties: { sports: 20 },
      contextRules: [
        { keyword: "bus", context: "smells bad", penalize: "food", value: -15 },
        { keyword: "driver", context: "rash safety", penalize: "security", value: -12 }
      ]
    },

    placements: {
      phrases: [
        "placement drive", "internship issue", "company visiting",
        "interview scheduled", "resume not reviewed", "offer letter",
        "placement cell", "job offer", "recruitment issue",
        "not getting placed", "placement criteria issue",
        "cgpa cutoff issue", "backlog issue in placement",
        "company rejected", "shortlist not received",
        "aptitude test issue", "coding round issue",
        "hr not responding", "offer not received", "joining delayed",
        "internship stipend issue", "internship certificate issue",
        "mock interview needed", "placement training needed",
        "linkedin profile help", "resume review needed",
        "job portal access", "no placement support",
        "campus recruitment issue", "off campus support needed",
        "average package"
      ],
      words: [
        "placement", "placements", "placed", "unplaced", "internship",
        "intern", "stipend", "ppo", "job", "jobs", "jobless", "employment",
        "unemployed", "company", "firm", "startup", "mnc", "corporate",
        "recruitment", "hiring", "campus hiring", "off campus", "ctc",
        "package", "salary", "lpa", "offer", "offer letter", "interview",
        "interviewer", "interviewee", "selection", "rejection", "shortlist",
        "waitlist", "resume", "cv", "portfolio", "cover letter",
        "eligibility", "criteria", "cutoff", "gpa cutoff", "drive",
        "aptitude", "reasoning", "verbal", "quant", "coding test",
        "online test", "assessment", "hr round", "technical round",
        "gd", "group discussion", "mock interview", "preparation",
        "coaching", "placement cell", "tpo", "career", "career guidance",
        "job portal", "naukri", "linkedin", "indeed", "glassdoor"
      ],
      penalties: {},
      contextRules: [
        { keyword: "coding", context: "interview", boost: 20 },
        { keyword: "coding", context: "club", penalize: "clubs", value: -15 }
      ]
    },

    sports: {
      phrases: [
        "ground not available", "sports equipment missing",
        "practice cancelled", "coach not available", "team selection issue",
        "tournament registration", "sports quota issue", "sports certificate needed",
        "gym not open", "gym equipment broken", "treadmill not working",
        "fitness center closed", "no sports facility", "match cancelled",
        "match postponed", "no referee", "kit not provided", "jersey not given",
        "sports fee issue", "practice timing issue", "no outdoor space",
        "ground locked", "cricket pitch damaged", "football ground flooded",
        "badminton court issue", "swimming pool closed", "sports attendance"
      ],
      words: [
        "sports", "sport", "athletic", "athletics", "ground", "field",
        "court", "pitch", "pool", "track", "match", "game", "play",
        "practice", "training", "workout", "tournament", "competition",
        "championship", "league", "cup", "equipment", "kit", "jersey",
        "uniform", "shoes", "gear", "coach", "trainer", "referee",
        "umpire", "fitness", "gym", "gymnasium", "weights", "dumbbells",
        "treadmill", "cycling", "cardio", "football", "soccer", "cricket",
        "basketball", "volleyball", "badminton", "tennis", "table tennis",
        "tt", "squash", "chess", "carrom", "kabaddi", "kho kho",
        "swimming", "athletics", "shot put", "long jump", "high jump",
        "running track", "sprint", "marathon", "relay", "stadium", "turf",
        "astroturf", "playground", "sports complex", "indoor stadium",
        "open air", "team selection", "selection trial", "tryout"
      ],
      penalties: { academics: 25 },
      contextRules: [
        { keyword: "uniform", context: "uncomfortable", penalize: "infrastructure", value: -12 },
        { keyword: "injured", context: "tournament", penalize: "health", value: -15 }
      ]
    },

    clubs: {
      phrases: [
        "event permission", "club meeting issue", "fest issue",
        "club registration problem", "event cancelled", "club budget issue",
        "not selected in club", "audition result", "club activity issue",
        "cultural event issue", "technical fest problem",
        "management fest issue", "no announcement made",
        "event venue not confirmed", "event postponed",
        "club funds not released", "sponsorship issue",
        "volunteer not informed", "coordinator not responding",
        "registration link not working", "participation certificate issue",
        "no recognition for winning", "prize not given",
        "workshop registration full", "seminar cancelled",
        "band performance"
      ],
      words: [
        "club", "society", "committee", "cell", "event", "fest", "festival",
        "carnival", "expo", "cultural", "techfest", "management fest", "spardha",
        "registration", "register", "enrollment", "participation", "participate",
        "participant", "volunteer", "volunteering", "organizing", "organizer",
        "team", "member", "lead", "head", "president", "secretary",
        "announcement", "notice", "circular", "poster", "flyer", "audition",
        "tryout", "selection", "shortlisting", "meeting", "agenda", "minutes",
        "schedule", "venue", "hall", "room booking", "coordination",
        "logistics", "arrangement", "budget", "funding", "sponsorship",
        "grant", "permission", "noc", "approval", "activity", "workshop",
        "seminar", "webinar", "talk", "competition", "hackathon", "ideathon",
        "datathon", "quiz", "debate", "elocution", "declamation", "dance",
        "music", "singing", "band", "drama", "skit", "mime", "painting",
        "art", "photography", "film", "short film", "coding", "robotics",
        "electronics", "innovation", "exhibition"
      ],
      penalties: {},
      contextRules: [
        { keyword: "robotics", context: "lab access", penalize: "academics", value: -15 },
        { keyword: "photography", context: "exhibition", penalize: "infrastructure", value: -12 },
        { keyword: "auditorium", context: "concert", penalize: "infrastructure", value: -15 },
        { keyword: "president", context: "not responding", boost: 15 }
      ]
    }
  };

  // -------------------------------------------------------
  // STEP 1: Initialize Scores
  // -------------------------------------------------------
  const scores = {};
  for (let category in categoryData) scores[category] = 0;

  // -------------------------------------------------------
  // STEP 2: Primary Scoring - Phrases (25 pts) and Words (10 pts)
  // -------------------------------------------------------
  for (let category in categoryData) {
    const { phrases, words } = categoryData[category];
    phrases.forEach(phrase => {
      if (text.includes(phrase)) scores[category] += 25;
    });
    words.forEach(word => {
      if (text.includes(word)) scores[category] += 10;
    });
  }

  // -------------------------------------------------------
  // STEP 3: Apply Category Penalties
  // -------------------------------------------------------
  const activeCategories = Object.keys(scores).filter(cat => scores[cat] > 0);
  if (activeCategories.length > 1) {
    activeCategories.forEach(cat => {
      const penalties = categoryData[cat].penalties;
      for (let penaltyCat in penalties) {
        if (activeCategories.includes(penaltyCat)) {
          scores[cat] -= penalties[penaltyCat];
        }
      }
    });
  }

  // -------------------------------------------------------
  // STEP 4: v3.0 NEW - Apply Context Rules
  // -------------------------------------------------------
  for (let category in categoryData) {
    const contextRules = categoryData[category].contextRules || [];
    contextRules.forEach(rule => {
      if (text.includes(rule.keyword)) {
        if (rule.context && text.includes(rule.context)) {
          if (rule.boost) {
            scores[category] += rule.boost;
          }
          if (rule.penalize) {
            scores[rule.penalize] -= rule.value;
          }
        }
      }
    });
  }

  // -------------------------------------------------------
  // STEP 5: Refined Context Boosters
  // -------------------------------------------------------
  const negationWords = ["not ", "no ", "not available", "missing", "absent", "never", "doesn't", "don't", "isn't", "aren't", "won't", "failed", "unable to"];
  const hasNegation = negationWords.some(w => text.includes(w));
  if (hasNegation) {
    let topCat = null, topScore = 0;
    for (let c in scores) {
      if (scores[c] > topScore) { topScore = scores[c]; topCat = c; }
    }
    if (topCat && topScore > 0) scores[topCat] += 10;
  }

  const qualityIndicators = ["well", "badly", "poorly", "properly", "correctly", "good", "bad", "poor", "worst", "nice", "terrible"];
  const academicSubjects = ["teacher", "faculty", "professor", "lecturer", "sir", "mam", "ma'am", "instructor"];
  if (qualityIndicators.some(w => text.includes(w)) && academicSubjects.some(w => text.includes(w))) {
    scores["academics"] += 20;
  }

  // -------------------------------------------------------
  // STEP 6: v3.0 NEW - Vagueness Detection
  // Downgrade overly vague or generic issues
  // -------------------------------------------------------
  const vagueKeywords = ["policy change", "improve", "learn", "develop", "skill"];
  const hasVague = vagueKeywords.some(w => text.includes(w));
  if (hasVague && Math.max(...Object.values(scores)) < 30) {
    // If score is low and vague, default to general
    return {
      category: "general",
      priority: detectPriority(text),
      score: getBaseScore(detectPriority(text)),
      confidence: 0
    };
  }

  // -------------------------------------------------------
  // STEP 7: Find Best Category using Priority Map
  // -------------------------------------------------------
  let finalCategory = "general";
  let maxScore = 0;
  const categoryPriority = {
    security: 1, health: 2, academics: 3, food: 4, hostel: 5,
    infrastructure: 6, transport: 7, placements: 8, technical: 9,
    sports: 10, clubs: 11
  };

  for (let c in scores) {
    if (scores[c] > maxScore) maxScore = scores[c];
  }

  let bestPriority = Infinity;
  if (maxScore > 0) {
    for (let c in scores) {
      if (scores[c] === maxScore) {
        const p = categoryPriority[c] || 99;
        if (p < bestPriority) {
          bestPriority = p;
          finalCategory = c;
        }
      }
    }
  }

  // Confidence filter - adjusted for better general detection
  if (maxScore < 15) {
    finalCategory = "general";
  }

  // -------------------------------------------------------
  // STEP 8: Final Score Calculation
  // -------------------------------------------------------
  const priority = detectPriority(text);
  const baseScore = getBaseScore(priority);
  const finalScore = Math.min(100, baseScore + Math.floor(maxScore / 10));

  return {
    category: finalCategory,
    priority,
    score: finalScore,
    confidence: maxScore
  };
}

// ===============================
// SUBMIT
// ===============================
function submitIssue() {
  const text = document.getElementById("issueInput").value.trim();
  if (!text) {
    alert("Enter your issue");
    return;
  }
  const issues = JSON.parse(localStorage.getItem("issues")) || [];
  const result = classifyIssue(text);
  const newIssue = {
    id: Date.now(),
    text,
    category: result.category,
    priority: result.priority,
    baseScore: result.score,
    votes: 0,
    score: result.score
  };
  issues.push(newIssue);
  localStorage.setItem("issues", JSON.stringify(issues));
  document.getElementById("resultBox").innerHTML = `
    <div class="success-box">
      ✅ Problem submitted successfully<br>
      Category: <b>${result.category}</b><br>
      Priority: <b>${result.priority}</b><br>
      Score: <b>${result.score}</b><br>
      <small>Confidence: ${result.confidence}</small>
    </div>
  `;
  document.getElementById("issueInput").value = "";
  if (preview) preview.innerHTML = "";
}