import { useAdminDashboard } from '../../hooks/useAdminDashboard';
export default function OrderDetailsModal() {
  const { selectedOrder, setSelectedOrder } = useAdminDashboard();
  if (!selectedOrder) return null;
  return <div className="order-detail-overlay" onClick={() => setSelectedOrder(null)}><div className="order-detail-modal" onClick={(e) => e.stopPropagation()}><div className="order-detail-header"><div><h3>{selectedOrder.orderNumber}</h3><p>{new Date(selectedOrder.createdAt).toLocaleString()}</p></div><button className="dashboard-clear-btn" onClick={() => setSelectedOrder(null)}>Close</button></div><div className="order-detail-grid"><div><h4>Customer</h4><p>{selectedOrder.customer?.name || selectedOrder.shippingAddress?.fullName}</p><p>{selectedOrder.customer?.phone || selectedOrder.shippingAddress?.phone}</p></div><div><h4>Total</h4><p>Rs. {Number(selectedOrder.total || 0).toFixed(2)}</p><p>{selectedOrder.paymentStatus}</p></div></div><h4>Items</h4>{(selectedOrder.items || []).map((item, i) => <div className="order-item-row" key={i}><span>{item.name || item.productName}</span><strong>x {item.quantity}</strong></div>)}</div></div>;
}
