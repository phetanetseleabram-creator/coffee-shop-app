import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../api.js';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const load = () => {
      // Delay the first fetch by 500ms to give the database time to save
      setTimeout(() => {
        getOrder(id)
          .then((data) => { if (isMounted) setOrder(data); })
          .catch((e) => { if (isMounted) setError(e.message); });
      }, 500);
    };
    
    load();
    
    // Keep checking for status updates every 5 seconds
    const t = setInterval(load, 5000); 
    
    return () => { 
      isMounted = false; 
      clearInterval(t); 
    };
  }, [id]);

  if (error) return <p className="container" style={{ color: 'var(--danger)' }}>{error}</p>;
  if (!order) return <p className="container">Loading…</p>;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--success)', fontSize: '3rem', margin: '0 0 10px 0' }}>✅</h1>
        <h2>Order Confirmed</h2>
        <p style={{ fontSize: '1.1rem' }}>Order number: <strong>{order.orderNumber}</strong></p>
        
        <div style={{ margin: '20px 0', padding: '10px', background: 'var(--bg)', borderRadius: '8px' }}>
          Status: <strong style={{ color: 'var(--primary)' }}>{order.status}</strong>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          {order.items.map((l) => (
            <li key={l.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span>{l.qty} × {l.name}</span>
              <span>M{l.lineTotal.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span>Total:</span>
          <span>M{order.total.toFixed(2)}</span>
        </div>

        <a href="/" className="primary" style={{ display: 'inline-block', marginTop: '30px', padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: '6px', textDecoration: 'none' }}>
          Back to Menu
        </a>
      </div>
    </div>
  );
}