import { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Tag, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart, backendUrl }) {
  const minimumOrderQty = Math.max(1, Number(product?.moq || product?.normalMoq || product?.wholesalerMoq || 1));
  const [qty, setQty] = useState(minimumOrderQty);

  const {
    name = 'Product',
    brand = '',
    price = 0,
    mrp = 0,
    image,
    category = '',
    description = 'Premium quality pet product from Dr. Snoopy. Trusted by pet parents across India.',
    stock = 10,
    moqLabel = 'MOQ',
  } = product;

  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;

  const imgSrc = image
    ? (image.startsWith('http') ? image : `${backendUrl}${image.startsWith('/') ? image : `/${image}`}`)
    : 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80';

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    setQty(minimumOrderQty);
  }, [minimumOrderQty, product?.id]);

  const handleAddToCart = () => {
    onAddToCart(product, qty);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="pdm-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="pdm-modal" role="dialog" aria-modal="true" aria-label={name}>

        {/* Close button */}
        <button className="pdm-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="pdm-body">
          {/* LEFT: Image */}
          <div className="pdm-img-col">
            <div className="pdm-img-wrap">
              <img
                src={imgSrc}
                alt={name}
                className="pdm-img"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80'; }}
              />
              {discount > 0 && <span className="pdm-discount-badge">{discount}% OFF</span>}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="pdm-info-col">
            {/* Brand / Category */}
            <div className="pdm-meta-row">
              {brand && <span className="pdm-brand"><Tag size={11}/> {brand}</span>}
              {category && <span className="pdm-category">{category}</span>}
            </div>

            {/* Name */}
            <h2 className="pdm-name">{name}</h2>

            {/* Stars */}
            <div className="pdm-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < 4 ? '#f7931e' : 'none'} color={i < 4 ? '#f7931e' : '#d1d5db'} />
              ))}
              <span className="pdm-rating-text">4.4 (24 reviews)</span>
            </div>

            {/* Price */}
            <div className="pdm-price-block">
              <span className="pdm-sale">₹{price.toLocaleString()}</span>
              {mrp > price && (
                <>
                  <span className="pdm-mrp">MRP ₹{mrp.toLocaleString()}</span>
                  <span className="pdm-save-badge">Save ₹{(mrp - price).toLocaleString()}</span>
                </>
              )}
            </div>

            <div className="pdm-moq-pill">
              <span>{moqLabel}</span>
              <strong>{minimumOrderQty} pcs</strong>
            </div>

            {stock === 0 ? (
              <div className="pdm-stock-out">❌ Currently Out of Stock</div>
            ) : (
              <div className="pdm-stock-in">✅ In Stock</div>
            )}

            {/* Description */}
            <p className="pdm-desc">{description}</p>

            <hr className="pdm-divider" />

            {/* Qty Selector */}
            <div className="pdm-qty-row">
              <span className="pdm-qty-label">Quantity:</span>
              <div className="pdm-qty-ctrl">
                <button className="pdm-qty-btn" onClick={() => setQty(Math.max(minimumOrderQty, qty - 1))} disabled={qty <= minimumOrderQty}>
                  <ChevronLeft size={16} />
                </button>
                <span className="pdm-qty-num">{qty}</span>
                <button className="pdm-qty-btn" onClick={() => setQty(Math.min(stock || 99, qty + 1))}>
                  <ChevronRight size={16} />
                </button>
              </div>
              <span className="pdm-total">= ₹{(price * qty).toLocaleString()}</span>
            </div>

            {/* Actions */}
            <div className="pdm-actions">
              <button
                className="pdm-add-btn"
                onClick={handleAddToCart}
                disabled={stock === 0}
              >
                <ShoppingCart size={18} />
                {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="pdm-buy-btn" onClick={handleAddToCart} disabled={stock === 0}>
                Buy Now
              </button>
            </div>

            {/* Assurances */}
            <div className="pdm-assurances">
              <div className="pdm-assurance-item">
                <Truck size={16} /> <span>Free delivery above ₹499</span>
              </div>
              <div className="pdm-assurance-item">
                <Shield size={16} /> <span>100% Authentic Product</span>
              </div>
              <div className="pdm-assurance-item">
                <RotateCcw size={16} /> <span>Easy 7-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pdm-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 3000;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }

        .pdm-modal {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3001;
          background: white;
          border-radius: var(--radius-lg);
          width: min(900px, 95vw);
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.3);
          animation: scaleIn 0.25s ease;
        }

        .pdm-close {
          position: absolute; top: 14px; right: 14px;
          z-index: 1; background: var(--bg-main);
          border: 1px solid var(--border-light);
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-dark);
          transition: var(--transition-smooth);
        }

        .pdm-close:hover { background: #fee2e2; color: #ef4444; }

        .pdm-body {
          display: flex;
          max-height: 90vh;
          overflow-y: auto;
        }

        .pdm-img-col {
          width: 45%;
          flex-shrink: 0;
          background: #f8fafc;
          position: sticky;
          top: 0;
          height: min(550px, 90vh);
        }

        .pdm-img-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .pdm-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }

        .pdm-discount-badge {
          position: absolute; top: 14px; left: 14px;
          background: #ef4444; color: white;
          font-size: 12px; font-weight: 800;
          padding: 4px 12px; border-radius: 999px;
        }

        .pdm-info-col {
          flex: 1;
          padding: 32px 28px;
          overflow-y: auto;
        }

        .pdm-meta-row {
          display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
        }

        .pdm-brand {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; font-weight: 700;
          color: var(--secondary-color); text-transform: uppercase; letter-spacing: 0.5px;
        }

        .pdm-category {
          font-size: 11px; font-weight: 600; color: var(--text-light);
          background: var(--bg-main); padding: 3px 10px; border-radius: 999px;
        }

        .pdm-name {
          font-size: 22px; font-weight: 850; color: var(--text-dark);
          font-family: var(--font-headers); margin-bottom: 12px; line-height: 1.3;
        }

        .pdm-stars {
          display: flex; align-items: center; gap: 3px; margin-bottom: 20px;
        }

        .pdm-rating-text {
          font-size: 13px; color: var(--text-medium); margin-left: 8px;
        }

        .pdm-price-block {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap; margin-bottom: 10px;
        }

        .pdm-sale {
          font-size: 32px; font-weight: 900; color: var(--primary-color);
          font-family: var(--font-headers);
        }

        .pdm-mrp {
          font-size: 15px; color: var(--text-light); text-decoration: line-through;
        }

        .pdm-save-badge {
          background: #dcfce7; color: #16a34a;
          font-size: 12px; font-weight: 800; padding: 3px 10px; border-radius: 999px;
        }

        .pdm-moq-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 7px 10px;
          margin-bottom: 12px;
          font-size: 13px;
          color: var(--text-medium);
        }

        .pdm-moq-pill strong {
          color: var(--primary-color);
          font-weight: 850;
        }

        .pdm-stock-in {
          font-size: 13px; font-weight: 700; color: #16a34a; margin-bottom: 14px;
        }

        .pdm-stock-out {
          font-size: 13px; font-weight: 700; color: #ef4444; margin-bottom: 14px;
        }

        .pdm-desc {
          font-size: 14px; color: var(--text-medium); line-height: 1.7; margin-bottom: 20px;
        }

        .pdm-divider { border: none; border-top: 1px solid var(--border-light); margin-bottom: 20px; }

        .pdm-qty-row {
          display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
        }

        .pdm-qty-label { font-size: 14px; font-weight: 700; color: var(--text-dark); }

        .pdm-qty-ctrl {
          display: flex; align-items: center;
          border: 1.5px solid var(--border-light); border-radius: var(--radius-sm); overflow: hidden;
        }

        .pdm-qty-btn {
          width: 36px; height: 36px; background: var(--bg-main);
          border: none; cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: var(--text-dark);
          transition: var(--transition-smooth);
        }

        .pdm-qty-btn:hover:not(:disabled) { background: var(--border-light); }
        .pdm-qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .pdm-qty-num {
          min-width: 40px; text-align: center;
          font-size: 15px; font-weight: 800; color: var(--text-dark);
          border-left: 1px solid var(--border-light);
          border-right: 1px solid var(--border-light);
          padding: 0 8px; line-height: 36px;
        }

        .pdm-total { font-size: 15px; font-weight: 800; color: var(--primary-color); }

        .pdm-actions { display: flex; gap: 12px; margin-bottom: 24px; }

        .pdm-add-btn {
          flex: 1; background: var(--secondary-color); color: white;
          border: none; padding: 14px; border-radius: var(--radius-sm);
          font-size: 15px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: var(--transition-smooth);
        }

        .pdm-add-btn:hover:not(:disabled) { background: var(--secondary-hover); }
        .pdm-add-btn:disabled { background: var(--text-light); cursor: not-allowed; }

        .pdm-buy-btn {
          flex: 1; background: var(--primary-color); color: white;
          border: none; padding: 14px; border-radius: var(--radius-sm);
          font-size: 15px; font-weight: 800; cursor: pointer;
          transition: var(--transition-smooth);
        }

        .pdm-buy-btn:hover:not(:disabled) { background: var(--primary-hover); }
        .pdm-buy-btn:disabled { background: var(--text-light); cursor: not-allowed; }

        .pdm-assurances {
          display: flex; flex-direction: column; gap: 10px;
          background: var(--bg-main); border-radius: var(--radius-md); padding: 16px;
        }

        .pdm-assurance-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 600; color: var(--text-medium);
        }

        .pdm-assurance-item svg { color: var(--primary-color); flex-shrink: 0; }

        @media (max-width: 640px) {
          .pdm-body { flex-direction: column; }
          .pdm-img-col { width: 100%; height: 240px; position: relative; }
          .pdm-info-col { padding: 20px 16px; }
          .pdm-sale { font-size: 26px; }
        }
      `}</style>
    </>
  );
}
