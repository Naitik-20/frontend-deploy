import { Save } from 'lucide-react';

export default function ProfileSettingsPage({
  profile,
  formData,
  saving,
  onProfileChange,
  onSaveProfile,
}) {
  return (
    <section className="settings-card edit-profile-card">
      <div className="settings-card-head">
        <h2>Profile Details</h2>
        <span>Edit customer account</span>
      </div>

      <div className="image-upload-row">
        <div className="profile-image-preview">
          {profile?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="profile-summary-copy">
          <strong>{profile?.name || 'Customer'}</strong>
          <span>{profile?.email || 'Email not added'}</span>
        </div>
      </div>

      <form className="dashboard-form" onSubmit={onSaveProfile}>
        <div className="form-grid">
          <label>
            Full Name
            <input name="name" value={formData.name} onChange={onProfileChange} required />
          </label>
          <label>
            Email Address
            <input type="email" name="email" value={formData.email} onChange={onProfileChange} required />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Current Password
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={onProfileChange}
              placeholder="Required for password change"
            />
          </label>
          <label>
            New Password
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={onProfileChange}
              placeholder="Leave blank to keep same"
              minLength={6}
            />
          </label>
        </div>
        <button className="primary-action" disabled={saving}>
          <Save size={17} />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </section>
  );
}
