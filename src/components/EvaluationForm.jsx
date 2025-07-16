// src/components/EvaluationForm.jsx
import React, { useState } from 'react';
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';
import { FiPaperclip } from 'react-icons/fi';

import logo from '../assets/logoform.jpg'; 

function EvaluationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    opd: '',
    petugas: '',
    adaLayananBaru: '',
    penjelasan: '',
    file: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['opd', 'petugas', 'adaLayananBaru', 'file', 'penjelasan'];

    requiredFields.forEach((field) => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = 'Kolom ini wajib diisi.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      alert('Form berhasil dikirim!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 shadow-lg rounded-xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mt-2 mb-4">
          EVALUASI SISTEM PEMERINTAHAN BERBASIS ELEKTRONIK (SPBE) TAHUN 2024
        </h1>
        <p className="text-gray-500 text-sm italic font-semibold">Formulir Upload Data Dukung Evaluasi Mandiri SPBE Tahun 2023</p>
        <img
          src= {logo}
          alt="Header SPBE"
          className="mt-4 rounded-lg"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pilih OPD */}
        <div>
          <label className="block font-medium text-gray-800">
            Pilih OPD Anda <span className="text-red-600">*</span>
          </label>
          <select
            name="opd"
            value={formData.opd}
            onChange={handleChange}
            className="w-full border border-gray-300 mt-1 rounded-md p-2 text-black"
          >
            <option value="" disabled hidden>Pilih</option>
            <option value="Inspektorat Daerah">Inspektorat Daerah</option>
            <option value="Sekretariat Daerah">Sekretariat Daerah</option>
            <option value="BPKAD">BPKAD</option>
            <option value="BAPPEDA">BAPPEDA</option>
            <option value="BKPSDM">BKPSDM</option>
            <option value="BPPRD">BPPRD</option>
            <option value="DISDUKCAPIL">DISDUKCAPIL</option>
            <option value="Dinas Perpustakaan dan Arsip Daerah">Dinas Perpustakaan dan Arsip Daerah</option>
            <option value="DPMPSTP">DPMPSTP</option>
            <option value="DINKES">DINKES</option>
            <option value="DISKOMINFO">DISKOMINFO</option>
            <option value="Bag. Hukum Setda">Bag. Hukum Setda</option>
            <option value="Bag. Organisasi Setda">Bag. Organisasi Setda</option>
            <option value="Bag. Pengadaan Barang dan Jasa Setda">Bag. Pengadaan Barang dan Jasa Setda</option>
          </select>
          {errors.opd && <ErrorMessage message={errors.opd} />}
        </div>

        {/* Nama Petugas */}
        <div>
          <label className="block font-medium text-gray-800">
            Nama Lengkap Petugas Upload Data <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="petugas"
            value={formData.petugas}
            onChange={handleChange}
            placeholder="Jawaban Anda"
            className="w-full border border-gray-300 mt-1 rounded-md p-2"
          />
          {errors.petugas && <ErrorMessage message={errors.petugas} />}
        </div>

        {/* Ada layanan baru */}
        <div>
          <label className="block font-medium text-gray-800">
            Apakah terdapat layanan/kebijakan/aplikasi terbaru terkait indikator evaluasi SPBE pada OPD anda? <span className="text-red-600">*</span>
          </label>
          <select
            name="adaLayananBaru"
            value={formData.adaLayananBaru}
            onChange={handleChange}
            className="w-full border border-gray-300 mt-1 rounded-md p-2"
          >
            <option value="" disabled hidden>Pilih</option>
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
          {errors.adaLayananBaru && <ErrorMessage message={errors.adaLayananBaru} />}
        </div>

        {/* Upload file */}
        <div className="mt-4">
          <label className="block font-medium text-gray-800 mb-2">Unggah Data Dukung<span className="text-red-600">*</span></label>

          <input
            type="file"
            id="fileUpload"
            onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
            className="hidden"
          />

          <label
            htmlFor="fileUpload"
            className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition"
            >
              <FiPaperclip className="text-lg" />
              Tambahkan File
            </label>

            {formData.file && (
              <p className="mt-2 text-sm text-gray-600">
                File terpilih: <span className="font-medium">{formData.file.name}</span>
              </p>
            )}

            {errors.file && <ErrorMessage message={errors.file} />}
        </div>

        {/* Penjelasan */}
        <div>
          <label className="block font-medium text-gray-800">
            Mohon tuliskan penjelasan atas masing-masing data dukung yang diunggah. <span className="text-red-600">*</span>
          </label>
          <textarea
            name="penjelasan"
            value={formData.penjelasan}
            onChange={handleChange}
            className="w-full border border-gray-300 mt-1 rounded-md p-2 h-16"
            placeholder="Tulis penjelasan Anda di sini..."
          />
          {errors.penjelasan && <ErrorMessage message={errors.penjelasan} />}
        </div>

        {/* Tombol Kirim */}
        <button
          type="submit"
          className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-800 transition"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}

export default EvaluationForm;
