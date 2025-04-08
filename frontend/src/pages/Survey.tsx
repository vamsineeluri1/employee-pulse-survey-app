import { useState } from 'react';
import axios from 'axios';

export default function Survey() {
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/survey`,
      { response },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    alert('Submitted!');
    setResponse('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Submit Pulse Survey
        </h2>

        <textarea
          className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Share your thoughts..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}