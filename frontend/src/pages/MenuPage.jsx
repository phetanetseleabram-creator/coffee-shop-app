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
      navigate(`/order/${order.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading menu…</p>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1>☕ Bean & Brew</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div>
          {menu.map((item) => (
            <div key={item.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10, borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{item.name}</strong> <em>({item.category})</em>
                  <p style={{ margin: '4px 0', color: '#555' }}>{item.description}</p>
                  <p style={{ margin: 0 }}>${item.price.toFixed(2)} {!item.available && <span style={{ color: 'red' }}>— Unavailable</span>}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>
                    <button onClick={() => remove(item.id)} disabled={!cart[item.id]}>−</button>
                    <span style={{ margin: '0 8px' }}>{cart[item.id] || 0}</span>
                    <button onClick={() => add(item.id)} disabled={!item.available}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {menu.length === 0 && <p>No menu items yet.</p>}
        </div>
        <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, height: 'fit-content' }}>
          <h3>Your Order</h3>
          <div>
            <input
              placeholder="Your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: '100%', padding: 6, marginBottom: 8 }}
            />
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', padding: 6, marginBottom: 8 }}
            />
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(cart).map(([id, qty]) => {
              const m = menu.find((x) => x.id === id);
              if (!m) return null;
              return <li key={id}>{qty} × {m.name} — ${(qty * m.price).toFixed(2)}</li>;
            })}
          </ul>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={submit} disabled={submitting || total === 0} style={{ width: '100%', padding: 10 }}>
            {submitting ? 'Placing…' : 'Place Order'}
          </button>
          <p style={{ marginTop: 12, fontSize: 12 }}>
            <a href="/staff/login">Staff login →</a>
          </p>
        </div>
      </div>
    </div>
  );
}