// src/pages/Admin/ManageQuestionsPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/Api';
import Navbar from '../../components/Navbar';
import InputField from '../../components/InputField';
import backgroundImage from '../../assets/bg.png';

// Nama fungsi bisa diubah agar lebih jelas, misal: CreateAndManageFormPage
function ManageQuestionsPage() {
  const navigate = useNavigate();

  // STATE BARU: untuk menyimpan data form yang baru saja dibuat
  const [createdForm, setCreatedForm] = useState(null); // Mulai dari null

  // State yang sudah ada, ditambah state untuk judul form
  const [formTitle, setFormTitle] = useState(''); 
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [questionType, setQuestionType] = useState('isian');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  // Fungsi untuk mengambil pertanyaan (hanya berjalan jika form sudah dibuat)
  const fetchQuestions = async () => {
    if (!createdForm) return; // Jangan lakukan apa-apa jika form belum ada
    try {
      const response = await api.get(`/admin/forms/${createdForm.id}`);
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Gagal mengambil data pertanyaan:', error);
    }
  };

  // FUNGSI BARU: untuk membuat 'cangkang' form (hanya judulnya)
  const handleCreateForm = async (e) => {
    e.preventDefault();
    if (!formTitle) {
      setError('Judul form tidak boleh kosong.');
      return;
    }
    try {
      setError('');
      const response = await api.post('/admin/forms', { title: formTitle });
      setCreatedForm(response.data); // Simpan data form yang baru (termasuk ID baru)
    } catch (err) {
      setError('Gagal membuat form baru.');
      console.error(err);
    }
  };
  
  // Fungsi ini sekarang menggunakan ID dari 'createdForm'
  const handleAddOrEditQuestion = async (e) => {
    e.preventDefault();
    if (!createdForm) return; // Guard clause

    const payload = { question: newQuestion, description, type: questionType, category };

    try {
      if (editingQuestionId) {
        await api.put(`/admin/questions/${editingQuestionId}`, payload);
      } else {
        await api.post(`/admin/forms/${createdForm.id}/questions`, payload);
      }
      setEditingQuestionId(null);
      setNewQuestion('');
      setDescription('');
      setQuestionType('isian');
      setCategory('');
      setError('');
      fetchQuestions();
    } catch (error) {
      setError('Gagal menyimpan pertanyaan.');
      console.error(error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pertanyaan ini?')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      fetchQuestions();
    } catch (error) {
      console.error('Gagal menghapus pertanyaan:', error);
    }
  };

  const startEditing = (question) => {
    setEditingQuestionId(question.id);
    setNewQuestion(question.question);
    setDescription(question.description || '');
    setQuestionType(question.type);
    setCategory(question.category || '');
    window.scrollTo(0, 200);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col" style={{ backgroundImage: `url(${backgroundImage})`}}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      <div className="relative z-10 flex-grow flex flex-col py-6">
        <Navbar role="admin" />
        <main className="flex-grow p-8 md:p-12 max-w-4xl mx-auto w-full">
          <button onClick={() => navigate('/admin/forms')} className="mb-6 ...">
            {/* ... SVG ... */}
            Kembali ke Daftar Form
          </button>
          
          {/* TAMPILAN KONDISIONAL */}
          {!createdForm ? (
            // TAHAP 1: Membuat Judul Form
            <form onSubmit={handleCreateForm} className="bg-white/10 p-8 rounded-xl ...">
              <h1 className="text-4xl font-bold text-white mb-8 text-center">Buat Form Evaluasi Baru</h1>
              <InputField
                label="Judul Form"
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Contoh: Form Evaluasi Kinerja 2025"
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white ...">
                Simpan Judul & Mulai Tambah Pertanyaan
              </button>
              {error && <p className="text-red-400 mt-4">{error}</p>}
            </form>
          ) : (
            // TAHAP 2: Mengelola Pertanyaan (setelah form dibuat)
            <div>
              <h1 className="text-4xl font-bold text-white mb-8 text-center">
                Tambah Pertanyaan untuk <br/> <span className="text-blue-400">{createdForm.title}</span>
              </h1>
              <form onSubmit={handleAddOrEditQuestion} className="bg-white/10 p-8 rounded-xl ...">
                <InputField label="Pertanyaan" type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} required />
                <InputField label="Deskripsi (Opsional)" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                <InputField label="Kategori (Opsional)" type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                <div className="mb-4">
                  <label htmlFor="questionType" className="block mb-1 text-white">Jenis Pertanyaan</label>
                  <select id="questionType" value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full ...">
                    <option value="essay" className="text-black">Text</option>
                    <option value="multiple_choice" className="text-black">Pilihan Ganda</option>
                    <option value="file" className="text-black">Unggah File</option>
                  </select>
                </div>
                <button type="submit" className="bg-blue-600 ...">
                  {editingQuestionId ? 'Simpan Perubahan' : 'Tambah Pertanyaan'}
                </button>
                {error && <p className="text-red-400 mt-4">{error}</p>}
              </form>

              <h2 className="text-2xl font-semibold text-white mt-10 mb-4">Daftar Pertanyaan</h2>
              <ul className="space-y-4">
                {questions.map((q) => (
                  <li key={q.id} className="bg-white/10 p-4 rounded-md ...">
                    {/* ... (isi list item) ... */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ManageQuestionsPage;