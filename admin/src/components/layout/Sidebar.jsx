import { NavLink } from 'react-router-dom';
import { ArrowLeft, ClipboardList, Dog, FolderTree, Grid, Heart, Package, Plus, Scissors, Stethoscope, Truck, Users } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';

const items = [
  { to: '/admin/dashboard', label: 'Overview & Stats', icon: Grid },
  { to: '/admin/products', label: 'Manage Products', icon: Package, count: 'totalProducts' },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList, count: 'totalOrders' },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree, count: 'categoriesCount' },
  { to: '/admin/pet-categories', label: 'Shop by pet category', icon: Dog, count: 'totalBreeds' },
  { to: '/admin/brands-we-love', label: 'Brands We Love', icon: Heart, count: 'totalBrandsWeLove' },
  { to: '/admin/delivery', label: 'Delivery', icon: Truck, count: 'totalDeliveryMethods' },
  { to: '/admin/services', label: 'Services', icon: Scissors, count: 'totalServices' },
  { to: '/admin/consultations', label: 'Online Consultation', icon: Stethoscope, count: 'totalConsultations' },
  { to: '/admin/wholesalers', label: 'Wholesalers', icon: Users, count: 'totalWholesalers' },
  { to: '/admin/users', label: 'Normal Users', icon: Users },
  { to: '/admin/products/add', label: 'Add New Product', icon: Plus },
];

export default function Sidebar() {
  const { totalProducts, totalOrders, categories, totalBreeds, totalBrandsWeLove, totalDeliveryMethods, totalServices, totalConsultations, totalWholesalers } = useAdminDashboard();
  const counts = {
    totalProducts,
    totalOrders,
    categoriesCount: categories.length,
    totalBreeds,
    totalBrandsWeLove,
    totalDeliveryMethods,
    totalServices,
    totalConsultations,
    totalWholesalers,
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand-box">
        <svg viewBox="0 0 160 50" className="brand-logo-svg">
          <path
            d="M 15 32 C 10 32, 5 28, 5 20 C 5 10, 15 5, 25 5 C 32 5, 38 10, 38 18 C 38 28, 30 32, 25 32 M 25 15 C 22 15, 20 18, 20 20 C 20 22, 22 24, 25 24 C 28 24, 30 22, 30 20 C 30 18, 28 15, 25 15"
            fill="none"
            stroke="#f7931e"
            strokeWidth="3.5"
          />
          <text x="50" y="28" fill="white" fontWeight="800" fontSize="20" fontFamily="Outfit">Dr. snoopy</text>
          <text x="50" y="42" fill="rgba(255,255,255,0.6)" fontWeight="600" fontSize="8.5" fontFamily="Inter">ADMIN PANEL</text>
        </svg>
      </div>

      <nav className="sidebar-menu">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{item.label}</span>
              {item.count && <span className="count-badge">{counts[item.count]}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <a href={`${import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'}/`} className="back-to-shop-btn">
          <ArrowLeft size={16} />
          <span>Back to Storefront</span>
        </a>
      </div>
    </aside>
  );
}
