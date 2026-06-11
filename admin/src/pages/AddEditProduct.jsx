import { Package, Upload, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const merchandisingOptions = [
  { name: 'newArrival', label: 'New arrival' },
  { name: 'bestseller', label: 'Bestseller' },
  { name: 'featuredCollection', label: 'Featured collection' },
  { name: 'trendingProducts', label: 'Trending products' },
];

export default function AddEditProduct() {
  const { id } = useParams();
  const {
    products,
    breeds,
    editingProduct,
    handleEditProduct,
    form,
    categoryOptions,
    handleChange,
    handleSubmit,
    handleReset,
    uploading,
    imagePreview,
    fileInputRef,
    dragRef,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    galleryFiles,
    removedGalleryImages,
    handleAddGalleryFiles,
    handleRemoveGalleryFile,
    handleRemoveSavedGalleryImage,
    getAdminImageUrl,
  } = useAdminDashboard();

  const galleryPreviews = useMemo(
    () => galleryFiles.map((file) => ({ name: file.name, src: URL.createObjectURL(file) })),
    [galleryFiles]
  );
  const currentGalleryImages = (Array.isArray(form.images) ? form.images : []).filter(
    (image) => !removedGalleryImages.includes(image)
  );
  const thumbnailPreview = imagePreview || (form.thumbnail ? getAdminImageUrl(form.thumbnail) : '');

  useEffect(() => {
    if (id && !editingProduct) {
      const product = products.find((item) => item._id === id);
      if (product) handleEditProduct(product);
    }
  }, [id, products, editingProduct, handleEditProduct]);

  useEffect(() => () => {
    galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview.src));
  }, [galleryPreviews]);

  return (
    <div className="tab-pane animate-fade">
      <form className="product-creator-grid" onSubmit={handleSubmit}>
        <div className="form-workspace-card">
          <div className="form-section-title">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Product Name <span className="required">*</span></label>
              <input className="form-input" name="name" value={form.name || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input className="form-input" name="brand" value={form.brand || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Manufacturer</label>
              <input className="form-input" name="manufacturer" value={form.manufacturer || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>SKU <span className="required">*</span></label>
              <input className="form-input" name="sku" value={form.sku || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select className="form-input" name="category" value={form.category || ''} onChange={handleChange}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input className="form-input" name="stock" type="number" value={form.stock || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Shop by pet category</label>
            <select className="form-input" name="petCategory" value={form.petCategory || ''} onChange={handleChange}>
              <option value="">Select pet category</option>
              {breeds.map((petCategory) => (
                <option key={petCategory._id || petCategory.name} value={petCategory.name}>
                  {petCategory.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Retail Price</label>
              <input className="form-input" name="retailPrice" type="number" value={form.retailPrice || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Wholesaler Price</label>
              <input className="form-input" name="wholesalerPrice" type="number" value={form.wholesalerPrice || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Normal MOQ</label>
              <input className="form-input" name="normalMoq" type="number" value={form.normalMoq || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Wholesaler MOQ</label>
              <input className="form-input" name="wholesalerMoq" type="number" value={form.wholesalerMoq || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Delivery Price</label>
              <input className="form-input" name="deliveryPrice" type="number" value={form.deliveryPrice || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Weight Group</label>
              <input className="form-input" name="weightGroup" value={form.weightGroup || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Show In Frontend Sections</label>
            <div className="product-section-checkboxes">
              {merchandisingOptions.map((option) => (
                <label key={option.name} className="product-section-checkbox">
                  <input
                    type="checkbox"
                    name={option.name}
                    checked={Boolean(form[option.name])}
                    onChange={handleChange}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea className="form-textarea" name="description" rows={3} value={form.description || ''} onChange={handleChange} />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Composition</label>
              <textarea className="form-textarea" name="composition" rows={3} value={form.composition || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Dosage</label>
              <textarea className="form-textarea" name="dosage" rows={3} value={form.dosage || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="form-action-bar">
            <button type="button" className="dashboard-clear-btn" onClick={handleReset}>Clear</button>
            <button type="submit" className="dashboard-submit-btn" disabled={uploading}>
              {uploading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>

        <div className="product-media-column">
          <div className="form-workspace-card">
            <div className="form-section-title">Live Preview</div>
            <div className="live-preview-card">
              <div className="preview-label"><Package size={12} /> Live Preview</div>
              <div className="preview-card-body">
                <div
                  className="preview-img-container preview-img-upload-area"
                  ref={dragRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="preview-img" />
                  ) : (
                    <div className="preview-img-placeholder">
                      <Package size={36} color="#ccc" />
                      <span>No Image Selected</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="thumbnail-live-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} />
                    <span>{thumbnailPreview ? 'Change thumbnail' : 'Upload thumbnail'}</span>
                  </button>
                </div>
                <div className="preview-details">
                  <span className="preview-brand">{form.brand || 'BRAND'}</span>
                  <h4>{form.name || 'Product name'}</h4>
                  <span className="preview-current">
                    Rs. {Number(form.retailPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
          </div>

          <div className="form-workspace-card">
            <div className="form-section-title">Product Images</div>
            <div className="form-group">
              <label>Gallery Images</label>
              <label className="product-gallery-upload-btn">
                <Upload size={16} />
                <span>Add multiple product images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    handleAddGalleryFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
              </label>
              <span className="prod-cell-id">
                {galleryFiles.length > 0 ? `${galleryFiles.length} image(s) selected` : 'No images selected'}
              </span>
              {galleryPreviews.length > 0 && (
                <div className="product-gallery-preview-grid">
                  {galleryPreviews.map((preview, index) => (
                    <div key={preview.src} className="product-gallery-preview-item">
                      <img src={preview.src} alt={preview.name} className="product-gallery-preview-img" />
                      <button
                        type="button"
                        className="product-gallery-remove-btn"
                        onClick={() => handleRemoveGalleryFile(index)}
                        aria-label="Remove selected image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {currentGalleryImages.length > 0 && (
                <>
                  <span className="prod-cell-id">Current gallery images</span>
                  <div className="product-gallery-preview-grid">
                    {currentGalleryImages.map((image) => (
                      <div key={image} className="product-gallery-preview-item">
                        <img src={getAdminImageUrl(image)} alt="Current gallery" className="product-gallery-preview-img" />
                        <button
                          type="button"
                          className="product-gallery-remove-btn"
                          onClick={() => handleRemoveSavedGalleryImage(image)}
                          aria-label="Remove current image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
