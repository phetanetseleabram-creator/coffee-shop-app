import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function StaffLayout() {
  const navigate = useNavigate();
  const key = sessionStorage.getItem('staffKey');
  
  // If no key is found, force them to login
  if (!key) { 
    navigate('/staff/login'); 
    return null; 
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <nav style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
        <strong>Staff Dashboard</strong>
        <Link to="/staff">Orders</Link>
        <Link to="/staff/menu">Menu</Link>
        <button 
          onClick={() => { 
            sessionStorage.removeItem('staffKey'); 
            navigate('/staff/login'); 
          }}
          style={{ marginLeft: 'auto' }}
        >
          Logout
        </button>
      </nav>
      {/* This Outlet renders the StaffOrders or StaffMenu page underneath */}
      <Outlet />
    </div>
  );
}