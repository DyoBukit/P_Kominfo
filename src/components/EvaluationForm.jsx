  // src/components/EvaluationForm.jsx
  import React, { useState, useEffect } from 'react'; // Tambahkan useEffect
  import InputField from './InputField';
  import ErrorMessage from './ErrorMessage';
  import { FiPaperclip } from 'react-icons/fi';
  import { useNavigate } from 'react-router-dom'; 

  import logo from '../assets/logoform.jpg'; 

  function EvaluationForm({ onSubmit, onBack }) { 
    const navigate = useNavigate(); 

    const [questions, setQuestions] = useState([]); // State untuk menyimpan pertanyaan dari backend
    const [formData, setFormData] = useState({}); // Data form akan diinisialisasi dinamis
    const [errors, setErrors] = useState({});
    const [loadingQuestions, setLoadingQuestions] = useState(true); // State loading pertanyaan
    const [fetchQuestionsError, setFetchQuestionsError] = useState(null); // State error fetch pertanyaan

    // >>> useEffect untuk mengambil pertanyaan dari backend <<<
    useEffect(() => {
      const fetchQuestions = async () => {
        setLoadingQuestions(true);
        setFetchQuestionsError(null);
        try {
          // GANTI URL INI dengan endpoint API backend Anda untuk pertanyaan formulir
          const response = await fetch('http://localhost:8000/api/questions'); 
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setQuestions(data); // Simpan pertanyaan

          // Inisialisasi formData berdasarkan pertanyaan yang diterima
          const initialFormData = {};
          data.forEach(q => {
            initialFormData[q.name] = q.type === 'file' && q.multiple ? [] : ''; // Default untuk file multiple adalah array kosong
            if (q.type === 'select') {
              initialFormData[q.name] = '';
            }
          });
          setFormData(initialFormData);

        } catch (err) {
          console.error("Gagal mengambil pertanyaan formulir:", err);
          setFetchQuestionsError("Gagal memuat pertanyaan. Pastikan backend berjalan & endpoint '/api/questions' benar.");
        } finally {
          setLoadingQuestions(false);
        }
      };

      fetchQuestions();
    }, []);

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      // Mengubah cara handle file untuk multiple
      if (files) {
        setFormData(prevData => ({ ...prevData, [name]: files })); // Simpan FileList untuk multiple files
      } else {
        setFormData(prevData => ({ ...prevData, [name]: value }));
      }
      // Hapus error jika field diubah
      if (errors[name]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
      }
    };

    const validateForm = () => {
      const newErrors = {};
      let isValid = true;

      questions.forEach(q => {
        if (q.required) {
          const value = formData[q.name];
          if (q.type === 'file') {
            // Validasi file: harus ada dan minimal 1 file jika multiple
            if (!value || value.length === 0) {
              newErrors[q.name] = 'Kolom ini wajib diisi.';
              isValid = false;
            }
          } else if (q.type === 'text' || q.type === 'textarea' || q.type === 'email' || q.type === 'password' || q.type === 'select') {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              newErrors[q.name] = 'Kolom ini wajib diisi.';
              isValid = false;
            }
          }
        }
      });

      setErrors(newErrors);
      return isValid;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit(formData);
        alert('Form berhasil dikirim!');
      } else {
        alert('Mohon lengkapi semua kolom yang wajib diisi.');
      }
    };

    const handleGoBackInternal = () => {
      if (onBack) {
        onBack(); 
      } else {
        navigate(-1); 
      }
    };

    if (loadingQuestions) {
      return (
        <div className="max-w-3xl mx-auto bg-white/10 p-6 md:p-10 shadow-lg rounded-xl text-white flex justify-center items-center h-64">
          <p className="text-xl">Memuat pertanyaan formulir...</p>
        </div>
      );
    }

    if (fetchQuestionsError) {
      return (
        <div className="max-w-3xl mx-auto bg-white/10 p-6 md:p-10 shadow-lg rounded-xl text-red-400 flex justify-center items-center h-64">
          <p className="text-xl">Error: {fetchQuestionsError}</p>
          <p className="text-sm text-gray-400 mt-2">Pastikan backend berjalan dan endpoint '/api/questions' benar.</p>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 shadow-lg rounded-xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mt-2 mb-4">
            EVALUASI SISTEM PEMERINTAHAN BERBASIS ELEKTRONIK (SPBE) TAHUN 2024
          </h1>
          <p className="text-gray-500 text-sm italic font-semibold">Formulir Upload Data Dukung Evaluasi Mandiri SPBE Tahun 2023</p>
          <img
            src={logo}
            alt="Header SPBE"
            className="mt-4 rounded-lg"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loop melalui pertanyaan yang diambil dari backend */}
          {questions.map(q => (
            <div key={q.id}>
              {q.type === 'text' || q.type === 'email' || q.type === 'password' || q.type === 'textarea' ? (
                <InputField
                  label={q.label}
                  type={q.type}
                  id={q.name}
                  name={q.name}
                  value={formData[q.name] || ''}
                  onChange={handleChange}
                  placeholder={q.placeholder}
                  error={errors[q.name]}
                  // Untuk textarea, tambahkan min-h dan resize-y
                  {...(q.type === 'textarea' ? { className: "min-h-[100px] resize-y" } : {})}
                />
              ) : q.type === 'select' ? (
                <div>
                  <label htmlFor={q.name} className="block font-medium text-gray-800">
                    {q.label} {q.required && <span className="text-red-600">*</span>}
                  </label>
                  <select
                    name={q.name}
                    id={q.name}
                    value={formData[q.name] || ''}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" disabled hidden>Pilih</option>
                    {q.options && q.options.map((option, idx) => (
                      <option key={idx} value={option} className="bg-gray-800 text-white">{option}</option>
                    ))}
                  </select>
                  {errors[q.name] && <ErrorMessage message={errors[q.name]} />}
                </div>
              ) : q.type === 'file' ? (
                <div className="mt-4">
                  <label htmlFor={q.name} className="block font-medium text-gray-800 mb-2">
                    {q.label} {q.required && <span className="text-red-600">*</span>}
                  </label>
                  <input
                    type="file"
                    id={q.name}
                    name={q.name}
                    onChange={handleChange}
                    multiple={q.multiple} // Atribut multiple diambil dari data backend
                    className="hidden"
                  />
                  <label
                    htmlFor={q.name}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition"
                  >
                    <FiPaperclip className="text-lg" />
                    Tambahkan File
                  </label>
                  {formData[q.name] && formData[q.name].length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">File terpilih:</p>
                      <ul className="list-disc list-inside ml-4">
                        {Array.from(formData[q.name]).map((fileItem, index) => (
                          <li key={index}>{fileItem.name}</li>
                        ))}
                      </ul>
                      <small className="text-gray-500">Total {formData[q.name].length} file dipilih.</small>
                    </div>
                  )}
                  {q.description && ( // Tampilkan deskripsi jika ada
                    <small className="mt-2 text-sm text-gray-500 block">{q.description}</small>
                  )}
                  {errors[q.name] && <ErrorMessage message={errors[q.name]} />}
                </div>
              ) : null}
            </div>
          ))}

          {/* Tombol Kirim dan Kembali */}
          <div className="flex justify-start items-center gap-4 mt-6"> 
            {/* Tombol Kirim */}
            <button
              type="submit"
              className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-800 transition"
            >
              Kirim
            </button>
            {/* Tombol Kembali */}
            <button
              type="button" 
              onClick={handleGoBackInternal}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-blue-200 transition duration-300 font-semibold" 
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    );
  }

  export default EvaluationForm;