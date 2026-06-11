import { ShoppingCart, Eye, Star, Tag } from 'lucide-react';

// ==========================================================
// PRODUCTCARD COMPONENT
// Ek single product ko display karta hai.
// Props:
//   product     → product object (id, name, brand, price, mrp, image, category)
//   onAddToCart → cart mein add karo (function)
//   onProductClick → product detail modal open karo (function)
//   backendUrl  → base URL for image paths
// ==========================================================

export default function ProductCard({ product, onAddToCart, onProductClick, backendUrl }) {
  const {
    name = 'Product',
    brand = '',
    price = 0,
    mrp = 0,
    image,
    category = '',
    stock = 10,
    moq = 1,
    moqLabel = 'MOQ',
  } = product;

  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;
  const minimumOrderQty = Math.max(1, Number(moq || 1));

  // Image URL: backend mein image stored hai? Use backendUrl. Warna placeholder.
  const imgSrc = image
    ? (image.startsWith('http') ? image : `${backendUrl}${image.startsWith('/') ? image : `/${image}`}`)
    : `https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=75`;

  const handleProductClick = () => {
    if (typeof onProductClick === 'function') {
      onProductClick(product);
    }
  };

  return (
    <article className="pcard" onClick={handleProductClick} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleProductClick();
      }
    }}>
      {/* Image Area */}
      <div className="pcard-img-wrap">
        <img
          src={imgSrc}
          alt={name}
          className="pcard-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=75';
          }}
        />

        {/* Discount badge */}
        {discount > 0 && (
          <span className="pcard-discount-badge">{discount}% OFF</span>
        )}

        {/* Out of stock overlay */}
        {stock === 0 && (
          <div className="pcard-out-of-stock">Out of Stock</div>
        )}

        {/* Quick View hover */}
        <div className="pcard-hover-layer">
          <button className="pcard-quick-view" type="button" onClick={(e) => {
            e.stopPropagation();
            handleProductClick();
          }}>
            <Eye size={14} /> Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pcard-info">
        {/* Brand + Category */}
        <div className="pcard-meta-row">
          {brand && <span className="pcard-brand"><Tag size={10}/> {brand}</span>}
          {category && <span className="pcard-category">{category}</span>}
        </div>

        {/* Product Name */}
        <h3 className="pcard-name">
          {name}
        </h3>

        {/* Fake Stars */}
        <div className="pcard-stars">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              fill={i < 4 ? '#f7931e' : 'none'}
              color={i < 4 ? '#f7931e' : '#d1d5db'}
            />
          ))}
          <span className="pcard-rating-count">(12)</span>
        </div>

        {/* Prices */}
        <div className="pcard-price-row">
          <span className="pcard-sale-price">₹{price.toLocaleString()}</span>
          {mrp > price && (
            <span className="pcard-mrp">₹{mrp.toLocaleString()}</span>
          )}
        </div>
        <div className="pcard-moq-row">
          <span>{moqLabel}</span>
          <strong>{minimumOrderQty} pcs</strong>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="pcard-footer">
        <button
          type="button"
          className="pcard-add-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={stock === 0}
        >
          <ShoppingCart size={14} />
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Styles */}
      <style>{`
        .pcard {
          background: white;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: var(--transition-smooth);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
        }

        .pcard:hover {
          border-color: var(--secondary-color);
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        /* Image */
        .pcard-img-wrap {
          position: relative;
          overflow: hidden;
          height: 200px;
          background: #f9fafb;
          cursor: pointer;
        }

        .pcard-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .pcard:hover .pcard-img {
          transform: scale(1.07);
        }

        /* Discount badge */
        .pcard-discount-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 999px;
        }

        /* Out of stock overlay */
        .pcard-out-of-stock {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          backdrop-filter: blur(2px);
        }

        /* Quick view hover */
        .pcard-hover-layer {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(10, 88, 164, 0.88);
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .pcard:hover .pcard-hover-layer {
          opacity: 1;
        }

        .pcard-quick-view {
          background: white;
          color: var(--primary-color);
          border: none;
          padding: 7px 18px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }

        .pcard-quick-view:hover {
          background: var(--secondary-color);
          color: white;
        }

        /* Info block */
        .pcard-info {
          padding: 12px 14px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pcard-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .pcard-brand {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          color: var(--secondary-color);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .pcard-category {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-light);
          background: var(--bg-main);
          padding: 2px 7px;
          border-radius: 999px;
        }

        .pcard-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1.4;
          cursor: pointer;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: var(--transition-smooth);
        }

        .pcard-name:hover {
          color: var(--primary-color);
        }

        .pcard-stars {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .pcard-rating-count {
          font-size: 11px;
          color: var(--text-light);
          margin-left: 4px;
        }

        .pcard-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .pcard-sale-price {
          font-size: 18px;
          font-weight: 900;
          color: var(--primary-color);
        }

        .pcard-mrp {
          font-size: 13px;
          color: var(--text-light);
          text-decoration: line-through;
        }

        .pcard-moq-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          padding: 5px 8px;
          font-size: 11px;
          color: var(--text-medium);
        }

        .pcard-moq-row strong {
          color: var(--primary-color);
          font-weight: 850;
        }

        /* Footer */
        .pcard-footer {
          padding: 0 14px 14px;
        }

        .pcard-add-btn {
          width: 100%;
          background: var(--secondary-color);
          color: white;
          border: none;
          padding: 10px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: var(--transition-smooth);
        }

        .pcard-add-btn:hover:not(:disabled) {
          background: var(--secondary-hover);
          transform: translateY(-1px);
        }

        .pcard-add-btn:disabled {
          background: var(--text-light);
          cursor: not-allowed;
        }
      `}</style>
    </article>
  );
}