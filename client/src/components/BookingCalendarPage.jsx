import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Calendar, User, Mail, Phone, ChevronDown } from 'lucide-react';

const BACKEND_URL = 'https://dr-snoopy2.onrender.com';

const SERVICE_INFO = {
  grooming: { 
    title: 'Full Grooming', 
    price: 499, 
    duration: '90 min', 
    icon: '✂️',
    description: 'Complete premium coat care for your pet. Includes standard deep conditioning bath, blow dry, hygienic breed-specific styling/haircut, nail trimming, ear cleaning, and refreshing pet-safe fragrance spray.'
  },
  consultation: { 
    title: 'On Call Veterinary Doctor Consultation', 
    price: 199, 
    duration: '30 min', 
    icon: '🩺',
    description: 'Direct online diagnostic and health consultation session with certified veterinary experts (BVSC). Get professional prescriptions, dietary guidance, vaccination scheduling, and overall pet wellness advice.'
  },
  spa: { 
    title: 'Pet Spa & Massage', 
    price: 349, 
    duration: '60 min', 
    icon: '🛁',
    description: 'Rejuvenating body massage and therapeutic spa session for stress relief. Includes anti-tick treatment, premium organic shampooing, paw massage with moisturizing balm, and final coat glossing spray.'
  },
  styling: { 
    title: 'Fashion Styling', 
    price: 699, 
    duration: '120 min', 
    icon: '🌟',
    description: 'Elevated styling session to make your pet look stellar. Includes bespoke haircuts, high-end finishing products, complimentary accessories (bow or designer bandana), and a small photo session.'
  },
};

const DEFAULT_SERVICE = {
  title: 'Online Vet Consultation',
  price: 199,
  duration: '30 min',
  icon: 'Service',
  description: 'Connect with certified veterinarians for pet care guidance.',
  availability: [],
};

const DEFAULT_SCHEDULE = {
  timezoneLabel: 'India Standard Time (IST)',
  advanceBookingLimitDays: 30,
  sameDayBookingEnabled: false,
  bookingCutoffTime: '18:00',
  cancellationWindowHours: 24,
  rescheduleWindowHours: 24,
  doctors: [],
  dates: [],
};

const getDateKey = (year, month, day) => {
  if (!day) return '';
  const monthValue = String(month + 1).padStart(2, '0');
  const dayValue = String(day).padStart(2, '0');
  return `${year}-${monthValue}-${dayValue}`;
};

const getTimeSlotMinutes = (slot) => {
  const match = String(slot || '').trim().toLowerCase().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (period === 'pm' && hours < 12) hours += 12;
  if (period === 'am' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function BookingCalendarPage({ onLoginClick }) {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isConsultationPage = location.pathname.includes('/consultation') || location.pathname.includes('/online-consultation');
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [serviceLoading, setServiceLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchServices = async () => {
      try {
        setServiceLoading(true);
        const [servicesRes, scheduleRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/services`),
          fetch(`${BACKEND_URL}/api/consultation-schedule`),
        ]);
        const [servicesData, scheduleData] = await Promise.all([servicesRes.json(), scheduleRes.json()]);

        if (!servicesRes.ok) {
          throw new Error(servicesData.message || 'Unable to load services.');
        }

        if (!scheduleRes.ok) {
          throw new Error(scheduleData.message || 'Unable to load consultation schedule.');
        }

        if (!ignore) {
          setServices(Array.isArray(servicesData) ? servicesData : []);
          setSchedule({ ...DEFAULT_SCHEDULE, ...scheduleData });
        }
      } catch (err) {
        console.error('Error fetching booking services:', err);
        if (!ignore) {
          setServices([]);
          setSchedule(DEFAULT_SCHEDULE);
        }
      } finally {
        if (!ignore) {
          setServiceLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      ignore = true;
    };
  }, []);

  const selectedService = services.find((item) => item.slug === serviceId || item._id === serviceId);
  const serviceUnavailable = Boolean(serviceId) && !serviceLoading && !selectedService;
  const fallbackService = serviceUnavailable
    ? {
        title: 'Service unavailable',
        price: 0,
        duration: '-',
        icon: 'Service',
        description: 'This service is no longer available. Please choose another service from the services page.',
        availability: [],
      }
    : {
        ...DEFAULT_SERVICE,
      };
  const service = selectedService
    ? {
        title: selectedService.title,
        price: Number(selectedService.price || 0),
        duration: selectedService.duration || '30 min',
        icon: 'Service',
        description: selectedService.description || '',
        availability: [],
      }
    : fallbackService;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('10:00 am'); // Select first slot by default
  const [step, setStep] = useState(1); // 1: DateTime Picker & Sidebar, 2: Form Details & Sidebar, 3: Success Screen
  const [form, setForm] = useState({ name: '', email: '', phone: '', petName: '', petType: 'Dog', notes: '' });
  const [loading, setLoading] = useState(false);

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const doctorById = useMemo(() => {
    const map = new Map();
    (schedule.doctors || []).forEach((doctor) => {
      if (doctor.doctorId && doctor.isActive !== false) map.set(doctor.doctorId, doctor);
    });
    return map;
  }, [schedule.doctors]);
  const todayDateKey = getDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const currentMinutes = today.getHours() * 60 + today.getMinutes();
  const availabilityByDate = useMemo(() => {
    const map = new Map();
    (schedule.dates || []).forEach((item) => {
      if (!item.date || item.isActive === false || item.status !== 'AVAILABLE') return;
      const slots = (item.slots || [])
        .filter((slot) => {
          if (!slot.time || slot.isActive === false || slot.isBlocked) return false;
          if (!slot.doctorId) return true;
          const doctor = doctorById.get(slot.doctorId);
          if (!doctor) return false;
          return !(doctor.leaveDates || []).includes(item.date);
        })
        .filter((slot) => {
          if (item.date !== todayDateKey) return true;
          const slotMinutes = getTimeSlotMinutes(slot.time);
          return slotMinutes === null || slotMinutes > currentMinutes;
        })
        .map((slot) => String(slot.time).trim())
        .filter(Boolean);
      if (slots.length) map.set(item.date, slots);
    });
    return map;
  }, [currentMinutes, doctorById, schedule.dates, todayDateKey]);
  const selectedDateKey = getDateKey(year, month, selectedDay);
  const availableSlots = selectedDay
    ? (availabilityByDate.get(selectedDateKey) || [])
    : [];

  useEffect(() => {
    if (!selectedDay) {
      setSelectedTime('');
      return;
    }

    if (availableSlots.length === 0) {
      setSelectedTime('');
      return;
    }

    if (!availableSlots.includes(selectedTime)) {
      setSelectedTime(availableSlots[0]);
    }
  }, [availableSlots, selectedDay, selectedTime]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert('Please fill out all required fields marked with *');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const getWeekdayName = (dayNum) => {
    if (!dayNum) return '';
    const dateObj = new Date(year, month, dayNum);
    const options = { weekday: 'long' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  const selectedDate = selectedDay ? `${selectedDay} ${MONTHS[month]} ${year}` : '';

  

  return (
    <div className="booking-page">
      <div className="booking-container container">
        
        {/* Step-back to services button */}
        {step < 3 && !isConsultationPage && (
          <button className="booking-back-btn" onClick={() => step === 2 ? setStep(1) : navigate('/services')}>
            <ChevronLeft size={16} /> {step === 2 ? 'Back to Date & Time' : 'Back to Services'}
          </button>
        )}

        {/* Page Header */}
     <div className="booking-header-modern">

  <div>
    <span className="booking-pill">
      ONLINE CONSULTATION
    </span>

    <h1>
      Book a Vet Consultation
    </h1>

    <p>
      Connect with certified veterinarians and get expert
      guidance for your pet from anywhere.
    </p>
  </div>

  <img
    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
    alt=""
  />

</div>

        
         {step < 3 ? (
  <>
    

    <div className="booking-grid">
            
            {/* Left/Middle Content Area */}
            <div className="booking-main-content">
              {step === 1 ? (
                <div className="booking-datetime-picker">
                  
                  {/* Column 1: Calendar Card */}
                  <div className="booking-col-calendar">
                    <div className="booking-section-header">
                      <h2 className="booking-section-title">Select a Date and Time</h2>
                      <span className="booking-timezone-label">{schedule.timezoneLabel}</span>
                    </div>
                    
                    <div className="calendar-card">
                      {/* Month Navigation */}
                      <div className="cal-header">
                        <button className="cal-nav-btn" onClick={prevMonth} type="button">
                          <ChevronLeft size={18} />
                        </button>
                        <span className="cal-month-label">{MONTHS[month]} {year}</span>
                        <button className="cal-nav-btn" onClick={nextMonth} type="button">
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      {/* Day Headers */}
                      <div className="cal-grid cal-days-header">
                        {DAYS.map(d => (
                          <div key={d} className="cal-day-label">{d}</div>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="cal-grid">
                        {[...Array(firstDay)].map((_, i) => (
                          <div key={`empty-${i}`} className="cal-empty-slot" />
                        ))}
                        {[...Array(daysInMonth)].map((_, i) => {
                          const day = i + 1;
                          const isSelected = selectedDay === day;
                          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                          const noAvailability = !(availabilityByDate.get(getDateKey(year, month, day)) || []).length;
                          
                          return (
                            <button
                              key={day}
                              type="button"
                              className={`cal-date-btn ${noAvailability ? 'cal-past' : ''} ${isSelected ? 'cal-selected' : ''} ${isToday ? 'cal-today' : ''}`}
                              onClick={() => setSelectedDay(day)}
                              disabled={false}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Time Slots Card */}
                  <div className="booking-col-time">
                    <h3 className="booking-availability-title">
                      Availability for {selectedDay ? `${getWeekdayName(selectedDay)}, ${selectedDay} ${MONTHS[month].slice(0, 3)}` : 'Select a date'}
                    </h3>
                    
                   {selectedDay ? (
  <div className="time-slots-wrapper">

    <div className="time-slots-grid">
      {availableSlots.map((slot) => (
        <button
          key={slot}
          type="button"
          className={`time-slot-btn ${selectedTime === slot ? 'selected' : ''}`}
          onClick={() => setSelectedTime(slot)}
        >
          {slot}
        </button>
      ))}
    </div>

    {availableSlots.length === 0 && (
      <div className="no-date-selected-message">
        No sessions are available for this date.
      </div>
    )}

    {/* Continue Button */}
    {selectedTime && (
      <button
        type="button"
        className="continue-btn"
        onClick={() => setStep(2)}
      >
        Continue Booking →
      </button>
    )}

  </div>
) : (
                      <div className="no-date-selected-message">
                        Select a date on the calendar to view available timing slots.
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* Step 2: Customer Details Form */
               
                <div className="booking-details-form-container">
                   <button
      type="button"
      className="booking-back-btn"
      onClick={() => setStep(1)}
    >
      ← Back to Date & Time
    </button>
                  <h2 className="booking-section-title" style={{ marginBottom: '24px' }}>📝 Enter Your Details</h2>
                  
                  <form id="booking-form" className="booking-form" onSubmit={handleBookingSubmit}>
                    <div className="booking-form-row">
                      <div className="booking-field">
                        <label>Your Name *</label>
                        <div className="booking-input-wrap">
                          <User size={15}/>
                          <input required placeholder="Full name" value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}/>
                        </div>
                      </div>
                      <div className="booking-field">
                        <label>Email *</label>
                        <div className="booking-input-wrap">
                          <Mail size={15}/>
                          <input required type="email" placeholder="you@example.com" value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}/>
                        </div>
                      </div>
                    </div>

                    <div className="booking-form-row">
                      <div className="booking-field">
                        <label>Phone *</label>
                        <div className="booking-input-wrap">
                          <Phone size={15}/>
                          <input required placeholder="Your contact number" value={form.phone}
                            onChange={e => setForm({...form, phone: e.target.value})}/>
                        </div>
                      </div>
                      <div className="booking-field">
                        <label>Pet Name</label>
                        <div className="booking-input-wrap">
                          <span style={{ marginLeft: '12px', marginRight: '4px', fontSize: '15px' }}>🐾</span>
                          <input placeholder="Your pet's name" value={form.petName}
                            onChange={e => setForm({...form, petName: e.target.value})}/>
                        </div>
                      </div>
                    </div>

                    <div className="booking-form-row">
                      <div className="booking-field">
                        <label>Pet Type</label>
                        <select value={form.petType} onChange={e => setForm({...form, petType: e.target.value})} className="booking-select">
                          {['Dog','Cat','Bird','Rabbit','Other'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="booking-field">
                        <label>Selected Appointment Time</label>
                        <div className="booking-readonly-input">
                          <Calendar size={14} style={{ marginRight: '6px' }} /> {selectedDate} at {selectedTime}
                        </div>
                      </div>
                    </div>

                    <div className="booking-field">
                      <label>Additional Notes / Instructions</label>
                      <textarea placeholder="Any special instructions for the care taker, health concerns, etc."
                        value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                        className="booking-textarea" rows={4}/>
                    </div>

                    <div className="login-notice" style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#a48c75' }}>
                      Have an account? <span onClick={onLoginClick} style={{ color: '#f7931e', fontWeight: '750', cursor: 'pointer', textDecoration: 'underline' }}>Log in</span>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Column 3: Service Details Right Sidebar */}
        


   <div className="consult-sidebar">

    <h3>Online Vet Consultation</h3>

    <p>
      Connect with certified veterinarians for expert
      pet care guidance.
    </p>

    <div className="consult-price">
      ₹199
    </div>

    <ul>
      <li>30 min session</li>
      <li>Expert veterinarian</li>
      <li>Video consultation</li>
      <li>Prescription guidance</li>
    </ul>

    <button
      onClick={() => selectedTime && setStep(2)}
      disabled={!selectedTime}
    >
      Continue Booking
    </button>

  </div>





</div>

          </>
        ) : (
          /* Step 3: Success Screen */
          <div className="booking-confirmed-card">
            <div className="confirmed-icon">🎉</div>
            <h2 className="confirmed-title">Booking Confirmed!</h2>
            <p className="confirmed-sub">Your appointment has been booked successfully.</p>
            <div className="confirmed-details">
              <div className="confirmed-row"><Calendar size={16}/> <strong>Date:</strong> {selectedDate}</div>
              <div className="confirmed-row"><Clock size={16}/> <strong>Time Slot:</strong> {selectedTime}</div>
              <div className="confirmed-row"><span>{service.icon}</span> <strong>Service:</strong> {service.title}</div>
              <div className="confirmed-row">💰 <strong>Consultation Fee:</strong> ₹{service.price} (Pay at clinic)</div>
            </div>
            <p className="confirmed-note">We'll send a confirmation email shortly to <strong>{form.email}</strong>. See you soon! 🐾</p>
            <button className="back-to-home-btn" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        )}

       

      </div>

      <style>{`

      .booking-back-btn{
  border:none;
  background:transparent;

  color:#0b5c4b;

  font-size:15px;
  font-weight:600;

  cursor:pointer;

  margin-bottom:24px;

  display:flex;
  align-items:center;
  gap:8px;

  transition:.3s;
}

.booking-back-btn:hover{
  color:#f59e0b;
  transform:translateX(-2px);
}

.consult-sidebar{
  background:#fff;

  padding:28px;

  border-radius:24px;

  box-shadow:
    0 12px 40px rgba(0,0,0,.06);

  position:sticky;
  top:120px;
}

.consult-price{
  font-size:42px;
  font-weight:800;

  color:#f59e0b;

  margin:20px 0;
}

.consult-sidebar button{
  width:100%;
  height:56px;

  border:none;

  border-radius:16px;

  background:#0b5c4b;
  color:white;

  font-weight:700;
}

.booking-header-modern{
  display:grid;
  grid-template-columns:1fr 420px;
  gap:50px;
  align-items:center;

  margin-bottom:50px;
}

.booking-header-modern img{
  width:100%;
  height:280px;
  object-fit:cover;

  border-radius:28px;

  box-shadow:
    0 20px 50px rgba(0,0,0,.08);
}

.booking-pill{
  display:inline-block;

  background:#fff3d7;
  color:#f59e0b;

  padding:8px 16px;

  border-radius:999px;

  font-size:12px;
  font-weight:700;
}

.booking-header-modern h1{
  margin-top:16px;

  font-size:60px;
  line-height:1.05;

  color:#0b3d2e;
}

.booking-header-modern p{
  margin-top:18px;

  color:#6b7280;

  max-width:500px;
}

.continue-btn{
  width:100%;
  margin-top:20px;

  background:#0b5c4b;
  color:#fff;

  border:none;
  border-radius:14px;

  height:54px;

  font-size:15px;
  font-weight:700;

  cursor:pointer;

  transition:.3s;
}

.continue-btn:hover{
  transform:translateY(-2px);
  background:#094738;
}


.service-overview-card{
  background:white;

  border-radius:24px;

  padding:30px;

  display:flex;
  justify-content:space-between;
  align-items:center;

  box-shadow:0 12px 40px rgba(0,0,0,.05);

  margin-bottom:40px;
}

.service-overview-card h3{
  color:#0b3d2e;
  font-size:28px;
  margin-bottom:10px;
}

.service-overview-card p{
  color:#666;
  max-width:650px;
}

.service-price-box h2{
  color:#f59e0b;
  font-size:40px;
}


.booking-hero{
  display:grid;
  grid-template-columns:1.1fr .9fr;
  gap:40px;
  align-items:center;

  margin-bottom:50px;
}

.booking-hero-content h1{
  font-size:64px;
  font-weight:800;
  line-height:1.05;
  color:#0b3d2e;
  font-family:var(--font-headers);
}

.booking-tag{
  display:inline-block;

  padding:8px 16px;

  border-radius:999px;

  background:#fff3d7;
  color:#f59e0b;

  font-weight:700;
  font-size:12px;
}

.booking-hero-content p{
  margin-top:18px;
  color:#6b7280;
  line-height:1.8;
  max-width:550px;
}

.booking-hero-image{
  height:420px;
  border-radius:32px;
  overflow:hidden;

  box-shadow:
  0 20px 50px rgba(0,0,0,.08);
}

.booking-hero-image img{
  width:100%;
  height:100%;
  object-fit:cover;


}

.booking-datetime-picker{
  align-items:start;
}

.calendar-card{
  height:auto;
  display:inline-block;
  width:100%;
  max-width:560px;
}

        .booking-page { 
          background:#f6efe6;
          min-height: 100vh; 
          padding: 30px 0 80px; 
          font-family: 'Inter', sans-serif;
        }

        .booking-back-btn {
          display: flex; 
          align-items: center; 
          gap: 6px; 
          background: none;
          border: 1.5px solid #ebd3bd; 
          padding: 8px 16px;
          border-radius: 99px; 
          font-size: 13px; 
          font-weight: 700;
          color: #f7931e; 
          cursor: pointer; 
          transition: all 0.25s ease;
          width: fit-content;
          margin-bottom: 20px;
        }

        .booking-back-btn:hover { 
          background-color: #fff7ed;
          border-color: #f7931e; 
        }

        /* Page Header */
        .booking-header {
          margin-bottom: 40px;
        }

        .booking-title {
          font-size: 40px;
          font-weight: 900;
          color: #f7931e;
          font-family: 'Outfit', 'Inter', sans-serif;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }

        .booking-subtitle {
          font-size: 16px;
          color: #a48c75;
          margin: 0;
        }

        /* Layout Grid */
        .booking-grid {
          display: grid;
          grid-template-columns: minmax(0,1fr) 320px;
          gap: 32px;
          align-items: start;
        }

        .booking-main-content {
          background: transparent;
        }

        /* Date Time Picker Layout */
        .booking-datetime-picker {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
        }

        .booking-section-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-bottom: 1.5px solid #ebd3bd;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }

        .booking-section-title {
          font-size: 20px;
          font-weight: 800;
          color: #0a58a4;
          margin: 0;
          font-family: 'Outfit', sans-serif;
        }

        .booking-timezone-label {
          font-size: 13px;
          color: #a48c75;
          font-weight: 500;
        }

        /* Calendar Styling */
       .calendar-card{
  background:#fff;
max-width:480px;
  padding:30px;

  border-radius:28px;

  box-shadow:
    0 12px 40px rgba(0,0,0,.06);
}
}
        .cal-header { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          margin-bottom: 24px; 
        }

        .cal-month-label { 
          font-size: 17px; 
          font-weight: 800; 
          color: #2d3748; 
          font-family: 'Outfit', sans-serif;
        }

        .cal-nav-btn { 
          background: #fff8f0; 
          border: 1px solid #ebd3bd; 
          width: 38px; 
          height: 38px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          color: #f7931e;
          transition: all 0.2s ease; 
        }

        .cal-nav-btn:hover { 
          background: #f7931e; 
          color: white; 
          border-color: #f7931e; 
        }

        .cal-grid { 
          display: grid; 
          grid-template-columns: repeat(7, 1fr); 
          gap: 8px; 
          margin-bottom: 10px; 
        }

        .cal-days-header { 
          margin-bottom: 12px; 
        }

        .cal-day-label { 
          text-align: center; 
          font-size: 13px; 
          font-weight: 700; 
          color: #a0aec0; 
          padding: 4px 0; 
        }

        .cal-date-btn {
         width:40px;
  height:40px;

  border-radius:14px;
          aspect-ratio: 1; 
        
          border: none;
          background: none; 
          font-size: 14px; 
          font-weight: 700; 
          cursor: pointer;
          color: #2d3748; 
          transition: all 0.2s ease;
          display: flex; 
          flex-direction: column;
          align-items: center; 
          justify-content: center;
        }

        .cal-date-btn:hover:not(:disabled) { 
          background: #fff3e5; 
          color: #f7931e; 
        }
          .cal-selected{
  background:#f59e0b;
  color:white;

  box-shadow:
    0 10px 20px rgba(245,158,11,.25);
}

        .cal-date-btn.cal-selected { 
          background: #f7931e; 
          color: white; 
          position: relative;
          box-shadow: 0 4px 12px rgba(247, 147, 30, 0.3);
        }

        .cal-date-btn.cal-selected::after {
          content: '';
          position: absolute;
          bottom: 5px;
          width: 4px;
          height: 4px;
          background-color: white;
          border-radius: 50%;
        }

        .cal-date-btn.cal-today:not(.cal-selected) {
          box-shadow: inset 0 0 0 1px #f59e0b;
          color: #f7931e;
        }

        .cal-date-btn.cal-past { 
          color: #cbd5e0; 
          cursor: not-allowed; 
        }

        .cal-empty-slot {
          aspect-ratio: 1;
        }

        /* Time Slots Column */
        .booking-col-time {
          display: flex;
          flex-direction: column;
        }

        .booking-availability-title {
          font-size: 16px;
          font-weight: 800;
          color: #f7931e;
          border-bottom: 1.5px solid #ebd3bd;
          padding-bottom: 12px;
          margin: 0 0 24px;
          min-height: 38px;
        }

        .time-slots-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .time-slots-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 10px; 
        }

        .time-slot-btn {
          padding: 12px 6px; 
          border-radius: 14px;
          border: 1.5px solid #ebd3bd; 
          background: white;
          font-size: 13px; 
          font-weight: 700; 
          color: #f7931e;
          cursor: pointer; 
          transition: all 0.25s ease;
          display: flex; 
          align-items: center; 
          justify-content: center;
        }

        .time-slot-btn:hover { 
          border-color: #f7931e; 
          background: #fffbf7; 
        }

        .time-slot-btn.selected { 
          background: #f7931e; 
          color: white; 
          border-color: #f7931e;
          box-shadow: 0 4px 10px rgba(247, 147, 30, 0.2);
        }

        .show-sessions-row {
          margin-top: 10px;
          display: flex;
          justify-content: center;
        }

        .show-sessions-btn {
          background: none;
          border: none;
          color: #f7931e;
          font-size: 14px;
          font-weight: 700;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s;
        }

        .show-sessions-btn:hover {
          color: #d87d15;
        }

        .no-date-selected-message {
          background: #fffbf7;
          border: 1.5px dashed #ebd3bd;
          border-radius: 12px;
          padding: 20px;
          min-height:80px;
          text-align: center;
          color: #a48c75;
          font-size: 14px;
          line-height: 1.6;
        }

        /* Right Sidebar Service Details */
       

        /* Booking Details Form */
       .booking-details-form-container{
  background:white;

  border:none;

  border-radius:24px;

  padding:32px;

  box-shadow:
    0 12px 40px rgba(0,0,0,.05);
}

        .form-back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #0a58a4;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          margin-bottom: 24px;
          transition: color 0.2s;
        }

        .form-back-btn:hover {
          color: #f7931e;
        }

        .booking-form { 
          display: flex; 
          flex-direction: column; 
          gap: 20px; 
        }

        .booking-form-row { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 20px; 
        }

        .booking-field { 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
        }

        .booking-field label { 
          font-size: 13px; 
          font-weight: 700; 
          color: #4a5568; 
        }

        .booking-input-wrap {
          display: flex; 
          align-items: center; 
          background: #fffcf9; 
          border: 1.5px solid #ebd3bd;
          border-radius: 8px; 
          transition: all 0.25s ease;
          padding-left: 12px;
        }

        .booking-input-wrap:focus-within { 
          border-color: #f7931e; 
          background: white; 
          box-shadow: 0 0 0 3px rgba(247, 147, 30, 0.08); 
        }

        .booking-input-wrap svg { 
          color: #a48c75; 
          flex-shrink: 0; 
        }

        .booking-input-wrap input { 
          flex: 1; 
          border: none; 
          background: transparent; 
          padding: 12px; 
          font-size: 14px; 
          color: #2d3748; 
          outline: none; 
        }

        .booking-readonly-input {
          display: flex;
          align-items: center;
          background: #edf2f7;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 13.5px;
          font-weight: 600;
          color: #4a5568;
        }

        .booking-select { 
          padding: 12px 14px; 
          background: #fffcf9; 
          border: 1.5px solid #ebd3bd; 
          border-radius: 8px; 
          font-size: 14px; 
          color: #2d3748; 
          outline: none; 
          transition: all 0.25s ease; 
          width: 100%; 
        }

        .booking-select:focus { 
          border-color: #f7931e; 
          background: white; 
        }

        .booking-textarea { 
          padding: 12px 14px; 
          background: #fffcf9; 
          border: 1.5px solid #ebd3bd; 
          border-radius: 8px; 
          font-size: 14px; 
          color: #2d3748; 
          outline: none; 
          resize: vertical; 
          width: 100%; 
          font-family: inherit; 
          transition: all 0.25s ease; 
        }

        .booking-textarea:focus { 
          border-color: #f7931e; 
          background: white; 
        }

        /* Success screen styling */
        .booking-confirmed-card { 
          background: white; 
          border: 1.5px solid #f3e6da; 
          border-radius: 20px;
          text-align: center; 
          padding: 60px 40px; 
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 4px 24px rgba(247, 147, 30, 0.05);
        }

        .confirmed-icon { 
          font-size: 72px; 
          margin-bottom: 24px; 
        }

        .confirmed-title { 
          font-size: 30px; 
          font-weight: 900; 
          color: #0a58a4; 
          font-family: 'Outfit', sans-serif; 
          margin-bottom: 12px; 
        }

        .confirmed-sub { 
          font-size: 16px; 
          color: #718096; 
          margin-bottom: 36px; 
        }

        .confirmed-details { 
          background: #fffcf9; 
          border: 1.5px solid #f3e6da;
          border-radius: 12px; 
          padding: 24px; 
          margin-bottom: 28px; 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          text-align: left; 
        }

        .confirmed-row { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          font-size: 15px; 
          color: #2d3748; 
        }

        .confirmed-row strong {
          color: #4a5568;
        }

        .confirmed-note { 
          font-size: 14.5px; 
          color: #718096; 
          margin-bottom: 32px; 
          line-height: 1.5;
        }

        .back-to-home-btn {
          padding: 14px 32px;
          background: #f7931e;
          color: white;
          border: none;
          border-radius: 99px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(247,147,30,0.25);
        }

        .back-to-home-btn:hover {
          background-color: #e57d09;
          transform: translateY(-2px);
        }

        .auth-spinner { 
          width: 20px; 
          height: 20px; 
          border: 2px solid rgba(255,255,255,0.3); 
          border-top-color: white; 
          border-radius: 50%; 
          display: inline-block;
          animation: spin 0.7s linear infinite; 
        }

        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }

        /* Why Consult Section */
        .why-consult-section {
          margin-top: 64px;
          padding-top: 48px;
          border-top: 1.5px solid #ebd3bd;
          text-align: center;
        }

        .why-consult-title {
          font-size: 32px;
          font-weight: 900;
          color: #0a58a4;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 48px;
          letter-spacing: -0.5px;
        }

        .why-consult-title .highlight-text {
          color: #f7931e;
        }

        .why-consult-stepper {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          max-width: 1000px;
          margin: 0 auto;
          gap: 8px;
        }

        .why-step-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 180px;
        }

        .why-step-img-container {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 2px solid #f7931e;
          padding: 4px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(247, 147, 30, 0.06);
        }

        .why-step-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .why-step-item:hover .why-step-img-container {
          transform: scale(1.06);
          border-color: #0a58a4;
          box-shadow: 0 6px 18px rgba(10, 88, 164, 0.12);
        }

        .why-step-desc {
          font-size: 13.5px;
          color: #718096;
          line-height: 1.5;
          margin-top: 16px;
          font-weight: 500;
        }

        .why-step-desc strong {
          color: #2d3748;
          font-weight: 700;
        }

        .why-step-connector {
          height: 1.5px;
          border-top: 2.5px dotted #ebd3bd;
          flex-grow: 1;
          margin-top: 60px;
          max-width: 80px;
        }

        /* Responsive styling */
        @media (max-width: 1024px) {
          .booking-grid {
            grid-template-columns: 1fr;
          }
          .booking-sidebar-card {
            position: static;
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .booking-datetime-picker {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .booking-form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .time-slots-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .why-consult-stepper {
            flex-direction: column;
            align-items: center;
            gap: 32px;
          }
          .why-step-connector {
            display: none;
          }
          .why-step-item {
            max-width: 260px;
          }
        }
      `}</style>
    </div>
  );
}
