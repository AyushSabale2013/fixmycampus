// auth.js

function register() {
  const name = document.getElementById("registerName").value.trim();

  if (!name) {
    alert("Enter your name");
    return;
  }

  setUser(name);
  window.location.href = "dashboard.html";
}

function login() {
  const name = document.getElementById("loginName").value.trim();

  if (!name) {
    alert("Enter your name");
    return;
  }

  setUser(name);
  window.location.href = "dashboard.html";
}