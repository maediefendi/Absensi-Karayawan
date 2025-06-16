// js/data.js

function ambilAbsensi() {
  return JSON.parse(localStorage.getItem("absensi")) || [];
}

function simpanAbsensi(data) {
  let absensi = ambilAbsensi();
  const index = absensi.findIndex(a => a.nama === data.nama && a.tanggal === data.tanggal);
  if (index !== -1) {
    absensi[index] = data;
  } else {
    absensi.push(data);
  }
  localStorage.setItem("absensi", JSON.stringify(absensi));
}

function ambilPengguna() {
  return [
    { username: "admin", password: "admin123", nama: "Admin", role: "admin" },
    { username: "karyawan1", password: "123", nama: "Karyawan 1", role: "karyawan" },
    { username: "karyawan2", password: "456", nama: "Karyawan 2", role: "karyawan" },
  ];
}

function setUserLogin(user) {
  localStorage.setItem("userLogin", JSON.stringify(user));
}

function getUserLogin() {
  return JSON.parse(localStorage.getItem("userLogin"));
}

function logoutUser() {
  localStorage.removeItem("userLogin");
}

function ambilAbsensi() {
  return JSON.parse(localStorage.getItem("absensi") || "[]");
}

function simpanAbsensi(data) {
  const semua = ambilAbsensi();
  const index = semua.findIndex(a => a.nama === data.nama && a.tanggal === data.tanggal);
  if (index !== -1) {
    semua[index] = data;
  } else {
    semua.push(data);
  }
  localStorage.setItem("absensi", JSON.stringify(semua));
}

function ambilPengguna() {
  return JSON.parse(localStorage.getItem("pengguna") || "[]");
}

function setUserLogin(user) {
  localStorage.setItem("login", JSON.stringify(user));
}

// js/data.js

// Inisialisasi data user jika belum ada
if (!localStorage.getItem("pengguna")) {
  localStorage.setItem("pengguna", JSON.stringify([
    { username: "admin", password: "admin123", nama: "Admin", role: "admin" },
    { username: "karyawan", password: "karyawan123", nama: "Karyawan 1", role: "karyawan" }
  ]));
}

// Fungsi ambil pengguna
function ambilPengguna() {
  return JSON.parse(localStorage.getItem("pengguna")) || [];
}

// Fungsi set user login (jika diperlukan di masa depan)
function setUserLogin(user) {
  localStorage.setItem("loginUser", JSON.stringify(user));
}

// Fungsi logout (opsional)
function logoutUser() {
  localStorage.removeItem("loginUser");
}

// Hitung rekap per karyawan
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

    rekap[item.nama].total++;

    switch (item.status) {
      case "Tepat Waktu":
        rekap[item.nama].tepat++;
        break;
      case "Terlambat":
        rekap[item.nama].telat++;
        break;
      case "Pulang Cepat":
        rekap[item.nama].cepat++;
        break;
      case "Terlambat & Pulang Cepat":
        rekap[item.nama].telatCepat++;
        break;
    }
  });

  return rekap;
}

// Tampilkan rekap ke dalam tabel
function tampilkanRekap(data) {
  const rekap = hitungRekapPerKaryawan(data);
  const tbody = document.getElementById("rekapPerKaryawan");
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

// Panggil tampilkan rekap
tampilkanRekap(absensi);
