// storage.js

function getIssues() {
  return JSON.parse(localStorage.getItem("issues")) || [];
}

function saveIssues(issues) {
  localStorage.setItem("issues", JSON.stringify(issues));
}

function getUser() {
  return localStorage.getItem("user");
}

function setUser(name) {
  localStorage.setItem("user", name);
}