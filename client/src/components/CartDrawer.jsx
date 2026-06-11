import { useEffect, useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==========================================================
// CART DRAWER COMPONENT
// Right side se slide hota hai.
// Props:
//   isOpen         → true/false
//   onClose        → drawer band karo
//   cartItems      → array of { id, name, price, image, quantity, brand }
//   onUpdateQuantity → (id, newQty) => update karo
//   onRemoveItem   → (id) => remove karo
//   onCheckout     → checkout success callback
//   backendUrl     → backend base URL
// ==========================================================

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  backendUrl,
}) {
  const navigate = useNavigate();
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [loadingDeliveryMethods, setLoadingDeliveryMethods] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.mrp || item.price) - item.price) * item.quantity, 0);
  const estimatedDeliveryMethod =
    deliveryMethods.find((method) => method.code === 'HOME_DELIVERY') ||
    deliveryMethods[0] ||
    {
      code: 'HOME_DELIVERY',
      name: 'Home Delivery',
      baseCharge: 49,
      useProductDeliveryCharge: true,
    };
  const productDeliveryCharge = estimatedDeliveryMethod.useProductDeliveryCharge === false
    ? 0
    : cartItems.reduce(
        (sum, item) => sum + Number(item.deliveryPrice || 0) * Number(item.quantity || 1),
        0
      );
  const deliveryBaseCharge = Number(estimatedDeliveryMethod.baseCharge || 0);
  const deliveryFee = subtotal === 0 ? 0 : deliveryBaseCharge + productDeliveryCharge;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!isOpen || !backendUrl) return;

    const fetchDeliveryMethods = async () => {
      setLoadingDeliveryMethods(true);
      try {
        const response = await fetch(`${backendUrl}/api/delivery/methods`);
        const data = await response.json();
        setDeliveryMethods(Array.isArray(data) ? data : []);
      } catch {
        setDeliveryMethods([]);
      } finally {
        setLoadingDeliveryMethods(false);
      }
    };

    fetchDeliveryMethods();
  }, [backendUrl, isOpen]);

  const getImgSrc = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=60';
    return image.startsWith('http') ? image : `${backendUrl}${image.startsWith('/') ? image : `/${image}`}`;
  };

  const handleCheckout = () => {
    navigate('/checkout');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="drawer-backdrop" onClick={onClose} />}

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'drawer-open' : ''}`} role="dialog" aria-label="Shopping Cart">

        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <ShoppingBag size={20} />
            <div>
              <h2 className="drawer-title">My Cart</h2>
              <p className="drawer-subtitle">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Delivery estimate */}
        {subtotal > 0 && (
          <div className={`drawer-delivery-bar ${deliveryFee === 0 ? 'free' : ''}`}>
            <span>
              {loadingDeliveryMethods ? (
                'Checking delivery charges...'
              ) : (
                <>
                  Estimated {estimatedDeliveryMethod.name}: <strong>{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString('en-IN')}`}</strong>
                </>
              )}
            </span>
            <p>Final method can be selected at checkout.</p>
          </div>
        )}

        {/* Cart Items */}
        <div className="drawer-items">
          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="drawer-empty">
              <div className="drawer-empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any products yet.</p>
              <button className="drawer-shop-btn" onClick={() => { navigate('/shop'); onClose(); }}>
                Browse Products <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                {/* Image */}
                <div className="cart-item-img-wrap">
                  <img
                    src={getImgSrc(item.image || item.img)}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=60'; }}
                  />
                </div>

                {/* Details */}
                <div className="cart-item-details">
                  {item.brand && <span className="cart-item-brand">{item.brand}</span>}
                  <h4 className="cart-item-name">{item.name}</h4>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">₹{item.price.toLocaleString()}</span>
                    {item.mrp > item.price && (
                      <span className="cart-item-mrp">₹{item.mrp?.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="cart-item-moq">
                    {item.moqLabel || 'MOQ'}: <strong>{Math.max(1, Number(item.moq || 1))} pcs</strong>
                  </div>

                  {/* Qty controls */}
                  <div className="cart-item-bottom">
                    <div className="cart-qty-ctrl">
                      <button
                        className="cart-qty-btn"
                        onClick={() => {
                          const minimumQty = Math.max(1, Number(item.moq || 1));
                          if (item.quantity <= minimumQty) onRemoveItem(item.id);
                          else onUpdateQuantity(item.id, item.quantity - 1);
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="cart-item-subtotal">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      className="cart-remove-btn"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            {/* Price Breakdown */}
            <div className="drawer-summary">
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="summary-row savings-row">
                  <span>You Save</span>
                  <span className="savings-value">- ₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery ({estimatedDeliveryMethod.name})</span>
                <span className={deliveryFee === 0 ? 'free-delivery' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString('en-IN')}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <div className="delivery-mini-breakdown">
                  <span>Base: {deliveryBaseCharge === 0 ? 'FREE' : `Rs. ${deliveryBaseCharge.toLocaleString('en-IN')}`}</span>
                  {estimatedDeliveryMethod.useProductDeliveryCharge !== false && (
                    <span>Product: {productDeliveryCharge === 0 ? 'FREE' : `Rs. ${productDeliveryCharge.toLocaleString('en-IN')}`}</span>
                  )}
                </div>
              )}
              <hr className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button className="drawer-checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight size={17} />
            </button>

           

<button
  className="drawer-order-summary-btn"
  onClick={() => {
    navigate('/order-summary');
    onClose();
  }}
>
  View Order Summary
</button>

            <button className="drawer-continue-btn" onClick={() => { navigate('/shop'); onClose(); }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      <style>{`

      .drawer-order-summary-btn {
  width: 100%;
  padding: 11px;
  margin-top: 10px;
  background: #f8fafc;
  border: 1.5px solid var(--border-light);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.drawer-order-summary-btn:hover {
  border-color: var(--secondary-color);
  color: var(--secondary-color);
  background: #fff7ed;
}
  
        .drawer-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 2000;
          backdrop-filter: blur(3px);
          animation: fadeIn 0.25s ease;
        }

        .cart-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(420px, 100vw);
          background: white;
          z-index: 2001;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 40px rgba(0,0,0,0.2);
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cart-drawer.drawer-open {
          transform: translateX(0);
        }

        /* Header */
        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px; border-bottom: 1px solid var(--border-light);
          background:linear-gradient(
    180deg,
    rgba(255,255,255,.95),
    rgba(250,247,242,.95)
  );

  border-bottom:1px solid rgba(11,61,46,.08);
        }

        .drawer-header-left {
          display: flex; align-items: center; gap: 12px;
          color: var(--text-dark);
        }

        .drawer-title {
           color:#0b3d2e;
  font-size:22px;
        font-weight: 800;
          font-family: var(--font-headers); margin: 0;
        }

        .drawer-subtitle { font-size: 12px; color: var(--text-light); margin: 0; }

        .drawer-close-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--bg-main); border: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-dark); transition: var(--transition-smooth);
        }

        .drawer-close-btn:hover { background: #fee2e2; color: #ef4444; }

        /* Delivery bar */
        .drawer-delivery-bar {
        border-left:4px solid #f5a623;
          background: #fff8ea; padding: 10px 20px;
          font-size: 13px; color: var(--text-medium); flex-shrink: 0;
        }

        .drawer-delivery-bar.free {  background:#eef8f3;
  border-left:4px solid #0b3d2e; color: #16a34a; }

        .drawer-delivery-bar p {
          margin: 4px 0 0;
          font-size: 12px;
          color: var(--text-light);
        }

        .delivery-progress {
          height: 4px; background: var(--border-light);
          border-radius: 999px; margin-top: 6px; overflow: hidden;
        }

        .delivery-progress-fill {
          height: 100%; background: var(--secondary-color);
          border-radius: 999px; transition: width 0.4s ease;
        }

        /* Items list */
        .drawer-items {
          flex: 1; overflow-y: auto; padding: 16px 20px;
          display: flex; flex-direction: column; gap: 16px;
        }

        /* Empty state */
        .drawer-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 40px 20px;
        }

        .drawer-empty-icon { font-size: 54px; margin-bottom: 16px; }

        .drawer-empty h3 {
          font-size: 18px; font-weight: 800; color: var(--text-dark); margin-bottom: 8px;
        }

        .drawer-empty p {
          font-size: 14px; color: var(--text-medium); margin-bottom: 24px;
        }

        .drawer-shop-btn {
          display: flex; align-items: center; gap: 8px;
          background: var(--primary-color); color: white; border: none;
          padding: 12px 28px; border-radius: var(--radius-sm);
          font-size: 14px; font-weight: 700; cursor: pointer;
          transition: var(--transition-smooth);
        }

        .drawer-shop-btn:hover { background: var(--primary-hover); }

        /* Cart Item */
        .cart-item {
          display: flex; gap: 14px;
          padding: 14px;  background:#fff;
  border:1px solid rgba(11,61,46,.08);

  box-shadow:
    0 8px 24px rgba(0,0,0,.04);

  border-radius:18px;
        }

        .cart-item-img-wrap {
          width: 80px; height: 80px; flex-shrink: 0;
          border-radius: var(--radius-sm); overflow: hidden; background: white;
          border: 1px solid var(--border-light);
        }

        .cart-item-img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .cart-item-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }

        .cart-item-brand {
          font-size: 10px; font-weight: 700; color: var(--secondary-color);
          text-transform: uppercase; letter-spacing: 0.4px;
        }

        .cart-item-name {
          font-size: 13px; font-weight: 700; color: var(--text-dark); line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .cart-item-price-row { display: flex; align-items: center; gap: 6px; }
        .cart-item-price { font-size: 15px; font-weight: 900; color: var(--primary-color); }
        .cart-item-mrp { font-size: 12px; color: var(--text-light); text-decoration: line-through; }

        .cart-item-moq {
          width: fit-content;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 3px 7px;
          font-size: 11px;
          color: var(--text-medium);
        }

        .cart-item-moq strong {
          color: var(--primary-color);
        }

        .cart-item-bottom { display: flex; align-items: center; gap: 10px; margin-top: 4px; }

        .cart-qty-ctrl {
          display: flex; align-items: center;
          border: 1.5px solid var(--border-light); border-radius: var(--radius-sm);
          overflow: hidden; background: white;
        }

        .cart-qty-btn {
          width: 28px; height: 28px; background: none; border: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: var(--text-dark); transition: var(--transition-smooth);
        }

        .cart-qty-btn:hover { background: var(--border-light); }

        .cart-qty-num {
          min-width: 28px; text-align: center;
          font-size: 13px; font-weight: 800; color: var(--text-dark);
          border-left: 1px solid var(--border-light);
          border-right: 1px solid var(--border-light);
          line-height: 28px;
        }

        .cart-item-subtotal { font-size: 13px; font-weight: 800; color: var(--text-dark); margin-left: auto; }

        .cart-remove-btn {
          background: none; border: none; cursor: pointer;
          color: var(--text-light); padding: 4px;
          border-radius: var(--radius-sm); transition: var(--transition-smooth);
        }

        .cart-remove-btn:hover { color: #ef4444; background: #fee2e2; }

        /* Footer */
        .drawer-footer {
          border-top: 1px solid var(--border-light);
          padding: 16px 20px; flex-shrink: 0; background: white;
        }

        .drawer-summary { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }

        .summary-row {
          display: flex; justify-content: space-between;
          font-size: 14px; color: var(--text-medium);
        }

        .savings-row { color: #16a34a; }
        .savings-value { font-weight: 800; }
        .free-delivery { color: #16a34a; font-weight: 800; }
        .delivery-mini-breakdown {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
          color: var(--text-light);
          font-size: 12px;
          font-weight: 700;
          margin-top: -4px;
        }
        .summary-divider { border: none; border-top: 1px solid var(--border-light); margin: 4px 0; }

        .total-row {
          font-size: 16px; font-weight: 900; color: var(--text-dark);
        }

        .drawer-checkout-btn {
          width: 100%; padding: 14px; background: var(--secondary-color);
          color: white; border: none; border-radius: var(--radius-sm);
          font-size: 16px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: var(--transition-smooth); margin-bottom: 10px;
          box-shadow: 0 4px 14px rgba(247,147,30,0.35);
        }

        .drawer-checkout-btn:hover {
          background: var(--secondary-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(247,147,30,0.45);
        }

        .drawer-continue-btn {
          width: 100%; padding: 11px;
          background: none; border: 1.5px solid var(--border-light);
          border-radius: var(--radius-sm); font-size: 14px; font-weight: 700;
          color: var(--text-medium); cursor: pointer; transition: var(--transition-smooth);
        }

        .drawer-continue-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
      `}</style>
    </>
  );
}
