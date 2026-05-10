// 🔐 daftar user
const USERS = [
  { id: "oki", pw: "123" },
  { id: "rizki", pw: "4654" },
  { id: "wachid", pw: "7265" },
  { id: "admin", pw: "admin" },
];

// 🔥 FUNCTION LOGIN
function login() {
  const id = document.getElementById("userId").value;
  const pw = document.getElementById("password").value;

  const user = USERS.find((u) => u.id === id && u.pw === pw);

  if (user) {
    localStorage.setItem("loginUser", id);
    window.location.href = "home.html";
  } else {
    alert("ID atau password salah!");
  }
}
