import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bath,
  CheckCircle,
  Clock,
  Scissors,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

const BACKEND_URL = 'https://dr-snoopy2.onrender.com';

const SERVICE_ICONS = [Scissors, Stethoscope, Bath, Sparkles];
const SERVICE_ICON_BY_SLUG = {
  grooming: Scissors,
  consultation: Stethoscope,
  spa: Bath,
  styling: Sparkles,
};

const WHY_ITEMS = [
  {
    icon: '01',
    title: 'Certified Groomers',
    desc: 'Professionally trained, breed-expert groomers with 5+ years experience.',
  },
  {
    icon: '02',
    title: 'BVSC Vets',
    desc: 'All consultations are handled by licensed veterinarians only.',
  },
  {
    icon: '03',
    title: 'Safe Products',
    desc: 'Only pet-safe, chemical-free grooming products are used.',
  },
  {
    icon: '04',
    title: 'Easy Booking',
    desc: 'Book a slot online in under 60 seconds. Cancel anytime.',
  },
];

const formatPrice = (price) => `Rs. ${Number(price || 0).toFixed(0)}`;

const getServiceIcon = (service, index) =>
  SERVICE_ICON_BY_SLUG[service.slug] || SERVICE_ICONS[index % SERVICE_ICONS.length];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${BACKEND_URL}/api/services`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Unable to load services.');
        }

        if (!ignore) {
          setServices(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        if (!ignore) {
          setError('Services are unavailable right now. Please try again shortly.');
          setServices([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="services-hero-inner container">
          <p className="services-eyebrow">Premium Pet Care</p>
          <h1 className="services-headline">Our Services</h1>
          <p className="services-subhead">
            Professional grooming, expert vet consultation and spa treatments,
            all under one roof. Trusted by pet parents across India.
          </p>
        </div>
      </div>

      <div className="services-grid-wrap container">
        {loading ? (
          <div className="services-state">Loading services...</div>
        ) : error ? (
          <div className="services-state error">{error}</div>
        ) : services.length === 0 ? (
          <div className="services-state">No services are available right now.</div>
        ) : (
          <div className="services-grid">
            {services.map((svc, index) => {
              const Icon = getServiceIcon(svc, index);
              const serviceSlug = svc.slug || svc._id;
              return (
                <div
                  key={svc._id || serviceSlug}
                  className="service-card"
                  style={{
                    '--svc-color': svc.color || '#0a58a4',
                    '--svc-bg': svc.bg || '#eff6ff',
                  }}
                >
                  <div className="svc-icon-wrap">
                    {svc.image ? (
                      <img src={`${BACKEND_URL}${svc.image}`} alt={svc.title} className="svc-image" />
                    ) : (
                      <Icon size={32} />
                    )}
                  </div>

                  <div className="svc-meta">
                    <span className="svc-price">{formatPrice(svc.price)}</span>
                    {svc.duration && (
                      <span className="svc-duration">
                        <Clock size={12} /> {svc.duration}
                      </span>
                    )}
                  </div>

                  <h2 className="svc-title">{svc.title}</h2>
                  <p className="svc-desc">{svc.description}</p>

                  {svc.features?.length > 0 && (
                    <ul className="svc-features">
                      {svc.features.map((feature) => (
                        <li key={feature}>
                          <CheckCircle size={14} /> {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link to={`/online-consultation/${serviceSlug}`} className="svc-book-btn">
                    Book Now <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="services-why container">
        <h2 className="services-why-title">Why Choose Dr. Snoopy?</h2>
        <div className="services-why-grid">
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="why-card">
              <span className="why-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .services-page { background: var(--bg-main); min-height: 100vh; }

        .services-hero {
          background: linear-gradient(135deg, #0d1b2a, #1a3a6a);
          padding: 72px 0 60px;
          text-align: center;
        }

        .services-hero-inner { max-width: 650px; margin: 0 auto; }
        .services-eyebrow { font-size: 13px; font-weight: 700; color: #fcd34d; letter-spacing: 1px; margin-bottom: 12px; text-transform: uppercase; }
        .services-headline { font-size: clamp(32px, 5vw, 56px); font-weight: 900; color: white; font-family: var(--font-headers); margin: 0 0 16px; }
        .services-subhead { font-size: 16px; color: rgba(255,255,255,0.65); line-height: 1.7; max-width: 500px; margin: 0 auto; }

        .services-grid-wrap { padding: 64px 2rem; }
        .services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }

        .services-state {
          background: white;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-medium);
          font-size: 15px;
          font-weight: 700;
          padding: 28px;
          text-align: center;
        }

        .services-state.error { color: #b91c1c; }

        .service-card {
          background: white; border-radius: 20px;
          border: 2px solid var(--border-light);
          padding: 32px 28px;
          box-shadow: var(--shadow-sm);
          transition: all 0.35s;
          display: flex; flex-direction: column; gap: 14px;
        }

        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.1);
          border-color: var(--svc-color);
        }

        .svc-icon-wrap {
          width: 68px; height: 68px; border-radius: 18px;
          background: var(--svc-bg); color: var(--svc-color);
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition-smooth);
          overflow: hidden;
        }

        .service-card:hover .svc-icon-wrap {
          background: var(--svc-color); color: white;
          transform: scale(1.1) rotate(-5deg);
        }

        .svc-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .service-card:hover .svc-icon-wrap:has(.svc-image) {
          background: var(--svc-bg);
          color: var(--svc-color);
        }

        .svc-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .svc-price { font-size: 22px; font-weight: 900; color: var(--svc-color); font-family: var(--font-headers); }
        .svc-duration { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--text-light); font-weight: 600; }

        .svc-title { font-size: 22px; font-weight: 900; color: var(--text-dark); font-family: var(--font-headers); margin: 0; }
        .svc-desc { font-size: 14px; color: var(--text-medium); line-height: 1.65; margin: 0; }

        .svc-features {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }

        .svc-features li {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600; color: var(--text-medium);
        }

        .svc-features li svg { color: var(--svc-color); flex-shrink: 0; }

        .svc-book-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--svc-color); color: white;
          text-decoration: none; padding: 13px 24px;
          border-radius: var(--radius-sm); font-size: 14px; font-weight: 800;
          transition: all 0.3s; margin-top: auto;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        }

        .svc-book-btn:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        .services-why { padding: 0 2rem 64px; }
        .services-why-title { font-size: clamp(22px, 3vw, 34px); font-weight: 900; color: var(--text-dark); font-family: var(--font-headers); margin-bottom: 32px; }
        .services-why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

        .why-card {
          background: white; border-radius: var(--radius-md); padding: 24px 20px;
          border: 1.5px solid var(--border-light); text-align: center;
          transition: var(--transition-smooth);
        }

        .why-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--secondary-color); }

        .why-icon {
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          border-radius: 50%;
          background: #fff7ed;
          color: var(--secondary-color);
          font-size: 14px;
          font-weight: 900;
        }

        .why-card h3 { font-size: 16px; font-weight: 800; color: var(--text-dark); margin-bottom: 8px; }
        .why-card p { font-size: 13px; color: var(--text-medium); line-height: 1.6; margin: 0; }

        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr; }
          .services-why-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .services-grid-wrap,
          .services-why { padding-left: 1rem; padding-right: 1rem; }
          .services-why-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
