// src/components/EvaluationForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/Api";
import ErrorMessage from "./ErrorMessage";
import logo from "../assets/logoform.jpg";

function EvaluationForm() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get("/forms/active");
        setQuestions(response.data);
        const initialAnswers = {};
        response.data.forEach((q) => {
          initialAnswers[q.id] = "";
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setSubmitError("Gagal memuat pertanyaan. Pastikan backend berjalan.");
        console.error("Fetch questions error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");

    const submissionData = new FormData();
    submissionData.append("form_title", "Evaluasi SPBE 2024");

    for (const questionId in answers) {
      if (answers[questionId]) {
        submissionData.append(`answers[${questionId}]`, answers[questionId]);
      }
    }

    try {
      await api.post("/evaluations", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/user/evaluasi/complete");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Gagal mengirim form. Mohon periksa kembali isian Anda."
      );
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-white p-10">Memuat formulir...</div>;
  }

  if (submitError && questions.length === 0) {
    return <div className="text-center text-red-500 p-10">{submitError}</div>;
  }

  // Urutkan agar pertanyaan "nama" muncul lebih dulu
  const pertanyaanNama = questions.find((q) =>
    q.question_text.toLowerCase().includes("nama")
  );
  const pertanyaanLain = questions.filter(
    (q) => !q.question_text.toLowerCase().includes("nama")
  );
  const orderedQuestions = pertanyaanNama
    ? [pertanyaanNama, ...pertanyaanLain]
    : questions;

  const renderQuestion = (q) => {
    switch (q.type) {
      case "multiple_choice":
        return (
          <div>
            <p className="block font-medium text-gray-800 mb-2">
              {q.question_text}
            </p>
            <div className="flex space-x-4">
              {["Ya", "Draft (dalam proses)", "Tidak"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question_${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "essay":
        return (
          <div>
            <label
              htmlFor={`question_${q.id}`}
              className="block font-medium text-gray-800 mb-2"
            >
              {q.question_text}
            </label>
            <textarea
              id={`question_${q.id}`}
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="w-full border border-gray-300 rounded-lg resize-none"
            />
          </div>
        );

      case "file":
        return (
          <div>
            <label
              htmlFor={`question_${q.id}`}
              className="block font-medium text-gray-800 mb-2"
            >
              {q.question_text}
            </label>
            <input
              id={`question_${q.id}`}
              type="file"
              onChange={(e) => handleChange(q.id, e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {answers[q.id] && (
              <p className="text-sm text-gray-600 mt-2">
                File terpilih: {answers[q.id].name}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 shadow-lg rounded-xl">
      <div className="mb-6 text-center">
        <img
          src={logo}
          alt="Header SPBE"
          className="mt-4 rounded-lg mx-auto"
          style={{ maxWidth: "300px" }}
        />
        <h1 className="text-2xl font-bold mt-4 mb-2">
          EVALUASI SPBE TAHUN 2024
        </h1>
        <p className="text-gray-500 text-sm">
          Formulir Upload Data Dukung Evaluasi Mandiri
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {orderedQuestions.map((q) => (
          <div key={q.id}>{renderQuestion(q)}</div>
        ))}

        {submitError && <ErrorMessage message={submitError} />}

        <div className="flex justify-start items-center gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition font-semibold"
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}

export default EvaluationForm;
