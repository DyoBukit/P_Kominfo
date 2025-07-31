// src/pages/Admin/FormTable.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import Navbar from '../../components/Navbar';
import api from '../../utils/Api';
import backgroundImage from '../../assets/bg.png';

function FormTable() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]); // State ini akan berisi daftar form template
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        // 1. Mengambil data dari endpoint /admin/forms, bukan /evaluations
        const response = await api.get('/admin/forms'); 
        setForms(response.data); // Asumsi response.data adalah array of forms
      } catch (err) {
        setError("Gagal memuat data form. Pastikan backend berjalan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleGoBack = () => {
    navigate('/admin/dashboard'); 
  };

  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 py-6">
        <Navbar role="admin" />
        <main className="p-8 md:p-12 max-w-6xl mx-auto">
          <button
            onClick={handleGoBack}
            className="mb-6 flex items-center text-gray-100 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition duration-300 border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </button>
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Kelola Form Evaluasi</h1>
            {/* Anda bisa menambahkan tombol "Buat Form Baru" di sini nanti */}
          </div>

          {loading ? (
            <p className="text-white text-center">Memuat data...</p>
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : (
            <div className="overflow-x-auto bg-white/10 rounded-xl shadow-xl border border-white/20 backdrop-blur">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-white/10">
                  <tr>
                    {/* 2. Mengubah kolom tabel agar sesuai untuk form template */}
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">Judul Form</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {forms.length > 0 ? forms.map((form) => (
                    <tr key={form.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-white">{form.id}</td>
                      <td className="px-4 py-3 text-white">{form.title}</td>
                      <td className="px-4 py-3 text-white">{form.is_active ? 'Aktif' : 'Tidak Aktif'}</td>
                      <td className="px-4 py-3">
                        {/* 3. INI ADALAH LINK DINAMIS YANG BENAR */}
                        <Link
                          to={`/admin/manage-questions/${form.id}`}
                          className="bg-blue-600/70 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 border border-blue-700"
                        >
                          Kelola Pertanyaan
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-white text-center py-6">Tidak ada form yang dibuat.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default FormTable;