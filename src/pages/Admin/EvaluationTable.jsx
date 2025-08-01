// src/pages/Admin/EvaluationTable.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function EvaluationTable({ evaluations }) {
  const navigate = useNavigate();

  const handleViewEvaluation = (id) => {
    navigate(`/admin/forms/view/${id}`);
  };

  return (
    <div className="overflow-x-auto mt-8 bg-white/10 rounded-xl shadow-2xl backdrop-blur-lg border border-white/20">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-white/10">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">No</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Nama User</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Email User</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Judul Form</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Status</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Tanggal Dibuat</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-gray-700">
          {evaluations.length > 0 ? evaluations.map((evaluation, index) => (
            <tr key={evaluation.id} className="hover:bg-white/5 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">{evaluation.user?.name || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">{evaluation.user?.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">{evaluation.form_title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">{evaluation.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">{evaluation.created_at ? new Date(evaluation.created_at).toLocaleDateString() : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleViewEvaluation(evaluation.id)}
                  className="bg-blue-600/50 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600/70 transition-colors duration-300 border border-blue-600/70"
                >
                  Lihat Evaluasi
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-lg">
                No evaluation forms found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EvaluationTable;
