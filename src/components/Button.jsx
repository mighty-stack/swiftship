import React from "react"

const Button = ({ children, onClick, type = "button", disabled, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 
        ${disabled
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"}
        ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
