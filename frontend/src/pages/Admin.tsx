import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/responses`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setResponses(res.data));
  }, []);

  const handleExport = async (format: string) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/export?format=${format}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = format === 'csv' ? res.data : JSON.stringify(res.data, null, 2);
    const blob = new Blob([data], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `survey_export.${format}`;
    link.click();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => handleExport('csv')}>Export CSV</button>
      <button onClick={() => handleExport('json')}>Export JSON</button>
      <ul>
        {responses.map((r: any, idx: number) => (
          <li key={idx}>{r.userId}: {r.response}</li>
        ))}
      </ul>
    </div>
  );
}