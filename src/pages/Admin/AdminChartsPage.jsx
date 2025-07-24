// src/pages/Admin/AdminChartsPage.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import OpdDistributionChart from './OpdDistributionChart'; // Import komponen chart
import { useNavigate } from 'react-router-dom'; // Untuk tombol kembali

import backgroundImage from '../../assets/bg.png'; // Import gambar background

function AdminChartsPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/admin/dashboard'); // Kembali ke dashboard admin
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

      {/* Layer Konten (Navbar & Main) */}
      <div className="relative z-10 flex-grow flex flex-col py-6"> 
        <Navbar role="admin" />
        <main className="flex-grow p-8 md:p-12 max-w-6xl mx-auto w-full"> {/* max-w-6xl untuk chart */}
          {/* Tombol Kembali */}
          <button
            onClick={handleGoBack}
            className="mb-6 flex items-center text-gray-100 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition duration-300 border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </button>

          <h1 className="text-4xl md:text-5xl font-bold py-5 text-white mb-8 text-center">
            Statistik <span className="text-blue-400">Distribusi OPD</span> 
          </h1>

          {/* Render komponen chart di sini */}
          <div className="flex justify-center mt-8">
            <OpdDistributionChart />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminChartsPage;