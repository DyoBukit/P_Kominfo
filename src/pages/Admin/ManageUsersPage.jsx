// src/pages/Admin/ManageUsersPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import UserTable from './UserTable';
import InputField from '../../components/InputField';
import ErrorMessage from '../../components/ErrorMessage'; // Import ErrorMessage
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';


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
    <div className="py-6 min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
      <Navbar role="admin" />
      <main className="flex-grow p-8 md:p-12 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold py-5 text-white mb-8 text-center">
          Manage <span className="text-primary">Users</span>
        </h1>

        <form onSubmit={handleAddUser} className="bg-white p-8 rounded-xl shadow-lg mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <h3 className="text-2xl font-bold text-primary col-span-full mb-4 text-center">Add New User</h3>
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
            placeholder="Set password"
          />
          <div>
            <label htmlFor="newRole" className="block text-gray-700 font-semibold mb-2 text-base">
              Role
            </label>
            <select
              id="newRole"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-3 sm:p-4 border border-border-light rounded-lg text-base bg-white focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {formError && <ErrorMessage message={formError} className="col-span-full" />}
          <button
            type="submit"
            className="col-span-full bg-blue-300 text-black py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors duration-300"
          >
            Add User
          </button>
        </form>

        <UserTable users={users} onDelete={handleDeleteUser} />
      </main>
    </div>
  );
}

export default ManageUsersPage;