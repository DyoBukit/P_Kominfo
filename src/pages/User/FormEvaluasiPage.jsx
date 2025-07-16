import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import EvaluationForm from '../../components/EvaluationForm';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col py-6">
      <Navbar role="user" />
      <main className="flex-grow p-8 md:p-12 max-w-4xl mx-auto w-full">
        {isSubmitting ? (
          <p className="text-white text-center text-xl">Mengirim data...</p>
        ) : (
          <EvaluationForm onSubmit={handleSubmitEvaluation} />
        )}
      </main>
    </div>
  );
}

export default FormEvaluasiPage;
