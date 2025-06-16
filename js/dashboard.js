document.addEventListener("DOMContentLoaded", () => {
  tampilkanStatistik();
  tampilkanGrafik();
  tampilkanTabelAbsensi();
  tampilkanRekapKaryawan();
});

function tampilkanStatistik() {
  const data = ambilAbsensi();
  const hariIni = new Date().toLocaleDateString('id-ID');

  const hariIniData = data.filter(d => d.tanggal === hariIni);
  document.getElementById("totalHariIni").textContent = hariIniData.length;
  document.getElementById("jumlahTerlambat").textContent = hariIniData.filter(d => d.status.includes("Terlambat")).length;
  document.getElementById("jumlahPulangCepat").textContent = hariIniData.filter(d => d.status.includes("Pulang Cepat")).length;
}

function tampilkanGrafik() {
  const ctx = document.getElementById("grafikHarian").getContext("2d");
  const data = ambilAbsensi();

  const tanggalUnik = [...new Set(data.map(d => d.tanggal))].slice(-7); // 7 hari terakhir
  const jumlahPerHari = tanggalUnik.map(tgl => data.filter(d => d.tanggal === tgl).length);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: tanggalUnik,
      datasets: [{
        label: "Jumlah Absen",
        data: jumlahPerHari,
        backgroundColor: "#0d6efd"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function tampilkanTabelAbsensi() {
  const absensi = ambilAbsensi();
  const tbody = document.querySelector('#tabelAbsensi tbody');
  tbody.innerHTML = "";

  if (absensi.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Belum ada data absensi.</td></tr>`;
    return;
  }

  absensi.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.nama}</td>
      <td>${item.tanggal}</td>
      <td>${item.jamMasuk}</td>
      <td>${item.jamPulang || '-'}</td>
      <td>${item.durasiKerja || '-'}</td>
      <td>${item.status}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('tabelAbsensi').classList.remove('d-none');
}

function tampilkanRekapKaryawan() {
  const absensi = ambilAbsensi();
  const rekap = {};

  absensi.forEach(item => {
    if (!rekap[item.nama]) {
      rekap[item.nama] = { tepat: 0, terlambat: 0, pulangCepat: 0, keduanya: 0, total: 0 };
    }

    const r = rekap[item.nama];
    const s = item.status;
    if (s.includes("Tepat Waktu")) r.tepat++;
    else if (s.includes("Terlambat") && s.includes("Pulang Cepat")) r.keduanya++;
    else if (s.includes("Terlambat")) r.terlambat++;
    else if (s.includes("Pulang Cepat")) r.pulangCepat++;

    r.total++;
  });

  const tbody = document.getElementById("rekapPerKaryawan");
  tbody.innerHTML = "";

  const namaKaryawan = Object.keys(rekap);
  if (namaKaryawan.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Belum ada rekap tersedia.</td></tr>`;
    return;
  }

  namaKaryawan.forEach(nama => {
    const r = rekap[nama];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nama}</td>
      <td>${r.tepat}</td>
      <td>${r.terlambat}</td>
      <td>${r.pulangCepat}</td>
      <td>${r.keduanya}</td>
      <td>${r.total}</td>
    `;
    tbody.appendChild(tr);
  });
}

