import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenu, placeOrder } from '../api.js';

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMenu()
      .then(setMenu)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return next;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const total = menu.reduce(
    (sum, m) => sum + (cart[m.id] || 0) * m.price,
    0
  );

  const submit = async () => {
    setError('');
    if (!customerName.trim()) return setError('Please enter your name');
    const items = Object.entries(cart).map(([menuItemId, qty]) => ({ menuItemId, qty }));
    if (!items.length) return setError('Cart is empty');
    
    setSubmitting(true);
    try {
      const order = await placeOrder({ customerName, items, notes });
      // Wait a fraction of a second to ensure the DB saves it before redirecting
      setTimeout(() => {
        navigate(`/order/${order.id}`);
      }, 500);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  if (loading) return <p className="container">Loading menu…</p>;

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px' }}>☕ Bean & Brew</h1>
      
      {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '16px' }}>
          {menu.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>
                  {item.name} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'normal' }}>({item.category})</span>
                </h3>
                <p style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '14px' }}>{item.description}</p>
                <strong style={{ color: 'var(--primary)' }}>M{item.price.toFixed(2)}</strong>
                {!item.available && <span style={{ marginLeft: '10px', color: 'var(--danger)', fontSize: '14px' }}>Unavailable</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => remove(item.id)} disabled={!cart[item.id]}>−</button>
                <span style={{ fontWeight: '600', width: '20px', textAlign: 'center' }}>{cart[item.id] || 0}</span>
                <button onClick={() => add(item.id)} disabled={!item.available}>+</button>
              </div>
            </div>
          ))}
          {menu.length === 0 && <p>No menu items yet.</p>}
        </div>

        <div className="card" style={{ position: 'sticky', top: '20px' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Your Order</h2>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
            <input placeholder="Your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows="2" />
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            {Object.entries(cart).map(([id, qty]) => {
              const m = menu.find((x) => x.id === id);
              if (!m) return null;
              return (
                <li key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span>{qty} × {m.name}</span>
                  <span>M{(qty * m.price).toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: '600' }}>
            <span>Total:</span>
            <span>M{total.toFixed(2)}</span>
          </div>
          <button className="primary" onClick={submit} disabled={submitting || total === 0} style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
            {submitting ? 'Placing…' : 'Place Order'}
          </button>
          <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center' }}>
            <a href="/staff/login">Staff login →</a>
          </p>
        </div>
      </div>
    </div>
  );
}