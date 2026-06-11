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

export default function DashboardOverview() {
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
    normalOrders,
    wholesalerOrders,
    productDeliveryTotal,
    averageOrderValue,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    lowStockProducts,
    inventoryValue,
    activeDeliveryMethods,
    recentOrders,
    paidOrders,
    paymentRate,
    deliveryReadinessRate,
    activeCategories,
    emptyStockList,
    lowStockList,
    availableStockList,
    emptyStockProducts,
    availableStockProducts,
    orderStatusChartData,
    categoryChartData,
    maxOrderStatusCount,
    maxCategoryCount,
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
    setActiveTab('overview');
  }, [setActiveTab]);

  return (
        <div className="tab-pane animate-fade">
          <div className="overview-hero">
            <div>
              <span className="overview-kicker">Store Command Center</span>
              <h2>Business overview</h2>
              <p>Products, orders, delivery, categories, and operational health in one place.</p>
            </div>
            <div className="overview-hero-actions">
              <button className="dashboard-clear-btn" onClick={fetchOrders}>
                <ClipboardList size={16} />
                Refresh Orders
              </button>
              <button className="dashboard-submit-btn" onClick={() => setActiveTab('add')}>
                <Plus size={16} />
                Add Product
              </button>
            </div>
          </div>

          <div className="dashboard-stats-grid overview-kpi-grid">
            <div className="stat-card pro-stat-card">
              <div className="stat-icon-wrapper blue"><ShoppingBag size={22} /></div>
              <div className="stat-details">
                <span className="stat-label">Products</span>
                <h3 className="stat-val">{totalProducts}</h3>
                <p>{lowStockProducts} low stock</p>
              </div>
            </div>
            <div className="stat-card pro-stat-card">
              <div className="stat-icon-wrapper orange"><ClipboardList size={22} /></div>
              <div className="stat-details">
                <span className="stat-label">Orders</span>
                <h3 className="stat-val">{totalOrders}</h3>
                <p>{pendingOrders} pending action</p>
              </div>
            </div>
            <div className="stat-card pro-stat-card">
              <div className="stat-icon-wrapper green"><TrendingUp size={22} /></div>
              <div className="stat-details">
                <span className="stat-label">Revenue</span>
                <h3 className="stat-val">Rs. {totalOrderRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
                <p>Avg order Rs. {averageOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <div className="stat-card pro-stat-card">
              <div className="stat-icon-wrapper purple"><Truck size={22} /></div>
              <div className="stat-details">
                <span className="stat-label">Delivery Setup</span>
                <h3 className="stat-val">{activeDeliveryMethods}/{deliveryMethods.length}</h3>
                <p>{pickupStores.length} pickup stores</p>
              </div>
            </div>
          </div>

          <div className="overview-dashboard-grid">
            <div className="workspace-card overview-panel">
              <div className="card-header-row">
                <h3 className="card-heading-title">Order Flow</h3>
                <span className="category-pill">{paymentRate}% paid</span>
              </div>
              <div className="bar-chart-list">
                {orderStatusChartData.map(([label, value]) => (
                  <div className="bar-chart-row" key={label}>
                    <div className="bar-chart-label">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.max(6, (value / maxOrderStatusCount) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="workspace-card overview-panel">
              <div className="card-header-row">
                <h3 className="card-heading-title">Category Mix</h3>
                <button className="view-all-shortcut-btn" onClick={() => setActiveTab('categories')}>Manage &gt;</button>
              </div>
              <div className="bar-chart-list">
                {categoryChartData.length === 0 ? (
                  <div className="empty-mini-state">No product category data.</div>
                ) : categoryChartData.map(([label, value]) => (
                  <div className="bar-chart-row category" key={label}>
                    <div className="bar-chart-label">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill category-fill" style={{ width: `${Math.max(8, (value / maxCategoryCount) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="workspace-card overview-panel">
              <div className="card-header-row">
                <h3 className="card-heading-title">Operations</h3>
                <span className="category-pill">{deliveryReadinessRate}% ready</span>
              </div>
              <div className="ops-card-grid">
                <button className="ops-card" onClick={() => setActiveTab('orders')}>
                  <ClipboardList size={18} />
                  <span>Pending Orders</span>
                  <strong>{pendingOrders}</strong>
                </button>
                <button className="ops-card" onClick={() => setActiveTab('manage')}>
                  <Package size={18} />
                  <span>Low Stock</span>
                  <strong>{lowStockProducts}</strong>
                </button>
                <button className="ops-card" onClick={() => setActiveTab('delivery')}>
                  <Truck size={18} />
                  <span>Delivery Charge Sum</span>
                  <strong>Rs. {productDeliveryTotal.toLocaleString('en-IN')}</strong>
                </button>
                <button className="ops-card" onClick={() => setActiveTab('categories')}>
                  <FolderTree size={18} />
                  <span>Active Categories</span>
                  <strong>{activeCategories}</strong>
                </button>
              </div>
            </div>

            <div className="workspace-card overview-panel">
              <div className="card-header-row">
                <h3 className="card-heading-title">Order Types</h3>
                <button className="view-all-shortcut-btn" onClick={() => setActiveTab('orders')}>Open Orders &gt;</button>
              </div>
              <div className="donut-card">
                <div className="donut-ring" style={{ '--paid': `${paymentRate}%` }} />
                <div className="donut-legend">
                  <p><span className="legend-dot normal" /> Normal orders <strong>{normalOrders}</strong></p>
                  <p><span className="legend-dot wholesale" /> Wholesaler orders <strong>{wholesalerOrders}</strong></p>
                  <p><span className="legend-dot paid" /> Paid orders <strong>{paidOrders}</strong></p>
                </div>
              </div>
            </div>
          </div>

          <div className="stock-health-grid">
            <div className="workspace-card stock-health-card danger">
              <div className="card-header-row">
                <h3 className="card-heading-title">Empty Stock</h3>
                <span className="stock-count-badge danger">{emptyStockProducts}</span>
              </div>
              <div className="stock-list">
                {emptyStockList.length === 0 ? (
                  <div className="empty-mini-state">No products are empty.</div>
                ) : emptyStockList.slice(0, 6).map((product) => (
                  <div className="stock-list-row" key={product._id}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.category || 'No category'}</span>
                    </div>
                    <span className="stock-status-pill danger">0 left</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="workspace-card stock-health-card warning">
              <div className="card-header-row">
                <h3 className="card-heading-title">Low Stock</h3>
                <span className="stock-count-badge warning">{lowStockProducts}</span>
              </div>
              <div className="stock-list">
                {lowStockList.length === 0 ? (
                  <div className="empty-mini-state">No low-stock products.</div>
                ) : lowStockList.slice(0, 6).map((product) => (
                  <div className="stock-list-row" key={product._id}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.category || 'No category'}</span>
                    </div>
                    <span className="stock-status-pill warning">{Number(product.stock || 0)} left</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="workspace-card stock-health-card healthy">
              <div className="card-header-row">
                <h3 className="card-heading-title">Available Stock</h3>
                <span className="stock-count-badge healthy">{availableStockProducts}</span>
              </div>
              <div className="stock-list">
                {availableStockList.length === 0 ? (
                  <div className="empty-mini-state">No products above low-stock level.</div>
                ) : availableStockList.slice(0, 6).map((product) => (
                  <div className="stock-list-row" key={product._id}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.category || 'No category'}</span>
                    </div>
                    <span className="stock-status-pill healthy">{Number(product.stock || 0)} in stock</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overview-lower-grid">
            <div className="workspace-card">
              <div className="card-header-row">
                <h3 className="card-heading-title">Recent Orders</h3>
                <button className="view-all-shortcut-btn" onClick={() => setActiveTab('orders')}>View All &gt;</button>
              </div>
              {loadingOrders ? (
                <div className="tab-loader"><Loader className="spin" size={30} color="#0a58a4" /></div>
              ) : recentOrders.length === 0 ? (
                <div className="empty-table-state">No orders registered yet.</div>
              ) : (
                <div className="overview-list">
                  {recentOrders.map((order) => (
                    <div className="overview-list-row" key={order._id}>
                      <div>
                        <strong>{order.orderNumber}</strong>
                        <span>{order.shippingAddress?.firstName || 'Guest'} {order.shippingAddress?.lastName || ''}</span>
                      </div>
                      <div>
                        <span className="category-pill">{order.orderStatus}</span>
                        <strong>Rs. {Number(order.total || 0).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="workspace-card">
              <div className="card-header-row">
                <h3 className="card-heading-title">Recent Inventory</h3>
                <button className="view-all-shortcut-btn" onClick={() => setActiveTab('manage')}>View All &gt;</button>
              </div>
              {loadingProducts ? (
                <div className="tab-loader"><Loader className="spin" size={30} color="#0a58a4" /></div>
              ) : products.length === 0 ? (
                <div className="empty-table-state">No products registered yet.</div>
              ) : (
                <div className="overview-list">
                  {products.slice(0, 5).map((prod) => (
                    <div className="overview-list-row inventory" key={prod._id}>
                      <div className="product-table-cell-detail">
                        <img
                          src={`${BACKEND_URL}${prod.thumbnail}`}
                          alt={prod.name}
                          className="prod-table-thumb"
                          onError={(e) => { e.target.src = 'https://placehold.co/100'; }}
                        />
                        <div>
                          <strong>{prod.name}</strong>
                          <span>{prod.category} / Stock {prod.stock || 0}</span>
                        </div>
                      </div>
                      <div>
                        <strong>Rs. {Number(prod.retailPrice || 0).toLocaleString('en-IN')}</strong>
                        <span>Delivery Rs. {Number(prod.deliveryPrice || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
  );
}
