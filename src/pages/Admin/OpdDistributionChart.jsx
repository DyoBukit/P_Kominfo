// src/pages/Admin/OpdDistributionChart.jsx
import React, { useState, useEffect } from 'react'; // Import useState dan useEffect
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'; // Tambahkan Title jika digunakan di options

// Daftarkan elemen Chart.js yang digunakan
ChartJS.register(ArcElement, Tooltip, Legend, Title); // Pastikan Title juga terdaftar jika digunakan

function OpdDistributionChart() {
  const [opdStats, setOpdStats] = useState([]); // State untuk menyimpan data statistik dari backend
  const [loading, setLoading] = useState(true); // State untuk indikator loading
  const [error, setError] = useState(null); // State untuk error

  // Fungsi untuk mengambil data dari backend
  useEffect(() => {
    const fetchOpdData = async () => {
      setLoading(true);
      setError(null); // Reset error setiap kali fetch
      try {
        // >>> GANTI URL INI DENGAN ENDPOINT API BACKEND ANDA YANG SEBENARNYA <<<
        // Contoh: Jika backend Anda berjalan di localhost:8000, dan endpoint-nya adalah /api/opd-statistics
        const response = await fetch('http://localhost:8000/api/opd-statistics'); // Sesuaikan URL API Anda
        
        if (!response.ok) {
          // Tangani jika respons tidak OK (misal status 404, 500)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Asumsi format data dari backend adalah array objek seperti:
        // [{ opd_name: 'Dinas A', form_count: 30 }, { opd_name: 'Dinas B', form_count: 20 }]
        // Jika backend Anda mengembalikan data di dalam properti 'data' (contoh: { success: true, data: [...] })
        // Anda mungkin perlu mengubahnya menjadi `setOpdStats(result.data);`
        if (Array.isArray(result)) { // Jika backend langsung mengembalikan array
          setOpdStats(result);
        } else if (result.data && Array.isArray(result.data)) { // Jika backend mengembalikan { data: [...] }
          setOpdStats(result.data);
        } else {
          throw new Error("Format data dari backend tidak sesuai. Diharapkan array atau objek dengan properti 'data' berupa array.");
        }
      } catch (err) {
        console.error("Gagal mengambil data OPD:", err);
        setError("Gagal memuat data statistik. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpdData();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat komponen mount

  // Persiapkan data untuk Chart.js berdasarkan opdStats yang sudah diambil
  const chartData = {
    labels: opdStats.map(item => item.opd_name), // Ambil nama OPD dari data
    datasets: [
      {
        label: 'Jumlah Formulir',
        data: opdStats.map(item => item.form_count), // Ambil jumlah formulir dari data
        backgroundColor: [ // Warna untuk setiap segmen diagram lingkaran (bisa disesuaikan atau dibuat dinamis)
          'rgba(255, 99, 132, 0.7)', // Merah
          'rgba(54, 162, 235, 0.7)', // Biru
          'rgba(255, 206, 86, 0.7)', // Kuning
          'rgba(75, 192, 192, 0.7)', // Hijau
          'rgba(153, 102, 255, 0.7)', // Ungu
          'rgba(255, 159, 64, 0.7)',  // Oranye
          'rgba(199, 199, 199, 0.7)', // Abu-abu
          'rgba(83, 109, 254, 0.7)',  // Biru terang
          'rgba(255, 120, 200, 0.7)', // Pink
          'rgba(120, 255, 120, 0.7)', // Hijau muda
        ],
        borderColor: [ // Warna border untuk setiap segmen
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 109, 254, 1)',
          'rgba(255, 120, 200, 1)',
          'rgba(120, 255, 120, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Penting untuk kontrol ukuran yang lebih baik dalam div
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 14 // Ukuran font legenda
          }
        }
      },
      title: {
        display: true,
        text: 'Distribusi Pengisian Formulir per OPD',
        color: 'white',
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: { // Gaya tooltip saat hover
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 12
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="bg-white/10 p-8 rounded-xl shadow-2xl backdrop-blur-lg border border-white/20 text-gray-100 flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-lg">Memuat data statistik...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 p-8 rounded-xl shadow-2xl backdrop-blur-lg border border-white/20 text-red-400 flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-lg">Error: {error}</p>
        <p className="text-sm text-gray-400 mt-2">Pastikan backend berjalan dan endpoint API '/api/opd-statistics' benar dan mengembalikan data dalam format yang diharapkan.</p>
      </div>
    );
  }

  // Jika tidak ada data OPD, tampilkan pesan
  if (opdStats.length === 0) {
    return (
      <div className="bg-white/10 p-8 rounded-xl shadow-2xl backdrop-blur-lg border border-white/20 text-gray-400 flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-lg">Tidak ada data formulir ditemukan untuk statistik OPD.</p>
        <p className="text-sm text-gray-400 mt-2">Mungkin belum ada pengisian formulir atau ada masalah dengan data yang diterima.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 p-8 rounded-xl shadow-2xl backdrop-blur-lg border border-white/20 text-gray-100 flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold mb-4 text-white">Statistik Distribusi OPD</h3>
      <div className="relative w-full md:w-3/4 lg:w-2/3 xl:w-1/2" style={{ height: '400px' }}> {/* Gunakan height untuk kontrol ukuran diagram */}
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default OpdDistributionChart;