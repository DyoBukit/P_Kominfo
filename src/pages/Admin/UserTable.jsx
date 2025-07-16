// src/pages/Admin/UserTable.jsx
import React from 'react';

function UserTable({ users, onDelete }) {
  return (
    <div className="overflow-x-auto mt-8 bg-white rounded-xl shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-primary">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
              Username
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-primary/5 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onDelete(user.id)}
                  className="bg-red-300 text-black font-semibold py-2 px-4 rounded-md text-sm font-medium hover:bg-red-800 transition-colors duration-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-lg">
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