import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ClipboardList,
  Grid2X2,
  Heart,
  LogOut,
  MapPin,
  Settings,
  Shield,
} from 'lucide-react';
import AddressesPage from './pages/AddressesPage';
import ConsultationsPage from './pages/ConsultationsPage';
import OrdersPage from './pages/OrdersPage';
import OverviewPage from './pages/OverviewPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import WishlistPage from './pages/WishlistPage';

const emptyAddressForm = {
  label: 'Home',
  firstName: '',
  lastName: '',
  phone: '',
  country: 'India',
  address: '',
  city: '',
  region: '',
  zip: '',
  isDefault: false,
};

const getSavedUser = (user) => {
  if (user && user.role !== 'wholesaler' && user.role !== 'wholeseller') return user;

  try {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    return savedUser?.role !== 'wholesaler' && savedUser?.role !== 'wholeseller' ? savedUser : null;
  } catch {
    return null;
  }
};

const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const formatDate = (value) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function UserProfilePage({ backendUrl, user, onUserUpdate, onLogout }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const savedUser = getSavedUser(user);
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(savedUser);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState(savedUser?.addresses || []);
  const [formData, setFormData] = useState({
    name: savedUser?.name || '',
    email: savedUser?.email || '',
    currentPassword: '',
    newPassword: '',
  });
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const primaryAddress = useMemo(
    () => addresses.find((address) => address.isDefault) || addresses[0],
    [addresses]
  );

  const syncProfile = (nextProfile) => {
    const syncedProfile = {
      ...nextProfile,
      role: nextProfile?.role || 'user',
    };

    setProfile(syncedProfile);
    setAddresses(syncedProfile.addresses || []);
    localStorage.setItem('user', JSON.stringify(syncedProfile));
    onUserUpdate?.(syncedProfile);
    setFormData((current) => ({
      ...current,
      name: syncedProfile?.name || '',
      email: syncedProfile?.email || '',
      currentPassword: '',
      newPassword: '',
    }));
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${backendUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Unable to load profile');

        if (!ignore) {
          syncProfile(data.user);
          setOrders(data.orders || []);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      ignore = true;
    };
  }, [backendUrl, token]);

  const handleLogout = () => {
    onLogout?.();
    navigate('/shop');
  };

  const handleProfileChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const response = await fetch(`${backendUrl}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Unable to save profile');

      syncProfile(data.user);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm);
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressForm({
      label: address.label || 'Home',
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      phone: address.phone || '',
      country: address.country || 'India',
      address: address.address || '',
      city: address.city || '',
      region: address.region || '',
      zip: address.zip || '',
      isDefault: Boolean(address.isDefault),
    });
  };

  const saveAddressRequest = async (address, addressId = null) => {
    const url = addressId
      ? `${backendUrl}/api/auth/me/addresses/${addressId}`
      : `${backendUrl}/api/auth/me/addresses`;
    const response = await fetch(url, {
      method: addressId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(address),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Unable to save address');
    return data.addresses || [];
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const nextAddresses = await saveAddressRequest(addressForm, editingAddressId);
      setAddresses(nextAddresses);
      setProfile((current) => ({ ...current, addresses: nextAddresses }));
      resetAddressForm();
      setMessage(editingAddressId ? 'Address updated successfully.' : 'Address added successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefaultAddress = async (address) => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const nextAddresses = await saveAddressRequest({ ...address, isDefault: true }, address._id);
      setAddresses(nextAddresses);
      setProfile((current) => ({ ...current, addresses: nextAddresses }));
      setMessage('Default address updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/auth/me/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Unable to delete address');

      const nextAddresses = data.addresses || [];
      setAddresses(nextAddresses);
      setProfile((current) => ({ ...current, addresses: nextAddresses }));
      if (editingAddressId === addressId) resetAddressForm();
      setMessage('Address deleted successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <main className="wholesaler-dashboard-page user-dashboard-page">
        <section className="wholesaler-auth-card">
          <Shield size={38} />
          <h1>Login Required</h1>
          <p>Please sign in to view your profile dashboard.</p>
          <Link to="/shop">Back to shop</Link>
        </section>
        <style>{userDashboardStyles}</style>
      </main>
    );
  }

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Grid2X2 },
    { id: 'profile', label: 'Setting', icon: Settings },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'consultations', label: 'Consultations', icon: Calendar },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Address', icon: MapPin },
  ];

  const renderActivePage = () => {
    if (activeTab === 'overview') {
      return (
        <OverviewPage
          profile={profile}
          addresses={addresses}
          primaryAddress={primaryAddress}
          recentOrders={recentOrders}
          onTabChange={setActiveTab}
          formatDate={formatDate}
          formatPrice={formatPrice}
        />
      );
    }

    if (activeTab === 'profile') {
      return (
        <ProfileSettingsPage
          profile={profile}
          formData={formData}
          saving={saving}
          onProfileChange={handleProfileChange}
          onSaveProfile={handleSaveProfile}
        />
      );
    }

    if (activeTab === 'orders') {
      return <OrdersPage orders={orders} formatDate={formatDate} formatPrice={formatPrice} />;
    }

    if (activeTab === 'consultations') {
      return (
        <ConsultationsPage
          backendUrl={backendUrl}
          token={token}
        />
      );
    }

    if (activeTab === 'wishlist') {
      return (
        <WishlistPage
          backendUrl={backendUrl}
          token={token}
          formatPrice={formatPrice}
        />
      );
    }

    return (
      <AddressesPage
        addresses={addresses}
        addressForm={addressForm}
        editingAddressId={editingAddressId}
        saving={saving}
        onAddressChange={handleAddressChange}
        onSaveAddress={handleSaveAddress}
        onEditAddress={handleEditAddress}
        onDeleteAddress={handleDeleteAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
        onResetAddressForm={resetAddressForm}
      />
    );
  };

  return (
    <main className="wholesaler-dashboard-page user-dashboard-page">
      <div className="wholesaler-dashboard-shell">
        <aside className="wholesaler-sidebar">
          <Link to="/" className="sidebar-brand">
            <span>Dr</span>Snoopy
          </Link>

          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <strong>{profile?.name || 'Customer'}</strong>
            <span>{profile?.email}</span>
          </div>

          <nav className="wholesaler-side-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  className={activeTab === item.id ? 'active' : ''}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button type="button" className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <section className="wholesaler-panel">
          <header className="panel-header">
            <h1>{activeTab === 'overview' ? 'Overview' : activeTab === 'profile' ? 'Setting' : activeTab === 'orders' ? 'Orders' : activeTab === 'consultations' ? 'Consultations & Appointments' : activeTab === 'wishlist' ? 'Wishlist' : 'Address'}</h1>
            <div className="panel-actions">
              <div className="top-user-chip">
                <div className="top-user-avatar">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span>{profile?.name || 'Customer'}</span>
              </div>
            </div>
          </header>

          {message && (
            <div className="dashboard-alert success">
              <CheckCircle size={16} />
              {message}
            </div>
          )}
          {error && (
            <div className="dashboard-alert error">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {loading ? (
            <div className="dashboard-card dashboard-state">Loading dashboard...</div>
          ) : (
            renderActivePage()
          )}
        </section>
      </div>
      <style>{userDashboardStyles}</style>
    </main>
  );
}

const userDashboardStyles = `
  .wholesaler-dashboard-page {
    min-height: 0;
    background: #f7f7f9;
    padding: 0;
    overflow: hidden;
  }

  .wholesaler-dashboard-shell {
    width: 100%;
    height: 100%;
    min-height: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 210px minmax(0, 1fr);
    gap: 0;
    align-items: stretch;
  }

  .wholesaler-sidebar,
  .wholesaler-panel,
  .dashboard-card,
  .settings-card,
  .wholesaler-auth-card {
    background: #ffffff;
    border: 1px solid #ececf0;
    border-radius: 8px;
    box-shadow: none;
  }

  .wholesaler-sidebar {
    position: sticky;
    top: 0;
    align-self: start;
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    padding: 0;
    display: flex;
    flex-direction: column;
    border-width: 0 1px 0 0;
    border-radius: 0;
  }

  .sidebar-brand {
    height: 58px;
    display: flex;
    align-items: center;
    padding: 0 22px;
    color: #1d2b3a;
    text-decoration: none;
    font-size: 22px;
    font-weight: 900;
    border-bottom: 1px solid #ececf0;
  }

  .sidebar-brand span {
    color: #0a58a4;
    margin-right: 2px;
  }

  .sidebar-profile {
    display: none;
  }

  .sidebar-avatar,
  .profile-photo,
  .profile-image-preview,
  .top-user-avatar {
    overflow: hidden;
    background: #0a58a4;
    color: #ffffff;
    display: grid;
    place-items: center;
    font-weight: 900;
  }

  .wholesaler-side-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 18px 0;
  }

  .wholesaler-side-nav button,
  .sidebar-logout {
    width: 100%;
    min-height: 42px;
    border-radius: 0;
    border: 1px solid transparent;
    background: transparent;
    color: #15171a;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0 22px;
    font-weight: 800;
    font-size: 13px;
    text-align: left;
  }

  .wholesaler-side-nav button.active,
  .wholesaler-side-nav button:hover {
    background: #ead7ff;
    border-color: #ead7ff;
  }

  .sidebar-logout {
    margin-top: auto;
    color: #dc2626;
    border-width: 1px 0 0;
    border-color: #ececf0;
    background: #ffffff;
    min-height: 54px;
  }

  .wholesaler-panel {
    padding: 0 28px 42px;
    border: 0;
    border-radius: 0;
    background: #f7f7f9;
    min-height: 0;
    overflow-y: auto;
  }

  .panel-header {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: center;
    min-height: 58px;
    margin: 0 -28px 24px;
    padding: 0 28px;
    background: #ffffff;
    border-bottom: 1px solid #ececf0;
  }

  .panel-header h1 {
    color: #15171a;
    font-size: 20px;
    line-height: 1;
    margin: 0;
    font-weight: 900;
  }

  .top-user-chip {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #15171a;
    font-size: 14px;
    font-weight: 800;
  }

  .top-user-avatar {
    width: 31px;
    height: 31px;
    border-radius: 50%;
  }

  .dashboard-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 8px;
    font-weight: 900;
    margin-bottom: 16px;
  }

  .dashboard-alert.success {
    background: #f0fdf4;
    color: #15803d;
  }

  .dashboard-alert.error {
    background: #fef2f2;
    color: #dc2626;
  }

  .dashboard-card,
  .settings-card {
    padding: 22px;
    border-color: #e6e6eb;
  }

  .dashboard-state,
  .empty-box {
    color: #65758a;
    text-align: center;
    padding: 28px;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    color: #f7931e;
  }

  .card-title h2 {
    color: #10243d;
    font-size: 24px;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.95fr);
    gap: 18px;
    align-items: start;
  }

  .settings-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 16px;
  }

  .settings-card-head h2 {
    color: #15171a;
    font-size: 16px;
    font-weight: 900;
    margin: 0;
  }

  .settings-card-head span,
  .profile-summary-copy span,
  .profile-summary-copy p,
  .order-row span,
  .address-item p {
    color: #6b7280;
    font-size: 13px;
  }

  .clickable-card {
    cursor: pointer;
    transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
  }

  .clickable-card:hover,
  .clickable-card:focus-visible {
    border-color: #d7c3ff;
    box-shadow: 0 10px 26px rgba(40, 30, 70, 0.08);
    outline: none;
    transform: translateY(-1px);
  }

  .recent-orders-card,
  .edit-profile-card {
    grid-column: 1 / -1;
  }

  .profile-summary-body {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
  }

  .profile-photo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    font-size: 28px;
  }

  .profile-image-preview {
    width: 82px;
    height: 82px;
    border-radius: 8px;
    font-size: 32px;
    flex-shrink: 0;
  }

  .profile-summary-copy strong,
  .compact-address-row strong,
  .order-row strong {
    display: block;
    color: #15171a;
    font-size: 14px;
    font-weight: 900;
    line-height: 1.4;
  }

  .small-edit-btn,
  .text-link-btn {
    border: 0;
    background: transparent;
    cursor: pointer;
    font-weight: 900;
  }

  .small-edit-btn {
    border-radius: 999px;
    min-height: 32px;
    padding: 0 14px;
    background: #ead7ff;
    color: #15171a;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .text-link-btn {
    color: #0a58a4;
    font-size: 13px;
    padding: 0;
  }

  .compact-address-list,
  .orders-list,
  .address-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .compact-address-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
  }

  .compact-address-row button {
    border: 0;
    background: transparent;
    color: #15171a;
    cursor: pointer;
  }

  .primary-pill {
    display: inline-flex;
    align-items: center;
    min-height: 21px;
    border-radius: 999px;
    padding: 0 10px;
    background: #eee5ff;
    color: #7b50c7;
    font-size: 11px;
    font-weight: 900;
  }

  .overview-empty-action {
    width: 100%;
    border: 1px dashed #dfe3ea;
    background: #fbfdff;
    cursor: pointer;
  }

  .image-upload-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px;
    border: 1px solid #e4edf5;
    border-radius: 8px;
    margin-bottom: 18px;
    background: #fbfdff;
  }

  .dashboard-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
  }

  .dashboard-form label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #10243d;
    font-size: 13px;
    font-weight: 900;
  }

  .dashboard-form input {
    width: 100%;
    min-height: 46px;
    border: 1.5px solid #dfe8f2;
    border-radius: 8px;
    padding: 0 13px;
    font-size: 14px;
    color: #10243d;
    outline: none;
  }

  .dashboard-form input:focus {
    border-color: #0a58a4;
    box-shadow: 0 0 0 3px rgba(10, 88, 164, 0.1);
  }

  .primary-action,
  .secondary-action {
    min-height: 46px;
    border-radius: 8px;
    padding: 0 16px;
    font-weight: 900;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .primary-action {
    border: 0;
    background: #f7931e;
    color: #ffffff;
    align-self: flex-start;
  }

  .primary-action:disabled {
    opacity: 0.72;
    cursor: not-allowed;
  }

  .secondary-action {
    border: 1px solid #dfe8f2;
    background: #ffffff;
    color: #10243d;
  }

  .order-row {
    display: grid;
    grid-template-columns: 1.2fr 1fr 0.8fr;
    gap: 16px;
    padding: 15px;
    border: 1px solid #e4edf5;
    border-radius: 8px;
    text-decoration: none;
    color: #10243d;
    background: #fbfdff;
  }

  .order-row:hover {
    border-color: #d7c3ff;
    background: #fbf9ff;
  }

  .order-track-card {
    border: 1px solid #e4edf5;
    border-radius: 8px;
    background: #ffffff;
    overflow: hidden;
  }

  .order-track-card.active {
    border-color: #c9a7ff;
    box-shadow: 0 10px 26px rgba(40, 30, 70, 0.07);
  }

  .order-track-card .order-row {
    border: 0;
    border-radius: 0;
  }

  .order-row-with-actions {
    grid-template-columns: 1.2fr 1fr 0.8fr auto;
    align-items: center;
  }

  .order-action-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    flex-wrap: wrap;
  }

  .order-invoice-link,
  .track-order-btn,
  .delhivery-track-link,
  .tracking-disabled-btn {
    min-height: 36px;
    padding: 0 12px;
    border-radius: 8px;
    font-size: 12px;
    white-space: nowrap;
    align-self: center;
    text-decoration: none;
  }

  .track-order-btn {
    background: #0a58a4;
  }

  .delhivery-track-link {
    background: #111827;
  }

  .tracking-disabled-btn {
    opacity: 0.62;
    cursor: not-allowed;
  }

  .tracking-panel {
    border-top: 1px solid #e4edf5;
    padding: 16px;
    background: #fbfdff;
  }

  .tracking-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .delhivery-panel-link {
    width: fit-content;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    background: #111827;
    color: #ffffff;
    text-decoration: none;
    padding: 0 14px;
    font-size: 13px;
    font-weight: 900;
    margin-bottom: 16px;
  }

  .tracking-summary div {
    border: 1px solid #e4edf5;
    border-radius: 8px;
    background: #ffffff;
    padding: 12px;
    min-width: 0;
  }

  .tracking-summary span {
    display: block;
    color: #64748b;
    font-size: 11px;
    font-weight: 900;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .tracking-summary strong {
    display: block;
    color: #10243d;
    font-size: 13px;
    word-break: break-word;
  }

  .tracking-timeline {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }

  .tracking-step {
    position: relative;
    min-height: 92px;
    border: 1px solid #e4edf5;
    border-radius: 8px;
    background: #ffffff;
    padding: 12px;
    color: #64748b;
  }

  .tracking-step.done {
    border-color: #b9efcc;
    background: #f0fdf4;
    color: #08703f;
  }

  .tracking-step.current {
    border-color: #0a58a4;
    box-shadow: inset 0 0 0 1px #0a58a4;
  }

  .tracking-step-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #f1f5f9;
    color: #64748b;
    margin-bottom: 9px;
  }

  .tracking-step.done .tracking-step-icon {
    background: #08703f;
    color: #ffffff;
  }

  .tracking-step strong {
    display: block;
    color: #10243d;
    font-size: 12px;
    line-height: 1.35;
  }

  .tracking-step span {
    display: block;
    font-size: 11px;
    font-weight: 800;
    margin-top: 4px;
  }

  .tracking-terminal {
    border: 1px solid #fecaca;
    border-radius: 8px;
    background: #fff1f1;
    color: #b91c1c;
    padding: 12px;
    font-weight: 900;
  }

  .address-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.85fr);
    gap: 20px;
  }

  .address-form {
    border: 1px solid #e4edf5;
    border-radius: 8px;
    padding: 16px;
    background: #fbfdff;
  }

  .default-toggle {
    flex-direction: row !important;
    align-items: center;
    margin-top: 26px;
  }

  .default-toggle input {
    width: 18px;
    min-height: 18px;
    accent-color: #f7931e;
  }

  .form-actions,
  .address-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .address-item {
    border: 1px solid #e4edf5;
    border-radius: 8px;
    padding: 15px;
    background: #ffffff;
  }

  .address-item-head {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
  }

  .address-item-head strong {
    color: #10243d;
  }

  .address-item-head span {
    background: #ecfdf3;
    color: #08703f;
    border-radius: 999px;
    padding: 3px 9px;
    font-size: 12px;
    font-weight: 900;
  }

  .address-actions {
    margin-top: 13px;
  }

  .address-actions button {
    border: 1px solid #dfe8f2;
    background: #ffffff;
    color: #10243d;
    border-radius: 8px;
    padding: 8px 10px;
    font-weight: 900;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .address-actions .danger-text-btn {
    color: #dc2626;
  }

  .wholesaler-auth-card {
    width: min(520px, 92%);
    margin: 40px auto;
    padding: 34px;
    text-align: center;
  }

  .wholesaler-auth-card svg {
    color: #f7931e;
  }

  .wholesaler-auth-card h1 {
    font-size: 30px;
    margin: 14px 0 8px;
    color: #10243d;
  }

  .wholesaler-auth-card p {
    color: #65758a;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .wholesaler-auth-card a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0 18px;
    border-radius: 8px;
    background: #f7931e;
    color: #ffffff;
    text-decoration: none;
    font-weight: 900;
  }

  .user-dashboard-page {
    --user-green: #0C3D2E;
    --user-orange: #FFA500;
    --user-cream: #f4f7f5;
    --user-soft: #f7efe2;
    --user-line: #eadfce;
    background: var(--user-cream);
    color: var(--user-green);
  }

  .user-dashboard-page .wholesaler-dashboard-shell {
    background: var(--user-cream);
  }

  .user-dashboard-page .wholesaler-sidebar {
    background: var(--user-green);
    border-color: rgba(255,255,255,0.12);
    color: #ffffff;
  }

  .user-dashboard-page .sidebar-brand {
    color: #ffffff;
    border-color: rgba(255,255,255,0.12);
    font-family: Georgia, 'Times New Roman', serif;
  }

  .user-dashboard-page .sidebar-brand span {
    color: var(--user-orange);
  }

  .user-dashboard-page .wholesaler-side-nav button,
  .user-dashboard-page .sidebar-logout {
    color: rgba(255,255,255,0.82);
    border-radius: 0 999px 999px 0;
    margin-right: 12px;
  }

  .user-dashboard-page .wholesaler-side-nav button.active,
  .user-dashboard-page .wholesaler-side-nav button:hover {
    background: var(--user-orange);
    border-color: var(--user-orange);
    color: #ffffff;
    box-shadow: 0 10px 24px rgba(255,165,0,0.22);
  }

  .user-dashboard-page .sidebar-logout {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.12);
    color: #ffffff;
  }

  .user-dashboard-page .sidebar-logout:hover {
    background: #ffffff;
    color: #dc2626;
  }

  .user-dashboard-page .wholesaler-panel {
    background: var(--user-cream);
  }

  .user-dashboard-page .panel-header {
    background: #ffffff;
    border-color: var(--user-line);
    box-shadow: 0 8px 24px rgba(12,61,46,0.06);
  }

  .user-dashboard-page .panel-header h1,
  .user-dashboard-page .settings-card-head h2,
  .user-dashboard-page .card-title h2,
  .user-dashboard-page .profile-summary-copy strong,
  .user-dashboard-page .compact-address-row strong,
  .user-dashboard-page .order-row strong,
  .user-dashboard-page .address-item-head strong,
  .user-dashboard-page .tracking-summary strong,
  .user-dashboard-page .tracking-step strong,
  .user-dashboard-page .dashboard-form label {
    color: var(--user-green);
  }

  .user-dashboard-page .top-user-chip {
    color: var(--user-green);
  }

  .user-dashboard-page .sidebar-avatar,
  .user-dashboard-page .profile-photo,
  .user-dashboard-page .profile-image-preview,
  .user-dashboard-page .top-user-avatar {
    background: var(--user-green);
    color: #ffffff;
    box-shadow: 0 8px 18px rgba(12,61,46,0.16);
  }

  .user-dashboard-page .dashboard-card,
  .user-dashboard-page .settings-card,
  .user-dashboard-page .wholesaler-auth-card,
  .user-dashboard-page .order-track-card,
  .user-dashboard-page .address-item {
    background: #ffffff;
    border-color: var(--user-line);
    border-radius: 12px;
    box-shadow: 0 10px 28px rgba(12,61,46,0.06);
  }

  .user-dashboard-page .card-title {
    color: var(--user-orange);
  }

  .user-dashboard-page .small-edit-btn,
  .user-dashboard-page .primary-action,
  .user-dashboard-page .wholesaler-auth-card a,
  .user-dashboard-page .track-order-btn,
  .user-dashboard-page .order-invoice-link {
    background: var(--user-orange);
    color: #ffffff;
    border-color: var(--user-orange);
    border-radius: 999px;
    box-shadow: 0 10px 22px rgba(255,165,0,0.22);
  }

  .user-dashboard-page .small-edit-btn:hover,
  .user-dashboard-page .primary-action:hover,
  .user-dashboard-page .wholesaler-auth-card a:hover,
  .user-dashboard-page .track-order-btn:hover,
  .user-dashboard-page .order-invoice-link:hover {
    background: var(--user-green);
    border-color: var(--user-green);
    color: #ffffff;
  }

  .user-dashboard-page .secondary-action,
  .user-dashboard-page .address-actions button,
  .user-dashboard-page .compact-address-row button {
    border-color: var(--user-line);
    color: var(--user-green);
    background: #ffffff;
    border-radius: 999px;
  }

  .user-dashboard-page .secondary-action:hover,
  .user-dashboard-page .address-actions button:hover,
  .user-dashboard-page .compact-address-row button:hover {
    border-color: var(--user-orange);
    color: var(--user-orange);
  }

  .user-dashboard-page .text-link-btn {
    color: var(--user-orange);
  }

  .user-dashboard-page .primary-pill,
  .user-dashboard-page .address-item-head span {
    background: #fff3d8;
    color: var(--user-green);
  }

  .user-dashboard-page .image-upload-row,
  .user-dashboard-page .address-form,
  .user-dashboard-page .order-row,
  .user-dashboard-page .tracking-panel,
  .user-dashboard-page .tracking-summary div,
  .user-dashboard-page .tracking-step,
  .user-dashboard-page .overview-empty-action {
    background: #ffffff;
    border-color: var(--user-line);
    color: var(--user-green);
  }

  .user-dashboard-page .order-row:hover,
  .user-dashboard-page .clickable-card:hover,
  .user-dashboard-page .clickable-card:focus-visible {
    border-color: var(--user-orange);
    box-shadow: 0 14px 30px rgba(255,165,0,0.12);
  }

  .user-dashboard-page .dashboard-form input {
    border-color: var(--user-line);
    color: var(--user-green);
    background: #ffffff;
  }

  .user-dashboard-page .dashboard-form input:focus {
    border-color: var(--user-orange);
    box-shadow: 0 0 0 3px rgba(255,165,0,0.16);
  }

  .user-dashboard-page .default-toggle input {
    accent-color: var(--user-orange);
  }

  .user-dashboard-page .tracking-step.done {
    background: #edf7f1;
    border-color: rgba(12,61,46,0.28);
    color: var(--user-green);
  }

  .user-dashboard-page .tracking-step.current {
    border-color: var(--user-orange);
    box-shadow: inset 0 0 0 1px var(--user-orange);
  }

  .user-dashboard-page .tracking-step.done .tracking-step-icon {
    background: var(--user-green);
  }

  .user-dashboard-page .wholesaler-auth-card svg {
    color: var(--user-orange);
  }

  @media (max-width: 900px) {
    .wholesaler-dashboard-shell,
    .address-layout,
    .form-grid,
    .order-row,
    .settings-grid,
    .order-row-with-actions,
    .tracking-summary,
    .tracking-timeline {
      grid-template-columns: 1fr;
    }

    .order-action-group {
      justify-content: flex-start;
    }

    .wholesaler-sidebar {
      position: sticky;
      top: 0;
      z-index: 25;
      height: auto;
      min-height: auto;
      overflow: visible;
    }

    .panel-header,
    .image-upload-row {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;
