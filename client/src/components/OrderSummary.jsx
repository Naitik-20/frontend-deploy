import React from "react";
import { ArrowLeft, ShieldCheck, Sparkles, Truck, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderSummary({ cartItems = [] }) {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = cartItems.reduce(
    (sum, item) => sum + ((item.mrp || item.price) - item.price) * item.quantity,
    0
  );
  const deliveryCharge = 49;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryCharge + tax;

  return (
    <div className="order-summary-page">
      <div className="order-summary-hero">
        <div className="hero-copy">
          <button className="back-link" onClick={() => navigate("/shop")}>
            <ArrowLeft size={16} />
            Back to Shop
          </button>
          <span className="eyebrow">
            <Sparkles size={14} />
            Review your cart
          </span>
          <h1>Order Summary</h1>
          <p>
            A clean, quick review of your items, savings, and delivery before checkout.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span>Items</span>
            <strong>{cartItems.length}</strong>
          </div>
          <div className="stat-card">
            <span>Savings</span>
            <strong>₹{savings.toLocaleString()}</strong>
          </div>
          <div className="stat-card">
            <span>Delivery</span>
            <strong>₹{deliveryCharge}</strong>
          </div>
        </div>
      </div>

      <div className="order-summary-layout">
        <section className="order-items-section">
          <div className="section-heading">
            <h2>Items in your Order</h2>
            <p>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} ready for checkout</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h3>Your order is empty</h3>
              <p>Add a few products from the shop to build your order summary.</p>
              <button className="primary-btn" onClick={() => navigate("/shop")}>
                Browse Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <article key={item.id} className="product-card">
                <div className="product-image-wrap">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80";
                    }}
                  />
                </div>

                <div className="product-content">
                  <div className="product-top">
                    <div>
                      <h3>{item.name}</h3>
                      {item.brand && <span className="brand-badge">{item.brand}</span>}
                    </div>
                    <span className="qty-pill">Qty {item.quantity}</span>
                  </div>

                  <p className="delivery-text">
                    <Truck size={14} /> Expected delivery: 3-5 business days
                  </p>

                  <div className="price-section">
                    <span className="current-price">₹{item.price.toLocaleString()}</span>
                    {item.mrp > item.price && (
                      <>
                        <span className="old-price">₹{item.mrp.toLocaleString()}</span>
                        <span className="discount-tag">
                          Save ₹{(item.mrp - item.price).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="item-meta-row">
                    <div className="meta-chip">
                      <ShieldCheck size={14} />
                      {item.moqLabel || "MOQ"} {Math.max(1, Number(item.moq || 1))} pcs
                    </div>
                    <div className="meta-chip soft">
                      <BadgeCheck size={14} />
                      Trusted product
                    </div>
                  </div>

                  <div className="item-total">
                    Item total: ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="summary-sidebar">
          <div className="sidebar-top">
            <span className="sidebar-label">Secure checkout</span>
            <h3>Order Summary</h3>
          </div>

          <div className="bill-row">
            <span>Items Total</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="bill-row">
            <span>Delivery</span>
            <span>₹{deliveryCharge}</span>
          </div>

          <div className="bill-row">
            <span>GST</span>
            <span>₹{tax}</span>
          </div>

          <div className="bill-row savings-row">
            <span>You Save</span>
            <span>-₹{savings.toLocaleString()}</span>
          </div>

          <hr />

          <div className="grand-total-row">
            <span>Grand Total</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>

          <div className="secure-checkout">
            <ShieldCheck size={16} />
            Secure payment and trusted delivery
          </div>

          <button className="place-order-btn" onClick={() => navigate("/checkout")}>
            Proceed To Checkout
          </button>
        </aside>
      </div>

      <style>{`
        .order-summary-page {
          padding: 28px 0 48px;
          background:
            radial-gradient(circle at top left, rgba(249, 115, 22, 0.12), transparent 28%),
            radial-gradient(circle at top right, rgba(14, 165, 233, 0.10), transparent 22%),
            linear-gradient(180deg, #fffdf9 0%, #f7f8fc 100%);
          min-height: 100vh;
        }

        .order-summary-hero {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 18px;
          align-items: stretch;
          margin-bottom: 24px;
        }

        .hero-copy,
        .hero-stats,
        .summary-sidebar,
        .product-card,
        .empty-state {
          border-radius: 22px;
          border: 1px solid rgba(11, 61, 46, 0.08);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.07);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
        }

        .hero-copy {
          padding: 26px;
          position: relative;
          overflow: hidden;
        }

        .hero-copy::after {
          content: "";
          position: absolute;
          right: -60px;
          top: -60px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(249, 115, 22, 0.20), transparent 70%);
          pointer-events: none;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: #fff7ed;
          color: #c2410c;
          padding: 9px 14px;
          border-radius: 999px;
          font-weight: 800;
          cursor: pointer;
          margin-bottom: 14px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f97316;
          font-weight: 800;
        }

        .hero-copy h1 {
          margin: 10px 0 10px;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
          color: #0b3d2e;
          font-family: var(--font-headers);
        }

        .hero-copy p {
          max-width: 60ch;
          color: #475569;
          font-size: 15px;
          line-height: 1.7;
          margin: 0;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding: 18px;
        }

        .stat-card {
          background: linear-gradient(180deg, #ffffff, #f8fafc);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 18px;
          padding: 16px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-card span {
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .stat-card strong {
          color: #0b3d2e;
          font-size: 18px;
        }

        .order-summary-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 22px;
          align-items: start;
        }

        .section-heading {
          margin-bottom: 16px;
        }

        .section-heading h2 {
          margin: 0 0 6px;
          color: #0b3d2e;
          font-size: 24px;
          font-family: var(--font-headers);
        }

        .section-heading p {
          margin: 0;
          color: #64748b;
        }

        .empty-state {
          padding: 44px 24px;
          text-align: center;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 12px;
        }

        .empty-state h3 {
          margin: 0 0 8px;
          color: #0f172a;
        }

        .empty-state p {
          margin: 0 0 18px;
          color: #64748b;
        }

        .primary-btn,
        .place-order-btn {
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .primary-btn {
          background: #f97316;
          color: white;
          padding: 13px 18px;
          border-radius: 14px;
          font-weight: 800;
        }

        .product-card {
          display: flex;
          gap: 18px;
          padding: 18px;
          margin-bottom: 16px;
        }

        .product-image-wrap {
          width: 150px;
          height: 150px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 18px;
          background: #f8fafc;
        }

        .product-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .product-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .product-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
        }

        .product-top h3 {
          margin: 0 0 8px;
          color: #0f172a;
          font-size: 20px;
        }

        .brand-badge,
        .qty-pill,
        .meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .brand-badge {
          background: #fff7ed;
          color: #c2410c;
          padding: 6px 12px;
        }

        .qty-pill {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 7px 12px;
          white-space: nowrap;
        }

        .delivery-text {
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #475569;
          font-size: 14px;
        }

        .price-section {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .current-price {
          font-size: 26px;
          font-weight: 900;
          color: #0b3d2e;
        }

        .old-price {
          text-decoration: line-through;
          color: #94a3b8;
          font-weight: 700;
        }

        .discount-tag {
          background: #dcfce7;
          color: #16a34a;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .item-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .meta-chip {
          padding: 8px 12px;
          background: #f8fafc;
          color: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .meta-chip.soft {
          background: #fff7ed;
          color: #9a3412;
        }

        .item-total {
          margin-top: 2px;
          color: #0b3d2e;
          font-size: 16px;
          font-weight: 900;
        }

        .summary-sidebar {
          position: sticky;
          top: 20px;
          padding: 22px;
        }

        .sidebar-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #f97316;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .sidebar-top h3 {
          margin: 8px 0 18px;
          color: #0b3d2e;
          font-size: 24px;
          font-family: var(--font-headers);
        }

        .bill-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: #334155;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .savings-row {
          color: #16a34a;
        }

        .summary-sidebar hr {
          border: none;
          border-top: 1px solid rgba(148, 163, 184, 0.18);
          margin: 14px 0;
        }

        .grand-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          font-weight: 900;
          color: #0b3d2e;
          margin-bottom: 16px;
        }

        .secure-checkout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #f8fafc;
          border-radius: 16px;
          padding: 12px 14px;
          color: #475569;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .place-order-btn {
          width: 100%;
          padding: 15px 16px;
          border-radius: 16px;
          background: linear-gradient(135deg, #f97316, #fb7185);
          color: white;
          font-weight: 900;
          box-shadow: 0 12px 24px rgba(249, 115, 22, 0.28);
        }

        .place-order-btn:hover,
        .primary-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .order-summary-hero,
          .order-summary-layout {
            grid-template-columns: 1fr;
          }

          .summary-sidebar {
            position: static;
          }

          .product-card {
            flex-direction: column;
          }

          .product-image-wrap {
            width: 100%;
            height: 240px;
          }
        }

        @media (max-width: 640px) {
          .order-summary-page {
            padding: 16px 0 28px;
          }

          .hero-copy,
          .hero-stats,
          .summary-sidebar {
            padding: 18px;
          }

          .current-price {
            font-size: 22px;
          }

          .product-top {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}