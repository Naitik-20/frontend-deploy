import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminDashboardProvider } from './hooks/useAdminDashboard';
import AdminLayout from './components/layout/AdminLayout';
import DashboardOverview from './pages/DashboardOverview';
import ProductsList from './pages/ProductsList';
import AddEditProduct from './pages/AddEditProduct';
import OrdersManagement from './pages/OrdersManagement';
import CategoriesManagement from './pages/CategoriesManagement';
import BreedsManagement from './pages/BreedsManagement';
import BrandsWeLoveManagement from './pages/BrandsWeLoveManagement';
import DeliveryManagement from './pages/DeliveryManagement';
import ServicesManagement from './pages/ServicesManagement';
import OnlineConsultationManagement from './pages/OnlineConsultationManagement';
import WholesalersManagement from './pages/WholesalersManagement';
import NormalUsersManagement from './pages/NormalUsersManagement';

export default function AdminDashboard() {
  return (
    <AdminDashboardProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/add" element={<AddEditProduct />} />
          <Route path="products/edit/:id" element={<AddEditProduct />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="pet-categories" element={<BreedsManagement />} />
          <Route path="breeds" element={<BreedsManagement />} />
          <Route path="brands-we-love" element={<BrandsWeLoveManagement />} />
          <Route path="delivery" element={<DeliveryManagement />} />
          <Route path="services" element={<ServicesManagement />} />
          <Route path="consultations" element={<OnlineConsultationManagement />} />
          <Route path="wholesalers" element={<WholesalersManagement />} />
          <Route path="users" element={<NormalUsersManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminDashboardProvider>
  );
}
