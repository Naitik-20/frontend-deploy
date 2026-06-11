import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastMessage from '../ToastMessage';
import OrderDetailsModal from '../modals/OrderDetailsModal';
import '../../styles/adminDashboard.css';

export default function AdminLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-workspace">
        <Header />
        <ToastMessage />
        <OrderDetailsModal />
        <div className="workspace-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
