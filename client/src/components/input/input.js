import React from "react";

const Input = ({ type, placeholder, value, onChange, required, validate }) => {
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (validate) {
      validate(inputValue);
    }
  };

  return (
    <div className="mb-4">
      <input
        className="border border-gray-300 rounded px-4 py-2"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        required={required}
      />
    </div>
  );
};

export default Input;
