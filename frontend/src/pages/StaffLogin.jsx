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
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '80px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Staff Login</h2>
        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="Staff API key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <button type="submit" className="primary" style={{ width: '100%', padding: '12px' }}>Login</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/">← Back to Customer Menu</a>
        </div>
      </div>
    </div>
  );
}