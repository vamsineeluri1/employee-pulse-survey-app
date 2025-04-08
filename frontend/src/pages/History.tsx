import { useEffect, useState } from 'react';
import axios from 'axios';

export default function History() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/survey`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setSurveys(res.data));
  }, []);

  return (
    <div>
      <h2>Your Submissions</h2>
      <ul>
        {surveys.map((s: any, idx: number) => (
          <li key={idx}>{s.response}</li>
        ))}
      </ul>
    </div>
  );
}