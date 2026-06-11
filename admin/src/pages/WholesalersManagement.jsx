import { useEffect } from 'react';
import { KeyRound, Loader, Pencil, Power, Trash2, Users } from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

export default function WholesalersManagement() {
  const {
    setActiveTab,
    wholesalers,
    loadingWholesalers,
    editingWholesaler,
    wholesalerForm,
    setWholesalerForm,
    handleWholesalerChange,
    resetWholesalerForm,
    handleSubmitWholesaler,
    handleEditWholesaler,
    handleToggleWholesalerStatus,
    handleDeleteWholesaler,
  } = useAdminDashboard();

  useEffect(() => {
    setActiveTab('wholesalers');
  }, [setActiveTab]);

  const generatePassword = () => {
    const lowercase = 'abcdefghjkmnpqrstuvwxyz';
    const uppercase = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const symbols = '!@#$%&*?';
    const allChars = lowercase + uppercase + numbers + symbols;
    const randomValues = new Uint32Array(14);
    window.crypto.getRandomValues(randomValues);

    const requiredChars = [
      lowercase[randomValues[0] % lowercase.length],
      uppercase[randomValues[1] % uppercase.length],
      numbers[randomValues[2] % numbers.length],
      symbols[randomValues[3] % symbols.length],
    ];

    const remainingChars = Array.from(randomValues.slice(4), (value) => allChars[value % allChars.length]);
    const password = [...requiredChars, ...remainingChars]
      .sort(() => 0.5 - Math.random())
      .join('');

    setWholesalerForm((previous) => ({ ...previous, password }));
  };

  return (
    <div className="tab-pane animate-fade">
      <div className="category-admin-layout">
        <div className="form-workspace-card">
          <form className="admin-form-pane" onSubmit={handleSubmitWholesaler}>
            <div className="form-section-title">{editingWholesaler ? 'Edit Wholesaler Account' : 'Add Wholesaler Account'}</div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Owner Name <span className="required">*</span></label>
                <input type="text" name="name" value={wholesalerForm.name} onChange={handleWholesalerChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>Shop Name <span className="required">*</span></label>
                <input type="text" name="shopName" value={wholesalerForm.shopName} onChange={handleWholesalerChange} className="form-input" />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Phone <span className="required">*</span></label>
                <input type="text" name="phone" value={wholesalerForm.phone} onChange={handleWholesalerChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>Login Email <span className="required">*</span></label>
                <input type="email" name="email" value={wholesalerForm.email} onChange={handleWholesalerChange} className="form-input" />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>{editingWholesaler ? 'New Password' : 'Password'} {!editingWholesaler && <span className="required">*</span>}</label>
                <input
                  type="password"
                  name="password"
                  value={wholesalerForm.password}
                  onChange={handleWholesalerChange}
                  placeholder={editingWholesaler ? 'Leave blank to keep current password' : ''}
                  className="form-input"
                />
                <button type="button" className="generate-password-btn" onClick={generatePassword}>
                  <KeyRound size={14} />
                  <span>Generate</span>
                </button>
              </div>
              <div className="form-group">
                <label>GST Number</label>
                <input type="text" name="gstNumber" value={wholesalerForm.gstNumber} onChange={handleWholesalerChange} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label>Address <span className="required">*</span></label>
              <textarea name="address" value={wholesalerForm.address} onChange={handleWholesalerChange} className="form-textarea" rows={3} />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>City <span className="required">*</span></label>
                <input type="text" name="city" value={wholesalerForm.city} onChange={handleWholesalerChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={wholesalerForm.state} onChange={handleWholesalerChange} className="form-input" />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" name="pincode" value={wholesalerForm.pincode} onChange={handleWholesalerChange} className="form-input" />
              </div>
              <label className="checkbox-row">
                <input type="checkbox" name="isActive" checked={wholesalerForm.isActive} onChange={handleWholesalerChange} />
                Active wholesaler account
              </label>
            </div>

            <div className="form-action-bar">
              <button type="button" className="dashboard-clear-btn" onClick={resetWholesalerForm}>
                {editingWholesaler ? 'Cancel Edit' : 'Clear'}
              </button>
              <button type="submit" className="dashboard-submit-btn">
                <Users size={16} />
                <span>{editingWholesaler ? 'Update Wholesaler' : 'Add Wholesaler'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="workspace-card">
          <div className="card-header-row">
            <h3 className="card-heading-title">Wholesaler Accounts</h3>
            <span className="count-badge">{wholesalers.length}</span>
          </div>
          {loadingWholesalers ? (
            <div className="tab-loader">
              <Loader className="spin" size={32} color="#0a58a4" />
            </div>
          ) : wholesalers.length === 0 ? (
            <div className="empty-table-state">
              <h4>No wholesaler accounts registered yet.</h4>
            </div>
          ) : (
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Wholesaler</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th className="align-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wholesalers.map((wholesaler) => (
                    <tr key={wholesaler._id}>
                      <td>
                        <strong>{wholesaler.shopName}</strong>
                        <div className="prod-cell-id">{wholesaler.name}</div>
                        {wholesaler.gstNumber && <div className="prod-cell-id">GST: {wholesaler.gstNumber}</div>}
                      </td>
                      <td>
                        <strong>{wholesaler.phone}</strong>
                        <div className="prod-cell-id">{wholesaler.email}</div>
                      </td>
                      <td>
                        {wholesaler.city || '-'}
                        <div className="prod-cell-id">{[wholesaler.state, wholesaler.pincode].filter(Boolean).join(' ')}</div>
                      </td>
                      <td>
                        <span className="category-pill">{wholesaler.isActive === false ? 'Inactive' : 'Active'}</span>
                      </td>
                      <td className="align-center">
                        <button className="action-edit-btn" onClick={() => handleEditWholesaler(wholesaler)} title="Edit Wholesaler">
                          <Pencil size={16} />
                        </button>
                        <button className="action-edit-btn" onClick={() => handleToggleWholesalerStatus(wholesaler)} title={wholesaler.isActive === false ? 'Activate Wholesaler' : 'Deactivate Wholesaler'}>
                          <Power size={16} />
                        </button>
                        <button className="action-delete-btn" onClick={() => handleDeleteWholesaler(wholesaler)} title="Delete Wholesaler">
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
