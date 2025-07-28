// src/pages/Admin/FormTable.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom'; 
import ErrorMessage from '../../components/ErrorMessage'; 
import api from '../../utils/Api'; // <--- PASTIKAN INI DIIMPOR DENGAN BENAR DARI FILE API.JS ANDA

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
      // >>> MENGGUNAKAN API.GET() UNTUK MENGAMBIL DATA <<<
      // Pastikan URL ini sesuai dengan rute GET di routes/api.php Anda (contoh: /api/admin/forms)
      const response = await api.get('/admin/evaluations'); 
      setForms(response.data); // Asumsi backend mengembalikan array form (evaluasi) langsung di response.data
    } catch (err) {
      console.error("Gagal mengambil data formulir:", err.response ? err.response.data : err.message);
      setFetchError(`Gagal memuat formulir: ${err.response?.data?.message || err.message || 'Server tidak merespons.'}`);
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
      // >>> MENGGUNAKAN API.DELETE() UNTUK MENGHAPUS DATA <<<
      const response = await api.delete(`/  /${id}`); // Mengirim permintaan DELETE ke /api/admin/forms/{id}

      alert('Formulir berhasil dihapus!');
      fetchForms(); // Refresh daftar formulir setelah hapus
    } catch (err) {
      console.error("Gagal menghapus formulir:", err.response ? err.response.data : err.message);
      setFetchError(`Gagal menghapus formulir: ${err.response?.data?.message || err.message || 'Server tidak merespons.'}`);
    }
  };

  // Fungsi untuk melihat detail/hasil evaluasi (menggantikan Edit)
  const handleViewEvaluation = (id) => { 
    navigate(`/admin/forms/view/${id}`); // Mengarahkan ke rute baru untuk melihat detail evaluasi
  };

  // Fungsi untuk tombol kembali
  const handleGoBack = () => {
    navigate('/admin/dashboard'); // Arahkan kembali ke dashboard admin
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
                      User ID
                    </th> {/* Kolom User ID dari database evaluations */}
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Tanggal Dibuat
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
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.user_id}</td> {/* Menampilkan user_id */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.form_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.created_at ? new Date(form.created_at).toLocaleDateString() : '-'}</td> 
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewEvaluation(form.id)} 
                          className="bg-blue-600/50 text-white py-2 px-4 rounded-md text-sm font-medium mr-2 hover:bg-blue-600/70 transition-colors duration-300 border border-blue-600/70"
                        >
                          Lihat Evaluasi
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