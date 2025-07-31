// src/pages/Admin/EvaluationDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../../utils/Api'; // Pastikan path ini benar
import backgroundImage from '../../assets/bg.png'; // Pastikan path ini benar

function EvaluationDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluationDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- PERBAIKAN UTAMA DI SINI ---
        // 1. Ganti 'evaluations' menjadi 'evaluasi'
        // 2. Ganti '{evaluation}' dengan id dinamis dari useParams()
        const response = await api.get(`/admin/evaluations/export`);
        setEvaluation(response.data);
      } catch (err) {
        console.error("Gagal mengambil detail evaluasi:", err.response ? err.response.data : err.message);
        setError(`Gagal memuat detail evaluasi: ${err.response?.data?.message || err.message || 'Server tidak merespons.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationDetails();
  }, [id]); // Panggil ulang jika ID berubah

  const handleGoBack = () => {
    navigate('/admin/forms'); // Kembali ke tabel formulir evaluasi
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div></div>
        <div className="relative z-10 text-white text-xl">Memuat detail evaluasi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div></div>
        <div className="relative z-10">
          <ErrorMessage message={error} />
          <button onClick={handleGoBack} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
            Kembali ke Daftar Formulir
          </button>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div></div>
        <div className="relative z-10 text-white text-xl">Evaluasi tidak ditemukan.</div>
        <button onClick={handleGoBack} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
          Kembali ke Daftar Formulir
        </button>
      </div>
    );
  }

  // URL dasar backend tanpa '/api' untuk link file
  const backendBaseURL = api.defaults.baseURL.replace('/api', '');

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Layer Background Blur */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}><div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div></div>

      {/* Layer Konten */}
      <div className="relative z-10 flex-grow flex flex-col py-6">
        <Navbar role="admin" />
        <main className="flex-grow p-8 md:p-12 max-w-4xl mx-auto w-full">
          <button onClick={handleGoBack} className="mb-6 flex items-center text-gray-100 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition duration-300 border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Kembali ke Daftar Formulir
          </button>

          <h1 className="text-4xl md:text-5xl py-5 font-bold text-white mb-8 text-center">Hasil <span className="text-blue-400">Evaluasi</span></h1>

          <div className="bg-white/10 rounded-xl shadow-2xl backdrop-blur-lg border border-white/20 p-6 md:p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{evaluation.form_title}</h2>
            <p className="mb-2"><strong>ID Evaluasi:</strong> {evaluation.id}</p>
            <p className="mb-2"><strong>Diisi oleh:</strong> {evaluation.user ? evaluation.user.name : `User ID ${evaluation.user_id}`}</p>
            <p className="mb-2"><strong>Status:</strong> {evaluation.status}</p>
            <p className="mb-4"><strong>Tanggal Dibuat:</strong> {new Date(evaluation.created_at).toLocaleString('id-ID')}</p>

            <h3 className="text-xl font-semibold mt-6 mb-4 border-b border-gray-600 pb-2">Detail Jawaban:</h3>
            {evaluation.answers && evaluation.answers.length > 0 ? (
              <div className="space-y-6">
                {evaluation.answers.map((answer) => (
                  <div key={answer.id} className="bg-white/5 p-4 rounded-lg border border-gray-700">
                    {/* Mengambil teks pertanyaan langsung dari relasi */}
                    <p className="font-semibold text-lg mb-2">{answer.question?.question_text || `Pertanyaan ID ${answer.question_id}`}</p>
                    
                    {/* Memeriksa tipe pertanyaan untuk menampilkan jawaban file */}
                    {answer.question?.type === 'file' ? (
                      <div>
                        <p className="text-gray-300">File Terlampir:</p>
                        <a
                          href={`${backendBaseURL}/storage/${answer.answer_value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0l-5.25 5.25M21 3H15" /></svg>
                          Lihat File
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">{answer.answer_value}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Tidak ada jawaban ditemukan untuk evaluasi ini.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EvaluationDetailPage;
