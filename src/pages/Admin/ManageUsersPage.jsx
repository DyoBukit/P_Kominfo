// src/pages/Admin/ManageUsersPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import UserTable from './UserTable'; 
import InputField from '../../components/InputField'; 
import ErrorMessage from '../../components/ErrorMessage'; 
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/Api'; 
import backgroundImage from '../../assets/bg.png'; 

function ManageUsersPage() {
  const navigate = useNavigate(); 

  const [users, setUsers] = useState([]); 
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [newRole, setNewRole] = useState('user'); 
  const [formError, setFormError] = useState(''); 
  const [loadingUsers, setLoadingUsers] = useState(true); 
  const [fetchError, setFetchError] = useState(null); 

  const [editingUser, setEditingUser] = useState(null); 

  const resetFormFields = () => {
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setConfirmPassword(''); 
    setNewRole('user'); 
    setFormError('');
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setFetchError(null);
    try {
      const response = await api.get('/admin/users'); 
      setUsers(response.data); 
    } catch (err) {
      console.error("Gagal mengambil data pengguna:", err.response ? err.response.data : err.message);
      setFetchError(`Gagal memuat pengguna: ${err.response?.data?.message || err.message || 'Server tidak merespons.'}`);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); 

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit); 
    setNewUsername(userToEdit.username);
    setNewEmail(userToEdit.email);
    setNewPassword(''); 
    setConfirmPassword(''); 
    setNewRole('user'); 
    setFormError(''); 
  };

  const handleCancelEdit = () => {
    setEditingUser(null); 
    resetFormFields(); 
  };

  const handleSaveEditedUser = async (e) => {
    e.preventDefault();
    setFormError('');

    const usernameError = validateRequired(newUsername, 'Username');
    const emailError = validateEmail(newEmail);
    let passwordError = '';
    let confirmPasswordError = '';

    if (newPassword) { 
      passwordError = validatePassword(newPassword);
      if (newPassword !== confirmPassword) { 
        confirmPasswordError = 'Konfirmasi password tidak cocok.';
      }
    }

    if (usernameError || emailError || passwordError || confirmPasswordError) { 
      setFormError(usernameError || emailError || passwordError || confirmPasswordError);
      return;
    }

    try {
      const updatedUserData = {
        name: newUsername,
        username: newUsername,
        email: newEmail,
        role: 'user', 
      };
      if (newPassword) { 
        updatedUserData.password = newPassword;
        updatedUserData.password_confirmation = confirmPassword; 
      }

      const response = await api.put(`/admin/users/${editingUser.id}`, updatedUserData); 

      alert('Pengguna berhasil diperbarui!');
      setEditingUser(null); 
      resetFormFields(); 
      fetchUsers(); 
    } catch (err) {
      console.error("Gagal memperbarui pengguna:", err.response ? err.response.data : err.message);
      setFormError(`Gagal memperbarui pengguna: ${err.response?.data?.message || err.message || 'Server tidak merespons.'}`);
    }
  };

  const handleAddUser = async (e) => { 
    e.preventDefault();
    setFormError('');

    const usernameError = validateRequired(newUsername, 'Username');
    const emailError = validateEmail(newEmail);
    const passwordError = validatePassword(newPassword);
    let confirmPasswordError = '';

    if (newPassword !== confirmPassword) { 
      confirmPasswordError = 'Konfirmasi password tidak cocok.';
    }

    if (usernameError || emailError || passwordError || confirmPasswordError) { 
      setFormError(usernameError || emailError || passwordError || confirmPasswordError);
      return;
    }

    try {
      const response = await api.post('/admin/users', { 
        name: newUsername,
        username: newUsername,
        email: newEmail,
        password: newPassword, 
        password_confirmation: confirmPassword,
        role: 'user', 
      });

      alert('Pengguna berhasil ditambahkan!');
      fetchUsers(); 
      resetFormFields(); 
    } catch (err) {
      console.error("Gagal menambahkan pengguna:", err.response ? err.response.data : err.message);
      setFormError(`Gagal menambahkan pengguna: ${err.response?.data?.message || err.message || 'Server tidak merespons.'}`);
    }
  };

  const handleDeleteUser = async (id) => { 
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return;
    }
    try {
      const response = await api.delete(`/admin/users/${id}`); 

      alert('Pengguna berhasil dihapus!');
      fetchUsers();
    } catch (err) {
      console.error("Gagal menghapus pengguna:", err.response ? err.response.data : err.message);
      setFetchError(`Gagal menghapus pengguna: ${err.response?.data?.message || err.message || 'Server tidak merespons.'}`);
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
            {/* Input Field untuk Konfirmasi Password */}
            <InputField
              label="Confirm Password" 
              type="password" 
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={editingUser ? 'Biarkan kosong jika tidak diubah' : 'Konfirmasi password'} 
            />
            
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