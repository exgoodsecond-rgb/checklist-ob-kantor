const user = localStorage.getItem("loginUser");

if (!user) {
  window.location.href = "login.html";
}
// ==============================
// 🔥 DETEKSI HALAMAN
// ==============================
const isHome = document.getElementById("dataList");
const isLaporan = document.getElementById("monthlyList");

// ==============================
// 📅 TAMPILKAN TANGGAL (HOME SAJA)
// ==============================
const dateElement = document.getElementById("date");
if (dateElement) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  dateElement.innerText = new Date().toLocaleDateString("id-ID", options);
}

// ==============================
// 🌐 URL APPS SCRIPT
// ==============================
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx7F7OTPFheqsFIL0ev18zf0U1qpKhLM_cz7lvf5jnHE_WzYs6g38xQXBNIKva9Q2U/exec";

// ==============================
// 📤 HANDLE FORM (HOME SAJA)
// ==============================
const cleaningForm = document.getElementById("cleaningForm");

if (cleaningForm) {
  cleaningForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.innerText = "Sedang Mengirim...";
    submitBtn.disabled = true;

    const name = document.getElementById("obName").value;
    const photoFile = document.getElementById("photoUpload").files[0];

    const checkedTasks = Array.from(
      document.querySelectorAll('input[name="task"]:checked'),
    )
      .map((el) => el.value)
      .join(", ");

    if (!checkedTasks) {
      alert("Pilih minimal 1 tugas!");
      submitBtn.innerText = "Kirim Laporan";
      submitBtn.disabled = false;
      return;
    }

    if (!photoFile) {
      alert("Harap ambil foto bukti kerja dulu!");
      submitBtn.innerText = "Kirim Laporan";
      submitBtn.disabled = false;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(photoFile);

  reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        // --- PROSES RESIZE ---
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // Ukuran lebar maksimal (sudah cukup jelas untuk bukti)
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_WIDTH) {
            width *= MAX_WIDTH / height;
            height = MAX_WIDTH;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Ubah ke Base64 dengan kualitas 0.7 (70% kualitas asli, hemat memori)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];

        // --- KIRIM DATA ---
        const formData = new URLSearchParams();
        formData.append("obName", name);
        formData.append("tasks", checkedTasks);
        formData.append("fileData", compressedBase64); // Data yang sudah kecil
        formData.append("fileName", "photo.jpg");
        formData.append("mimeType", "image/jpeg");

        fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }).then(() => {
          alert("Laporan berhasil dikirim!");
          cleaningForm.reset();
          document.getElementById("preview").innerHTML = "";
          submitBtn.innerText = "Kirim Laporan";
          submitBtn.disabled = false;
        }).catch(err => {
          alert("Gagal kirim: " + err);
          submitBtn.disabled = false;
        });
      };
    };

// ==============================
// 🖼️ PREVIEW GAMBAR (HOME SAJA)
// ==============================
const photoInput = document.getElementById("photoUpload");
const preview = document.getElementById("preview");

if (photoInput) {
  photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        preview.innerHTML = `<img src="${reader.result}" style="width:100%; margin-top:10px; border-radius:10px;">`;
      };
      reader.readAsDataURL(file);
    }
  });
}

// ==============================
// 📋 MASTER TASK
// ==============================
const MASTER_TASKS = [
  { nama: "Lap List Kaca Bawah", kategori: "Harian" },
  { nama: "Pembersihan Kaca Lobby Depan", kategori: "Mingguan" },
  { nama: "Pembersihan Area Makan", kategori: "Harian" },
  { nama: "Kaca Dalam - Ruang 1", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang 2", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang 3", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang 4", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang 5", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang 6", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang 7", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang 8", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang Manager", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang Direktur", kategori: "Mingguan" },
  { nama: "Kaca Dalam - Ruang Meeting", kategori: "Mingguan" },
  { nama: "Pembersihan Kaca Afilio", kategori: "Mingguan" },
  { nama: "Pencucian Kain Pel + Lobby Duster", kategori: "Mingguan" },
  { nama: "Pembersihan Karpet Lobby", kategori: "Mingguan" },
  { nama: "Pencucian Tempat Sampah", kategori: "Bulanan" },
  { nama: "Pembuangan Air AC Afilio", kategori: "Harian" },
  { nama: "Vakum All Floor", kategori: "Harian" },
  { nama: "Pembuangan Sampah All Floor", kategori: "Harian" },
  { nama: "Pel Area - Pantry", kategori: "Harian" },
  { nama: "Pel Area - Loker", kategori: "Mingguan" },
  { nama: "Pel Area - Lantai L", kategori: "Harian" },
  { nama: "Pembersihan Sarang Laba-laba", kategori: "Mingguan" },
];

// ==============================
// 🔄 LOAD DATA
// ==============================
function loadData() {
  if (isHome) {
    const container = document.getElementById("dataList");
    container.innerHTML = `
      <div class="mini-loading">
        <div class="mini-spinner"></div>
        <span>Memuat data...</span>
      </div>
    `;
  }

  fetch(SCRIPT_URL)
    .then((res) => res.json())
    .then((data) => {
      // ================= HOME =================
      if (isHome) {
        const container = document.getElementById("dataList");
        container.innerHTML = "";

        const today = new Date().toDateString();

        const todayData = data.filter((item) => {
          return new Date(item.waktu).toDateString() === today;
        });

        const doneTasks = {};

        todayData.forEach((item) => {
          const tasks = item.tugas.split(", ");
          tasks.forEach((task) => {
            if (!doneTasks[task]) doneTasks[task] = [];
            doneTasks[task].push(item.nama);
          });
        });

        MASTER_TASKS.forEach((task) => {
          const div = document.createElement("div");

          div.style.padding = "12px";
          div.style.marginBottom = "10px";
          div.style.borderRadius = "10px";
          div.style.color = "white";
          div.style.fontWeight = "bold";

          if (doneTasks[task.nama]) {
            div.style.background = "#16a34a";
            div.innerHTML = `
              ✔ ${task.nama}<br>
              <small>Dikerjakan oleh: ${doneTasks[task.nama].join(", ")}</small>
            `;
          } else {
            div.style.background = "#dc2626";
            div.innerHTML = `
              ✖ ${task.nama}<br>
              <small>Belum dikerjakan</small>
            `;
          }

          container.appendChild(div);
        });
      }

      // ================= LAPORAN =================
      if (isLaporan) {
        loadMonthlyReport(data);
      }
    })
    .catch((err) => console.error(err));
}

loadData();
setInterval(loadData, 10000);

// ==============================
// 📊 LAPORAN BULANAN
// ==============================
function loadMonthlyReport(data) {
  const container = document.getElementById("monthlyList");
  if (!container) return;
  container.innerHTML = `
  <div class="mini-loading">
    <div class="mini-spinner"></div>
    <span>Memuat laporan bulanan...</span>
  </div>
`;

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const monthData = data.filter((item) => {
    const d = new Date(item.waktu);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const doneTasks = {};

  monthData.forEach((item) => {
    const tasks = item.tugas.split(", ");
    tasks.forEach((task) => {
      if (!doneTasks[task]) doneTasks[task] = [];
      doneTasks[task].push(item.nama);
    });
  });

  let html = `
  <div class="fade-in-report">
    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr style="background:#3498db; color:white;">
          <th style="padding:10px; border:1px solid #ddd;">Tugas</th>
          <th style="padding:10px; border:1px solid #ddd;">Kategori</th>
          <th style="padding:10px; border:1px solid #ddd;">Status</th>
          <th style="padding:10px; border:1px solid #ddd;">Dikerjakan Oleh</th>
        </tr>
      </thead>
      <tbody>
  `;

  MASTER_TASKS.forEach((taskObj) => {
    const done = doneTasks[taskObj.nama];

    html += `
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">${taskObj.nama}</td>
        <td style="padding:8px; border:1px solid #ddd;">${taskObj.kategori}</td>
        <td style="padding:8px; border:1px solid #ddd; text-align:center;">
          ${done ? "✅" : "❌"}
        </td>
        <td style="padding:8px; border:1px solid #ddd;">
          ${done ? [...new Set(done)].join(", ") : "-"}
        </td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;

  container.innerHTML = html;
  container.classList.remove("report-show");
  void container.offsetWidth;
  container.classList.add("report-show");
}
const toggleKaca = document.getElementById("toggleKacaDalam");
const kacaList = document.getElementById("kacaDalamList");

if (toggleKaca) {
  toggleKaca.addEventListener("change", function () {
    kacaList.style.display = this.checked ? "block" : "none";
  });
}
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-item").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// ==========================
// LOGOUT FUNCTION
// ==========================
function logout() {
  localStorage.removeItem("loginUser");
  window.location.href = "login.html";
}
const welcome = document.getElementById("welcomeUser");
if (welcome) {
  const user = localStorage.getItem("loginUser");
  welcome.innerText = "Halo " + user;
}
const togglePelArea = document.getElementById("togglePelArea");
const pelAreaList = document.getElementById("pelAreaList");

if (togglePelArea) {
  togglePelArea.addEventListener("change", function () {
    pelAreaList.style.display = this.checked ? "block" : "none";
  });
}
