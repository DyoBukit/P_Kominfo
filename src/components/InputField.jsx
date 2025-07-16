// src/components/InputField.jsx
import React from 'react';
import ErrorMessage from './ErrorMessage';

const InputField = ({ label, type = 'text', id, value, onChange, placeholder, error, ...props }) => {
  const commonClasses = "w-full p-3 sm:p-4 border border-border-light rounded-lg text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300";
  const errorClass = error ? 'border-error' : '';

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="mb-6 text-left">
      {label && (
        <label htmlFor={id} className="block text-gray-700 font-semibold mb-2 text-base">
          {label}
        </label>
      )}
      <InputComponent
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        type={type === 'textarea' ? undefined : type}
        id={id}
        name={id} // Penting untuk form handling
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${commonClasses} ${errorClass} ${type === 'textarea' ? 'min-h-[100px] resize-y' : ''}`}
        {...props}
      />
      {error && <ErrorMessage message={error} id={`${id}-error`} />}
    </div>
  );
};

export default InputField;