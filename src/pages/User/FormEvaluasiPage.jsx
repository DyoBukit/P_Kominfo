// src/pages/User/FormEvaluasiPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import EvaluationForm from '../../components/EvaluationForm';

import backgroundImage from '../../assets/bg.png'; // <--- PASTIKAN PATH INI BENAR

function FormEvaluasiPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitEvaluation = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log('Form data submitted:', formData);
      // Simulasi delay (hapus saat sudah terhubung dengan backend)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/user/evaluasi/complete');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Terjadi kesalahan saat mengirim data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi yang akan dipanggil ketika tombol kembali di EvaluationForm diklik
  const handleGoBack = () => {
    navigate('/user/evaluasi'); // <--- PASTIKAN INI mengarah ke halaman pengantar
  };

  return (
    // Lapisan Paling Luar: Container utama dengan posisi relatif
    <div className="relative min-h-screen w-full flex flex-col"> 
      
      {/* Layer 1: Background Gambar yang di-Blur */}
      <div 
        className="absolute inset-0 z-0" // Memposisikan div ini absolut menutupi seluruh parent
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay gelap semi-transparan di atas gambar background dan efek BLUR */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div> 
      </div>

      {/* Layer 2: Konten Halaman (Navbar & Main) - tetap tajam di atas blur */}
      <div className="relative z-10 flex-grow flex flex-col py-6"> 
        <Navbar role="user" />
        <main className="flex-grow p-8 md:p-12 max-w-4xl mx-auto w-full"> {/* mx-auto untuk pusatkan form */}
          {isSubmitting ? (
            <p className="text-white text-center text-xl">Mengirim data...</p>
          ) : (
            // Meneruskan fungsi handleGoBack sebagai prop 'onBack' ke EvaluationForm
            <EvaluationForm onSubmit={handleSubmitEvaluation} onBack={handleGoBack} /> 
          )}
        </main>
      </div>
    </div>
  );
}

export default FormEvaluasiPage;