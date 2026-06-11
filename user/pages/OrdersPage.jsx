import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ClipboardList, FileText, MapPin, PackageCheck, Route, Truck } from 'lucide-react';

const trackingSteps = [
  { key: 'PLACED', label: 'Order Placed', icon: ClipboardList },
  { key: 'CONFIRMED', label: 'Confirmed', icon: PackageCheck },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Route },
  { key: 'DELIVERED', label: 'Delivered', icon: MapPin },
];

const statusRank = {
  PLACED: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
};

const terminalStatuses = new Set(['CANCELLED', 'RETURNED', 'FAILED']);

const getTrackingStatus = (order) => {
  const shipmentStatus = order.shipment?.status;
  if (shipmentStatus === 'CREATED') return 'CONFIRMED';
  if (shipmentStatus && statusRank[shipmentStatus] !== undefined) return shipmentStatus;
  return order.orderStatus || 'PLACED';
};

const getDelhiveryTrackingUrl = (awb) => (
  awb ? `https://www.delhivery.com/track-v2/package/${encodeURIComponent(awb)}` : ''
);

export default function OrdersPage({ orders, formatDate, formatPrice }) {
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  return (
    <section className="dashboard-card">
      <div className="card-title">
        <ClipboardList size={20} />
        <h2>Your Orders</h2>
      </div>
      {orders.length === 0 ? (
        <div className="empty-box">No orders found yet.</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isTrackingOpen = trackingOrderId === order._id;
            const currentStatus = getTrackingStatus(order);
            const currentRank = statusRank[currentStatus] ?? 0;
            const isTerminal = terminalStatuses.has(order.orderStatus) || terminalStatuses.has(order.shipment?.status);

            return (
              <article className={`order-track-card ${isTrackingOpen ? 'active' : ''}`} key={order._id}>
                <div className="order-row order-row-with-actions">
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
                  <div className="order-action-group">
                    <Link to={`/invoice/${order._id}`} state={{ order }} className="secondary-action order-invoice-link">
                      <FileText size={15} />
                      Invoice
                    </Link>
                    {order.shipment?.awb ? (
                      <a
                        href={getDelhiveryTrackingUrl(order.shipment.awb)}
                        target="_blank"
                        rel="noreferrer"
                        className="primary-action delhivery-track-link"
                      >
                        <Truck size={15} />
                        Track on Delhivery
                      </a>
                    ) : (
                      <button type="button" className="secondary-action tracking-disabled-btn" disabled>
                        <Truck size={15} />
                        Tracking pending
                      </button>
                    )}
                    <button
                      type="button"
                      className="primary-action track-order-btn"
                      onClick={() => setTrackingOrderId(isTrackingOpen ? null : order._id)}
                    >
                      <Truck size={15} />
                      {isTrackingOpen ? 'Hide Track' : 'Track Order'}
                    </button>
                  </div>
                </div>

                {isTrackingOpen && (
                  <div className="tracking-panel">
                    <div className="tracking-summary">
                      <div>
                        <span>Current Status</span>
                        <strong>{isTerminal ? order.orderStatus : currentStatus}</strong>
                      </div>
                      <div>
                        <span>Shipment</span>
                        <strong>{order.shipment?.status || 'PENDING'}</strong>
                      </div>
                      <div>
                        <span>AWB / Tracking No.</span>
                        <strong>{order.shipment?.awb || 'Not generated yet'}</strong>
                      </div>
                    </div>

                    {order.shipment?.awb && (
                      <a
                        href={getDelhiveryTrackingUrl(order.shipment.awb)}
                        target="_blank"
                        rel="noreferrer"
                        className="delhivery-panel-link"
                      >
                        <Truck size={16} />
                        Open real-time Delhivery tracking
                      </a>
                    )}

                    {isTerminal ? (
                      <div className="tracking-terminal">
                        This order is marked as {order.orderStatus || order.shipment?.status}.
                      </div>
                    ) : (
                      <div className="tracking-timeline">
                        {trackingSteps.map((step, index) => {
                          const Icon = step.icon;
                          const isDone = index <= currentRank;
                          const isCurrent = index === currentRank;

                          return (
                            <div className={`tracking-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`} key={step.key}>
                              <div className="tracking-step-icon">
                                <Icon size={16} />
                              </div>
                              <div>
                                <strong>{step.label}</strong>
                                <span>{isCurrent ? 'Current step' : isDone ? 'Completed' : 'Pending'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
