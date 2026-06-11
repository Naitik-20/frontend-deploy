import { useEffect, useState } from 'react';
import { Dog, Loader, Pencil, Trash2, Upload } from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const getPetCategoryImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/${image}`;
};

export default function BreedsManagement() {
  const [selectedImagePreview, setSelectedImagePreview] = useState('');
  const {
    setActiveTab,
    breeds,
    loadingBreeds,
    breedForm,
    breedImageFile,
    editingBreed,
    handleBreedChange,
    handleBreedImageChange,
    handleResetBreed,
    handleSubmitBreed,
    handleEditBreed,
    handleDeleteBreed,
  } = useAdminDashboard();

  useEffect(() => {
    setActiveTab('breeds');
  }, [setActiveTab]);

  useEffect(() => {
    if (!breedImageFile) {
      setSelectedImagePreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(breedImageFile);
    setSelectedImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [breedImageFile]);

  return (
    <div className="tab-pane animate-fade">
      <div className="category-admin-layout">
        <div className="form-workspace-card">
          <form className="admin-form-pane" onSubmit={handleSubmitBreed}>
            <div className="form-section-title">{editingBreed ? 'Edit Pet Category' : 'Add Pet Category'}</div>
            <div className="form-group">
              <label>Pet Category Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={breedForm.name}
                onChange={handleBreedChange}
                placeholder="e.g. Dogs"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Pet Category Image</label>
              <label className="brand-upload-box">
                <Upload size={18} />
                <span>{breedImageFile ? breedImageFile.name : 'Upload image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleBreedImageChange(e.target.files?.[0])}
                />
              </label>
              {(selectedImagePreview || breedForm.image) && (
                <div className="brand-upload-preview-wrap">
                  <img
                    src={selectedImagePreview || getPetCategoryImageUrl(breedForm.image)}
                    alt={breedForm.name || 'Pet category preview'}
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
                value={breedForm.sortOrder}
                onChange={handleBreedChange}
                className="form-input"
              />
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isActive"
                checked={breedForm.isActive}
                onChange={handleBreedChange}
              />
              Active for customers
            </label>
            <div className="form-action-bar">
              <button type="button" className="dashboard-clear-btn" onClick={handleResetBreed}>
                {editingBreed ? 'Cancel Edit' : 'Clear'}
              </button>
              <button type="submit" className="dashboard-submit-btn">
                <Dog size={16} />
                <span>{editingBreed ? 'Update Pet Category' : 'Add Pet Category'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="workspace-card">
          <div className="card-header-row">
            <h3 className="card-heading-title">Shop by pet category</h3>
            <span className="count-badge">{breeds.length}</span>
          </div>
          {loadingBreeds ? (
            <div className="tab-loader">
              <Loader className="spin" size={32} color="#0a58a4" />
            </div>
          ) : breeds.length === 0 ? (
            <div className="empty-table-state">
              <h4>No pet categories registered yet.</h4>
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
                  {breeds.map((breed) => (
                    <tr key={breed._id}>
                      <td>
                        {breed.image ? (
                          <img src={getPetCategoryImageUrl(breed.image)} alt={breed.name} className="category-thumb" />
                        ) : (
                          <span className="category-pill">No image</span>
                        )}
                      </td>
                      <td><strong>{breed.name}</strong></td>
                      <td>{breed.sortOrder || 0}</td>
                      <td><span className="category-pill">{breed.isActive === false ? 'Inactive' : 'Active'}</span></td>
                      <td className="align-center">
                        <button className="action-edit-btn" onClick={() => handleEditBreed(breed)} title="Edit Pet Category">
                          <Pencil size={16} />
                        </button>
                        <button className="action-delete-btn" onClick={() => handleDeleteBreed(breed)} title="Delete Pet Category">
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
