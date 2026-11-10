import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../api.js';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = () =>
      getOrder(id).then(setOrder).catch((e) => setError(e.message));
    load();
    const t = setInterval(load, 5000); // poll for status updates
    return () => clearInterval(t);
  }, [id]);

  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;
  if (!order) return <p style={{ padding: 20 }}>Loading…</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>✅ Order Confirmed</h1>
      <p>Order number: <strong>{order.orderNumber}</strong></p>
      <p>Status: <strong>{order.status}</strong></p>
      <ul>
        {order.items.map((l) => (
          <li key={l.menuItemId}>{l.qty} × {l.name} — ${l.lineTotal.toFixed(2)}</li>
        ))}
      </ul>
      <h3>Total: ${order.total.toFixed(2)}</h3>
      <a href="/">← Back to menu</a>
    </div>
  );
}