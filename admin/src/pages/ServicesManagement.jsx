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
  Scissors,
  Calendar,
  Clock
} from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

export default function ServicesManagement() {
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
    serviceImageFile,
    setServiceImageFile,
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
    handleAddServiceAvailability,
    handleServiceAvailabilityChange,
    handleRemoveServiceAvailability,
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
    setActiveTab('services');
  }, [setActiveTab]);

  return (
        <div className="tab-pane animate-fade">
          <div className="category-admin-layout">
            <div className="form-workspace-card">
              <form className="admin-form-pane" onSubmit={handleSubmitService}>
                <div className="form-section-title">{editingService ? 'Edit Service' : 'Add Service'}</div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Service Title <span className="required">*</span></label>
                    <input type="text" name="title" value={serviceForm.title} onChange={handleServiceChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Slug <span className="required">*</span></label>
                    <input type="text" name="slug" value={serviceForm.slug} onChange={handleServiceChange} className="form-input" />
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Price</label>
                    <input type="number" name="price" value={serviceForm.price} onChange={handleServiceChange} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input type="text" name="duration" value={serviceForm.duration} onChange={handleServiceChange} placeholder="e.g. 30 min" className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description <span className="required">*</span></label>
                  <textarea name="description" value={serviceForm.description} onChange={handleServiceChange} className="form-textarea" rows={3} />
                </div>
                <div className="form-group">
                  <label>Features</label>
                  <textarea name="features" value={serviceForm.features} onChange={handleServiceChange} placeholder="One feature per line" className="form-textarea" rows={5} />
                </div>
                <div className="availability-editor">
                  <div className="availability-editor-header">
                    <div>
                      <div className="form-section-title">Schedule Availability</div>
                      <p>Set the dates and time slots customers can book on the consultation page.</p>
                    </div>
                    <button type="button" className="dashboard-clear-btn availability-add-btn" onClick={handleAddServiceAvailability}>
                      <Plus size={15} />
                      <span>Add Date</span>
                    </button>
                  </div>
                  {(serviceForm.availability || []).map((item, index) => (
                    <div className="availability-row" key={`${item.date}-${index}`}>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label><Calendar size={13} /> Date</label>
                          <input
                            type="date"
                            value={item.date || ''}
                            onChange={(e) => handleServiceAvailabilityChange(index, 'date', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <label className="checkbox-row checkbox-row-inline">
                          <input
                            type="checkbox"
                            checked={item.isActive !== false}
                            onChange={(e) => handleServiceAvailabilityChange(index, 'isActive', e.target.checked)}
                          />
                          Available
                        </label>
                      </div>
                      <div className="form-group">
                        <label><Clock size={13} /> Time Slots</label>
                        <textarea
                          value={item.slots || ''}
                          onChange={(e) => handleServiceAvailabilityChange(index, 'slots', e.target.value)}
                          placeholder="One time per line, e.g. 10:00 am"
                          className="form-textarea"
                          rows={5}
                        />
                      </div>
                      <button type="button" className="availability-remove-btn" onClick={() => handleRemoveServiceAvailability(index)}>
                        <Trash2 size={14} />
                        <span>Remove date</span>
                      </button>
                    </div>
                  ))}
                  {(serviceForm.availability || []).length === 0 && (
                    <div className="availability-empty-state">No availability dates added.</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Service Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setServiceImageFile(e.target.files?.[0] || null)}
                    className="form-input"
                  />
                  {(serviceImageFile || serviceForm.image) && (
                    <div className="service-image-preview">
                      <img
                        src={serviceImageFile ? URL.createObjectURL(serviceImageFile) : `${BACKEND_URL}${serviceForm.image}`}
                        alt="Service preview"
                      />
                      <span>{serviceImageFile ? serviceImageFile.name : 'Current image'}</span>
                    </div>
                  )}
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Accent Color</label>
                    <input type="color" name="color" value={serviceForm.color} onChange={handleServiceChange} className="form-input color-input" />
                  </div>
                  <div className="form-group">
                    <label>Background Color</label>
                    <input type="color" name="bg" value={serviceForm.bg} onChange={handleServiceChange} className="form-input color-input" />
                  </div>
                </div>
                <label className="checkbox-row">
                  <input type="checkbox" name="isActive" checked={serviceForm.isActive} onChange={handleServiceChange} />
                  Active for customers
                </label>
                <div className="form-action-bar">
                  <button type="button" className="dashboard-clear-btn" onClick={resetServiceForm}>
                    {editingService ? 'Cancel Edit' : 'Clear'}
                  </button>
                  <button type="submit" className="dashboard-submit-btn">
                    <Scissors size={16} />
                    <span>{editingService ? 'Update Service' : 'Add Service'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="workspace-card">
              <div className="card-header-row">
                <h3 className="card-heading-title">Services</h3>
                <span className="count-badge">{services.length}</span>
              </div>
              {loadingServices ? (
                <div className="tab-loader">
                  <Loader className="spin" size={32} color="#0a58a4" />
                </div>
              ) : services.length === 0 ? (
                <div className="empty-table-state">
                  <h4>No services registered yet.</h4>
                </div>
              ) : (
                <div className="products-table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th className="align-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service._id}>
                          <td>
                            <div className="product-table-cell-detail">
                              {service.image && (
                                <img
                                  src={`${BACKEND_URL}${service.image}`}
                                  alt={service.title}
                                  className="prod-table-thumb"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                              <div>
                            <strong>{service.title}</strong>
                            <div className="prod-cell-id">{service.slug}</div>
                            <div className="prod-cell-id">{service.description}</div>
                              </div>
                            </div>
                          </td>
                          <td><strong className="cell-price">Rs. {Number(service.price || 0).toFixed(2)}</strong></td>
                          <td>{service.duration || '-'}</td>
                          <td>
                            <span className="category-pill">
                              {(service.availability || []).filter((item) => item.isActive !== false && item.slots?.length).length} dates
                            </span>
                          </td>
                          <td><span className="category-pill">{service.isActive === false ? 'Inactive' : 'Active'}</span></td>
                          <td className="align-center">
                            <button className="action-edit-btn" onClick={() => handleEditService(service)} title="Edit Service">
                              <Pencil size={16} />
                            </button>
                            <button className="action-delete-btn" onClick={() => handleDeleteService(service)} title="Delete Service">
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
