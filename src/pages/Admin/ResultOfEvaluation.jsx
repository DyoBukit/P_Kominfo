// src/pages/Admin/ResultOfEvaluation.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import EvaluationTable from './EvaluationTable';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/Api';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/bg.png';

function ResultOfEvaluation() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvaluations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/evaluations', {
        params: {
          page: currentPage,
          search: searchQuery,
        },
      });
      setEvaluations(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotalItems(response.data.total);
    } catch (err) {
      console.error("Gagal mengambil data evaluasi:", err);
      setError(`Gagal memuat data evaluasi: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  const handleGoBack = () => {
    navigate('/admin/dashboard');
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
        setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  // FUNGSI BARU UNTUK MENGEXPORT DATA
  const handleExport = async () => {
    try {
      // Panggil API export
      const response = await api.get('/admin/evaluations/export', {
        responseType: 'blob', // Penting: respons berupa blob
        params: {
          search: searchQuery,
        },
      });

      // Buat URL objek dari respons blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'evaluations.xlsx'); // Nama file
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      alert('File berhasil di-export!');
    } catch (err) {
      console.error("Gagal export file:", err);
      alert(`Gagal export file: ${err.response?.data?.message || err.message}`);
    }
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

          <h1 className="text-4xl md:text-5xl py-5 font-bold text-white mb-8 text-center">
            Result of <span className="text-blue-400">Evaluation Forms</span>
          </h1>
          
          {/* Input Pencarian & Tombol Export */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari berdasarkan judul form, nama, atau email..."
              className="w-full md:w-1/3 p-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleExport}
              className="bg-green-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-green-700 transition duration-300 w-full md:w-auto"
            >
              Export to Excel
            </button>
          </div>

          {loading ? (
            <p className="text-white text-center text-xl">Memuat data...</p>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <>
              <EvaluationTable evaluations={evaluations} />
              {/* UI Paginasi */}
              {totalItems > 0 && (
                <div className="flex justify-center items-center mt-6 space-x-2 text-gray-100">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 disabled:opacity-50 transition"
                  >
                    Sebelumnya
                  </button>
                  <span className="px-4 py-2 bg-white/10 rounded-lg">
                    Halaman {currentPage} dari {lastPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 disabled:opacity-50 transition"
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ResultOfEvaluation;
