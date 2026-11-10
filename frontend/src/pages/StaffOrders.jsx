import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api.js';

const STATUSES = ['Pending', 'Preparing', 'Ready', 'Collected'];

export default function StaffOrders() {
  const key = sessionStorage.getItem('staffKey');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Load orders and auto-refresh every 8 seconds
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

  // Calculate daily summary
  const today = new Date().toDateString();
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const summary = STATUSES.reduce((acc, s) => ({ ...acc, [s]: todays.filter((o) => o.status === s).length }), {});
  const revenue = todays.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <h2>Orders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, marginBottom: 20 }}>
        <strong>Today:</strong> {todays.length} orders · ${revenue.toFixed(2)} revenue ·{' '}
        {STATUSES.map((s) => `${s}: ${summary[s]}`).join(' · ')}
      </div>

      {orders.length === 0 && <p>No orders yet.</p>}
      
      {orders.map((o) => (
        <div key={o.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10, borderRadius: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{o.orderNumber}</strong> — {o.customerName} — <em style={{ color: o.status === 'Pending' ? 'orange' : 'green' }}>{o.status}</em>
            </div>
            <div><strong>${o.total.toFixed(2)}</strong></div>
          </div>
          
          <ul style={{ margin: '10px 0' }}>
            {o.items.map((l) => <li key={l.menuItemId}>{l.qty} × {l.name}</li>)}
          </ul>
          
          {o.notes && <p><em>Notes: {o.notes}</em></p>}
          
          <div style={{ marginTop: 10 }}>
            {STATUSES.map((s) => (
              <button 
                key={s} 
                onClick={() => setStatus(o.id, s)} 
                disabled={o.status === s} 
                style={{ marginRight: 6, backgroundColor: o.status === s ? '#ddd' : '#fff' }}
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