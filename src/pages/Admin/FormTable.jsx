// src/pages/Admin/FormTable.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

// Import gambar background Anda
import backgroundImage from '../../assets/bg.png'; // Pastikan path ini benar

const DUMMY_FORMS = [
  { id: 1, title: 'Evaluasi Kinerja Karyawan Q1 2024', status: 'Active', created: '2024-03-01' },
  { id: 2, title: 'Evaluasi Pelayanan Publik', status: 'Inactive', created: '2023-11-15' },
  { id: 3, title: 'Evaluasi Program Kerja Tahunan', status: 'Active', created: '2024-01-10' },
];

function FormTable() {
  const [forms, setForms] = useState(DUMMY_FORMS);

  const handleDeleteForm = (id) => {
    setForms(forms.filter(form => form.id !== id));
  };

  const handleEditForm = (id) => {
    alert(`Edit form with ID: ${id}`);
  };

  return (
    // Layer Paling Luar: Container utama dengan posisi relatif
    <div className="relative min-h-screen w-full flex flex-col"> 
      {/* Layer 1: Background Gambar yang di-Blur */}
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

      {/* Layer 2: Konten Halaman (Navbar & Main) - tetap tajam di atas blur */}
      <div className="relative z-10 flex-grow flex flex-col py-6"> 
        <Navbar role="admin" />
        <main className="flex-grow p-8 md:p-12 max-w-6xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl py-5 font-bold text-white mb-8 text-center">
            Manage <span className="text-blue-400">Evaluation Forms</span> {/* Warna teks aksen */}
          </h1>
          
          {/* Table Container - Gaya Frosted Glass */}
          <div className="overflow-x-auto mt-8 bg-white/10 rounded-xl shadow-2xl
                        backdrop-blur-lg border border-white/20"> {/* Gaya frosted glass */}
            <table className="min-w-full divide-y divide-gray-700"> {/* Border divider gelap */}
              <thead className="bg-white/10"> {/* Latar thead transparan */}
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider"> {/* text-sm untuk konsistensi, text-white */}
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
              <tbody className="bg-transparent divide-y divide-gray-700"> {/* Latar tbody transparan, divider gelap */}
                {forms.map(form => (
                  <tr key={form.id} className="hover:bg-white/5 transition-colors duration-200"> {/* Hover transparan */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.id}</td> {/* Warna teks disesuaikan */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">{form.created}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEditForm(form.id)}
                        className="bg-white/10 text-white py-2 px-4 rounded-md text-sm font-medium mr-2 hover:bg-white/20 transition-colors duration-300 border border-white/20" /* Gaya frosted glass tombol */
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteForm(form.id)}
                        className="bg-red-600/50 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-600/70 transition-colors duration-300 border border-red-600/70" /* Gaya frosted glass tombol merah */
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {forms.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-lg"> {/* Warna teks disesuaikan */}
                      No evaluation forms found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FormTable;