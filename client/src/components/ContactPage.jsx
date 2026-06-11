import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone:'', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  return (
//     <div className="contact-page">

//       {/* ── HERO ── */}
//       {/* <div className="contact-hero">
//         <div className="container">
//           <p className="contact-eyebrow">💬 We're Here For You</p>
//           <h1 className="contact-headline">Contact Us</h1>
//           <p className="contact-subhead">
//             Any question about your pet's health, orders, or services? We're happy to help!
//           </p>
//         </div>
//       </div> */}
// <div className="contact-header">
//     <span>Get In Touch</span>

//     <h1>Contact Us</h1>

//     <p>
//       Have a question about your pet's health,
//       orders, consultations, or products?
//       Our team is here to help.
//     </p>
//   </div>

//   <div className="contact-body container"></div>


      

//         {/* ── LEFT: Quick Contact Cards ── */}
//         <div className="contact-info-col">
//           <h2 className="contact-info-title">Get In Touch</h2>

//           {/* Phone — clickable */}
//           <a href="tel:+919876543210" className="contact-info-card contact-card-blue">
//             <div className="contact-info-icon-wrap">
//               <Phone size={26} />
//             </div>
//             <div>
//               <p className="contact-info-label">Call Us</p>
//               <p className="contact-info-value">+91 98765 43210</p>
//               <p className="contact-info-hint">Mon–Sat, 9am to 7pm IST</p>
//             </div>
//           </a>

//           {/* Email — clickable */}
//           <a href="mailto:support@drsnoopy.co.in" className="contact-info-card contact-card-green">
//             <div className="contact-info-icon-wrap">
//               <Mail size={26} />
//             </div>
//             <div>
//               <p className="contact-info-label">Email Us</p>
//               <p className="contact-info-value">support@drsnoopy.co.in</p>
//               <p className="contact-info-hint">We reply within 24 hours</p>
//             </div>
//           </a>

//           {/* WhatsApp — clickable */}
//           <a
//             href="https://wa.me/919876543210?text=Hi%20Dr.%20Snoopy%2C%20I%20have%20a%20query%20about%20my%20pet."
//             target="_blank" rel="noreferrer"
//             className="contact-info-card contact-card-whatsapp"
//           >
//             <div className="contact-info-icon-wrap">
//               <MessageSquare size={26} />
//             </div>
//             <div>
//               <p className="contact-info-label">WhatsApp</p>
//               <p className="contact-info-value">Chat with us</p>
//               <p className="contact-info-hint">Quick reply in minutes</p>
//             </div>
//           </a>

//           {/* Address — opens Google Maps */}
//           <a
//             href="https://www.google.com/maps/search/Eluru+Andhra+Pradesh+534002+India"
//             target="_blank" rel="noreferrer"
//             className="contact-info-card contact-card-orange"
//           >
//             <div className="contact-info-icon-wrap">
//               <MapPin size={26} />
//             </div>
//             <div>
//               <p className="contact-info-label">Visit Our Store</p>
//               <p className="contact-info-value">Eluru, Andhra Pradesh</p>
//               <p className="contact-info-hint">PIN: 534002 — Open in Maps ↗</p>
//             </div>
//           </a>

//           {/* Store Hours */}
//           <div className="store-hours-card">
//             <h4><Clock size={16}/> Store Hours</h4>
//             <div className="hours-row"><span>Mon – Fri</span><span>9:00 AM – 7:00 PM</span></div>
//             <div className="hours-row"><span>Saturday</span><span>9:00 AM – 5:00 PM</span></div>
//             <div className="hours-row"><span>Sunday</span><span className="closed">Closed</span></div>
//           </div>
//         </div>

//         {/* ── RIGHT: Contact Form ── */}
//         <div className="contact-form-col">
//           <div className="contact-form-card">
//             {!submitted ? (
//               <>
//                 <h2 className="contact-form-title">We'd Love To Hear From You</h2>
//                 <p className="contact-form-sub">Fill in the form and we'll get back to you within 24 hours.</p>

//                 <form className="contact-form" onSubmit={handleSubmit}>
//                   <div className="contact-form-row">
//                     <div className="contact-field">
//                       <label>Your Name *</label>
//                       <input
//                         type="text" required placeholder="Full name"
//                         value={form.name} onChange={e => setForm({...form, name: e.target.value})}
//                         className="contact-input"
//                       />
//                     </div>
//                     <div className="contact-field">
//                       <label>Email Address *</label>
//                       <input
//                         type="email" required placeholder="you@example.com"
//                         value={form.email} onChange={e => setForm({...form, email: e.target.value})}
//                         className="contact-input"
//                       />
//                     </div>
//                   </div>

//                   <div className="contact-field">
//     <label>Phone Number *</label>

//     <input
//       type="tel"
//       required
//       placeholder="+91 9876543210"
//       value={form.phone || ''}
//       onChange={e =>
//         setForm({
//           ...form,
//           phone: e.target.value
//         })
//       }
//       className="contact-input"
//     />
//   </div>

//                   <div className="contact-field">
                  
//                     <label>Subject</label>
//                     <select
//                       value={form.subject}
//                       onChange={e => setForm({...form, subject: e.target.value})}
//                       className="contact-select"
//                     >
//                       <option value="">Select a topic...</option>
//                       <option>Order Issue</option>
//                       <option>Product Query</option>
//                       <option>Grooming Appointment</option>
//                       <option>Vet Consultation</option>
//                       <option>Wholesale Inquiry</option>
//                       <option>Other</option>
//                     </select>
//                   </div>

//                   <div className="contact-field">
//                     <label>Your Message *</label>
//                     <textarea
//                       required placeholder="Tell us about your query or concern..."
//                       value={form.message} onChange={e => setForm({...form, message: e.target.value})}
//                       className="contact-textarea" rows={5}
//                     />
//                   </div>

//                   <button type="submit" className="contact-submit-btn" disabled={loading}>
//                     {loading
//                       ? <span className="contact-spinner"/>
//                       : <><Send size={16}/> Send Message</>
//                     }
//                   </button>
//                 </form>
//               </>
//             ) : (
//               /* Success State */
//               <div className="contact-success">
//                 <CheckCircle size={64} color="#16a34a" />
//                 <h3>Message Sent! 🎉</h3>
//                 <p>Thanks for reaching out, <strong>{form.name}</strong>! We'll reply to <strong>{form.email}</strong> within 24 hours.</p>
//                 <button
//                   className="contact-reset-btn"
//                   onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
//                 >
//                   Send Another Message
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Map embed */}
//           <div className="contact-map-wrap">
//             <a
//               href="https://www.google.com/maps/search/Eluru+Andhra+Pradesh+534002"
//               target="_blank" rel="noreferrer"
//               className="contact-map-link"
//             >
//               <div className="contact-map-placeholder">
//                 <MapPin size={36} />
//                 <p>Dr. Snoopy Pet Store</p>
//                 <p className="map-sub">Eluru, Andhra Pradesh 534002</p>
//                 <span className="map-cta">Open in Google Maps ↗</span>
//               </div>
//             </a>
//           </div>
//         </div>
<div className="contact-page">

  <div className="contact-container">

    <div className="contact-title-wrap">
      <span>GET IN TOUCH</span>
      <h1>Contact Us</h1>
      <p>
        Have questions about products, consultations,
        orders or your pet's healthcare?
      </p>
    </div>

    <div className="contact-top-section">

      <div className="contact-image-card">
        <img
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb"
          alt="Pet Care"
        />
      </div>

      <div className="contact-main-card">

        <h3>Dr. Snoopy Pet Care</h3>

        <div className="info-row">
          <Phone size={18}/>
          <span>+91 98765 43210</span>
        </div>

        <div className="info-row">
          <Mail size={18}/>
          <span>support@drsnoopy.co.in</span>
        </div>

        <div className="info-row">
          <MapPin size={18}/>
          <span>Eluru, Andhra Pradesh 534002</span>
        </div>

        <div className="info-row">
          <Clock size={18}/>
          <span>Mon-Sat • 9 AM - 7 PM</span>
        </div>

      </div>

    </div>

    <div className="contact-form-card">

      <h2>We'd Love To Hear From You</h2>

      <form>

        <div className="form-grid">

          <input placeholder="Your Name" />
          <input placeholder="Email Address" />

          <input placeholder="Phone Number" />
          <input placeholder="Subject" />

        </div>

        <textarea
          rows="6"
          placeholder="Tell us about your query..."
        />

        <button>
          Send Message
        </button>

      </form>

    </div>

    <div className="contact-mini-cards">

      <a href="tel:+919876543210" className="mini-card">
        <Phone size={20}/>
        <h4>Call Us</h4>
        <span>+91 98765 43210</span>
      </a>

      <a href="mailto:support@drsnoopy.co.in" className="mini-card">
        <Mail size={20}/>
        <h4>Email</h4>
        <span>support@drsnoopy.co.in</span>
      </a>

      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noreferrer"
        className="mini-card"
      >
        <MessageSquare size={20}/>
        <h4>WhatsApp</h4>
        <span>Chat with us</span>
      </a>

      <a
        href="https://www.google.com/maps/search/Eluru+Andhra+Pradesh+534002"
        target="_blank"
        rel="noreferrer"
        className="mini-card"
      >
        <MapPin size={20}/>
        <h4>Location</h4>
        <span>Open Maps</span>
      </a>

    </div>

  </div>


    

      <style>{`


// .contact-header{
//   text-align:center;

//   max-width:700px;

//   margin:0 auto;

//   padding:70px 20px 40px;
// }

// .contact-header span{
//   color:#f5a623;
//   font-weight:700;

//   text-transform:uppercase;
//   letter-spacing:.12em;

//   font-size:13px;
// }

// .contact-header h1{
//   font-family:'Playfair Display', serif;

//   color:#0b3d2e;

//   font-size:60px;

//   margin:12px 0;
// }

// .contact-header p{
//   color:#666;

//   line-height:1.8;

//   font-size:17px;
// }
//         .contact-page { background: var(--bg-main); min-height: 100vh; }

//         .contact-hero {
//           background: linear-gradient(135deg, #065f46, #059669);
//           padding: 64px 0 52px; text-align: center;
//         }

//         .contact-eyebrow { font-size: 13px; font-weight: 700; color: #a7f3d0; letter-spacing: 1px; margin-bottom: 12px; }
//         .contact-headline { font-size: clamp(32px, 5vw, 56px); font-weight: 900; color: white; font-family: var(--font-headers); margin: 0 0 14px; }
//         .contact-subhead { font-size: 16px; color: rgba(255,255,255,0.7); max-width: 480px; margin: 0 auto; line-height: 1.65; }

//         .contact-body {
//           display: grid; grid-template-columns: 420px 1fr;
//           gap: 40px; padding-top: 56px; padding-bottom: 80px;
//         }


//         .contact-form-card{
//   background:#fff;

//   border-radius:28px;

//   padding:40px;

//   box-shadow:
//     0 20px 50px rgba(0,0,0,.06);
// }

//         /* Info Column */
//        .contact-info-col{
//   display:grid;
//   grid-template-columns:repeat(2,1fr);
//   gap:18px;
// }
//         .contact-info-title { font-size: 20px; font-weight: 900; color: var(--text-dark); font-family: var(--font-headers); margin: 0 0 6px; }

      

//         .contact-info-card{
//   background:#fff;

//   border:none;

//   border-radius:20px;

//   padding:22px;

//   box-shadow:
//     0 10px 30px rgba(0,0,0,.05);

//   transition:.35s;
// }

// .contact-info-card:hover{
//   transform:translateY(-6px);
// }

        

//         .contact-info-card:hover { transform: translateX(6px); }
//         .contact-card-blue:hover { border-color: #3b82f6; box-shadow: 0 8px 24px rgba(59,130,246,0.12); }
//         .contact-card-green:hover { border-color: #22c55e; box-shadow: 0 8px 24px rgba(34,197,94,0.12); }
//         .contact-card-whatsapp:hover { border-color: #25d366; box-shadow: 0 8px 24px rgba(37,211,102,0.12); }
//         .contact-card-orange:hover { border-color: #f97316; box-shadow: 0 8px 24px rgba(249,115,22,0.12); }

//         .contact-info-icon-wrap {
//          background:#fff8ea !important;
//   color:#f5a623 !important;
//           width: 52px; height: 52px; border-radius: 13px;
//           display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0; transition: all 0.3s;
//         }

       
      

//         .contact-info-label { font-size: 11px; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 3px; }
//         .contact-info-value { font-size: 15px; font-weight: 800; color: var(--text-dark); margin: 0 0 3px; }
//         .contact-info-hint { font-size: 12px; color: var(--text-light); margin: 0; }

//         /* Store Hours */
//         .store-hours-card {
//           background: white; border-radius: 20px; padding: 20px;
//             box-shadow:
//     0 10px 30px rgba(0,0,0,.05);
//           border: none;
//         }

//         .store-hours-card h4 {
//           display: flex; align-items: center; gap: 8px;
//           font-size: 14px; font-weight: 800; color: var(--text-dark); margin: 0 0 14px;
//         }

//         .hours-row {
//           display: flex; justify-content: space-between;
//           font-size: 13px; color: var(--text-medium); padding: 6px 0;
//           border-bottom: 1px solid var(--border-light);
//         }

//         .hours-row:last-child { border-bottom: none; }
//         .hours-row span:first-child { font-weight: 600; }
//         .closed { color: #ef4444; font-weight: 700; }

//         /* Form Column */
//         .contact-form-col { display: flex; flex-direction: column; gap: 24px; }

//         // .contact-form-card {
//         //   background: white; border-radius: var(--radius-lg);
//         //   border: 1.5px solid var(--border-light); padding: 36px;
//         //   box-shadow: var(--shadow-sm);
//         // }

        

//         .contact-form-title { font-size: 22px; font-weight: 900; color: var(--text-dark); font-family: var(--font-headers); margin: 0 0 6px; }
//         .contact-form-sub { font-size: 14px; color: var(--text-medium); margin: 0 0 28px; }

//         .contact-form { display: flex; flex-direction: column; gap: 20px; }
//         .contact-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//         .contact-field { display: flex; flex-direction: column; gap: 6px; }
//         .contact-field label { font-size: 13px; font-weight: 700; color: var(--text-dark); }

//         .contact-input, .contact-select, .contact-textarea {
//           width: 100%; 
//           background:#faf7f2;

//   border:none;

//   border-radius:14px;

//   padding:14px 18px; font-size: 14px; color: var(--text-dark);
//           outline: none; transition: var(--transition-smooth); font-family: inherit;
//         }

//         .contact-input:focus, .contact-select:focus, .contact-textarea:focus {
//           border-color: var(--primary-color);  background:white;

//   box-shadow:
//     0 0 0 3px rgba(245,166,35,.15);
//         }

//         .contact-textarea { resize: vertical; }

//         .contact-submit-btn {
//           width: 100%; padding: 14px; background:linear-gradient(
//     135deg,
//     #0b3d2e,
//     #145544
//   );

//   border-radius:16px;

//   padding:16px;

//   font-weight:700;

//   box-shadow:
//     0 12px 30px rgba(11,61,46,.25);
//      color: white;
//           border: none;  font-size: 16px;
//           cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
//           transition: var(--transition-smooth); 
//         }

//         .contact-submit-btn:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-3px); }
//         .contact-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

//         .contact-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: cspin 0.7s linear infinite; }
//         @keyframes cspin { to { transform: rotate(360deg); } }

//         /* Success */
//         .contact-success {
//           text-align: center; padding: 48px 24px;
//           display: flex; flex-direction: column; align-items: center; gap: 16px;
//         }

//         .contact-success h3 { font-size: 26px; font-weight: 900; color: var(--text-dark); font-family: var(--font-headers); }
//         .contact-success p { font-size: 15px; color: var(--text-medium); line-height: 1.65; }

//         .contact-reset-btn {
//           padding: 12px 28px; background: var(--primary-color); color: white;
//           border: none; border-radius: var(--radius-sm); font-size: 14px; font-weight: 700;
//           cursor: pointer; transition: var(--transition-smooth);
//         }

//         .contact-reset-btn:hover { background: var(--primary-hover); }

//         /* Map */
//         .contact-map-wrap {
//           border-radius: 14px; overflow: hidden;
//           border: 1.5px solid var(--border-light); box-shadow: var(--shadow-sm);
//         }

//         .contact-map-link { display: block; text-decoration: none; }

//         .contact-map-placeholder {
//          background:
//     linear-gradient(
//       135deg,
//       #fff8ea,
//       #faf7f2
//     );

//   min-height:260px;

//           padding: 48px 24px; text-align: center;
//           display: flex; flex-direction: column; align-items: center; gap: 10px;
//           transition: all 0.3s;
//         }

//         .contact-map-link:hover .contact-map-placeholder { background: linear-gradient(135deg, #bae6fd, #7dd3fc); }

//         .contact-map-placeholder svg { color: var(--primary-color); }
//         .contact-map-placeholder p { font-size: 18px; font-weight: 800; color: var(--text-dark); margin: 0; }
//         .map-sub { font-size: 14px; color: var(--text-medium); font-weight: 500 !important; }

//         .map-cta {
//           display: inline-block; margin-top: 8px;
//          background:#0b3d2e; color: white;
//           padding: 10px 24px; border-radius: 8px;
//           font-size: 14px; font-weight: 800;
//           transition: all 0.3s;
//         }

//         .contact-map-link:hover .map-cta { background: var(--primary-hover); }

//         @media (max-width: 900px) {
//           .contact-body { grid-template-columns: 1fr; }
//           .contact-form-row { grid-template-columns: 1fr; }
//         }


.contact-page{
  background:#f6efe6;
  min-height:100vh;
  padding:80px 20px;
}

.contact-container{
  max-width:1200px;
  margin:auto;
}

.contact-title-wrap{
  text-align:center;
  margin-bottom:60px;
}

.contact-title-wrap span{
  color:#f5a623;
  font-size:13px;
  font-weight:700;
  letter-spacing:.15em;
}

.contact-title-wrap h1{
  font-family:'Playfair Display',serif;
  font-size:64px;
  color:#0b3d2e;
  margin:15px 0;
}

.contact-title-wrap p{
  max-width:600px;
  margin:auto;
  color:#666;
  line-height:1.8;
}

.contact-top-section{
  display:grid;
  grid-template-columns:1.2fr .8fr;
  gap:30px;
  margin-bottom:40px;
}

.contact-image-card,
.contact-main-card,
.contact-form-card,
.mini-card{
  background:white;
  border-radius:24px;
  box-shadow:0 15px 40px rgba(0,0,0,.05);
}

.contact-image-card{
  overflow:hidden;
}

.contact-image-card img{
  width:100%;
  height:100%;
  min-height:340px;
  object-fit:cover;
}

.contact-main-card{
  padding:35px;
}

.contact-main-card h3{
  color:#0b3d2e;
  font-size:28px;
  margin-bottom:25px;
}

.info-row{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:18px;
  color:#555;
}

.contact-form-card{
  padding:40px;
  margin-bottom:40px;
}

.contact-form-card h2{
  color:#0b3d2e;
  margin-bottom:25px;
}

.form-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
  margin-bottom:18px;
}

.contact-form-card input,
.contact-form-card textarea{
  width:100%;
  border:none;
  background:#faf7f2;
  border-radius:14px;
  padding:16px;
  font-size:15px;
}

.contact-form-card textarea{
  margin-bottom:20px;
}

.contact-form-card button{
  background:#0b3d2e;
  color:white;
  border:none;
  border-radius:14px;
  padding:16px 34px;
  cursor:pointer;
  font-weight:600;
}

.contact-mini-cards{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:20px;
}

.mini-card{
  text-decoration:none;
  color:#222;
  padding:25px;
  text-align:center;
  transition:.3s;
}

.mini-card:hover{
  transform:translateY(-8px);
}

.mini-card svg{
  color:#f5a623;
  margin-bottom:12px;
}

.mini-card h4{
  margin-bottom:8px;
  color:#0b3d2e;
}

.mini-card span{
  font-size:14px;
  color:#666;
}

@media(max-width:900px){

  .contact-top-section{
    grid-template-columns:1fr;
  }

  .contact-mini-cards{
    grid-template-columns:repeat(2,1fr);
  }

  .form-grid{
    grid-template-columns:1fr;
  }

  .contact-title-wrap h1{
    font-size:48px;
  }
}

@media(max-width:600px){

  .contact-mini-cards{
    grid-template-columns:1fr;
  }
}
      `}</style>
    </div>
  );
}
