import React from 'react'

export default function TailwindCheck() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-red-500 text-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold">✅ Tailwind is Loaded!</h2>
        <p className="mt-2 text-lg">
          If you see this red box with white text and padding, Tailwind is working.
        </p>
      </div>
    </div>
  )
}