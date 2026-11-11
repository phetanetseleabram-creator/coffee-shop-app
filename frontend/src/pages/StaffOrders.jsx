import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api.js';

const STATUSES = ['Pending', 'Preparing', 'Ready', 'Collected'];

export default function StaffOrders() {
  const key = sessionStorage.getItem('staffKey');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const reload = () => getOrders(key).then(setOrders).catch((e) => setError(e.message));
  
  useEffect(() => {
    reload();
    const t = setInterval(reload, 8000);
    return () => clearInterval(t);
  }, []);

  const setStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status, key);
      reload();
    } catch (e) { 
      setError(e.message); 
    }
  };

  const today = new Date().toDateString();
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const summary = STATUSES.reduce((acc, s) => ({ ...acc, [s]: todays.filter((o) => o.status === s).length }), {});
  const revenue = todays.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      
      <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ fontSize: '1.2rem' }}>Today's Summary</strong>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
            {todays.length} orders · M{revenue.toFixed(2)} revenue
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {STATUSES.map((s) => (
            <div key={s} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary[s]}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {orders.length === 0 && <p>No orders yet.</p>}
      
      {orders.map((o) => (
        <div key={o.id} className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '12px' }}>
            <div>
              <strong style={{ fontSize: '1.1rem' }}>{o.orderNumber}</strong> 
              <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>|</span> 
              {o.customerName}
            </div>
            <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>M{o.total.toFixed(2)}</div>
          </div>
          
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', color: 'var(--text-muted)' }}>
            {o.items.map((l) => <li key={l.menuItemId}>{l.qty} × {l.name}</li>)}
          </ul>
          
          {o.notes && <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}><em>Notes: {o.notes}</em></p>}
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Status:</span>
            {STATUSES.map((s) => (
              <button 
                key={s} 
                onClick={() => setStatus(o.id, s)} 
                disabled={o.status === s} 
                className={o.status === s ? "primary" : ""}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}