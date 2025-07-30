// src/pages/Admin/ManageQuestionsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/Api';
import Navbar from '../../components/Navbar';
import InputField from '../../components/InputField';
import ErrorMessage from '../../components/ErrorMessage';
import backgroundImage from '../../assets/bg.png';
import { useNavigate } from 'react-router-dom';

function ManageQuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [questionType, setQuestionType] = useState('isian');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/admin/forms/1');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Gagal mengambil data pertanyaan:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddOrEditQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestionId) {
        await api.put(`/admin/questions/${editingQuestionId}`, {
          question: newQuestion,
          description,
          type: questionType,
          category,
        });
      } else {
        await api.post('/admin/forms/1/questions', {
          question: newQuestion,
          description,
          type: questionType,
          category,
        });
      }
      setEditingQuestionId(null);
      setNewQuestion('');
      setDescription('');
      setQuestionType('isian');
      setCategory('');
      setError('');
      fetchQuestions();
    } catch (error) {
      setError('Gagal menyimpan pertanyaan');
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
    setCategory(question.category);
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
        <main className="flex-grow p-8 md:p-12 max-w-4xl mx-auto w-full">
          <button
            onClick={handleGoBack}
            className="mb-6 flex items-center text-gray-100 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition duration-300 border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Kelola <span className="text-blue-400">Pertanyaan Evaluasi</span>
          </h1>

          <form
            onSubmit={handleAddOrEditQuestion}
            className="bg-white/10 p-8 rounded-xl shadow-2xl mb-10 backdrop-blur-lg border border-white/20"
          >
            <InputField
              label="Pertanyaan"
              type="text"
              id="question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required
            />
            <InputField
              label="Deskripsi (Opsional)"
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <InputField
              label="Kategori (Opsional)"
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <div className="mb-4">
              <label htmlFor="questionType" className="block mb-1 text-white">Jenis Pertanyaan</label>
              <select
                id="questionType"
                className="w-full p-2 mb-3 border border-white/20 rounded text-white"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <option value="isian" className="text-black">Isian</option>
                <option value="ya-tidak-draft" className="text-black">Ya/Tidak/Draft(dalam proses)</option>
                <option value="unggah_file" className="text-black">Unggah File</option>
              </select>
            </div>

            {questionType === 'ya-tidak-draft' && (
              <div className="mb-4">
                <label className="block mb-1">Contoh Tampilan Jawaban</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input type="radio" disabled className="mr-2" />
                    Ya
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" disabled className="mr-2" />
                    Draft (dalam proses)
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" disabled className="mr-2" />
                    Tidak
                  </label>
                </div>
              </div>
            )}

            {questionType === 'unggah_file' && (
              <div className="mb-4">
                <label className="block mb-1 text-white">Contoh Tampilan Jawaban</label>
                <input type="file" disabled className="block text-sm text-white" />
                <p className="text-xs text-gray-300 mt-1">* Ukuran minimal: 10MB</p>
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg mt-4"
            >
              {editingQuestionId ? 'Simpan Perubahan' : 'Tambah Pertanyaan'}
            </button>
          </form>

          <h2 className="text-2xl font-semibold text-white mb-4">Daftar Pertanyaan</h2>
          <ul className="space-y-4">
            {questions.map((q) => (
              <li key={q.id} className="bg-white/10 p-4 rounded-md text-white flex justify-between items-center border border-white/10">
                <div>
                  <p className="font-semibold">{q.question}</p>
                  {q.description && <p className="text-sm italic text-gray-300">{q.description}</p>}
                  <p className="text-sm text-gray-400">Jenis: {q.type} | Kategori: {q.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(q)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-full"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

export default ManageQuestionsPage;
