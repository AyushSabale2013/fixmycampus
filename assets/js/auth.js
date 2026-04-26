// ===============================
// GET USERS
// ===============================
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// SAVE USERS
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}


// ===============================
// REGISTER
// ===============================
function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  const errorBox = document.getElementById("error");
  errorBox.innerText = "";

  if (!name || !email || !phone || !password) {
    errorBox.innerText = "All fields are required";
    return;
  }

  let users = getUsers();

  // CHECK DUPLICATE
  if (users.some(u => u.email === email)) {
    errorBox.innerText = "User already exists";
    return;
  }

  // SAVE USER OBJECT
  const newUser = { name, email, phone, password };
  users.push(newUser);
  saveUsers(users);

  // STORE CURRENT USER (IMPORTANT FIX)
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  alert("Registration successful!");

  // REDIRECT → HOME
  window.location.href = "index.html";
}


// ===============================
// LOGIN
// ===============================
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const errorBox = document.getElementById("error");
  errorBox.innerText = "";

  if (!email || !password) {
    errorBox.innerText = "Enter email and password";
    return;
  }

  let users = getUsers();

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    errorBox.innerText = "Invalid credentials";
    return;
  }

  // STORE CURRENT USER OBJECT
  localStorage.setItem("currentUser", JSON.stringify(user));

  alert("Login successful!");

  // REDIRECT → DASHBOARD
  window.location.href = "dashboard.html";
}