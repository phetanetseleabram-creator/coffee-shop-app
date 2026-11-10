import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StaffLogin() {
  const [key, setKey] = useState('');
  const navigate = useNavigate();
  
  const submit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('staffKey', key);
    navigate('/staff');
  };
  
  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h2>Staff Login</h2>
      <form onSubmit={submit}>
        <input
          type="password"
          placeholder="Staff API key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
      </form>
    </div>
  );
}