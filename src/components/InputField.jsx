// src/components/InputField.jsx
import React from 'react';
import ErrorMessage from './ErrorMessage';

const InputField = ({ label, type = 'text', id, value, onChange, placeholder, error, className, ...props }) => { // Tambahkan `className` prop
  // Gaya input field default yang cocok dengan tema gelap (mirip LoginPage)
  const defaultInputClasses = `
    w-full px-4 py-3 rounded-full 
    bg-gray-700 text-white placeholder-gray-400 
    border border-gray-600 
    shadow-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    transition-all duration-300
  `;
  
  const errorClass = error ? 'border-red-500' : '';

  const finalInputClasses = `${type === 'textarea'
  ? 'w-full bg-gray-700 rounded-xl p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm'
  : defaultInputClasses} ${errorClass} ${className || ''}`;

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="mb-6 text-left">
      {/* Label akan dirender oleh InputField, warnanya diatur untuk tema gelap */}
      {label && (
        <label htmlFor={id} className="block text-gray-100 font-semibold mb-2 text-base"> {/* Warna label untuk tema gelap */}
          {label}
        </label>
      )}
      <InputComponent
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        type={type === 'textarea' ? undefined : type}
        id={id}
        name={id} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={finalInputClasses} // Gunakan kelas yang sudah digabungkan
        {...props}
      />
      {error && <ErrorMessage message={error} id={`${id}-error`} />}
    </div>
  );
};

export default InputField;