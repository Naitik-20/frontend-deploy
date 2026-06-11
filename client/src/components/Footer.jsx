import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
} from 'lucide-react';

// ==========================================================
// FOOTER COMPONENT
// Ye page ke bilkul bottom mein rehta hai.
// Isme koi props nahi chahiye — yeh static content hai.
// Static = jo kabhi change nahi hota, hardcoded hai.
// ==========================================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const shopCategories = [
    { label: 'Pharmacy', path: '/category/Pharmacy' },
    { label: 'Food', path: '/category/Food' },
    { label: 'Snacks &         Treats', path: '/category/Snacks & Treats' },
    { label: 'Grooming Essentials', path: '/category/Grooming Essentials' },
    { label: 'Accessories', path: '/category/Accessories' },
    { label: 'Toys', path: '/category/Toys' },
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/shop' },
    { label: 'Services', path: '/services' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const policies = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms' },
  { label: 'Shipping Policy', path: '/shipping-policy' },
  { label: 'Refund Policy', path: '/refund-policy' },
];

  const topBrands = ['Royal Canin', 'Pedigree', 'Drools', 'Whiskas', 'Himalaya', 'Purepet'];

  return (
    <footer className="site-footer">

      {/* ── STATS BAR ── */}
      
      
      {/* ── MAIN FOOTER BODY ── */}
      <div className="footer-body container">

        {/* Column 1: Brand */}
        <div className="footer-col footer-brand-col">
          <div className="footer-logo">
            <span className="footer-logo-icon">🐾</span>
            <div>
              <span className="footer-logo-dr">Dr.</span>
              <span className="footer-logo-snoopy">Snoopy</span>
            </div>
          </div>
          <p className="footer-tagline">
            Your trusted pet store in Eluru. Premium pet food, veterinary consultation, grooming
            services, and pet supplies — all in one place.
          </p>

          {/* Social Icons */}
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
              <Facebook size={17} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="YouTube">
              <Youtube size={17} />
            </a>
          </div>
        </div>

        {/* Column 2: Shop Categories */}
        <div className="footer-col">
          <h4 className="footer-col-title">Shop</h4>
          <ul className="footer-link-list">
            {shopCategories.map((cat) => (
              <li key={cat.label}>
                <Link to={cat.path} className="footer-link">
                  <ArrowRight size={12} />
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-link-list">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="footer-link">
                  <ArrowRight size={12} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h4 className="footer-col-title" style={{ marginTop: '24px' }}>Top Brands</h4>
          <ul className="footer-link-list">
            {topBrands.map((brand) => (
              <li key={brand}>
                <Link to={`/category/${brand}`} className="footer-link">
                  <ArrowRight size={12} />
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
        </div>


{/* Policies */}
<div className="footer-col">
  <h4 className="footer-col-title">Policies</h4>

  <ul className="footer-link-list">
    {policies.map((policy) => (
      <li key={policy.label}>
        <Link to={policy.path} className="footer-link">
          <ArrowRight size={12} />
          {policy.label}
        </Link>
      </li>
    ))}
  </ul>
</div>

        {/* Column 4: Contact */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact Us</h4>
          <ul className="footer-contact-list">
            <li>
              <MapPin size={15} className="contact-icon" />
              <span>Eluru, Andhra Pradesh, India – 534002</span>
            </li>
            <li>
              <Phone size={15} className="contact-icon" />
              <a href="tel:+919876543210" className="footer-link">+91 98765 43210</a>
            </li>
            <li>
              <Mail size={15} className="contact-icon" />
              <a href="mailto:support@drsnoopy.co.in" className="footer-link">
                support@drsnoopy.co.in
              </a>
            </li>
          </ul>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <p className="newsletter-label">Get deals in your inbox</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Go</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner container">
          <p className="footer-copyright">
            © {currentYear} Dr. Snoopy Pet Store. All rights reserved.
          </p>
        <div className="footer-bottom-links">

  <Link to="/privacy-policy" className="footer-bottom-link">
    Privacy Policy
  </Link>

  <Link to="/terms" className="footer-bottom-link">
    Terms of Service
  </Link>

  <Link to="/refund-policy" className="footer-bottom-link">
    Refund Policy
  </Link>

</div>
        </div>
      </div>

      {/* ── STYLES ── */}
      <style>{`
        .site-footer {
          background: #050d08;
          color: white;
          margin-top: auto;
        }

        /* Stats bar */
        .footer-stats-bar {
          background: var(--primary-color);
          padding: 20px 0;
        }

        .footer-stats-inner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .stat-emoji {
          font-size: 28px;
          line-height: 1;
        }

        .stat-number {
          font-size: 16px;
          font-weight: 800;
          color: white;
          font-family: var(--font-headers);
          margin: 0;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.75);
          margin: 2px 0 0;
        }

        /* Footer body */
        .footer-body {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          gap: 40px;
          padding-top: 56px;
          padding-bottom: 56px;
        }

        /* Brand column */
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .footer-logo-icon {
          font-size: 32px;
        }

        .footer-logo-dr {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-logo-snoopy {
          display: block;
          font-size: 24px;
          font-weight: 850;
          color: white;
          font-family: var(--font-headers);
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .footer-tagline {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          margin-bottom: 24px;
        }

        .footer-socials {
          display: flex;
          gap: 10px;
        }

        .social-btn {
          width: 38px;
          height: 38px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .social-btn:hover {
          background: var(--secondary-color);
          transform: translateY(-2px);
        }

        /* Column links */
        .footer-col-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 16px;
        }

        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .footer-link:hover {
          color: var(--secondary-color);
          padding-left: 4px;
        }

        /* Contact column */
        .footer-contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 28px;
        }

        .footer-contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          line-height: 1.5;
        }

        .contact-icon {
          color: var(--secondary-color);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Newsletter */
        .footer-newsletter {
          background: rgba(255,255,255,0.05);
          border-radius: var(--radius-md);
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .newsletter-label {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          margin-bottom: 10px;
        }

        .newsletter-form {
          display: flex;
          gap: 8px;
        }

        .newsletter-input {
          flex: 1;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-sm);
          padding: 9px 12px;
          font-size: 13px;
          color: white;
          outline: none;
          transition: var(--transition-smooth);
        }

        .newsletter-input::placeholder {
          color: rgba(255,255,255,0.35);
        }

        .newsletter-input:focus {
          border-color: var(--secondary-color);
          background: rgba(255,255,255,0.15);
        }

        .newsletter-btn {
          background: var(--secondary-color);
          color: white;
          border: none;
          padding: 9px 18px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .newsletter-btn:hover {
          background: var(--secondary-hover);
        }

        /* Bottom bar */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .footer-bottom-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          padding-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-copyright {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }

        .footer-bottom-links {
          display: flex;
          gap: 20px;
        }

        .footer-bottom-link {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .footer-bottom-link:hover {
          color: rgba(255,255,255,0.8);
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .footer-stats-inner {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-body {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }

          .footer-brand-col {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .footer-stats-inner {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .stat-number {
            font-size: 14px;
          }

          .footer-body {
            grid-template-columns: 1fr;
          }

          .footer-brand-col {
            grid-column: auto;
          }

          .footer-bottom-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </footer>
  );
}
