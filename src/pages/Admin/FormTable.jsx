// src/pages/Admin/FormTable.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Tambahkan Link
import Navbar from '../../components/Navbar';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/Api';
import backgroundImage from '../../assets/bg.png';

function FormTable() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fungsi untuk mengambil data hasil evaluasi dari backend
  const fetchForms = async () => {
    setLoadingForms(true);
    setFetchError(null);
    try {
      const response = await api.get('/admin/evaluations');
      setForms(response.data);
    } catch (err) {
      console.error("Gagal mengambil data formulir:", err.response ? err.response.data : err.message);
      // PERBAIKAN: Menambahkan backtick (`) di sekitar string
      setFetchError(`Gagal memuat formulir: ${err.response?.data?.message || err.message || 'Server tidak merespons.'}`);
    } finally {
      setLoadingForms(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleDeleteForm = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus formulir ini?')) {
      return;
    }
    try {
      // PERBAIKAN: Menambahkan backtick (`) dan endpoint yang benar
      await api.delete(`/admin/evaluations/${id}`); 
      alert('Hasil evaluasi berhasil dihapus!');
      fetchForms();
    } catch (err) {
      console.error("Gagal menghapus formulir:", err.response ? err.response.data : err.message);
      // PERBAIKAN: Menambahkan backtick (`) di sekitar string
      setFetchError(`Gagal menghapus formulir: ${err.response?.data?.message || err.message || 'Server tidak merespons.'}`);
    }
  };

  const handleViewEvaluation = (id) => {
    // PERBAIKAN: Menambahkan backtick (`)
    navigate(`/admin/forms/view/${id}`);
  };

  const handleGoBack = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          // PERBAIKAN: Menambahkan tanda kutip pada url()
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

          <h1 className="text-4xl md:text-5xl py-5 font-bold text-white mb-8 text-center">
            Result of <span className="text-blue-400">Evaluation Forms</span>
          </h1>
          
          {loadingForms ? (
            <p className="text-white text-center text-xl">Memuat formulir...</p>
          ) : fetchError ? (
            <ErrorMessage message={fetchError} />
          ) : (
            <div className="overflow-x-auto mt-8 bg-white/10 rounded-xl shadow-2xl backdrop-blur-lg border border-white/20">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">User ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Tanggal Dibuat</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-700">
                  {forms.length > 0 ? forms.map(form => (
                    <tr key={form.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.user_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.form_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.created_at ? new Date(form.created_at).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewEvaluation(form.id)}
                          className="bg-blue-600/50 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600/70 transition-colors duration-300 border border-blue-600/70"
                        >
                          Lihat Evaluasi
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-400 text-lg">
                        No evaluation forms found.
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

export default FormTable;