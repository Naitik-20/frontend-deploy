import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Package,
  Upload,
  ShoppingBag,
  TrendingUp,
  Users,
  ChevronRight,
  Search,
  Eye,
  Star,
  ShoppingCart,
  Loader,
  CheckCircle,
  AlertCircle,
  Grid,
  Pencil,
  FolderTree,
  ClipboardList,
  Download,
  Truck,
  Store,
  Stethoscope,
  Scissors,
  Calendar
} from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

export default function OnlineConsultationManagement() {
  const {
    activeTab,
    setActiveTab,
    products,
    loadingProducts,
    searchTerm,
    setSearchTerm,
    categories,
    loadingCategories,
    categoryForm,
    editingCategory,
    orders,
    loadingOrders,
    orderSearchTerm,
    setOrderSearchTerm,
    orderTypeView,
    setOrderTypeView,
    selectedOrder,
    setSelectedOrder,
    deliveryMethods,
    pickupStores,
    loadingDelivery,
    editingDeliveryMethod,
    editingPickupStore,
    services,
    loadingServices,
    editingService,
    serviceForm,
    consultations,
    loadingConsultations,
    loadingConsultationSchedule,
    editingConsultation,
    consultationForm,
    consultationScheduleForm,
    deliveryMethodForm,
    pickupStoreForm,
    form,
    thumbnailFile,
    galleryFiles,
    setGalleryFiles,
    imagePreview,
    uploading,
    actionStatus,
    editingProduct,
    fileInputRef,
    dragRef,
    fetchAllProducts,
    fetchCategories,
    fetchOrders,
    fetchDeliverySettings,
    fetchServices,
    fetchConsultations,
    handleChange,
    handleCategoryChange,
    handleResetCategory,
    handleSubmitCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleDeliveryMethodChange,
    handlePickupStoreChange,
    resetDeliveryMethodForm,
    resetPickupStoreForm,
    handleSubmitDeliveryMethod,
    handleEditDeliveryMethod,
    handleDeleteDeliveryMethod,
    handleSubmitPickupStore,
    handleEditPickupStore,
    handleDeletePickupStore,
    handleServiceChange,
    resetServiceForm,
    handleSubmitService,
    handleEditService,
    handleDeleteService,
    handleConsultationChange,
    resetConsultationForm,
    handleSubmitConsultation,
    handleEditConsultation,
    handleDeleteConsultation,
    handleConsultationScheduleChange,
    handleAddScheduleDoctor,
    handleScheduleDoctorChange,
    handleRemoveScheduleDoctor,
    handleAddScheduleDate,
    handleScheduleDateChange,
    handleRemoveScheduleDate,
    handleAddScheduleSlot,
    handleScheduleSlotChange,
    handleRemoveScheduleSlot,
    handleSubmitConsultationSchedule,
    handleResetConsultationSchedule,
    handleUpdateOrder,
    handleDeleteOrder,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleReset,
    handleSubmit,
    handleEditProduct,
    handleDeleteProduct,
    totalProducts,
    totalOrders,
    totalDeliveryMethods,
    totalServices,
    totalConsultations,
    totalOrderRevenue,
    averageOrderValue,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    lowStockProducts,
    inventoryValue,
    categoryOptions,
    filteredProducts,
    filteredOrders,
    renderProductPreview,
    DEFAULT_CATEGORIES,
    DELIVERY_METHOD_OPTIONS,
    ORDER_TO_SHIPMENT_STATUS,
    SHIPMENT_TO_ORDER_STATUS,
    BACKEND_URL
  } = useAdminDashboard();
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const doctors = consultationScheduleForm.doctors || [];
  const scheduleDates = consultationScheduleForm.dates || [];
  const selectedDoctor = selectedDoctorIndex !== null ? doctors[selectedDoctorIndex] : null;
  const selectedDoctorId = selectedDoctor?.doctorId || '';
  const selectedDate = selectedDateIndex !== null ? scheduleDates[selectedDateIndex] : null;
  const selectedDoctorDateIndexes = useMemo(() => (
    scheduleDates
      .map((dateItem, index) => ({ dateItem, index }))
      .filter(({ dateItem }) => (dateItem.slots || []).some((slot) => slot.doctorId === selectedDoctorId) || selectedDoctor)
  ), [scheduleDates, selectedDoctor, selectedDoctorId]);
  const selectedDoctorSlots = selectedDate
    ? (selectedDate.slots || [])
        .map((slot, slotIndex) => ({ slot, slotIndex }))
        .filter(({ slot }) => slot.doctorId === selectedDoctorId)
    : [];

  useEffect(() => {
    setActiveTab('consultations');
  }, [setActiveTab]);

  useEffect(() => {
    if (selectedDoctorIndex !== null && selectedDoctorIndex >= doctors.length) {
      setSelectedDoctorIndex(null);
      setSelectedDateIndex(null);
    }
  }, [doctors.length, selectedDoctorIndex]);

  useEffect(() => {
    if (selectedDateIndex !== null && selectedDateIndex >= scheduleDates.length) {
      setSelectedDateIndex(null);
    }
  }, [scheduleDates.length, selectedDateIndex]);

  return (
        <div className="tab-pane animate-fade">
          <div className="workspace-card consultation-content-card">
            <div className="card-header-row">
              <h3 className="card-heading-title">Consultation Calendar & Availability</h3>
              {loadingConsultationSchedule && <Loader className="spin" size={18} color="#0a58a4" />}
            </div>
            <form className="consultation-content-form" onSubmit={handleSubmitConsultationSchedule}>
              <div className="schedule-section-head schedule-doctor-top">
                <div>
                  <div className="form-section-title">Doctors</div>
                  <p className="schedule-helper-text">Select a doctor to manage calendar dates and slots.</p>
                </div>
                <button type="button" className="dashboard-clear-btn availability-add-btn" onClick={handleAddScheduleDoctor}>
                  <Plus size={15} />
                  <span>Add Doctor</span>
                </button>
              </div>
              <div className="doctor-row-list">
                {doctors.length === 0 ? (
                  <div className="availability-empty-state">No doctors added yet.</div>
                ) : doctors.map((doctor, index) => {
                  const assignedDateCount = scheduleDates.filter((dateItem) => (dateItem.slots || []).some((slot) => slot.doctorId === doctor.doctorId)).length;
                  const assignedSlotCount = scheduleDates.reduce((total, dateItem) => total + (dateItem.slots || []).filter((slot) => slot.doctorId === doctor.doctorId).length, 0);
                  return (
                    <div
                      className={`doctor-select-row ${selectedDoctorIndex === index ? 'active' : ''}`}
                      key={doctor._id || `${doctor.doctorId}-${index}`}
                      onClick={() => {
                        setSelectedDoctorIndex(index);
                        setSelectedDateIndex(null);
                      }}
                    >
                      <div>
                        <strong>{doctor.name || 'Untitled Doctor'}</strong>
                        <span>{doctor.speciality || 'No speciality'} · {doctor.doctorId || 'No ID'}</span>
                      </div>
                      <div className="doctor-row-meta">
                        <span className="category-pill">{doctor.isActive === false ? 'Inactive' : 'Active'}</span>
                        <span>{assignedDateCount} dates</span>
                        <span>{assignedSlotCount} slots</span>
                        <label className="doctor-row-toggle" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={doctor.isActive !== false}
                            onChange={(e) => handleScheduleDoctorChange(index, 'isActive', e.target.checked)}
                          />
                          {doctor.isActive === false ? 'Inactive' : 'Active'}
                        </label>
                        <button
                          type="button"
                          className="action-delete-btn"
                          title="Delete Doctor"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveScheduleDoctor(index);
                            if (selectedDoctorIndex === index) {
                              setSelectedDoctorIndex(null);
                              setSelectedDateIndex(null);
                            } else if (selectedDoctorIndex !== null && selectedDoctorIndex > index) {
                              setSelectedDoctorIndex(selectedDoctorIndex - 1);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedDoctor ? (
                <div className="schedule-drilldown-grid">
                  <div className="availability-row">
                    <div className="schedule-section-head">
                      <div className="form-section-title">Doctor Details</div>
                      <button type="button" className="availability-remove-btn" onClick={() => {
                        handleRemoveScheduleDoctor(selectedDoctorIndex);
                        setSelectedDoctorIndex(null);
                        setSelectedDateIndex(null);
                      }}>
                        <Trash2 size={14} />
                        <span>Delete Doctor</span>
                      </button>
                    </div>
                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Doctor ID</label>
                        <input className="form-input" value={selectedDoctor.doctorId || ''} onChange={(e) => handleScheduleDoctorChange(selectedDoctorIndex, 'doctorId', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Name</label>
                        <input className="form-input" value={selectedDoctor.name || ''} onChange={(e) => handleScheduleDoctorChange(selectedDoctorIndex, 'name', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Speciality</label>
                        <input className="form-input" value={selectedDoctor.speciality || ''} onChange={(e) => handleScheduleDoctorChange(selectedDoctorIndex, 'speciality', e.target.value)} />
                      </div>
                      <label className="checkbox-row checkbox-row-inline">
                        <input type="checkbox" checked={selectedDoctor.isActive !== false} onChange={(e) => handleScheduleDoctorChange(selectedDoctorIndex, 'isActive', e.target.checked)} />
                        Active
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Leave Dates</label>
                      <textarea className="form-textarea" rows={3} value={selectedDoctor.leaveDates || ''} onChange={(e) => handleScheduleDoctorChange(selectedDoctorIndex, 'leaveDates', e.target.value)} placeholder="One YYYY-MM-DD date per line" />
                    </div>
                  </div>

                  <div className="availability-row">
                    <div className="schedule-section-head">
                      <div>
                        <div className="form-section-title">Calendar Dates</div>
                        <p className="schedule-helper-text">Select a date to manage this doctor's slots.</p>
                      </div>
                      <button type="button" className="dashboard-clear-btn availability-add-btn" onClick={handleAddScheduleDate}>
                        <Plus size={15} />
                        <span>Add Date</span>
                      </button>
                    </div>
                    <div className="doctor-date-list">
                      {selectedDoctorDateIndexes.length === 0 ? (
                        <div className="availability-empty-state">No dates added yet.</div>
                      ) : selectedDoctorDateIndexes.map(({ dateItem, index }) => {
                        const doctorSlotCount = (dateItem.slots || []).filter((slot) => slot.doctorId === selectedDoctorId).length;
                        return (
                          <button
                            type="button"
                            className={`date-select-row ${selectedDateIndex === index ? 'active' : ''}`}
                            key={dateItem._id || `${dateItem.date}-${index}`}
                            onClick={() => setSelectedDateIndex(index)}
                          >
                            <strong>{dateItem.date || 'No date'}</strong>
                            <span>{dateItem.status || 'AVAILABLE'} · {doctorSlotCount} slots</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDate ? (
                    <div className="availability-row schedule-selected-date">
                      <div className="schedule-section-head">
                        <div className="form-section-title">Date & Time Slots</div>
                        <button type="button" className="availability-remove-btn" onClick={() => {
                          handleRemoveScheduleDate(selectedDateIndex);
                          setSelectedDateIndex(null);
                        }}>
                          <Trash2 size={14} />
                          <span>Delete Date</span>
                        </button>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Date</label>
                          <input type="date" className="form-input" value={selectedDate.date || ''} onChange={(e) => handleScheduleDateChange(selectedDateIndex, 'date', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Status</label>
                          <select className="form-select" value={selectedDate.status || 'AVAILABLE'} onChange={(e) => handleScheduleDateChange(selectedDateIndex, 'status', e.target.value)}>
                            <option value="AVAILABLE">Available</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                            <option value="HOLIDAY">Holiday</option>
                            <option value="DOCTOR_LEAVE">Doctor Leave</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Reason</label>
                          <input className="form-input" value={selectedDate.reason || ''} onChange={(e) => handleScheduleDateChange(selectedDateIndex, 'reason', e.target.value)} />
                        </div>
                        <label className="checkbox-row checkbox-row-inline">
                          <input type="checkbox" checked={selectedDate.isActive !== false} onChange={(e) => handleScheduleDateChange(selectedDateIndex, 'isActive', e.target.checked)} />
                          Active
                        </label>
                      </div>
                      <div className="schedule-section-head schedule-slot-head">
                        <strong>Slots for {selectedDoctor.name || selectedDoctor.doctorId}</strong>
                        <button type="button" className="dashboard-clear-btn availability-add-btn" onClick={() => handleAddScheduleSlot(selectedDateIndex, selectedDoctorId)}>
                          <Plus size={14} />
                          <span>Add Slot</span>
                        </button>
                      </div>
                      <div className="schedule-slot-list">
                        {selectedDoctorSlots.length === 0 ? (
                          <div className="availability-empty-state">No slots for this doctor on this date.</div>
                        ) : selectedDoctorSlots.map(({ slot, slotIndex }) => (
                          <div className="slot-editor-row compact" key={slot._id || `${slot.time}-${slotIndex}`}>
                            <input className="form-input" value={slot.time || ''} onChange={(e) => handleScheduleSlotChange(selectedDateIndex, slotIndex, 'time', e.target.value)} placeholder="10:00 am" />
                            <label className="checkbox-row"><input type="checkbox" checked={slot.isActive !== false} onChange={(e) => handleScheduleSlotChange(selectedDateIndex, slotIndex, 'isActive', e.target.checked)} /> Active</label>
                            <label className="checkbox-row"><input type="checkbox" checked={Boolean(slot.isBlocked)} onChange={(e) => handleScheduleSlotChange(selectedDateIndex, slotIndex, 'isBlocked', e.target.checked)} /> Block</label>
                            <input className="form-input" value={slot.blockReason || ''} onChange={(e) => handleScheduleSlotChange(selectedDateIndex, slotIndex, 'blockReason', e.target.value)} placeholder="Block reason" />
                            <button type="button" className="action-delete-btn" onClick={() => handleRemoveScheduleSlot(selectedDateIndex, slotIndex)} title="Delete Slot">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="availability-empty-state">Select a date to manage time slots.</div>
                  )}
                </div>
              ) : (
                <div className="availability-empty-state">Select a doctor row to open calendar dates.</div>
              )}

              <div className="form-action-bar">
                <button type="button" className="dashboard-clear-btn" onClick={handleResetConsultationSchedule}>Reset Schedule</button>
                <button type="submit" className="dashboard-submit-btn">
                  <Calendar size={16} />
                  <span>Save Schedule</span>
                </button>
              </div>
            </form>
          </div>

        </div>
  );
}
