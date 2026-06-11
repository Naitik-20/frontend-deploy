import { useEffect, useState } from 'react';
import BookingCalendarPage from './BookingCalendarPage';
import 'react-calendar/dist/Calendar.css';

const BACKEND_URL = 'https://dr-snoopy2.onrender.com';

const DEFAULT_CONSULTATION_ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    title: 'Book your appointment easily through our',
    highlight: 'online portal',
  },
  {
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop',
    title: 'Get a clear diagnosis and',
    highlight: 'customized treatment plan',
  },
  {
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop',
    title: 'Meet your doctor for a personalized health',
    highlight: 'consultation',
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop',
    title: 'Discuss symptoms and receive expert medical',
    highlight: 'guidance instantly',
  },
  {
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop',
    title: 'Begin your recovery with continuous',
    highlight: 'care and support',
  },
];

export default function OnlineConsultationPage({ onLoginClick }) {
  const [consultationItems, setConsultationItems] = useState(DEFAULT_CONSULTATION_ITEMS);

  useEffect(() => {
    let ignore = false;

    const fetchConsultationItems = async () => {
      try {
        const itemsRes = await fetch(`${BACKEND_URL}/api/online-consultations`);
        const itemsData = await itemsRes.json();

        if (!itemsRes.ok) {
          throw new Error(itemsData.message || 'Unable to load consultation items.');
        }

        if (!ignore) {
          setConsultationItems(Array.isArray(itemsData) && itemsData.length > 0 ? itemsData : DEFAULT_CONSULTATION_ITEMS);
        }
      } catch (error) {
        console.error('Error fetching online consultation items:', error);
        if (!ignore) {
          setConsultationItems(DEFAULT_CONSULTATION_ITEMS);
        }
      }
    };

    fetchConsultationItems();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="consult-page">
    

      <BookingCalendarPage onLoginClick={onLoginClick} />

      <div className="consult-process container">
        <h2 className="process-title">Why Consult With Dr. Snoopy?</h2>

        <div className="process-grid">
          {consultationItems.map((item, index) => (
            <div key={item._id || `${item.title}-${index}`} className="process-card">
              <div className="process-image-wrap">
                <img
                  src={item.image || DEFAULT_CONSULTATION_ITEMS[index % DEFAULT_CONSULTATION_ITEMS.length].image}
                  alt={item.title}
                />
                <div className="process-ring"></div>
              </div>

              <p>
                {item.title}
                <br />
                <span>{item.highlight}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .consult-page {
          background: var(--bg-main);
          min-height: 100vh;
        }

        .consult-hero {
          background: linear-gradient(135deg, #0d1b2a, #1a3a6a);
          padding: 72px 0 60px;
          text-align: center;
        }

        .consult-hero-inner {
          max-width: 700px;
          margin: 0 auto;
        }

        .consult-eyebrow {
          font-size: 13px;
          font-weight: 700;
          color: #fcd34d;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .consult-headline {
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 900;
          color: white;
          font-family: var(--font-headers);
          margin-bottom: 16px;
        }

        .consult-subhead {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255,255,255,0.7);
          max-width: 550px;
          margin: 0 auto;
        }

        .consult-process {
          padding: 30px 2rem 80px;
        }

        .process-title {
          text-align: center;
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 900;
          color: var(--text-dark);
          font-family: var(--font-headers);
          margin-bottom: 56px;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          align-items: start;
        }

        .process-card {
          text-align: center;
          position: relative;
        }

        .process-image-wrap {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto 20px;
        }

        .process-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid #f97316;
          position: relative;
          z-index: 2;
        }

        .process-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: #f1f5f9;
          z-index: 1;
        }

        .process-card p {
          font-size: 14px;
          color: var(--text-medium);
          line-height: 1.6;
          max-width: 180px;
          margin: auto;
        }

        .process-card span {
          font-weight: 800;
          color: var(--text-dark);
        }

        @media (max-width: 1200px) {
          .process-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px;
          }
        }

        @media (max-width: 640px) {
          .process-grid {
            grid-template-columns: 1fr;
          }

          .process-image-wrap {
            width: 120px;
            height: 120px;
          }

          .process-card p {
            max-width: 220px;
          }
        }
      `}</style>
    </div>
  );
}
