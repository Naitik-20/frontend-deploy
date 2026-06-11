import { ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/admin/dashboard': 'Overview & Stats',
  '/admin/products': 'Manage Products',
  '/admin/products/add': 'Add New Product',
  '/admin/orders': 'Orders',
  '/admin/categories': 'Categories',
  '/admin/delivery': 'Delivery',
  '/admin/services': 'Services',
  '/admin/consultations': 'Online Consultation',
  '/admin/wholesalers': 'Wholesalers',
};

export default function Header() {
  const location = useLocation();
  const title = location.pathname.startsWith('/admin/products/edit')
    ? 'Edit Product'
    : titles[location.pathname] || 'Overview & Stats';

  return (
    <header className="workspace-header">
      <div className="header-breadcrumbs">
        <span className="breadcrumb-parent">Admin Dashboard</span>
        <ChevronRight size={14} className="breadcrumb-sep" />
        <span className="breadcrumb-current">{title}</span>
      </div>

      <div className="admin-profile-badge">
        <div className="avatar-circle">A</div>
        <div className="profile-info">
          <span className="profile-name">Administrator</span>
          <span className="profile-role">Store Owner</span>
        </div>
      </div>
    </header>
  );
}
