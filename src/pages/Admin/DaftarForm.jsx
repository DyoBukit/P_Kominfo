// src/pages/Admin/FormTable.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/Api';
import backgroundImage from '../../assets/bg.png';

function DaftarForm() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        // Mengambil data dari endpoint /admin/forms untuk mendapatkan daftar form template
        const response = await api.get('/admin/forms');
        setForms(response.data);
      } catch (err) {
        console.error("Gagal mengambil data form:", err);
        // PERBAIKAN: Menambahkan backtick (`) di sini
        setError(`Gagal memuat data form: ${err.response?.data?.message || err.message}`);
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
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Background */}
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

      {/* Konten */}
      <div className="relative z-10 flex-grow flex flex-col py-6">
        <Navbar role="admin" />
        <main className="flex-grow p-8 md:p-12 max-w-6xl mx-auto w-full">
          <button
            onClick={handleGoBack}
            className="mb-6 flex items-center text-gray-100 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition duration-300 border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </button>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Kelola <span className="text-blue-400">Form Evaluasi</span>
            </h1>
            <Link
              to="/admin/forms/create"
              className="bg-blue-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
            >
              + Buat Form Baru
            </Link>
          </div>
          
          {loading ? (
            <p className="text-white text-center text-xl">Memuat data...</p>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="overflow-x-auto bg-white/10 rounded-xl shadow-2xl border border-white/20">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Judul Form</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Jumlah Pertanyaan</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {forms.length > 0 ? forms.map(form => (
                    <tr key={form.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-gray-100">{form.id}</td>
                      <td className="px-6 py-4 text-gray-100">{form.title}</td>
                      <td className="px-6 py-4 text-gray-100">{form.questions_count}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/manage-questions/${form.id}`}
                          className="bg-green-600/70 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                        >
                          Kelola Pertanyaan
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                        Belum ada form yang dibuat.
                      </td>
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

export default DaftarForm;