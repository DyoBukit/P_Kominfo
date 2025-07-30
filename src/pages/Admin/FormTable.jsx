import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/Api';
import backgroundImage from '../../assets/bg.png';

function FormTable() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchForms = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await api.get(`/admin/evaluations?page=${page}&search=${search}`);
      setForms(response.data.data);
      setLastPage(response.data.last_page);
    } catch (err) {
      setFetchError("Gagal memuat data evaluasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [page, search]);

  const handleViewEvaluation = (id) => {
    navigate(`/admin/forms/view/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset ke page 1 saat pencarian
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
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Evaluation Forms</h1>
            <input
              type="text"
              placeholder="Cari nama, email, OPD..."
              value={search}
              onChange={handleSearchChange}
              className="px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none"
            />
          </div>

          {loading ? (
            <p className="text-white">Memuat data...</p>
          ) : fetchError ? (
            <ErrorMessage message={fetchError} />
          ) : (
            <div className="overflow-x-auto bg-white/10 rounded-xl shadow-xl border border-white/20 backdrop-blur">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">No</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">Nama User</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">OPD</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {forms.length > 0 ? forms.map((form, index) => (
                    <tr key={form.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-white">{(page - 1) * 10 + index + 1}</td>
                      <td className="px-4 py-3 text-white">{form.user?.name || '-'}</td>
                      <td className="px-4 py-3 text-white">{form.user?.email || '-'}</td>
                      <td className="px-4 py-3 text-white">{form.status}</td>
                      <td className="px-4 py-3 text-white">{new Date(form.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewEvaluation(form.id)}
                          className="bg-blue-600/70 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 border border-blue-700"
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-white text-center py-6">Tidak ada data ditemukan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: lastPage }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default FormTable;
