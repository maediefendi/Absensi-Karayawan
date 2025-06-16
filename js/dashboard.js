document.addEventListener("DOMContentLoaded", () => {
  tampilkanStatistik();
  tampilkanGrafik();
});

function tampilkanStatistik() {
  const data = ambilAbsensi();
  const hariIni = new Date().toLocaleDateString('id-ID');

  const hariIniData = data.filter(d => d.tanggal === hariIni);
  const total = hariIniData.length;
  const telat = hariIniData.filter(d => d.status.includes("Terlambat")).length;
  const cepat = hariIniData.filter(d => d.status.includes("Pulang Cepat")).length;

  document.getElementById("totalAbsen").innerText = total;
  document.getElementById("terlambat").innerText = telat;
  document.getElementById("pulangCepat").innerText = cepat;
}

function tampilkanGrafik() {
  const ctx = document.getElementById("grafikKehadiran").getContext("2d");
  const data = ambilAbsensi();

  const hari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const nilai = new Array(7).fill(0);

  data.forEach(d => {
    const tgl = new Date(d.tanggal.split("/").reverse().join("-"));
    const idx = (tgl.getDay() + 6) % 7; // ubah agar Senin di indeks 0
    nilai[idx]++;
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: hari,
      datasets: [{
        label: "Jumlah Kehadiran",
        data: nilai,
        backgroundColor: "#0d6efd"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}
