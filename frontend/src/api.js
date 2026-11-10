const API = import.meta.env.VITE_API_URL;

const request = async (path, opts = {}) => {
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

export const getMenu = () => request('/api/menu');

export const createMenuItem = (item, key) =>
  request('/api/menu', { 
    method: 'POST', 
    headers: { 'x-api-key': key, 'Content-Type': 'application/json' }, 
    body: JSON.stringify(item) 
  });

export const updateMenuItem = (id, item, key) =>
  request(`/api/menu/${id}`, { 
    method: 'PUT', 
    headers: { 'x-api-key': key, 'Content-Type': 'application/json' }, 
    body: JSON.stringify(item) 
  });

export const deleteMenuItem = (id, key) =>
  request(`/api/menu/${id}`, { method: 'DELETE', headers: { 'x-api-key': key } });

export const placeOrder = (order) =>
  request('/api/orders', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(order) 
  });

export const getOrders = (key) =>
  request('/api/orders', { headers: { 'x-api-key': key } });

export const getOrder = (id) => request(`/api/orders/${id}`);

export const updateOrderStatus = (id, status, key) =>
  request(`/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });