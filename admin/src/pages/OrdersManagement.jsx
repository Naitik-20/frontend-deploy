import { useEffect } from 'react';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Package,
  Upload,
  ShoppingBag,
  TrendingUp,
  Users,
  ChevronRight,
  Search,
  Eye,
  Star,
  ShoppingCart,
  Loader,
  CheckCircle,
  AlertCircle,
  Grid,
  Pencil,
  FolderTree,
  ClipboardList,
  Download,
  Truck,
  Store,
  Stethoscope,
  Scissors
} from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

export default function OrdersManagement() {
  const {
    activeTab,
    setActiveTab,
    products,
    loadingProducts,
    searchTerm,
    setSearchTerm,
    categories,
    loadingCategories,
    categoryForm,
    editingCategory,
    orders,
    loadingOrders,
    orderSearchTerm,
    setOrderSearchTerm,
    orderTypeView,
    setOrderTypeView,
    selectedOrder,
    setSelectedOrder,
    deliveryMethods,
    pickupStores,
    loadingDelivery,
    editingDeliveryMethod,
    editingPickupStore,
    services,
    loadingServices,
    editingService,
    serviceForm,
    consultations,
    loadingConsultations,
    editingConsultation,
    consultationForm,
    deliveryMethodForm,
    pickupStoreForm,
    form,
    thumbnailFile,
    galleryFiles,
    setGalleryFiles,
    imagePreview,
    uploading,
    actionStatus,
    editingProduct,
    fileInputRef,
    dragRef,
    fetchAllProducts,
    fetchCategories,
    fetchOrders,
    fetchDeliverySettings,
    fetchServices,
    fetchConsultations,
    handleChange,
    handleCategoryChange,
    handleResetCategory,
    handleSubmitCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleDeliveryMethodChange,
    handlePickupStoreChange,
    resetDeliveryMethodForm,
    resetPickupStoreForm,
    handleSubmitDeliveryMethod,
    handleEditDeliveryMethod,
    handleDeleteDeliveryMethod,
    handleSubmitPickupStore,
    handleEditPickupStore,
    handleDeletePickupStore,
    handleServiceChange,
    resetServiceForm,
    handleSubmitService,
    handleEditService,
    handleDeleteService,
    handleConsultationChange,
    resetConsultationForm,
    handleSubmitConsultation,
    handleEditConsultation,
    handleDeleteConsultation,
    handleUpdateOrder,
    handleDeleteOrder,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleReset,
    handleSubmit,
    handleEditProduct,
    handleDeleteProduct,
    totalProducts,
    totalOrders,
    totalDeliveryMethods,
    totalServices,
    totalConsultations,
    totalOrderRevenue,
    averageOrderValue,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    lowStockProducts,
    inventoryValue,
    categoryOptions,
    filteredProducts,
    filteredOrders,
    renderProductPreview,
    DEFAULT_CATEGORIES,
    DELIVERY_METHOD_OPTIONS,
    ORDER_TO_SHIPMENT_STATUS,
    SHIPMENT_TO_ORDER_STATUS,
    BACKEND_URL
  } = useAdminDashboard();

  useEffect(() => {
    setActiveTab('orders');
  }, [setActiveTab]);

  return (
        <div className="tab-pane animate-fade">
          <div className="workspace-card">
            <div className="card-actions-header">
              <div className="search-filter-wrapper">
                <Search className="search-box-icon" size={18} />
                <input
                  type="text"
                  placeholder="Search orders by order no, customer, phone or status..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className="inventory-search-input"
                />
              </div>
              <div className="order-type-toggle">
                <button
                  className={orderTypeView === 'All' ? 'active' : ''}
                  onClick={() => setOrderTypeView('All')}
                >
                  All Orders {orderTypeView === 'All' ? `(${totalOrders})` : ''}
                </button>
                <button
                  className={orderTypeView === 'NORMAL' ? 'active' : ''}
                  onClick={() => setOrderTypeView('NORMAL')}
                >
                  Normal Orders {orderTypeView === 'NORMAL' ? `(${totalOrders})` : ''}
                </button>
                <button
                  className={orderTypeView === 'WHOLESALER' ? 'active' : ''}
                  onClick={() => setOrderTypeView('WHOLESALER')}
                >
                  Wholesaler Orders {orderTypeView === 'WHOLESALER' ? `(${totalOrders})` : ''}
                </button>
              </div>
              <button className="add-product-accent-btn" onClick={fetchOrders}>
                <ClipboardList size={16} />
                <span>Refresh Orders</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="tab-loader">
                <Loader className="spin" size={36} color="#0a58a4" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="empty-table-state">
                <h4>No orders found</h4>
                <p>New customer orders will appear here automatically.</p>
              </div>
            ) : (
              <div className="products-table-wrapper">
                <table className="products-table orders-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Type</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Order Status</th>
                      <th>Shipment</th>
                      <th className="align-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const customerName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim();
                      const itemCount = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

                      return (
                        <tr key={order._id}>
                          <td>
                            <div className="prod-cell-name">{order.orderNumber}</div>
                            <span className="prod-cell-id">{new Date(order.createdAt).toLocaleString()}</span>
                          </td>
                          <td><span className="category-pill">{order.orderType || 'NORMAL'}</span></td>
                          <td>
                            <strong>{customerName || 'Guest Customer'}</strong>
                            <div className="prod-cell-id">{order.shippingAddress?.phone || order.customerEmail || '—'}</div>
                            <div className="prod-cell-id">{order.shippingAddress?.city || ''} {order.shippingAddress?.zip || ''}</div>
                          </td>
                          <td>
                            <span className="category-pill">{itemCount} item(s)</span>
                            <div className="prod-cell-id">{order.items?.[0]?.name || '—'}</div>
                          </td>
                          <td><strong className="cell-price">₹{Number(order.total || 0).toFixed(2)}</strong></td>
                          <td>
                            <div className="order-control-stack">
                              <span className="category-pill">{order.paymentMethod}</span>
                              <select
                                className="table-select"
                                value={order.paymentStatus}
                                onChange={(e) => handleUpdateOrder(order._id, { paymentStatus: e.target.value })}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="PAID">PAID</option>
                                <option value="FAILED">FAILED</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <select
                              className="table-select"
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrder(order._id, {
                                orderStatus: e.target.value,
                                shipmentStatus: ORDER_TO_SHIPMENT_STATUS[e.target.value],
                              })}
                            >
                              <option value="PLACED">PLACED</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                              <option value="RETURNED">RETURNED</option>
                              <option value="FAILED">FAILED</option>
                            </select>
                          </td>
                          <td>
                            <div className="order-control-stack">
                              <select
                                className="table-select"
                                value={order.shipment?.status || 'PENDING'}
                                onChange={(e) => handleUpdateOrder(order._id, {
                                  shipmentStatus: e.target.value,
                                  orderStatus: SHIPMENT_TO_ORDER_STATUS[e.target.value],
                                })}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CREATED">CREATED</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="FAILED">FAILED</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="RETURNED">RETURNED</option>
                              </select>
                            </div>
                          </td>
                          <td className="align-center">
                            <button
                              className="action-edit-btn"
                              onClick={() => setSelectedOrder(order)}
                              title="View Order Details"
                            >
                              <Eye size={16} />
                            </button>
                            <a
                              className="action-edit-btn"
                              href={`${BACKEND_URL}/api/orders/${order._id}/invoice.pdf`}
                              target="_blank"
                              rel="noreferrer"
                              title="Download Invoice"
                            >
                              <Download size={16} />
                            </a>
                            <button
                              className="action-delete-btn"
                              onClick={() => handleDeleteOrder(order)}
                              title="Delete Order"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
  );
}
