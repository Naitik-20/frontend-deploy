import { useAdminDashboard } from '../../hooks/useAdminDashboard';
export default function CategoryForm() {
  const { categoryForm, editingCategory, handleCategoryChange, handleSubmitCategory, handleResetCategory } = useAdminDashboard();
  return <form className="admin-form-pane" onSubmit={handleSubmitCategory}><div className="form-section-title">{editingCategory ? 'Edit Category' : 'Add Category'}</div><div className="form-group"><label>Name</label><input className="form-input" name="name" value={categoryForm.name} onChange={handleCategoryChange}/></div><div className="form-group"><label>Description</label><textarea className="form-textarea" name="description" value={categoryForm.description} onChange={handleCategoryChange}/></div><div className="form-action-bar"><button type="button" className="dashboard-clear-btn" onClick={handleResetCategory}>Clear</button><button className="dashboard-submit-btn">Save Category</button></div></form>;
}
