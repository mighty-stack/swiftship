import React from "react"

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-blue-600 font-medium">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
