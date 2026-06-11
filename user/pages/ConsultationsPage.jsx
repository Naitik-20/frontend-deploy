import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Phone,
  Plus,
  X,
} from 'lucide-react';

export default function ConsultationsPage({
  backendUrl,
  token,
}) {
  const [consultations, setConsultations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formData, setFormData] = useState({
    doctorId: '',
    consultationType: 'ONLINE',
    date: '',
    timeSlot: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchConsultations();
    fetchDoctors();
  }, [selectedStatus]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const url = selectedStatus
        ? `${backendUrl}/api/user/consultations?status=${selectedStatus}`
        : `${backendUrl}/api/user/consultations`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setConsultations(data.consultations || []);
      } else {
        setError(data.message || 'Failed to load consultations');
      }
    } catch (err) {
      setError(err.message || 'Error fetching consultations');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/consultations/doctors/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setDoctors(data.doctors || []);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const params = new URLSearchParams({ date });
      if (formData.doctorId) params.append('doctorId', formData.doctorId);

      const response = await fetch(
        `${backendUrl}/api/user/consultations/slots/available?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setAvailableSlots(data.slots || []);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'date') {
      fetchAvailableSlots(value);
    }
  };

  const handleBookConsultation = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/user/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book consultation');
      }

      setMessage('Consultation booked successfully!');
      setShowBookingForm(false);
      setFormData({
        doctorId: '',
        consultationType: 'ONLINE',
        date: '',
        timeSlot: '',
        title: '',
        description: '',
      });
      fetchConsultations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelConsultation = async (consultationId, reason = '') => {
    if (!window.confirm('Are you sure you want to cancel this consultation?')) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(
        `${backendUrl}/api/user/consultations/${consultationId}/cancel`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cancellationReason: reason }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel consultation');
      }

      setMessage('Consultation cancelled successfully');
      fetchConsultations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
      case 'CONFIRMED':
        return '#10b981';
      case 'COMPLETED':
        return '#3b82f6';
      case 'CANCELLED':
        return '#ef4444';
      case 'RESCHEDULED':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="badge badge-info">Scheduled</span>;
      case 'CONFIRMED':
        return <span className="badge badge-success">Confirmed</span>;
      case 'COMPLETED':
        return <span className="badge badge-primary">Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      case 'RESCHEDULED':
        return <span className="badge badge-warning">Rescheduled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  if (loading) {
    return <div className="dashboard-card dashboard-state">Loading consultations...</div>;
  }

  return (
    <div className="consultation-page">
      {message && (
        <div className="dashboard-alert success">
          <CheckCircle size={16} />
          {message}
        </div>
      )}
      {error && (
        <div className="dashboard-alert error">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="consultation-header">
        <div>
          <h2>My Consultations & Appointments</h2>
          <p>Book and manage your online consultations with doctors</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowBookingForm(!showBookingForm)}
        >
          <Plus size={18} />
          {showBookingForm ? 'Close' : 'Book Consultation'}
        </button>
      </div>

      {showBookingForm && (
        <div className="dashboard-card consultation-form">
          <h3>Book a Consultation</h3>
          <form onSubmit={handleBookConsultation}>
            <div className="form-group">
              <label>Select Doctor *</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleFormChange}
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctorId} value={doctor.doctorId}>
                    {doctor.name} - {doctor.speciality}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Consultation Type *</label>
                <select
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleFormChange}
                  required
                >
                  <option value="ONLINE">Online (Video)</option>
                  <option value="PHONE">Phone Call</option>
                  <option value="VIDEO">Video Conference</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            {formData.date && (
              <div className="form-group">
                <label>Time Slot *</label>
                {availableSlots.length > 0 ? (
                  <div className="slot-grid">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`slot-button ${formData.timeSlot === slot.time ? 'active' : ''}`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, timeSlot: slot.time }))
                        }
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="no-slots">No available slots for this date</p>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Title (Optional)</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., General Health Checkup"
                value={formData.title}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                placeholder="Describe your health concerns..."
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Booking...' : 'Book Consultation'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowBookingForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-buttons">
        <button
          className={`filter-btn ${selectedStatus === '' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('')}
        >
          All
        </button>
        <button
          className={`filter-btn ${selectedStatus === 'SCHEDULED' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('SCHEDULED')}
        >
          Scheduled
        </button>
        <button
          className={`filter-btn ${selectedStatus === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('COMPLETED')}
        >
          Completed
        </button>
        <button
          className={`filter-btn ${selectedStatus === 'CANCELLED' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('CANCELLED')}
        >
          Cancelled
        </button>
      </div>

      <div className="consultations-list">
        {consultations.length === 0 ? (
          <div className="dashboard-card dashboard-state">
            <Calendar size={32} />
            <p>No consultations booked yet</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowBookingForm(true)}
            >
              Book Your First Consultation
            </button>
          </div>
        ) : (
          consultations.map((consultation) => (
            <div key={consultation._id} className="consultation-card">
              <div className="consultation-header-card">
                <div>
                  <h3>{consultation.title || 'Consultation'}</h3>
                  {consultation.doctorName && (
                    <p className="doctor-name">Dr. {consultation.doctorName}</p>
                  )}
                </div>
                {getStatusBadge(consultation.status)}
              </div>

              <div className="consultation-details">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{new Date(consultation.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span>{consultation.timeSlot}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{consultation.consultationType}</span>
                </div>
              </div>

              {consultation.description && (
                <p className="consultation-description">{consultation.description}</p>
              )}

              {consultation.meetingLink && (
                <a href={consultation.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                  Join Meeting
                </a>
              )}

              {['SCHEDULED', 'CONFIRMED', 'RESCHEDULED'].includes(consultation.status) && (
                <div className="consultation-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      handleCancelConsultation(consultation._id, 'User cancelled')
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style>{consultationStyles}</style>
    </div>
  );
}

const consultationStyles = `
  .consultation-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .consultation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .consultation-header h2 {
    margin: 0 0 4px 0;
    font-size: 20px;
    color: #1d2b3a;
  }

  .consultation-header p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }

  .consultation-form {
    padding: 24px;
  }

  .consultation-form h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #1d2b3a;
  }

  .slot-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
    margin-top: 8px;
  }

  .slot-button {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
  }

  .slot-button:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .slot-button.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .no-slots {
    color: #ef4444;
    font-size: 13px;
    margin: 8px 0 0 0;
  }

  .filter-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    color: #6b7280;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
  }

  .filter-btn:hover,
  .filter-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .consultations-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .consultation-card {
    background: white;
    border: 1px solid #ececf0;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.2s;
  }

  .consultation-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .consultation-header-card {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 12px;
  }

  .consultation-header-card h3 {
    margin: 0 0 4px 0;
    color: #1d2b3a;
    font-size: 16px;
  }

  .doctor-name {
    margin: 0;
    color: #6b7280;
    font-size: 13px;
  }

  .consultation-details {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #ececf0;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6b7280;
  }

  .detail-item svg {
    color: #3b82f6;
  }

  .consultation-description {
    margin: 0 0 12px 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.5;
  }

  .meeting-link {
    display: inline-block;
    color: #3b82f6;
    text-decoration: none;
    font-size: 13px;
    margin-bottom: 12px;
    padding: 6px 12px;
    border: 1px solid #bfdbfe;
    border-radius: 4px;
    background: #eff6ff;
    transition: all 0.2s;
  }

  .meeting-link:hover {
    background: #dbeafe;
    border-color: #3b82f6;
  }

  .consultation-actions {
    display: flex;
    gap: 10px;
  }

  .badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .badge-info {
    background: #e0f2fe;
    color: #0369a1;
  }

  .badge-success {
    background: #dcfce7;
    color: #166534;
  }

  .badge-primary {
    background: #dbeafe;
    color: #1e40af;
  }

  .badge-danger {
    background: #fee2e2;
    color: #991b1b;
  }

  .badge-warning {
    background: #fef3c7;
    color: #92400e;
  }
`;
