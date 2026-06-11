import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Heart, ShoppingCart, Trash2, X } from 'lucide-react';

export default function WishlistPage({ backendUrl, token, formatPrice = (val) => `Rs. ${val}` }) {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/user/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setWishlist(data);
      } else {
        setError(data.message || 'Failed to load wishlist');
      }
    } catch (err) {
      setError(err.message || 'Error fetching wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm('Remove this item from wishlist?')) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(
        `${backendUrl}/api/user/wishlist/${productId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item');
      }

      setMessage('Item removed from wishlist');
      setWishlist(data.wishlist);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClearWishlist = async () => {
    if (!window.confirm('Clear entire wishlist? This action cannot be undone.')) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/user/wishlist`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear wishlist');
      }

      setMessage('Wishlist cleared');
      setWishlist(data.wishlist);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = (productId) => {
    alert(`Product ${productId} added to cart!`);
    // Implement actual add to cart functionality here
  };

  if (loading) {
    return <div className="dashboard-card dashboard-state">Loading wishlist...</div>;
  }

  const items = wishlist?.items || [];

  return (
    <div className="wishlist-page">
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

      <div className="wishlist-header">
        <div>
          <h2>My Wishlist</h2>
          <p>Save your favorite products for later</p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClearWishlist}
            disabled={saving}
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="dashboard-card dashboard-state">
          <Heart size={32} />
          <p>Your wishlist is empty</p>
          <button type="button" className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="wishlist-container">
          <div className="wishlist-stats">
            <div className="stat-item">
              <span className="stat-label">Items in Wishlist</span>
              <span className="stat-value">{items.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Value</span>
              <span className="stat-value">
                {formatPrice(items.reduce((sum, item) => sum + (item.price || 0), 0))}
              </span>
            </div>
          </div>

          <div className="wishlist-items">
            {items.map((item) => (
              <div key={item._id} className="wishlist-item">
                <div className="item-image">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} />
                  ) : (
                    <div className="image-placeholder">
                      <Heart size={32} />
                    </div>
                  )}
                </div>

                <div className="item-details">
                  <h3>{item.productName}</h3>
                  <p className="item-price">{formatPrice(item.price)}</p>
                  <p className="item-added">
                    Added {new Date(item.addedAt).toLocaleDateString('en-IN')}
                  </p>
                </div>

                <div className="item-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    onClick={() => handleAddToCart(item.productId)}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={saving}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{wishlistStyles}</style>
    </div>
  );
}

const wishlistStyles = `
  .wishlist-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .wishlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .wishlist-header h2 {
    margin: 0 0 4px 0;
    font-size: 20px;
    color: #1d2b3a;
  }

  .wishlist-header p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }

  .wishlist-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .wishlist-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .stat-item {
    background: white;
    border: 1px solid #ececf0;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stat-label {
    color: #6b7280;
    font-size: 13px;
    font-weight: 500;
  }

  .stat-value {
    color: #3b82f6;
    font-size: 24px;
    font-weight: 700;
  }

  .wishlist-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .wishlist-item {
    background: white;
    border: 1px solid #ececf0;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
  }

  .wishlist-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }

  .item-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    color: #d1d5db;
  }

  .item-details {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item-details h3 {
    margin: 0;
    color: #1d2b3a;
    font-size: 15px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .item-price {
    margin: 0;
    color: #10b981;
    font-size: 16px;
    font-weight: 700;
  }

  .item-added {
    margin: 0;
    color: #9ca3af;
    font-size: 12px;
  }

  .item-actions {
    padding: 12px 16px;
    border-top: 1px solid #f3f4f6;
    display: flex;
    gap: 8px;
  }

  .btn-small {
    flex: 1;
    padding: 8px 12px !important;
    font-size: 13px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .btn-danger {
    background: #ef4444;
    color: white;
    border: none;
  }

  .btn-danger:hover:not(:disabled) {
    background: #dc2626;
  }
`;
