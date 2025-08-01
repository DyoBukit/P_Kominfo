// src/pages/Admin/ListForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/Api';
import backgroundImage from '../../assets/bg.png';

function ListForm() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForms = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await api.get('/admin/forms');
      setForms(response.data);
    } catch (err) {
      console.error("Gagal mengambil data form:", err);
      setError(`Gagal memuat data form: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchForms();
  }, [fetchForms]); 

  const handleGoBack = () => {
    navigate('/admin/dashboard');
  };

  const handleDeleteForm = async (formId) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus form ini? Semua pertanyaan terkait juga akan terhapus.');
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/forms/${formId}`);
      alert('Form berhasil dihapus!');

      setForms(prevForms => prevForms.filter(form => form.id !== formId));

    } catch (err) {
      console.error("Gagal menghapus form:", err.response ? err.response.data : err.message);
      alert(`Gagal menghapus form: ${err.response?.data?.message || err.message}`);
      fetchForms();
    }
  };

  const handleToggleIsActive = async (formId) => {
    const formToToggle = forms.find(form => form.id === formId);
    if (!formToToggle) return;

    const confirmed = window.confirm(`Apakah Anda yakin ingin ${formToToggle.is_active ? 'menonaktifkan' : 'mengaktifkan'} form "${formToToggle.title}"?`);
    if (!confirmed) return;

    try {
      const response = await api.patch(`/admin/forms/${formId}/toggle-active`);
      alert(`Form "${response.data.title}" berhasil ${response.data.is_active ? 'diaktifkan.' : 'dinonaktifkan.'}`);
      
      setForms(prevForms => prevForms.map(form => 
        form.id === formId ? { ...form, is_active: response.data.is_active } : 
        form.is_active ? { ...form, is_active: false } : form
      ));
      
      fetchForms();
    } catch (err) {
      let errorMessage = 'Gagal mengubah status form.';
      if (err.message === 'Network Error') {
        errorMessage = 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
      } else if (err.response?.data?.message) {
        errorMessage = `Gagal mengubah status form: ${err.response.data.message}`;
      } else {
        errorMessage = `Terjadi error: ${err.message}`;
      }
      
      console.error("Gagal mengubah status form:", err);
      alert(errorMessage);
      fetchForms();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col">
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
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">No</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Judul Form</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Jumlah Pertanyaan</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {forms.length > 0 ? forms.map((form, index) => ( 
                    <tr key={form.id} className="hover:bg-white/5">
                      {/* Tampilkan nomor urut (index + 1) */}
                      <td className="px-6 py-4 text-gray-100">{index + 1}</td>
                      <td className="px-6 py-4 text-gray-100">{form.title}</td>
                      <td className="px-6 py-4 text-gray-100">{form.questions_count}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${form.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                          {form.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <Link
                          to={`/admin/forms/${form.id}`}
                          className="bg-green-600/70 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                        >
                          Kelola Pertanyaan
                        </Link>
                        <button
                          onClick={() => handleToggleIsActive(form.id)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition duration-300
                            ${form.is_active 
                              ? 'bg-orange-500/70 text-white hover:bg-orange-600'
                              : 'bg-blue-500/70 text-white hover:bg-blue-600'
                            }`}
                        >
                          {form.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          onClick={() => handleDeleteForm(form.id)}
                          className="bg-red-600/70 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
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

export default ListForm;
