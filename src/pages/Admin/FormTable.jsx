// src/pages/Admin/FormTable.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

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
    <div className="py-6 min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
      <Navbar role="admin" />
      <main className="flex-grow p-8 md:p-12 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl py-5 font-bold text-white mb-8 text-center">
          Manage <span className="text-secondary">Evaluation Forms</span>
        </h1>
        <div className="overflow-x-auto mt-8 bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-secondary">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-lx font-bold text-black uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-lx font-bold text-black uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-lx font-bold text-black uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-lx font-bold text-black uppercase tracking-wider">
                  Created Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-lx font-bold text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.map(form => (
                <tr key={form.id} className="hover:bg-secondary/5 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{form.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{form.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{form.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{form.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEditForm(form.id)}
                      className="bg-gray-300 text-black py-2 px-4 rounded-md text-sm font-medium mr-2 hover:bg-blue-800 transition-colors duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteForm(form.id)}
                      className="bg-red-200 text-black py-2 px-4 rounded-md text-sm font-medium hover:bg-red-800 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {forms.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-lg">
                    No evaluation forms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default FormTable;