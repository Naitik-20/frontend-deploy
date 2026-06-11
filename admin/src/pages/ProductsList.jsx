import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

export default function ProductsList() {
  const {
    filteredProducts,
    loadingProducts,
    searchTerm,
    setSearchTerm,
    handleEditProduct,
    handleDeleteProduct,
    getAdminImageUrl,
  } = useAdminDashboard();

  return (
    <div className="tab-pane animate-fade">
      <div className="workspace-card">
        <div className="card-actions-header">
          <div className="search-filter-wrapper">
            <Search className="search-box-icon" size={18} />
            <input
              type="text"
              placeholder="Search inventory by title, brand or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="inventory-search-input"
            />
          </div>
          <Link className="add-product-accent-btn" to="/admin/products/add">
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>

        {loadingProducts ? (
          <div className="tab-loader">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-table-state">
            <h4>No products found.</h4>
          </div>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Manufacturer</th>
                  <th>MOQ - Normal</th>
                  <th>MOQ - Wholesaler</th>
                  <th>retailPrice</th>
                  <th>wholesalerPrice</th>
                  <th>Delivery</th>
                  <th className="align-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div className="product-table-cell-detail">
                        {prod.thumbnail && (
                          <img
                            src={getAdminImageUrl(prod.thumbnail)}
                            alt={prod.name}
                            className="prod-table-thumb"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/100';
                            }}
                          />
                        )}
                        <div>
                          <div className="prod-cell-name">{prod.name}</div>
                          <span className="prod-cell-id">ID: {prod._id}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="category-pill">{prod.category}</span></td>
                    <td><strong>{prod.brand}</strong></td>
                    <td><strong>{prod.manufacturer || '-'}</strong></td>
                    <td><span className="category-pill">{prod.normalMoq || prod.moq || 0}</span></td>
                    <td><span className="category-pill">{prod.wholesalerMoq || 0}</span></td>
                    <td><strong>Rs. {Number(prod.retailPrice || 0).toFixed(2)}</strong></td>
                    <td><strong>Rs. {Number(prod.wholesalerPrice || 0).toFixed(2)}</strong></td>
                    <td><strong>Rs. {Number(prod.deliveryPrice || 0).toFixed(2)}</strong></td>
                    <td className="align-center">
                      <button
                        className="action-edit-btn"
                        onClick={() => handleEditProduct(prod)}
                        title="Edit Product"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="action-delete-btn"
                        onClick={() => handleDeleteProduct(prod._id, prod.name)}
                        title="Delete Product"
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
  );
}
