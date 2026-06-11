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

export default function DeliveryManagement() {
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
    setActiveTab('delivery');
  }, [setActiveTab]);

  return (
        <div className="tab-pane animate-fade">
          <div className="category-admin-layout">
            <div className="form-workspace-card">
              <form className="admin-form-pane" onSubmit={handleSubmitDeliveryMethod}>
                <div className="form-section-title">{editingDeliveryMethod ? 'Edit Delivery Method' : 'Add Delivery Method'}</div>
                <div className="form-group">
                  <label>Delivery Type <span className="required">*</span></label>
                  <select
                    name="code"
                    value={deliveryMethodForm.code}
                    onChange={handleDeliveryMethodChange}
                    className="form-select"
                    disabled={Boolean(editingDeliveryMethod)}
                  >
                    {DELIVERY_METHOD_OPTIONS.map((method) => (
                      <option key={method.code} value={method.code}>{method.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Display Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryMethodForm.name}
                    onChange={handleDeliveryMethodChange}
                    className="form-input"
                  />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Base Charge</label>
                    <input
                      type="number"
                      name="baseCharge"
                      min="0"
                      value={deliveryMethodForm.baseCharge}
                      onChange={handleDeliveryMethodChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Logistics Partner</label>
                    <input
                      type="text"
                      name="logisticsPartner"
                      value={deliveryMethodForm.logisticsPartner}
                      onChange={handleDeliveryMethodChange}
                      placeholder="e.g. Delhivery"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={deliveryMethodForm.description}
                    onChange={handleDeliveryMethodChange}
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                {deliveryMethodForm.code === 'HOME_DELIVERY' && (
                  <div className="form-group">
                    <label>Home Delivery Pincodes</label>
                    <textarea
                      name="servicePincodes"
                      value={deliveryMethodForm.servicePincodes}
                      onChange={handleDeliveryMethodChange}
                      className="form-textarea"
                      rows={4}
                      placeholder="Add multiple pincodes separated by comma, space, or new line"
                    />
                    <small className="form-help-text">Only these pincodes can choose Home Delivery at checkout.</small>
                  </div>
                )}
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    name="useProductDeliveryCharge"
                    checked={deliveryMethodForm.useProductDeliveryCharge}
                    onChange={handleDeliveryMethodChange}
                  />
                  Add product-level delivery charge
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={deliveryMethodForm.isActive}
                    onChange={handleDeliveryMethodChange}
                  />
                  Active for customers
                </label>
                <div className="form-action-bar">
                  <button type="button" className="dashboard-clear-btn" onClick={resetDeliveryMethodForm}>
                    {editingDeliveryMethod ? 'Cancel Edit' : 'Clear'}
                  </button>
                  <button type="submit" className="dashboard-submit-btn">
                    <Truck size={16} />
                    <span>{editingDeliveryMethod ? 'Update Method' : 'Add Method'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="workspace-card">
              <div className="card-header-row">
                <h3 className="card-heading-title">Delivery Methods</h3>
                <span className="count-badge">{deliveryMethods.length}</span>
              </div>
              {loadingDelivery ? (
                <div className="tab-loader">
                  <Loader className="spin" size={32} color="#0a58a4" />
                </div>
              ) : deliveryMethods.length === 0 ? (
                <div className="empty-table-state">
                  <h4>No delivery methods registered yet.</h4>
                </div>
              ) : (
                <div className="products-table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Method</th>
                        <th>Charge</th>
                        <th>Product Charge</th>
                        <th>Pincodes</th>
                        <th>Status</th>
                        <th className="align-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryMethods.map((method) => (
                        <tr key={method._id}>
                          <td>
                            <strong>{method.name}</strong>
                            <div className="prod-cell-id">{method.logisticsPartner || method.code}</div>
                          </td>
                          <td><strong className="cell-price">₹{Number(method.baseCharge || 0).toFixed(2)}</strong></td>
                          <td><span className="category-pill">{method.useProductDeliveryCharge === false ? 'No' : 'Yes'}</span></td>
                          <td>
                            {method.code === 'HOME_DELIVERY' ? (
                              <span className="category-pill">{method.servicePincodes?.length || 0} pincodes</span>
                            ) : (
                              <span className="prod-cell-id">Not required</span>
                            )}
                          </td>
                          <td><span className="category-pill">{method.isActive === false ? 'Inactive' : 'Active'}</span></td>
                          <td className="align-center">
                            <button className="action-edit-btn" onClick={() => handleEditDeliveryMethod(method)} title="Edit Delivery Method">
                              <Pencil size={16} />
                            </button>
                            <button className="action-delete-btn" onClick={() => handleDeleteDeliveryMethod(method)} title="Delete Delivery Method">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="category-admin-layout delivery-store-layout">
            <div className="form-workspace-card">
              <form className="admin-form-pane" onSubmit={handleSubmitPickupStore}>
                <div className="form-section-title">{editingPickupStore ? 'Edit Pickup Store' : 'Add Pickup Store'}</div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Store Name <span className="required">*</span></label>
                    <input type="text" name="name" value={pickupStoreForm.name} onChange={handlePickupStoreChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Phone <span className="required">*</span></label>
                    <input type="text" name="phone" value={pickupStoreForm.phone} onChange={handlePickupStoreChange} className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address <span className="required">*</span></label>
                  <textarea name="address" value={pickupStoreForm.address} onChange={handlePickupStoreChange} className="form-textarea" rows={3} />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>City <span className="required">*</span></label>
                    <input type="text" name="city" value={pickupStoreForm.city} onChange={handlePickupStoreChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>State <span className="required">*</span></label>
                    <input type="text" name="state" value={pickupStoreForm.state} onChange={handlePickupStoreChange} className="form-input" />
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Pincode <span className="required">*</span></label>
                    <input type="text" name="pincode" value={pickupStoreForm.pincode} onChange={handlePickupStoreChange} className="form-input" />
                  </div>
                  <label className="checkbox-row checkbox-row-inline">
                    <input type="checkbox" name="isActive" checked={pickupStoreForm.isActive} onChange={handlePickupStoreChange} />
                    Active store
                  </label>
                </div>
                <div className="form-action-bar">
                  <button type="button" className="dashboard-clear-btn" onClick={resetPickupStoreForm}>
                    {editingPickupStore ? 'Cancel Edit' : 'Clear'}
                  </button>
                  <button type="submit" className="dashboard-submit-btn">
                    <Store size={16} />
                    <span>{editingPickupStore ? 'Update Store' : 'Add Store'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="workspace-card">
              <div className="card-header-row">
                <h3 className="card-heading-title">Enrolled Pickup Stores</h3>
                <span className="count-badge">{pickupStores.length}</span>
              </div>
              {loadingDelivery ? (
                <div className="tab-loader">
                  <Loader className="spin" size={32} color="#0a58a4" />
                </div>
              ) : pickupStores.length === 0 ? (
                <div className="empty-table-state">
                  <h4>No pickup stores registered yet.</h4>
                </div>
              ) : (
                <div className="products-table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Store</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th className="align-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickupStores.map((store) => (
                        <tr key={store._id}>
                          <td>
                            <strong>{store.name}</strong>
                            <div className="prod-cell-id">{store.phone}</div>
                          </td>
                          <td>
                            {store.address}
                            <div className="prod-cell-id">{store.city}, {store.state} - {store.pincode}</div>
                          </td>
                          <td><span className="category-pill">{store.isActive === false ? 'Inactive' : 'Active'}</span></td>
                          <td className="align-center">
                            <button className="action-edit-btn" onClick={() => handleEditPickupStore(store)} title="Edit Pickup Store">
                              <Pencil size={16} />
                            </button>
                            <button className="action-delete-btn" onClick={() => handleDeletePickupStore(store)} title="Delete Pickup Store">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
  );
}
