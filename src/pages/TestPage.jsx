import React from 'react'

const TestPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Test Page</h1>
      <p className="text-gray-600">If you can see this, the routing is working!</p>
      <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
        <p className="text-green-800">✅ Application is working correctly!</p>
      </div>
    </div>
  )
}

export default TestPage
