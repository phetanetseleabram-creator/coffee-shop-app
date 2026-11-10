import { Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import StaffLogin from './pages/StaffLogin.jsx';
import StaffLayout from './pages/StaffLayout.jsx';
import StaffMenu from './pages/StaffMenu.jsx';
import StaffOrders from './pages/StaffOrders.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/order/:id" element={<OrderConfirmation />} />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<StaffOrders />} />
        <Route path="menu" element={<StaffMenu />} />
      </Route>
    </Routes>
  );
}