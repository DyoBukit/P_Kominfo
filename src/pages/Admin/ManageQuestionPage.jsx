// src/pages/Admin/ManageQuestionsPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import api from '../../utils/Api';
import Navbar from '../../components/Navbar';
import InputField from '../../components/InputField';
import ErrorMessage from '../../components/ErrorMessage'; 
import backgroundImage from '../../assets/bg.png';

function ManageQuestionsPage() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [createdForm, setCreatedForm] = useState(null);
  const [formTitle, setFormTitle] = useState(''); 
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [questionType, setQuestionType] = useState('essay');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [options, setOptions] = useState(['']);

  const fetchQuestions = async (formId) => {
    try {
      const response = await api.get(`/admin/forms/${formId}`);
      setQuestions(response.data.questions || []);
      if (!formTitle) {
        setFormTitle(response.data.title);
      }
    } catch (error) {
      console.error('Gagal mengambil data pertanyaan:', error);
      setError('Gagal memuat pertanyaan untuk form ini.');
    }
  };

  useEffect(() => {
    const loadForm = async () => {
      setLoading(true);
      if (id) {
        try {
          const response = await api.get(`/admin/forms/${id}`);
          setCreatedForm(response.data); 
          setFormTitle(response.data.title); 
          await fetchQuestions(id); 
        } catch (err) {
          console.error("Gagal memuat form untuk diedit:", err);
          setError(`Gagal memuat form: ${err.response?.data?.message || err.message}`);
          setCreatedForm(null); 
        }
      } else {
        setCreatedForm(null);
        setFormTitle('');
        setQuestions([]);
      }
      setLoading(false);
    };

    loadForm();
  }, [id]);

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
      await fetchQuestions(response.data.id); 
    } catch (err) {
      setError('Gagal membuat form baru.');
      console.error(err);
    }
  };
  
  const handleAddOrEditQuestion = async (e) => {
    e.preventDefault();
    if (!createdForm) {
      setError('Silakan buat atau pilih form terlebih dahulu.');
      return;
    }

    const payload = { 
      question: newQuestion, 
      description, 
      type: questionType, 
      category 
    };

    if (questionType === 'multiple_choice') {
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

      setEditingQuestionId(null);
      setNewQuestion('');
      setDescription('');
      setQuestionType('essay');
      setCategory('');
      setOptions(['']); 
      setError('');
      await fetchQuestions(createdForm.id);
    } catch (err) {
      setError('Gagal menyimpan pertanyaan. Periksa kembali data Anda.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    const confirmed = window.confirm('Yakin ingin menghapus pertanyaan ini?'); // TODO: Ganti dengan modal kustom
    if (!confirmed) return;

    try {
      await api.delete(`/admin/questions/${qId}`);
      await fetchQuestions(createdForm.id);
    } catch (err) {
      console.error('Gagal menghapus pertanyaan:', err.response?.data || err.message);
      setError('Gagal menghapus pertanyaan.');
    }
  };

  const startEditing = (question) => {
    console.log("Data pertanyaan yang akan diedit:", question); 
    setEditingQuestionId(question.id);
    setNewQuestion(question.question_text);
    setDescription(question.description || '');
    setQuestionType(question.type);
    setCategory(question.category || '');
    
    if (question.type === 'multiple_choice' && question.options && question.options.length > 0) {
      setOptions(question.options.map(opt => opt.option_text));
    } else {
      setOptions(['']);
    }

    window.scrollTo(0, 200);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length <= 1) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})`}}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
        <p className="relative z-10 text-white text-xl">Memuat form...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col" style={{ backgroundImage: `url(${backgroundImage})`}}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      <div className="relative z-10 flex-grow flex flex-col py-6">
        <Navbar role="admin" />
        <main className="flex-grow p-8 md:p-12 max-w-4xl mx-auto w-full">
          <button onClick={() => navigate('/admin/dashboard')} className="mb-6 flex items-center text-gray-100 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition duration-300 border border-white/20">
            Kembali ke Dashboard
          </button>
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
              {error && <ErrorMessage message={error} />}
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
                {error && <ErrorMessage message={error} />}
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
