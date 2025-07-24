// src/pages/Admin/FormTable.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom'; 
import ErrorMessage from '../../components/ErrorMessage'; // Pastikan ini diimpor dengan benar

// Import gambar background Anda
import backgroundImage from '../../assets/bg.png'; // Pastikan path ini benar

function FormTable() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]); // State untuk menyimpan data formulir dari backend
  const [loadingForms, setLoadingForms] = useState(true); // State loading
  const [fetchError, setFetchError] = useState(null); // State error

  // Fungsi untuk mengambil data formulir dari backend
  const fetchForms = async () => {
    setLoadingForms(true);
    setFetchError(null);
    try {
      // >>> PERBAIKAN: Gunakan backticks untuk URL <<<
      const response = await fetch(`http://localhost:8000/api/forms`); 
      if (!response.ok) {
        // >>> PERBAIKAN: Gunakan backticks untuk pesan error <<<
        throw new Error(`HTTP error! status: ${response.status}`); 
      }
      const data = await response.json();
      setForms(data); 
    } catch (err) {
      console.error("Gagal mengambil data formulir:", err);
      // >>> PERBAIKAN: Gunakan backticks untuk pesan error <<<
      setFetchError(`Gagal memuat formulir. Pastikan backend berjalan.`); 
    } finally {
      setLoadingForms(false);
    }
  };

  // useEffect untuk memuat formulir saat komponen dimuat
  useEffect(() => {
    fetchForms();
  }, []);

  const handleDeleteForm = async (id) => { 
    if (!window.confirm('Apakah Anda yakin ingin menghapus formulir ini?')) {
      return;
    }
    try {
      // >>> PERBAIKAN: Gunakan backticks untuk URL <<<
      const response = await fetch(`http://localhost:8000/api/forms/${id}`, {
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${token}` // Tambahkan jika ada autentikasi API
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        // >>> PERBAIKAN: Gunakan backticks untuk pesan error <<<
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`); 
      }

      alert('Formulir berhasil dihapus!');
      fetchForms(); 
    } catch (err) {
      console.error("Gagal menghapus formulir:", err);
      // >>> PERBAIKAN: Gunakan backticks untuk pesan error <<<
      setFetchError(`Gagal menghapus formulir: ${err.message || err.toString()}`);
    }
  };

  const handleEditForm = (id) => {
    // >>> PERBAIKAN: Gunakan backticks untuk navigasi <<<
    navigate(`/admin/forms/edit/${id}`); 
  };

  // Fungsi untuk tombol kembali
  const handleGoBack = () => {
    navigate('/admin/dashboard'); 
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col"> 
      {/* Layer Background Blur */}
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

      {/* Layer Konten (Navbar & Main) - tetap tajam di atas blur */}
      <div className="relative z-10 flex-grow flex flex-col py-6"> 
        <Navbar role="admin" />
        <main className="flex-grow p-8 md:p-12 max-w-6xl mx-auto w-full">
          {/* Tombol Kembali di sini */}
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
            Manage <span className="text-blue-400">Evaluation Forms</span> 
          </h1>
          
          {/* Loading/Error/Table Container */}
          {loadingForms ? (
            <p className="text-white text-center text-xl">Memuat formulir...</p>
          ) : fetchError ? (
            <ErrorMessage message={fetchError} />
          ) : (
            <div className="overflow-x-auto mt-8 bg-white/10 rounded-xl shadow-2xl
                          backdrop-blur-lg border border-white/20"> 
              <table className="min-w-full divide-y divide-gray-700"> 
                <thead className="bg-white/10"> 
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-700"> 
                  {forms.map(form => (
                    <tr key={form.id} className="hover:bg-white/5 transition-colors duration-200"> 
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.id}</td> 
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.created}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEditForm(form.id)} 
                          className="bg-blue-600/50 text-white py-2 px-4 rounded-md text-sm font-medium mr-2 hover:bg-blue-600/70 transition-colors duration-300 border border-blue-600/70"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteForm(form.id)}
                          className="bg-red-600/50 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-600/70 transition-colors duration-300 border border-red-600/70" 
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {forms.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-lg"> 
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