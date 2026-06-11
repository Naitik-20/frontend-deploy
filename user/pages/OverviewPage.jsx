import { Link } from 'react-router-dom';
import { MoreVertical, Pencil } from 'lucide-react';

export default function OverviewPage({
  profile,
  addresses,
  primaryAddress,
  recentOrders,
  onTabChange,
  formatDate,
  formatPrice,
}) {
  const openTab = (tab) => onTabChange(tab);

  const handleCardKeyDown = (event, tab) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openTab(tab);
  };

  return (
    <div className="settings-grid">
      <section
        className="settings-card profile-summary-card clickable-card"
        role="button"
        tabIndex={0}
        onClick={() => openTab('profile')}
        onKeyDown={(event) => handleCardKeyDown(event, 'profile')}
      >
        <div className="settings-card-head">
          <h2>Your profile</h2>
          <span>Customer account</span>
        </div>
        <div className="profile-summary-body">
          <div className="profile-photo">
            {profile?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-summary-copy">
            <strong>{profile?.name || 'Customer'}</strong>
            <span>{profile?.email || 'Email not added'}</span>
            <p>{primaryAddress?.phone || 'Phone not added'}</p>
          </div>
          <button type="button" className="small-edit-btn">
            <Pencil size={14} />
            Edit
          </button>
        </div>
      </section>

      <section
        className="settings-card address-summary-card clickable-card"
        role="button"
        tabIndex={0}
        onClick={() => openTab('addresses')}
        onKeyDown={(event) => handleCardKeyDown(event, 'addresses')}
      >
        <div className="settings-card-head">
          <h2>Address</h2>
        </div>
        {primaryAddress ? (
          <div className="compact-address-list">
            {addresses.slice(0, 3).map((address) => (
              <div className="compact-address-row" key={address._id}>
                <div>
                  {address.isDefault && <span className="primary-pill">Primary</span>}
                  <strong>{address.address}</strong>
                  <p>{[address.city, address.region, address.zip].filter(Boolean).join(', ')}</p>
                </div>
                <button type="button" aria-label="Open address settings">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-box">No saved addresses yet.</div>
        )}
      </section>

      <section className="settings-card recent-orders-card">
        <div className="settings-card-head">
          <h2>Recent Orders</h2>
          <button type="button" className="text-link-btn" onClick={() => openTab('orders')}>
            View all
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <button type="button" className="empty-box overview-empty-action" onClick={() => openTab('orders')}>
            No orders found yet.
          </button>
        ) : (
          <div className="orders-list recent-orders-list">
            {recentOrders.map((order) => (
              <Link to={`/invoice/${order._id}`} state={{ order }} className="order-row recent-order-row" key={order._id}>
                <div>
                  <strong>{order.orderNumber}</strong>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <strong>{formatPrice(order.total)}</strong>
                  <span>{order.paymentMethod} / {order.paymentStatus}</span>
                </div>
                <div>
                  <strong>{order.orderStatus}</strong>
                  <span>{order.items?.length || 0} item lines</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
