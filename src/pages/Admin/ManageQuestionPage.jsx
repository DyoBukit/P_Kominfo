// src/pages/Admin/ManageQuestionsPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/Api';
import Navbar from '../../components/Navbar';
import InputField from '../../components/InputField';
import backgroundImage from '../../assets/bg.png';

function ManageQuestionsPage() {
  const navigate = useNavigate();

  const [createdForm, setCreatedForm] = useState(null);
  const [formTitle, setFormTitle] = useState(''); 
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [questionType, setQuestionType] = useState('essay'); // Ubah default ke 'essay'
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  /* === STATE BARU UNTUK OPSI === */
  const [options, setOptions] = useState(['']); // Mulai dengan satu opsi kosong

  const fetchQuestions = async () => {
    if (!createdForm) return;
    try {
      const response = await api.get(`/admin/forms/${createdForm.id}`);
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Gagal mengambil data pertanyaan:', error);
    }
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    if (!formTitle) {
      setError('Judul form tidak boleh kosong.');
      return;
    }
    try {
      setError('');
      const response = await api.post('/admin/forms', { title: formTitle });
      setCreatedForm(response.data);
    } catch (err) {
      setError('Gagal membuat form baru.');
      console.error(err);
    }
  };
  
  const handleAddOrEditQuestion = async (e) => {
    e.preventDefault();
    if (!createdForm) return;

    const payload = { 
      question: newQuestion, 
      description, 
      type: questionType, 
      category 
    };

    /* === TAMBAHKAN OPSI KE PAYLOAD JIKA TIPE ADALAH PILIHAN GANDA === */
    if (questionType === 'multiple_choice') {
      // Filter opsi yang kosong
      const filledOptions = options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 1) {
        setError('Pilihan ganda harus memiliki setidaknya satu opsi.');
        return;
      }
      payload.options = filledOptions;
    }

    try {
      if (editingQuestionId) {
        await api.put(`/admin/questions/${editingQuestionId}`, payload);
      } else {
        await api.post(`/admin/forms/${createdForm.id}/questions`, payload);
      }
      
      // Reset form
      setEditingQuestionId(null);
      setNewQuestion('');
      setDescription('');
      setQuestionType('essay');
      setCategory('');
      setOptions(['']); // Reset opsi
      setError('');
      fetchQuestions();
    } catch (error) {
      setError('Gagal menyimpan pertanyaan. Periksa kembali data Anda.');
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
    setNewQuestion(question.question_text); // Sesuaikan dengan nama kolom DB
    setDescription(question.description || '');
    setQuestionType(question.type);
    setCategory(question.category || '');
    
    if (question.type === 'multiple_choice' && question.options.length > 0) {
      setOptions(question.options.map(opt => opt.option_text));
    } else {
      setOptions(['']);
    }

    window.scrollTo(0, 200);
  };

  /* === FUNGSI-FUNGSI BARU UNTUK MENGELOLA OPSI === */
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length <= 1) return; // Sisakan minimal satu
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col" style={{ backgroundImage: `url(${backgroundImage})`}}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      <div className="relative z-10 flex-grow flex flex-col py-6">
        <Navbar role="admin" />
        <main className="flex-grow p-8 md:p-12 max-w-4xl mx-auto w-full">
          <button onClick={() => navigate('/admin/forms')} className="mb-6 flex items-center text-gray-100 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition duration-300 border border-white/20">
            Kembali ke Daftar Form
          </button>
          
          {!createdForm ? (
            <form onSubmit={handleCreateForm} className="bg-white/10 p-8 rounded-xl shadow-2xl">
              <h1 className="text-4xl font-bold text-white mb-8 text-center">Buat Form Evaluasi Baru</h1>
              <InputField
                label="Judul Form"
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Contoh: Form Evaluasi Kinerja 2025"
                required
              />
              <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg">
                Simpan Judul & Mulai Tambah Pertanyaan
              </button>
              {error && <p className="text-red-400 mt-4">{error}</p>}
            </form>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-white mb-8 text-center">
                Tambah Pertanyaan untuk <br/> <span className="text-blue-400">{createdForm.title}</span>
              </h1>
              <form onSubmit={handleAddOrEditQuestion} className="bg-white/10 p-8 rounded-xl shadow-2xl">
                <InputField label="Pertanyaan" type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} required />
                <InputField label="Deskripsi (Opsional)" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                <InputField label="Kategori (Opsional)" type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                <div className="mb-4">
                  <label htmlFor="questionType" className="block mb-1 text-white">Jenis Pertanyaan</label>
                  <select id="questionType" value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full p-2 rounded text-white bg-black/30 border border-white/20">
                    <option value="essay" className="text-black">Text</option>
                    <option value="multiple_choice" className="text-black">Pilihan Ganda</option>
                    <option value="file" className="text-black">Unggah File</option>
                  </select>
                </div>

                {/* === UI KONDISIONAL UNTUK OPSI PILIHAN GANDA === */}
                {questionType === 'multiple_choice' && (
                  <div className="mt-4 p-4 border border-white/20 rounded-md">
                    <label className="block mb-2 text-white font-semibold">Opsi Jawaban</label>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Opsi ${index + 1}`}
                          className="flex-grow p-2 rounded text-white bg-black/30 border border-white/20"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeOption(index)}
                          className="ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={addOption}
                      className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                    >
                      + Tambah Opsi
                    </button>
                  </div>
                )}

                <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg">
                  {editingQuestionId ? 'Simpan Perubahan' : 'Tambah Pertanyaan'}
                </button>
                {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
              </form>

              <h2 className="text-2xl font-semibold text-white mt-10 mb-4">Daftar Pertanyaan</h2>
              <ul className="space-y-4">
                {questions.map((q) => (
                  <li key={q.id} className="bg-white/10 p-4 rounded-md text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{q.question_text}</p>
                        <p className="text-sm text-gray-400">Jenis: {q.type}</p>
                        {q.type === 'multiple_choice' && q.options && (
                          <ul className="list-disc list-inside pl-4 mt-2 text-sm text-gray-300">
                            {q.options.map(opt => <li key={opt.id}>{opt.option_text}</li>)}
                          </ul>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEditing(q)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded-full">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteQuestion(q.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-full">
                          Hapus
                        </button>
                      </div>
                    </div>
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