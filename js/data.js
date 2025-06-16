// ================================
// Inisialisasi Data Awal
// ================================
if (!localStorage.getItem("pengguna")) {
  localStorage.setItem("pengguna", JSON.stringify([
    { username: "admin", password: "admin123", nama: "Admin", role: "admin" },
    { username: "karyawan1", password: "123", nama: "Budi Santoso", role: "karyawan" },
    { username: "karyawan2", password: "456", nama: "Siti Aisyah", role: "karyawan" }
  ]));
}

// ================================
// Fungsi User
// ================================
function ambilPengguna() {
  return JSON.parse(localStorage.getItem("pengguna")) || [];
}

function setUserLogin(user) {
  localStorage.setItem("loginUser", JSON.stringify(user));
}

function getUserLogin() {
  return JSON.parse(localStorage.getItem("loginUser"));
}

function logoutUser() {
  localStorage.removeItem("loginUser");
}

// ================================
// Fungsi Absensi
// ================================
function ambilAbsensi() {
  return JSON.parse(localStorage.getItem("absensi")) || [];
}

function simpanAbsensi(data) {
  const semua = ambilAbsensi();
  const index = semua.findIndex(a => a.nama === data.nama && a.tanggal === data.tanggal);

  if (index !== -1) {
    semua[index] = data; // update jika sudah ada
  } else {
    semua.push(data); // tambah baru
  }

  localStorage.setItem("absensi", JSON.stringify(semua));
}

// ================================
// Fungsi Rekap
// ================================
function hitungRekapPerKaryawan(data) {
  const rekap = {};

  data.forEach(item => {
    if (!rekap[item.nama]) {
      rekap[item.nama] = {
        tepat: 0,
        telat: 0,
        cepat: 0,
        telatCepat: 0,
        total: 0
      };
    }

    const r = rekap[item.nama];
    r.total++;

    if (item.status === "Tepat Waktu") r.tepat++;
    else if (item.status === "Terlambat") r.telat++;
    else if (item.status === "Pulang Cepat") r.cepat++;
    else if (item.status === "Terlambat & Pulang Cepat") r.telatCepat++;
  });

  return rekap;
}

function tampilkanRekap(data) {
  const rekap = hitungRekapPerKaryawan(data);
  const tbody = document.getElementById("rekapPerKaryawan");

  if (!tbody) return;

  tbody.innerHTML = "";

  Object.entries(rekap).forEach(([nama, r]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nama}</td>
      <td class="text-center">${r.tepat}</td>
      <td class="text-center">${r.telat}</td>
      <td class="text-center">${r.cepat}</td>
      <td class="text-center">${r.telatCepat}</td>
      <td class="text-center">${r.total}</td>
    `;
    tbody.appendChild(tr);
  });
}
