import { useEffect, useState } from 'react';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../api.js';

export default function StaffMenu() {
  const key = sessionStorage.getItem('staffKey');
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', category: 'coffee', price: '', available: true });
  const [error, setError] = useState('');

  const reload = () => getMenu().then(setMenu).catch((e) => setError(e.message));
  
  useEffect(() => { 
    reload(); 
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createMenuItem({ ...form, price: parseFloat(form.price) }, key);
      setForm({ name: '', description: '', category: 'coffee', price: '', available: true });
      reload();
    } catch (e) { 
      setError(e.message); 
    }
  };

  const toggleAvail = async (item) => {
    try {
      await updateMenuItem(item.id, { available: !item.available }, key);
      reload();
    } catch (e) { 
      setError(e.message); 
    }
  };

  const updatePrice = async (item) => {
    const val = prompt(`New price for ${item.name}:`, item.price);
    if (val === null) return;
    const price = parseFloat(val);
    if (isNaN(price) || price <= 0) return alert('Invalid price');
    try {
      await updateMenuItem(item.id, { price }, key);
      reload();
    } catch (e) { 
      setError(e.message); 
    }
  };

  const remove = async (item) => {
    if (!confirm(`Delete ${item.name}?`)) return;
    try {
      await deleteMenuItem(item.id, key);
      reload();
    } catch (e) { 
      setError(e.message); 
    }
  };

  return (
    <div>
      <h2>Menu Management</h2>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Add New Item</h3>
        <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
            <option value="pastry">Pastry</option>
            <option value="other">Other</option>
          </select>
          <input placeholder="Price" type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} style={{ width: 'auto' }} /> 
            Available to order
          </label>
          
          <button type="submit" className="primary" style={{ gridColumn: 'span 2', padding: '12px' }}>Add Item</button>
        </form>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '12px 0' }}>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Available</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 0', fontWeight: '500' }}>{item.name}</td>
                <td style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{item.category}</td>
                <td>M{item.price.toFixed(2)}</td>
                <td>{item.available ? '✅ Yes' : '❌ No'}</td>
                <td style={{ textAlign: 'right', padding: '12px 0' }}>
                  <button onClick={() => updatePrice(item)} style={{ marginRight: '8px' }}>Edit Price</button>
                  <button onClick={() => toggleAvail(item)} style={{ marginRight: '8px' }}>{item.available ? 'Mark Unavailable' : 'Mark Available'}</button>
                  <button onClick={() => remove(item)} className="danger">Delete</button>
                </td>
              </tr>
            ))}
            {menu.length === 0 && <tr><td colSpan="5" style={{ padding: '20px 0', textAlign: 'center' }}>No menu items found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}