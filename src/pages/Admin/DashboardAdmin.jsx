// src/pages/Admin/ManageUsersPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import UserTable from './UserTable'; 
import InputField from '../../components/InputField'; // Pastikan InputField sudah diupdate
import ErrorMessage from '../../components/ErrorMessage'; 
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';

import backgroundImage from '../../assets/bg.png'; 

const DUMMY_USERS = [
  { id: 1, username: 'user1', email: 'user1@example.com', role: 'user' },
  { id: 2, username: 'user2', email: 'user2@example.com', role: 'user' },
  { id: 3, username: 'moderator', email: 'mod@example.com', role: 'moderator' },
];

function ManageUsersPage() {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [formError, setFormError] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();
    setFormError('');

    const usernameError = validateRequired(newUsername, 'Username');
    const emailError = validateEmail(newEmail);
    const passwordError = validatePassword(newPassword);
    const roleError = validateRequired(newRole, 'Role');

    if (usernameError || emailError || passwordError || roleError) {
      setFormError(usernameError || emailError || passwordError || roleError);
      return;
    }

    const newUser = {
      id: users.length + 1,
      username: newUsername,
      email: newEmail,
      password: newPassword, 
      role: newRole,
    };
    setUsers([...users, newUser]);
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('user');
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col"> 
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

      <div className="relative z-10 flex-grow flex flex-col py-6"> 
        <Navbar role="admin" />
        <main className="flex-grow p-8 md:p-12 max-w-6xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl font-bold py-5 text-white mb-8 text-center">
            Manage <span className="text-blue-400">Users</span> 
          </h1>

          <form onSubmit={handleAddUser} 
                className="bg-white/10 p-10 rounded-xl shadow-2xl mb-10 grid grid-cols-1 md:grid-cols-2 gap-6
                           backdrop-blur-lg border border-white/20 text-gray-100" 
          >
            <h3 className="text-2xl font-bold text-white col-span-full mb-4 text-center">Add New User</h3> 
            
            {/* InputField Username - Hapus label manual */}
            <InputField
              label="Username" // Label sekarang dihandle oleh InputField
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="e.g., john_doe"
              // Kelas disesuaikan secara default oleh InputField
            />
            {/* InputField Email - Hapus label manual */}
            <InputField
              label="Email" // Label sekarang dihandle oleh InputField
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g., john@example.com"
            />
            {/* InputField Password - Hapus label manual */}
            <InputField
              label="Password" // Label sekarang dihandle oleh InputField
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Set password"
            />
            
            {/* Select Role - Labelnya tidak di InputField, jadi tetap manual tapi gayanya disesuaikan */}
            <div>
              <label htmlFor="newRole" className="block text-gray-100 font-semibold mb-2 text-base"> 
                Role
              </label>
              <select
                id="newRole"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full pl-4 pr-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" /* Gaya select disesuaikan */
              >
                <option value="user" className="bg-gray-800 text-white">User</option> 
                <option value="admin" className="bg-gray-800 text-white">Admin</option>
              </select>
            </div>
            {formError && <ErrorMessage message={formError} className="col-span-full" />}
            
            {/* Tombol Add User - Gaya Baru */}
            <button
              type="submit"
              className="col-span-full bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg transform active:scale-98" 
            >
              Add User
            </button>
          </form>

          <UserTable users={users} onDelete={handleDeleteUser} /> 
        </main>
      </div>
    </div>
  );
}

export default ManageUsersPage;