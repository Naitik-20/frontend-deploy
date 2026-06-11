import { Camera, Save } from 'lucide-react';

export default function ProfileSettingsPage({
  profile,
  profileImage,
  formData,
  saving,
  onImageUpload,
  onProfileChange,
  onSaveProfile,
}) {
  return (
    <section className="settings-card edit-profile-card">
      <div className="settings-card-head">
        <h2>Profile Details</h2>
        <span>Edit wholesaler account</span>
      </div>

      <div className="image-upload-row">
        <div className="profile-image-preview">
          {profileImage ? (
            <img src={profileImage} alt={profile?.shopName || 'Profile'} />
          ) : (
            profile?.shopName?.charAt(0).toUpperCase() || 'W'
          )}
        </div>
        <label className="image-upload-btn">
          <Camera size={17} />
          Upload Profile Image
          <input type="file" accept="image/*" onChange={onImageUpload} />
        </label>
      </div>

      <form className="dashboard-form" onSubmit={onSaveProfile}>
        <div className="form-grid">
          <label>
            Contact Person
            <input name="name" value={formData.name} onChange={onProfileChange} required />
          </label>
          <label>
            Shop Name
            <input name="shopName" value={formData.shopName} onChange={onProfileChange} required />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Phone
            <input name="phone" value={formData.phone} onChange={onProfileChange} required />
          </label>
          <label>
            GST Number
            <input name="gstNumber" value={formData.gstNumber} onChange={onProfileChange} />
          </label>
        </div>
        <label>
          Business Address
          <input name="address" value={formData.address} onChange={onProfileChange} required />
        </label>
        <div className="form-grid">
          <label>
            City
            <input name="city" value={formData.city} onChange={onProfileChange} required />
          </label>
          <label>
            State
            <input name="state" value={formData.state} onChange={onProfileChange} />
          </label>
        </div>
        <label>
          Pincode
          <input name="pincode" value={formData.pincode} onChange={onProfileChange} />
        </label>
        <button className="primary-action" disabled={saving}>
          <Save size={17} />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </section>
  );
}
