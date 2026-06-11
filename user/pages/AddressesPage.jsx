import { MapPin, Pencil, Plus, Save, Trash2 } from 'lucide-react';

export default function AddressesPage({
  addresses,
  addressForm,
  editingAddressId,
  saving,
  onAddressChange,
  onSaveAddress,
  onEditAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onResetAddressForm,
}) {
  return (
    <section className="dashboard-card">
      <div className="card-title">
        <MapPin size={20} />
        <h2>Manage Addresses</h2>
      </div>
      <div className="address-layout">
        <form className="dashboard-form address-form" onSubmit={onSaveAddress}>
          <div className="form-grid">
            <label>
              Label
              <input name="label" value={addressForm.label} onChange={onAddressChange} required />
            </label>
            <label className="default-toggle">
              <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={onAddressChange} />
              Default checkout address
            </label>
          </div>
          <div className="form-grid">
            <label>
              First Name
              <input name="firstName" value={addressForm.firstName} onChange={onAddressChange} required />
            </label>
            <label>
              Last Name
              <input name="lastName" value={addressForm.lastName} onChange={onAddressChange} required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Phone
              <input name="phone" value={addressForm.phone} onChange={onAddressChange} required />
            </label>
            <label>
              Country
              <input name="country" value={addressForm.country} onChange={onAddressChange} required />
            </label>
          </div>
          <label>
            Address
            <input name="address" value={addressForm.address} onChange={onAddressChange} required />
          </label>
          <div className="form-grid">
            <label>
              City
              <input name="city" value={addressForm.city} onChange={onAddressChange} required />
            </label>
            <label>
              State / Region
              <input name="region" value={addressForm.region} onChange={onAddressChange} required />
            </label>
          </div>
          <label>
            Zip / Pincode
            <input name="zip" value={addressForm.zip} onChange={onAddressChange} required />
          </label>
          <div className="form-actions">
            <button className="primary-action" disabled={saving}>
              {editingAddressId ? <Save size={17} /> : <Plus size={17} />}
              {saving ? 'Saving...' : editingAddressId ? 'Update Address' : 'Add Address'}
            </button>
            {editingAddressId && (
              <button type="button" className="secondary-action" onClick={onResetAddressForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="address-list">
          {addresses.length === 0 ? (
            <div className="empty-box">No saved addresses yet.</div>
          ) : (
            addresses.map((address) => (
              <article className="address-item" key={address._id}>
                <div className="address-item-head">
                  <strong>{address.label}</strong>
                  {address.isDefault && <span>Default</span>}
                </div>
                <p>{[address.firstName, address.lastName].filter(Boolean).join(' ')}</p>
                <p>{address.phone}</p>
                <p>{address.address}</p>
                <p>{[address.city, address.region, address.zip].filter(Boolean).join(', ')}</p>
                <div className="address-actions">
                  <button type="button" onClick={() => onEditAddress(address)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button type="button" onClick={() => onSetDefaultAddress(address)}>
                      Set Default
                    </button>
                  )}
                  <button type="button" className="danger-text-btn" onClick={() => onDeleteAddress(address._id)}>
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
