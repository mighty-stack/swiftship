import React from "react"

const ErrorMessage = ({ message }) => {
  if (!message) return null

  return (
    <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-md my-3">
      <p className="font-medium">Error:</p>
      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage
