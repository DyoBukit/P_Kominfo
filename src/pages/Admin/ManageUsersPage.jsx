// src/pages/Admin/ManageUsersPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import UserTable from './UserTable'; 
import InputField from '../../components/InputField'; 
import ErrorMessage from '../../components/ErrorMessage'; 
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';
import { useNavigate } from 'react-router-dom'; 

import backgroundImage from '../../assets/bg.png'; 

function ManageUsersPage() {
  const navigate = useNavigate(); 

  const [users, setUsers] = useState([]); 
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [formError, setFormError] = useState(''); 
  const [loadingUsers, setLoadingUsers] = useState(true); 
  const [fetchError, setFetchError] = useState(null); 

  // >>>>>> PERBAIKAN: Tambahkan kembali deklarasi state editingUser <<<<<<
  const [editingUser, setEditingUser] = useState(null); 

  // Fungsi untuk reset form fields
  const resetFormFields = () => {
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('user'); 
    setFormError('');
  };

  // Fungsi untuk mengambil data pengguna dari backend
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setFetchError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/users`); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data); 
    } catch (err) {
      console.error("Gagal mengambil data pengguna:", err);
      setFetchError(`Gagal memuat pengguna. Pastikan backend berjalan.`);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); 

  // Fungsi yang dipanggil saat tombol Edit di UserTable diklik
  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit); 
    setNewUsername(userToEdit.username);
    setNewEmail(userToEdit.email);
    setNewPassword(''); 
    setNewRole('user'); 
    setFormError(''); 
  };

  const handleCancelEdit = () => {
    setEditingUser(null); 
    resetFormFields(); 
  };

  // Fungsi untuk menyimpan perubahan pengguna yang diedit
  const handleSaveEditedUser = async (e) => {
    e.preventDefault();
    setFormError('');

    const usernameError = validateRequired(newUsername, 'Username');
    const emailError = validateEmail(newEmail);
    const passwordError = newPassword ? validatePassword(newPassword) : ''; 

    if (usernameError || emailError || passwordError) { 
      setFormError(usernameError || emailError || passwordError);
      return;
    }

    try {
      const updatedUserData = {
        username: newUsername,
        email: newEmail,
        role: 'user', 
      };
      if (newPassword) { 
        updatedUserData.password = newPassword;
      }

      const response = await fetch(`http://localhost:8000/api/users/${editingUser.id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert('Pengguna berhasil diperbarui!');
      setEditingUser(null); 
      resetFormFields(); 
      fetchUsers(); 
    } catch (err) {
      console.error("Gagal memperbarui pengguna:", err);
      setFormError(`Gagal memperbarui pengguna: ${err.message || err.toString()}`);
    }
  };

  const handleAddUser = async (e) => { 
    e.preventDefault();
    setFormError('');

    const usernameError = validateRequired(newUsername, 'Username');
    const emailError = validateEmail(newEmail);
    const passwordError = validatePassword(newPassword);

    if (usernameError || emailError || passwordError) { 
      setFormError(usernameError || emailError || passwordError);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername,
          email: newEmail,
          password: newPassword, 
          role: 'user', 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert('Pengguna berhasil ditambahkan!');
      fetchUsers(); 
      resetFormFields(); 
    } catch (err) {
      console.error("Gagal menambahkan pengguna:", err);
      setFormError(`Gagal menambahkan pengguna: ${err.message || err.toString()}`);
    }
  };

  const handleDeleteUser = async (id) => { 
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${token}` 
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert('Pengguna berhasil dihapus!');
      fetchUsers();
    } catch (err) {
      console.error("Gagal menghapus pengguna:", err);
      setFetchError(`Gagal menghapus pengguna: ${err.message || err.toString()}`);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/dashboard'); 
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
            Manage <span className="text-blue-400">Users</span> 
          </h1>

          {/* Form Add/Edit User */}
          <form onSubmit={editingUser ? handleSaveEditedUser : handleAddUser} 
                className="bg-white/10 p-10 rounded-xl shadow-2xl mb-10 grid grid-cols-1 md:grid-cols-2 gap-6
                           backdrop-blur-lg border border-white/20 text-gray-100" 
          >
            <h3 className="text-2xl font-bold text-white col-span-full mb-4 text-center">
              {editingUser ? 'Edit User' : 'Add New User'} 
            </h3> 
            
            <InputField
              label="Username" 
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="e.g., john_doe"
            />
            <InputField
              label="Email" 
              type="email" 
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g., john@example.com"
            />
            <InputField
              label="Password" 
              type="password" 
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={editingUser ? 'Biarkan kosong jika tidak diubah' : 'Set password'} 
            />
            
            {/* Select Role (dihilangkan seperti permintaan sebelumnya) */}
            {/* Pastikan `newRole` selalu diset ke 'user' secara internal */}
            {/* ... Kode sebelumnya untuk select role yang dikomentari ... */}
            {/* Jika Anda ingin menambahkan kembali opsi role untuk admin, Anda perlu mengelola state newRole dari context atau dari input ini */}
            
            {formError && <ErrorMessage message={formError} className="col-span-full" />}
            
            <button
              type="submit"
              className="col-span-full bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg transform active:scale-98" 
            >
              {editingUser ? 'Save Changes' : 'Add User'} 
            </button>

            {editingUser && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="col-span-full mt-4 bg-gray-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-gray-700 transition-colors duration-300 shadow-lg transform active:scale-98"
              >
                Cancel
              </button>
            )}
          </form>

          {loadingUsers ? (
            <p className="text-white text-center text-xl">Memuat pengguna...</p>
          ) : fetchError ? (
            <ErrorMessage message={fetchError} />
          ) : (
            <UserTable users={users} onDelete={handleDeleteUser} onEdit={handleEditUser} /> 
          )}
        </main>
      </div>
    </div>
  );
}

export default ManageUsersPage;