// src/pages/Admin/UserTable.jsx
import React from 'react';

function UserTable({ users, onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto mt-8 bg-white/10 rounded-xl shadow-2xl backdrop-blur-lg border border-white/20">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-white/10">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
              No
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
              Username
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
              OPD
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-gray-700">
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-white/5 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                {user.OPD}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onEdit(user)}
                  className="bg-blue-600/50 text-white py-2 px-4 rounded-md text-sm font-medium mr-2 hover:bg-blue-600/70 transition-colors duration-300 border border-blue-600/70"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-lg">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
