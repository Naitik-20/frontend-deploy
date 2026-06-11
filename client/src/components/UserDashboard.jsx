import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  MapPin,
  Pencil,
  Plus,
  LogOut,
  Save,
  Shield,
  Trash2,
  User,
} from "lucide-react";

export default function UserDashboard({ backendUrl, user, onUserUpdate, onLogout }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });
  const emptyAddressForm = {
    label: "Home",
    firstName: "",
    lastName: "",
    phone: "",
    country: "India",
    address: "",
    city: "",
    region: "",
    zip: "",
    isDefault: false,
  };
  const [addressForm, setAddressForm] = useState(emptyAddressForm);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }

        setProfile(data.user);
        setOrders(data.orders || []);
        setAddresses(data.user.addresses || []);
        setFormData((current) => ({
          ...current,
          name: data.user.name || "",
          email: data.user.email || "",
        }));
        onUserUpdate?.(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [backendUrl, onUserUpdate, token]);

  const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm);
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressForm({
      label: address.label || "Home",
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      phone: address.phone || "",
      country: address.country || "India",
      address: address.address || "",
      city: address.city || "",
      region: address.region || "",
      zip: address.zip || "",
      isDefault: Boolean(address.isDefault),
    });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const url = editingAddressId
        ? `${backendUrl}/api/auth/me/addresses/${editingAddressId}`
        : `${backendUrl}/api/auth/me/addresses`;
      const response = await fetch(url, {
        method: editingAddressId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save address");
      }

      setAddresses(data.addresses || []);
      resetAddressForm();
      setMessage(editingAddressId ? "Address updated successfully." : "Address added successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${backendUrl}/api/auth/me/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete address");
      }

      setAddresses(data.addresses || []);
      if (editingAddressId === addressId) {
        resetAddressForm();
      }
      setMessage("Address deleted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefaultAddress = async (address) => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${backendUrl}/api/auth/me/addresses/${address._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...address, isDefault: true }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update default address");
      }

      setAddresses(data.addresses || []);
      setMessage("Default address updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      setProfile(data.user);
      onUserUpdate?.(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setFormData((current) => ({
        ...current,
        currentPassword: "",
        newPassword: "",
      }));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete account");
      }

      onLogout?.();
      navigate("/shop");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <main className="profile-page">
        <div className="profile-auth-card">
          <Shield size={40} />
          <h1>Please log in</h1>
          <p>You need an account to view and edit your dashboard.</p>
          <Link to="/shop">Back to shop</Link>
        </div>
        <style>{profileStyles}</style>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <section className="profile-hero">
          <div className="profile-avatar">
            {profile?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <span>My Account</span>
            <h1>{profile?.name || "Customer Dashboard"}</h1>
            <p>{profile?.email}</p>
          </div>
          <button className="profile-logout-btn" onClick={onLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </section>

        {loading ? (
          <div className="profile-card profile-state">Loading dashboard...</div>
        ) : (
          <div className="profile-grid">
            <section className="profile-card">
              <div className="profile-card-title">
                <User size={20} />
                <h2>Personal Details</h2>
              </div>

              {message && (
                <div className="profile-alert success">
                  <CheckCircle size={16} />
                  {message}
                </div>
              )}
              {error && (
                <div className="profile-alert error">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}

              <form className="profile-form" onSubmit={handleSave}>
                <label>
                  Full Name
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </label>

                <label>
                  Email Address
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <div className="profile-form-grid">
                  <label>
                    Current Password
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Required for password change"
                    />
                  </label>

                  <label>
                    New Password
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Leave blank to keep same"
                      minLength={6}
                    />
                  </label>
                </div>

                <button className="profile-save-btn" disabled={saving}>
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </section>

            <section className="profile-card address-card">
              <div className="profile-card-title">
                <MapPin size={20} />
                <h2>Delivery Addresses</h2>
              </div>

              <div className="address-layout">
                <form className="profile-form address-form" onSubmit={handleSaveAddress}>
                  <div className="profile-form-grid">
                    <label>
                      Label
                      <input
                        name="label"
                        value={addressForm.label}
                        onChange={handleAddressChange}
                        placeholder="Home, Office"
                        required
                      />
                    </label>
                    <label className="default-address-toggle">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={addressForm.isDefault}
                        onChange={handleAddressChange}
                      />
                      Use as default checkout address
                    </label>
                  </div>

                  <div className="profile-form-grid">
                    <label>
                      First Name
                      <input
                        name="firstName"
                        value={addressForm.firstName}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                    <label>
                      Last Name
                      <input
                        name="lastName"
                        value={addressForm.lastName}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                  </div>

                  <div className="profile-form-grid">
                    <label>
                      Phone
                      <input
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                    <label>
                      Country
                      <input
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                  </div>

                  <label>
                    Address
                    <input
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                      placeholder="House number, street, area"
                      required
                    />
                  </label>

                  <div className="profile-form-grid">
                    <label>
                      City
                      <input
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                    <label>
                      State / Region
                      <input
                        name="region"
                        value={addressForm.region}
                        onChange={handleAddressChange}
                        required
                      />
                    </label>
                  </div>

                  <label>
                    Zip / Postal Code
                    <input
                      name="zip"
                      value={addressForm.zip}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>

                  <div className="address-form-actions">
                    <button className="profile-save-btn" disabled={saving}>
                      {editingAddressId ? <Save size={17} /> : <Plus size={17} />}
                      {saving ? "Saving..." : editingAddressId ? "Update Address" : "Add Address"}
                    </button>
                    {editingAddressId && (
                      <button type="button" className="profile-secondary-btn" onClick={resetAddressForm}>
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>

                <div className="address-list">
                  {addresses.length === 0 ? (
                    <div className="profile-empty">
                      <p>No saved addresses yet.</p>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <article className="address-item" key={address._id}>
                        <div className="address-item-header">
                          <strong>{address.label}</strong>
                          {address.isDefault && <span>Default</span>}
                        </div>
                        <p>{address.firstName} {address.lastName}</p>
                        <p>{address.phone}</p>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.region} - {address.zip}</p>
                        <div className="address-actions">
                          <button type="button" onClick={() => handleEditAddress(address)}>
                            <Pencil size={14} />
                            Edit
                          </button>
                          {!address.isDefault && (
                            <button type="button" onClick={() => handleSetDefaultAddress(address)}>
                              Set Default
                            </button>
                          )}
                          <button type="button" className="danger-text-btn" onClick={() => handleDeleteAddress(address._id)}>
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="profile-card">
              <div className="profile-card-title">
                <ClipboardList size={20} />
                <h2>Order History</h2>
              </div>

              {orders.length === 0 ? (
                <div className="profile-empty">
                  <p>No orders found yet.</p>
                  <Link to="/shop">Start shopping</Link>
                </div>
              ) : (
                <div className="profile-orders">
                  {orders.map((order) => (
                    <Link
                      to={`/invoice/${order._id}`}
                      state={{ order }}
                      className="profile-order-row"
                      key={order._id}
                    >
                      <div>
                        <strong>{order.orderNumber}</strong>
                        <span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>
                      <div>
                        <strong>{formatPrice(order.total)}</strong>
                        <span>{order.paymentMethod} / {order.paymentStatus}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {profile?.role !== "admin" && (
              <section className="profile-card danger-card">
                <div className="profile-card-title">
                  <Trash2 size={20} />
                  <h2>Delete Account</h2>
                </div>
                <p>This permanently removes your account. Your past order records may remain for billing and shipping records.</p>

                {!showDeleteConfirm ? (
                  <button className="profile-danger-btn" onClick={() => setShowDeleteConfirm(true)}>
                    Delete My Account
                  </button>
                ) : (
                  <div className="delete-confirm">
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter password to confirm"
                    />
                    <div className="delete-actions">
                      <button type="button" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                      </button>
                      <button type="button" className="profile-danger-btn" onClick={handleDeleteAccount} disabled={saving}>
                        {saving ? "Deleting..." : "Confirm Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>

      <style>{profileStyles}</style>
    </main>
  );
}

const profileStyles = `
  .profile-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 34px 0 70px;
  }

  .profile-shell {
    width: min(1120px, 92%);
    margin: 0 auto;
  }

  .profile-hero,
  .profile-card,
  .profile-auth-card {
    background: white;
    border: 1px solid var(--border-light);
    border-radius: 18px;
    box-shadow: var(--shadow-sm);
  }

  .profile-hero {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .profile-avatar {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: var(--primary-color);
    color: white;
    display: grid;
    place-items: center;
    font-size: 30px;
    font-weight: 900;
  }

  .profile-hero span {
    color: var(--secondary-color);
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
  }

  .profile-hero h1 {
    font-family: var(--font-headers);
    font-size: 34px;
    margin: 4px 0;
  }

  .profile-hero p {
    color: var(--text-medium);
  }

  .profile-logout-btn {
    margin-left: auto;
    border: 1px solid var(--border-light);
    background: white;
    color: var(--text-dark);
    border-radius: 12px;
    padding: 12px 16px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .profile-grid {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 22px;
  }

  .profile-card {
    padding: 24px;
  }

  .profile-card-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    color: var(--secondary-color);
  }

  .profile-card-title h2 {
    font-family: var(--font-headers);
    font-size: 26px;
    color: var(--text-dark);
  }

  .profile-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .profile-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .profile-form label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--text-dark);
    font-size: 14px;
    font-weight: 800;
  }

  .profile-form input,
  .delete-confirm input {
    width: 100%;
    border: 1.5px solid var(--border-light);
    border-radius: 12px;
    padding: 14px;
    font-size: 15px;
    outline: none;
  }

  .profile-form input:focus,
  .delete-confirm input:focus {
    border-color: var(--secondary-color);
  }

  .profile-save-btn,
  .profile-secondary-btn,
  .profile-danger-btn,
  .profile-empty a,
  .profile-auth-card a {
    border: none;
    border-radius: 12px;
    padding: 14px 18px;
    font-weight: 900;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .profile-save-btn,
  .profile-empty a,
  .profile-auth-card a {
    background: var(--secondary-color);
    color: white;
  }

  .profile-secondary-btn {
    background: white;
    color: var(--text-dark);
    border: 1px solid var(--border-light);
  }

  .profile-danger-btn {
    background: #dc2626;
    color: white;
  }

  .profile-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 12px;
    font-weight: 800;
    margin-bottom: 16px;
  }

  .profile-alert.success {
    background: #f0fdf4;
    color: #15803d;
  }

  .profile-alert.error {
    background: #fef2f2;
    color: #dc2626;
  }

  .profile-orders {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .profile-order-row {
    border: 1px solid var(--border-light);
    border-radius: 14px;
    padding: 14px;
    color: var(--text-dark);
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  .profile-order-row span {
    display: block;
    color: var(--text-medium);
    font-size: 13px;
    margin-top: 4px;
  }

  .profile-empty {
    border: 1px dashed var(--border-light);
    border-radius: 14px;
    padding: 24px;
    text-align: center;
  }

  .profile-empty p {
    color: var(--text-medium);
    margin-bottom: 16px;
  }

  .address-card {
    grid-column: 1 / -1;
  }

  .address-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
    gap: 22px;
  }

  .address-form {
    border: 1px solid var(--border-light);
    border-radius: 16px;
    padding: 18px;
    background: var(--bg-main);
  }

  .default-address-toggle {
    flex-direction: row !important;
    align-items: center;
    justify-content: flex-start;
    margin-top: 26px;
  }

  .default-address-toggle input {
    width: 18px;
    height: 18px;
    accent-color: var(--secondary-color);
  }

  .address-form-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .address-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .address-item {
    border: 1px solid var(--border-light);
    border-radius: 16px;
    padding: 16px;
    background: white;
  }

  .address-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }

  .address-item-header strong {
    font-size: 17px;
    color: var(--text-dark);
  }

  .address-item-header span {
    background: #f0fdf4;
    color: #15803d;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 900;
  }

  .address-item p {
    color: var(--text-medium);
    line-height: 1.55;
  }

  .address-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .address-actions button {
    border: 1px solid var(--border-light);
    background: white;
    color: var(--text-dark);
    border-radius: 10px;
    padding: 9px 11px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .address-actions .danger-text-btn {
    color: #dc2626;
  }

  .danger-card {
    grid-column: 1 / -1;
    border-color: #fecaca;
  }

  .danger-card p {
    color: var(--text-medium);
    margin-bottom: 16px;
    line-height: 1.6;
  }

  .delete-confirm {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .delete-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .delete-actions button:first-child {
    border: 1px solid var(--border-light);
    background: white;
    color: var(--text-dark);
    border-radius: 12px;
    padding: 14px 18px;
    font-weight: 900;
    cursor: pointer;
  }

  .profile-state,
  .profile-auth-card {
    padding: 34px;
    text-align: center;
  }

  .profile-auth-card {
    width: min(520px, 92%);
    margin: 40px auto;
  }

  .profile-auth-card svg {
    color: var(--secondary-color);
  }

  .profile-auth-card h1 {
    font-family: var(--font-headers);
    font-size: 34px;
    margin: 12px 0 8px;
  }

  .profile-auth-card p {
    color: var(--text-medium);
    margin-bottom: 20px;
  }

  @media (max-width: 820px) {
    .profile-hero {
      align-items: flex-start;
      flex-direction: column;
    }

    .profile-logout-btn {
      margin-left: 0;
    }

    .profile-grid,
    .address-layout,
    .profile-form-grid {
      grid-template-columns: 1fr;
    }

    .profile-order-row {
      flex-direction: column;
    }
  }
`;
