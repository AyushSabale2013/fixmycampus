// GET USERS
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// SAVE USERS
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// EMAIL VALIDATION
function isValidEmail(email) {
  const regex = /^11[0-9]{2}(15|16)[0-9]{3}@(cse|ece)\.iiitp\.ac\.in$/;

  if (!regex.test(email)) return false;

  const [roll, domain] = email.split("@");
  const branchFromEmail = domain.split(".")[0];

  const branchCode = roll.slice(4, 6);

  if (branchCode === "15" && branchFromEmail !== "cse") return false;
  if (branchCode === "16" && branchFromEmail !== "ece") return false;

  return true;
}

// REGISTER
function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const errorBox = document.getElementById("error");

  errorBox.innerText = "";

  // VALIDATION
  if (!name || !email) {
    errorBox.innerText = "All fields are required";
    return;
  }

  if (name.length < 3) {
    errorBox.innerText = "Name must be at least 3 characters";
    return;
  }

  if (!isValidEmail(email)) {
    errorBox.innerText = "Invalid email format";
    return;
  }

  let users = getUsers();

  // CHECK DUPLICATE
  const exists = users.some(user => user.email === email);

  if (exists) {
    errorBox.innerText = "User already registered";
    return;
  }

  // SAVE USER
  users.push({ name, email });
  saveUsers(users);

  // STORE CURRENT USER
  localStorage.setItem("user", name);

  alert("Registration successful!");

  // REDIRECT TO HOME
  window.location.href = "index.html";
}




// LOGIN 
function login() {
  const email = document.getElementById("email").value.trim();
  const errorBox = document.getElementById("error");

  errorBox.innerText = "";

  if (!email) {
    errorBox.innerText = "Enter your email";
    return;
  }

  let users = getUsers();

  const user = users.find(u => u.email === email);

  if (!user) {
    errorBox.innerText = "User not found. Please register.";
    return;
  }

  // LOGIN SUCCESS
  localStorage.setItem("user", user.name);

  alert("Login successful!");

  window.location.href = "dashboard.html";
}