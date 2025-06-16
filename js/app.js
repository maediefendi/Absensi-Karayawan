function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const users = ambilPengguna();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    setUserLogin(user);

    cekResetHarian(); // Reset absensi jika hari baru

    document.getElementById("loginSection").classList.add("d-none");
    document.getElementById("appSection").classList.remove("d-none");
    document.getElementById("nama").value = user.nama;
    document.getElementById("nama").readOnly = false;

    if (user.role === "admin") {
      window.location.href = "dashboard.html";
    }

    tampilkanData();
  } else {
    document.getElementById("loginStatus").innerText = "Username atau password salah";
  }
}

function absen(jenis) {
  const nama = document.getElementById("nama").value;
  const posisi = document.getElementById("posisi")?.value || "-";
  const keterangan = document.getElementById("keterangan")?.value || "-";
  const sekarang = new Date();
  const tanggal = sekarang.toLocaleDateString('id-ID');
  const jam = sekarang.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace('.', ':');

  let absen = ambilAbsensi();
  let data = absen.find(a => a.nama === nama && a.tanggal === tanggal) || {
    nama,
    tanggal,
    jamMasuk: "",
    jamPulang: "",
    status: "",
    durasi: "",
    posisi: posisi,
    keterangan: keterangan
  };

  data.posisi = posisi;
  data.keterangan = keterangan;

  if (jenis === 'masuk' && !data.jamMasuk) {
    data.jamMasuk = jam;
  } else if (jenis === 'pulang' && !data.jamPulang) {
    data.jamPulang = jam;
    if (data.jamMasuk && data.jamPulang) {
      data.durasi = hitungDurasi(data.jamMasuk, data.jamPulang);
    } else {
      data.durasi = "-";
    }
  }

  data.status = tentukanStatus(data.jamMasuk, data.jamPulang);
  simpanAbsensi(data);
  tampilkanData();
}

function tentukanStatus(jamMasuk, jamPulang) {
  const telat = jamMasuk && jamMasuk > "08:00";
  const cepat = jamPulang && jamPulang < "17:00";
  if (telat && cepat) return "Terlambat & Pulang Cepat";
  if (telat) return "Terlambat";
  if (cepat) return "Pulang Cepat";
  return "Tepat Waktu";
}

function hitungDurasi(jamMasuk, jamPulang) {
  if (!jamMasuk || !jamPulang || !jamMasuk.includes(":") || !jamPulang.includes(":")) return "-";
  const [h1, m1] = jamMasuk.split(":"), [h2, m2] = jamPulang.split(":");
  const t1 = parseInt(h1) * 60 + parseInt(m1);
  const t2 = parseInt(h2) * 60 + parseInt(m2);
  const total = t2 - t1;
  const jam = Math.floor(total / 60);
  const menit = total % 60;
  return `${jam}j ${menit}m`;
}

function tampilkanData() {
  const data = ambilAbsensi();
  const tbody = document.querySelector("#tabelAbsensi tbody");
  tbody.innerHTML = "";

  if (data.length === 0) return;

  data.forEach((d, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${d.nama}</td>
      <td>${d.tanggal}</td>
      <td>${d.jamMasuk || "-"}</td>
      <td>${d.jamPulang || "-"}</td>
      <td>${d.durasi || "-"}</td>
      <td>${d.status || "-"}</td>
      <td>${d.posisi || "-"}</td>
      <td>${d.keterangan || "-"}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("tabelAbsensi").classList.remove("d-none");
  document.getElementById("exportBtn").classList.remove("d-none");
}

function exportToExcel() {
  const data = ambilAbsensi();
  let csv = "No,Nama,Tanggal,Jam Masuk,Jam Pulang,Durasi,Status,Posisi,Keterangan\n";
  data.forEach((d, i) => {
    csv += `${i + 1},${d.nama},${d.tanggal},${d.jamMasuk || "-"},${d.jamPulang || "-"},${d.durasi || "-"},${d.status || "-"},${d.posisi || "-"},${d.keterangan || "-"}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "absensi.csv";
  a.click();
}

function logoutUser() {
  localStorage.removeItem("userLogin");
  window.location.href = "index.html";
}

function cekResetHarian() {
  const hariIni = new Date().toLocaleDateString('id-ID');
  const tanggalTerakhir = localStorage.getItem("tanggalTerakhir");

  if (tanggalTerakhir !== hariIni) {
    localStorage.setItem("absensi", JSON.stringify([]));
    localStorage.setItem("tanggalTerakhir", hariIni);
  }
}
