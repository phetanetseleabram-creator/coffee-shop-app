import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function StaffLayout() {
  const navigate = useNavigate();
  const key = sessionStorage.getItem('staffKey');
  
  if (!key) { 
    navigate('/staff/login'); 
    return null; 
  }

  return (
    <div className="container">
      <nav className="staff-nav">
        <strong style={{ fontSize: '1.2rem' }}>Staff Dashboard</strong>
        <Link to="/staff">Orders</Link>
        <Link to="/staff/menu">Menu</Link>
        <Link to="/" style={{ marginLeft: 'auto' }}>View Store</Link>
        <button onClick={() => { sessionStorage.removeItem('staffKey'); navigate('/staff/login'); }}>
          Logout
        </button>
      </nav>
      <Outlet />
    </div>
  );
}