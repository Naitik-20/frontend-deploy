import { Pencil, Trash2 } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
export default function ProductTable() {
  const { filteredProducts, loadingProducts, handleEditProduct, handleDeleteProduct } = useAdminDashboard();
  if (loadingProducts) return <div className="tab-loader">Loading products...</div>;
  return <div className="products-table-wrapper"><table className="products-table"><thead><tr><th>Product</th><th>Category</th><th>Brand</th><th>Stock</th><th>Retail</th><th>Wholesale</th><th className="align-center">Actions</th></tr></thead><tbody>{filteredProducts.map((p) => <tr key={p._id}><td><div className="prod-cell-main">{p.thumbnail && <img src={`${BACKEND_URL}${p.thumbnail}`} className="prod-table-thumb" alt={p.name} />}<div><strong>{p.name}</strong><div className="prod-cell-id">{p.sku}</div></div></div></td><td><span className="category-pill">{p.category}</span></td><td>{p.brand}</td><td>{p.stock}</td><td>Rs. {Number(p.retailPrice || 0).toFixed(2)}</td><td>Rs. {Number(p.wholesalerPrice || 0).toFixed(2)}</td><td className="align-center"><button className="action-edit-btn" onClick={() => handleEditProduct(p)}><Pencil size={16}/></button><button className="action-delete-btn" onClick={() => handleDeleteProduct(p._id, p.name)}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>;
}
