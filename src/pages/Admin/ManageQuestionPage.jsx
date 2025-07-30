// src/pages/Admin/ManageQuestionsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/Api';
import Navbar from '../../components/Navbar';
import backgroundImage from '../../assets/bg.png';
import InputField from '../../components/InputField';

function ManageQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [questionType, setQuestionType] = useState('isian');
  const [category, setCategory] = useState('');

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/admin/evaluation-questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Gagal mengambil data pertanyaan:', error);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/forms/{form}/questions', {
        question: newQuestion,
        description,
        type: questionType,
        category,
      });
      fetchQuestions();
      setNewQuestion('');
      setDescription('');
      setQuestionType('isian');
      setCategory('');
    } catch (error) {
      console.error('Gagal menambahkan pertanyaan:', error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pertanyaan ini?')) return;
    try {
      await api.delete(`/admin/evaluation-questions/${id}`);
      fetchQuestions();
    } catch (error) {
      console.error('Gagal menghapus pertanyaan:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

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
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Kelola <span className="text-blue-400">Pertanyaan Evaluasi</span>
          </h1>

          <form
            onSubmit={handleAddQuestion}
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

            <div className="mb-4">
              <label htmlFor="questionType" className="block mb-1 text-white">Jenis Pertanyaan</label>
              <select
                id="questionType"
                className="w-full p-2 mb-3 border border-white/20 rounded text-white"
                value={newQuestion.type}
                onChange={(e) => setQuestionType({type: e.target.value })}
              >
                <option value="isian" className='text-black'>Isian</option>
                <option value="ya_tidak" className='text-black'>Pilihan Ya/Draft sedang diproses/Tidak</option>
              </select>
            </div>

            {questionType === 'ya_tidak' && (
              <div className="mb-4">
                <label className="block mb-1">Contoh Tampilan Jawaban</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input type="radio" disabled className="mr-2" />
                    Ya
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" disabled className="mr-2" />
                    Tidak
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg mt-4"
            >
              Tambah Pertanyaan
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
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-full"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

export default ManageQuestionsPage;
