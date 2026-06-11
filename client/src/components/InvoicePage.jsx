import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Download, ShoppingBag } from "lucide-react";

export default function InvoicePage({ backendUrl }) {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (order) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load invoice");
        }

        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [backendUrl, order, orderId]);

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      navigate("/shop");
    }, 10000);

    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [navigate]);

  const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
  const paymentLabel = order?.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment";
  const paymentStatus = order?.paymentStatus === "PAID" ? "Paid" : "Pending";

  return (
    <div className="invoice-page">
      <div className="invoice-shell">
        {loading ? (
          <div className="invoice-state">Loading invoice...</div>
        ) : error ? (
          <div className="invoice-state error">{error}</div>
        ) : (
          <>
            <div className="invoice-success">
              <CheckCircle size={42} />
              <div>
                <h1>Order Placed Successfully</h1>
                <p>Redirecting to shop in {secondsLeft} seconds</p>
              </div>
            </div>

            <div className="invoice-card">
              <div className="invoice-header">
                <div>
                  <span className="invoice-kicker">Invoice</span>
                  <h2>Dr. Snoopy Pet Store</h2>
                </div>
                <div className="invoice-meta">
                  <strong>{order.orderNumber}</strong>
                  <span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              </div>

              <div className="invoice-info-grid">
                <section>
                  <h3>Customer</h3>
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  {order.customerEmail && <p>{order.customerEmail}</p>}
                </section>

                <section>
                  <h3>Delivery Address</h3>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.region} - {order.shippingAddress.zip}</p>
                  <p>{order.shippingAddress.country || "India"}</p>
                </section>

                <section>
                  <h3>Payment</h3>
                  <p>{paymentLabel}</p>
                  <p>{paymentStatus}</p>
                  {order.razorpay?.paymentId && <p>{order.razorpay.paymentId}</p>}
                </section>

                <section>
                  <h3>Shipment</h3>
                  <p>{order.shipment?.status || "Pending"}</p>
                  {order.shipment?.awb && <p>AWB: {order.shipment.awb}</p>}
                </section>
              </div>

              <div className="invoice-items">
                <div className="invoice-items-head">
                  <span>Product</span>
                  <span>Qty</span>
                  <span>Amount</span>
                </div>

                {order.items.map((item) => (
                  <div className="invoice-item" key={item.product || item.name}>
                    <div>
                      <strong>{item.name}</strong>
                      {item.sku && <small>SKU: {item.sku}</small>}
                      {item.moq && <small>{item.moqLabel || "MOQ"}: {item.moq} pcs</small>}
                    </div>
                    <span>{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="invoice-totals">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatPrice(order.subtotal)}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>{order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}</strong>
                </div>
                <div className="grand-total">
                  <span>Total</span>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
              </div>
            </div>

            <a
              className="invoice-download-btn"
              href={`${backendUrl}/api/orders/${order._id}/invoice.pdf`}
              download={`invoice-${order.orderNumber}.pdf`}
            >
              <Download size={18} />
              Download Invoice PDF
            </a>

            <button className="invoice-shop-btn" onClick={() => navigate("/shop")}>
              <ShoppingBag size={18} />
              Continue Shopping
            </button>
          </>
        )}
      </div>

      <style>{`
        .invoice-page {
          min-height: 100vh;
          background: var(--bg-main);
          color: var(--text-dark);
          padding: 42px 16px;
        }

        .invoice-shell {
          width: min(960px, 100%);
          margin: 0 auto;
        }

        .invoice-success {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 20px;
        }

        .invoice-success h1 {
          font-family: var(--font-headers);
          font-size: 30px;
          margin: 0;
          color: #166534;
        }

        .invoice-success p {
          margin-top: 4px;
          font-weight: 700;
        }

        .invoice-card {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 18px;
          box-shadow: var(--shadow-sm);
          padding: 30px;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border-light);
        }

        .invoice-kicker {
          color: var(--secondary-color);
          font-weight: 900;
          text-transform: uppercase;
          font-size: 12px;
        }

        .invoice-header h2 {
          font-family: var(--font-headers);
          font-size: 32px;
          margin-top: 5px;
        }

        .invoice-meta {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .invoice-meta span {
          color: var(--text-medium);
        }

        .invoice-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          padding: 24px 0;
        }

        .invoice-info-grid section {
          border: 1px solid var(--border-light);
          border-radius: 14px;
          padding: 16px;
        }

        .invoice-info-grid h3 {
          font-size: 14px;
          margin-bottom: 10px;
          color: var(--secondary-color);
        }

        .invoice-info-grid p {
          color: var(--text-medium);
          line-height: 1.55;
        }

        .invoice-items {
          border: 1px solid var(--border-light);
          border-radius: 14px;
          overflow: hidden;
        }

        .invoice-items-head,
        .invoice-item {
          display: grid;
          grid-template-columns: 1fr 80px 130px;
          gap: 14px;
          align-items: center;
          padding: 14px 16px;
        }

        .invoice-items-head {
          background: var(--bg-main);
          font-weight: 900;
          color: var(--text-dark);
        }

        .invoice-item + .invoice-item {
          border-top: 1px solid var(--border-light);
        }

        .invoice-item small {
          display: block;
          margin-top: 4px;
          color: var(--text-light);
        }

        .invoice-totals {
          width: min(360px, 100%);
          margin: 24px 0 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .invoice-totals div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          color: var(--text-medium);
        }

        .invoice-totals .grand-total {
          border-top: 1px solid var(--border-light);
          padding-top: 14px;
          font-size: 24px;
          color: var(--text-dark);
        }

        .invoice-shop-btn {
          width: 100%;
          margin-top: 22px;
          border: none;
          background: var(--secondary-color);
          color: white;
          border-radius: 16px;
          padding: 18px;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: var(--transition-smooth);
        }

        .invoice-download-btn {
          width: 100%;
          margin-top: 22px;
          border: none;
          background: var(--primary-color);
          color: white;
          border-radius: 16px;
          padding: 18px;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .invoice-download-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        .invoice-shop-btn:hover {
          background: var(--secondary-hover);
          transform: translateY(-2px);
        }

        .invoice-state {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          font-weight: 800;
        }

        .invoice-state.error {
          color: #dc2626;
        }

        @media (max-width: 680px) {
          .invoice-card {
            padding: 20px;
          }

          .invoice-header,
          .invoice-success {
            align-items: flex-start;
            flex-direction: column;
          }

          .invoice-meta {
            text-align: left;
          }

          .invoice-info-grid {
            grid-template-columns: 1fr;
          }

          .invoice-items-head,
          .invoice-item {
            grid-template-columns: 1fr 44px 96px;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
