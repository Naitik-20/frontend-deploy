import { useEffect, useState } from 'react';
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

const getCategoryImageUrl = (image, backendUrl) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${backendUrl}${image}`;
  return `${backendUrl}/uploads/${image}`;
};

export default function CategoriesManagement() {
  const [selectedImagePreview, setSelectedImagePreview] = useState('');
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
    categoryImageFile,
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
    handleCategoryImageChange,
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
    setActiveTab('categories');
  }, [setActiveTab]);

  useEffect(() => {
    if (!categoryImageFile) {
      setSelectedImagePreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(categoryImageFile);
    setSelectedImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [categoryImageFile]);

  return (
        <div className="tab-pane animate-fade">
          <div className="category-admin-layout">
            <div className="form-workspace-card">
              <form className="admin-form-pane" onSubmit={handleSubmitCategory}>
                <div className="form-section-title">{editingCategory ? 'Edit Category' : 'Add Category'}</div>
                <div className="form-group">
                  <label>Category Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={categoryForm.name}
                    onChange={handleCategoryChange}
                    placeholder="e.g. Pharmacy"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={categoryForm.description}
                    onChange={handleCategoryChange}
                    placeholder="Optional category note for admin reference"
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Icon Label</label>
                    <input
                      type="text"
                      name="icon"
                      value={categoryForm.icon}
                      onChange={handleCategoryChange}
                      placeholder="e.g. Food"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Sort Order</label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={categoryForm.sortOrder}
                      onChange={handleCategoryChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Category Image</label>
                  <label className="brand-upload-box">
                    <Upload size={18} />
                    <span>{categoryImageFile ? categoryImageFile.name : 'Upload image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleCategoryImageChange(e.target.files?.[0])}
                    />
                  </label>
                  {(selectedImagePreview || categoryForm.image) && (
                    <div className="brand-upload-preview-wrap">
                      <img
                        src={selectedImagePreview || getCategoryImageUrl(categoryForm.image, BACKEND_URL)}
                        alt={categoryForm.name || 'Category preview'}
                        className="brand-upload-preview"
                      />
                      <span>{selectedImagePreview ? 'Selected image preview' : 'Current image'}</span>
                    </div>
                  )}
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Card Background</label>
                    <input
                      type="color"
                      name="color"
                      value={categoryForm.color || '#ffffff'}
                      onChange={handleCategoryChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Accent Color</label>
                    <input
                      type="color"
                      name="accent"
                      value={categoryForm.accent || '#0a58a4'}
                      onChange={handleCategoryChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subcategories</label>
                  <textarea
                    name="subcategories"
                    value={categoryForm.subcategories}
                    onChange={handleCategoryChange}
                    placeholder="One subcategory per line"
                    className="form-textarea"
                    rows={5}
                  />
                </div>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={categoryForm.isActive}
                    onChange={handleCategoryChange}
                  />
                  Active for customers
                </label>
                <div className="form-action-bar">
                  <button type="button" className="dashboard-clear-btn" onClick={handleResetCategory}>
                    {editingCategory ? 'Cancel Edit' : 'Clear'}
                  </button>
                  <button type="submit" className="dashboard-submit-btn">
                    <FolderTree size={16} />
                    <span>{editingCategory ? 'Update Category' : 'Add Category'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="workspace-card">
              <div className="card-header-row">
                <h3 className="card-heading-title">Product Categories</h3>
                <span className="count-badge">{categories.length}</span>
              </div>
              {loadingCategories ? (
                <div className="tab-loader">
                  <Loader className="spin" size={32} color="#0a58a4" />
                </div>
              ) : categories.length === 0 ? (
                <div className="empty-table-state">
                  <h4>No categories registered yet.</h4>
                </div>
              ) : (
                <div className="products-table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Subcategories</th>
                        <th>Status</th>
                        <th className="align-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category._id}>
                          <td>
                            {category.image ? (
                              <img src={getCategoryImageUrl(category.image, BACKEND_URL)} alt={category.name} className="category-thumb" />
                            ) : (
                              <span className="category-pill">No image</span>
                            )}
                          </td>
                          <td><strong>{category.name}</strong></td>
                          <td>{category.description || '—'}</td>
                          <td><span className="category-pill">{category.subcategories?.length || 0}</span></td>
                          <td><span className="category-pill">{category.isActive === false ? 'Inactive' : 'Active'}</span></td>
                          <td className="align-center">
                            <button
                              className="action-edit-btn"
                              onClick={() => handleEditCategory(category)}
                              title="Edit Category"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="action-delete-btn"
                              onClick={() => handleDeleteCategory(category)}
                              title="Delete Category"
                            >
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
