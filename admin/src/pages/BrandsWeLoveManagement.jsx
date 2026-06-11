import { useEffect, useState } from 'react';
import { Heart, Loader, Pencil, Trash2, Upload } from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const getBrandImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/${image}`;
};

export default function BrandsWeLoveManagement() {
  const [selectedImagePreview, setSelectedImagePreview] = useState('');
  const {
    setActiveTab,
    brandsWeLove,
    loadingBrandsWeLove,
    brandWeLoveForm,
    brandWeLoveImageFile,
    editingBrandWeLove,
    handleBrandWeLoveChange,
    handleBrandWeLoveImageChange,
    handleResetBrandWeLove,
    handleSubmitBrandWeLove,
    handleEditBrandWeLove,
    handleDeleteBrandWeLove,
  } = useAdminDashboard();

  useEffect(() => {
    setActiveTab('brandsWeLove');
  }, [setActiveTab]);

  useEffect(() => {
    if (!brandWeLoveImageFile) {
      setSelectedImagePreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(brandWeLoveImageFile);
    setSelectedImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [brandWeLoveImageFile]);

  return (
    <div className="tab-pane animate-fade">
      <div className="category-admin-layout">
        <div className="form-workspace-card">
          <form className="admin-form-pane" onSubmit={handleSubmitBrandWeLove}>
            <div className="form-section-title">{editingBrandWeLove ? 'Edit Brand' : 'Add Brand'}</div>
            <div className="form-group">
              <label>Brand Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={brandWeLoveForm.name}
                onChange={handleBrandWeLoveChange}
                placeholder="e.g. Royal Canin"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Brand Image</label>
              <label className="brand-upload-box">
                <Upload size={18} />
                <span>{brandWeLoveImageFile ? brandWeLoveImageFile.name : 'Upload image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleBrandWeLoveImageChange(e.target.files?.[0])}
                />
              </label>
              {(selectedImagePreview || editingBrandWeLove?.image) && (
                <div className="brand-upload-preview-wrap">
                  <img
                    src={selectedImagePreview || getBrandImageUrl(editingBrandWeLove.image)}
                    alt={brandWeLoveForm.name || 'Brand preview'}
                    className="brand-upload-preview"
                  />
                  <span>{selectedImagePreview ? 'Selected image preview' : 'Current image'}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={brandWeLoveForm.sortOrder}
                onChange={handleBrandWeLoveChange}
                className="form-input"
              />
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isActive"
                checked={brandWeLoveForm.isActive}
                onChange={handleBrandWeLoveChange}
              />
              Active for customers
            </label>
            <div className="form-action-bar">
              <button type="button" className="dashboard-clear-btn" onClick={handleResetBrandWeLove}>
                {editingBrandWeLove ? 'Cancel Edit' : 'Clear'}
              </button>
              <button type="submit" className="dashboard-submit-btn">
                <Heart size={16} />
                <span>{editingBrandWeLove ? 'Update Brand' : 'Add Brand'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="workspace-card">
          <div className="card-header-row">
            <h3 className="card-heading-title">Brands We Love</h3>
            <span className="count-badge">{brandsWeLove.length}</span>
          </div>
          {loadingBrandsWeLove ? (
            <div className="tab-loader">
              <Loader className="spin" size={32} color="#0a58a4" />
            </div>
          ) : brandsWeLove.length === 0 ? (
            <div className="empty-table-state">
              <h4>No brands added yet.</h4>
            </div>
          ) : (
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Name</th>
                    <th>Sort</th>
                    <th>Status</th>
                    <th className="align-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brandsWeLove.map((brand) => (
                    <tr key={brand._id}>
                      <td>
                        {brand.image ? (
                          <img src={getBrandImageUrl(brand.image)} alt={brand.name} className="category-thumb" />
                        ) : (
                          <span className="category-pill">No image</span>
                        )}
                      </td>
                      <td><strong>{brand.name}</strong></td>
                      <td>{brand.sortOrder || 0}</td>
                      <td><span className="category-pill">{brand.isActive === false ? 'Inactive' : 'Active'}</span></td>
                      <td className="align-center">
                        <button className="action-edit-btn" onClick={() => handleEditBrandWeLove(brand)} title="Edit Brand">
                          <Pencil size={16} />
                        </button>
                        <button className="action-delete-btn" onClick={() => handleDeleteBrandWeLove(brand)} title="Delete Brand">
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
