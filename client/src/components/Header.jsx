
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import {
  ShoppingCart, Search, Menu, X, User, LogOut, ChevronDown, ChevronRight,
} from 'lucide-react';
import { getCategories } from '../services/categoryService';
import logoSrc from '../uploads/logo.png';

export default function Header({
  searchTerm, setSearchTerm, cartCount, onCartClick, onLoginClick, user, onLogout,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [shopOpen, setShopOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [breeds, setBreeds] = useState([]);
const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const userRef = useRef(null);
  const timeoutRef = useRef();
  const location = useLocation();

  const openMegaMenu = () => {
  clearTimeout(timeoutRef.current);
  setShopOpen(true);
};

const closeMegaMenu = () => {
  timeoutRef.current = setTimeout(() => {
    setShopOpen(false);
  }, 250);
};

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleOut = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleOut);
    return () => document.removeEventListener('mousedown', handleOut);
  }, []);

  useEffect(() => {
  fetch("https://dr-snoopy2.onrender.com/api/breeds")
    .then(res => res.json())
    .then(data => setBreeds(data))
    .catch(console.error);
}, []);

  const close = () => { setIsMobileMenuOpen(false); setActiveMobileCategory(null); };

  const handleSearchSubmit = (e) => { e.preventDefault(); navigate('/shop'); };

  // ── NAV LINKS (matching drsnoopy.co.in exactly)
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/shop' },
    { label: 'Services', path: '/services' },
    { label: 'Online Consultation', path: '/consultation' },
    { label: 'Contact', path: '/contact' },
  ];

  // ── MEGA MENU (matching drsnoopy.co.in exactly)
  const defaultMegaCategories = [
    { label: 'Pharmacy', path: '/category/Pharmacy', icon: '💊', sub: ['Prescription Diet','Dewormer','Tick & Flea','Skin Care','Joint Care','Gut Health','Cardiac Care','Kidney Care','Liver Care','Eye & Ear Care','Vitamins & Supplements','Pain Medication','Anti-biotics','Oral Care','Wound Care','Calming Aids'] },
    { label: 'Food', path: '/category/Food', icon: '🍖', sub: ['Dry Food','Wet Food','Puppy Food','Grain Free Food','Baked Dry Food','Veg Dog Food','Premium Dog Food','Kitten Food'] },
    { label: 'Snacks & Treats', path: '/category/Snacks & Treats', icon: '🦴', sub: ['Biscuits & Cookies','Bones & Chews','Dental Treats','Jerky Treats','Training Treats','Creamy Treats','Ice Creams','Biryanis'] },
    { label: 'Grooming Essentials', path: '/category/Grooming Essentials', icon: '✂️', sub: ['Shampoos & Conditioners','Tick & Flea Solutions','Brushes & Combs','Grooming Essentials','Trimmers & Nail Clippers','Paw & Nail care','Oral Care','Deodorants & Perfumes','Towels & Wipes','Diapers & Training Pads','Cleaning & Waste Disposal','Pet Safe Cleaners'] },
    { label: 'Accessories', path: '/category/Accessories', icon: '🎀', sub: ['Collars','Leashes','Harnesses','Bowls & Feeders','Bedding','Clothing','Carriers & Travel Supplies','Cages & Crates'] },
    { label: 'Toys', path: '/category/Toys', icon: '🎾', sub: ['Cat Teasers','Ball & Chaser Toys','Catnip Toys','Cat Trees & Scratchers','Chew Toys','Smart & Interactive Toys','Plush & Soft Toys','Rope & Tug Toys','Ball & Fetch Toys','Squeaky Toys'] },
    { label: 'Species', path: '/category/species', icon: '🐾', sub: ['Dogs','Cats','Birds','Large Animals','Others'] },
    { label: 'Brand', path: '/brand', icon: '⭐', sub: ['Royal Canin','Pedigree','Drools','Pedigree Pro','Focus','Whiskas','Meo','Purepet','Grain Zero','Fidel','Pet Star','Himalaya','Vet Pro','Jerhigh','Canine Creek','Bowlers','Moochie','Supercoat','N & D','Orijen','Dr Snoopy'] },
  ];

  useEffect(() => {
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (!ignore) {
  setDynamicCategories(data);
  setCategories(data);
}
      } catch {
        setDynamicCategories([]);
      }
    };

    fetchCategories();
    return () => { ignore = true; };
  }, []);

  const megaCategories = dynamicCategories.length > 0 ? dynamicCategories : defaultMegaCategories;
  const userRole = (user?.role || '').toLowerCase();
  const isAdminUser = userRole === 'admin';
  const isWholesalerUser = userRole === 'wholesaler' || userRole === 'wholeseller' || user?.isWholesaler;
  const profilePath = isWholesalerUser ? '/wholesaler/profile' : '/profile';
  const accountLabel = isAdminUser ? 'Admin Dashboard' : isWholesalerUser ? 'Wholesaler Profile' : 'My Profile';
  const accountSubLabel = isAdminUser ? 'Admin Account' : isWholesalerUser ? 'Wholesaler Account' : 'My Account';
  const displayName = user?.name || user?.shopName || user?.email || 'User';
  const shortName = displayName.split(' ')[0];
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const openAdminDashboard = () => {
  const token = localStorage.getItem('token');
  const CLIENT_URL =
    import.meta.env.VITE_CLIENT_URL ||
    'https://your-client-vercel-url.vercel.app';

  window.location.href = token
    ? `${CLIENT_URL}/?token=${encodeURIComponent(token)}`
    : `${CLIENT_URL}/`;
};

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <>
      {/* ════════════════════════════════════
          TIER 1 — BLUE TOP BAR
          (Logo | Search | Cart + Login)
          Matches drsnoopy.co.in top header
      ════════════════════════════════════ */}
    <header className="modern-header">
  <div className="modern-header-inner">

    {/* Logo */}
    <Link to="/" className="modern-logo">
      <img
        src={logoSrc}
        alt="Dr Snoopy"
      />
    </Link>

    {/* Navigation */}
    <nav className="modern-nav">
      <Link
  to="/"
  className={`modern-nav-link ${
    location.pathname === "/" ? "active" : ""
  }`}
>
  Home
</Link>

     <div
  className="shop-menu-wrapper"
   onMouseEnter={openMegaMenu}
  onMouseLeave={closeMegaMenu}
>
 <Link
  to="/shop"
  className={`modern-nav-link ${
    location.pathname.startsWith("/shop")
      ? "active"
      : ""
  }`}
>
  Shop <ChevronDown size={14}/>
</Link>

  {shopOpen && (
    <div className="shop-mega-menu">

      {/* SHOP BY PET */}
      <div>
        <h4 className="mega-title">
          SHOP BY PET
        </h4>

        {breeds.map((pet) => (
          <div
            key={pet._id}
            className="mega-item"
             onMouseEnter={() => setSelectedItem(pet)}
          >
            {pet.name}
          </div>
        ))}
      </div>

      {/* SHOP BY CATEGORY */}
      <div>
        <h4 className="mega-title">
          SHOP BY CATEGORY
        </h4>

        {categories.map((cat) => (
          <div
            key={cat._id}
            className="mega-item"
             onMouseEnter={() => setSelectedItem(cat)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* DRILLDOWN PANEL */}
      <div className="drill-panel">
  <h4>{selectedItem?.name}</h4>

  {selectedItem?.subcategories?.map(sub => (
    <div
      key={sub}
      className="drill-subcategory"
    >
      {sub}
    </div>
  ))}

  {selectedItem?.image && (
    <div className="drill-preview">
      <img src={selectedItem.image} alt={selectedItem.name} />

      <div className="drill-preview-content">
        <h5>{selectedItem.name}</h5>
        <p>Explore products</p>
      </div>
    </div>
  )}
</div>

    </div>
  )}
</div>

     <Link
  to="/consultation"
  className={`modern-nav-link ${
    location.pathname === "/consultation"
      ? "active"
      : ""
  }`}
>
  Doctor Consultation
</Link>

    <Link
  to="/about"
  className={`modern-nav-link ${
    location.pathname === "/about"
      ? "active"
      : ""
  }`}
>
  About Us
</Link>

     <Link
  to="/contact"
  className={`modern-nav-link ${
    location.pathname === "/contact"
      ? "active"
      : ""
  }`}
>
  Contact
</Link>

     
    </nav>

    {/* Search */}
    <form
      className="modern-search"
      onSubmit={handleSearchSubmit}
    >
      <Search size={16} />
      <input
        type="text"
        placeholder="I'm searching for..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>

    {/* Actions */}
    <div className="modern-actions">

      <button className="modern-icon-btn">
        ♡
      </button>

      <button
        className="modern-icon-btn"
        onClick={onCartClick}
      >
        <ShoppingCart size={18} />
      </button>

      {user ? (
        // <button className="modern-icon-btn"
        //  onClick={() => navigate("/profile")}
        //  >
        //   <User size={18} />
        // </button>

        <div
  className="user-menu-wrapper"
  ref={userRef}
>
  <button
    className="modern-icon-btn"
    onClick={() =>
      setIsUserDropdownOpen(!isUserDropdownOpen)
    }
  >
    <User size={18}/>
  </button>

  {isUserDropdownOpen && (
    <div className="user-dropdown">

      <button
        onClick={() => {
          navigate("/profile");
          setIsUserDropdownOpen(false);
        }}
      >
        My Profile
      </button>

      <button
        onClick={() => {
          onLogout();
          setIsUserDropdownOpen(false);
        }}
      >
        Logout
      </button>

    </div>
  )}
</div>
      ) : (
        <button
         className="logout-btn"
          className="modern-icon-btn"
          onClick={onLoginClick}
        >
          <User size={18} />
        </button>
      )}
    </div>

  </div>
</header>

      {/* ════════════════════════════════════
          ALL STYLES
      ════════════════════════════════════ */}
      <style>{`
//       .modern-header{
//   background:#f6efe6;
//   border-bottom:1px solid #eee;
//   position:sticky;
//   top:0;
//   z-index:999;
// }


/* mega menu */
/* =========================
   SHOP MEGA MENU
========================= */
.shop-menu-wrapper::after{
  content:"";
  position:absolute;
  top:100%;
  left:0;

  width:100%;
  height:25px;
}

.logout-btn{
  color:#dc2626 !important;
  border-top:1px solid #f1f1f1 !important;
}

.logout-btn:hover{
  background:#fef2f2 !important;
  color:#b91c1c !important;
}

.shop-menu-wrapper{
  position:relative;
  display:flex;
  align-items:center;
}

.shop-mega-menu{
  position:absolute;
  top:calc(100% + 18px);
  left:50%;

  width:780px;

  background:rgba(255,255,255,.88);
  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);

  border:1px solid rgba(11,61,46,.08);

  border-radius:24px;

  padding:28px;

  display:grid;
  grid-template-columns:1fr 1fr 1.2fr;
  gap:28px;

  box-shadow:
    0 24px 60px rgba(0,0,0,.10);

  z-index:1000;

  animation:megaFade .25s ease;
}

@keyframes megaFade{
  from{
    opacity:0;
    transform:translateY(12px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

/* =========================
   TITLES
========================= */

.mega-title{
  font-size:12px;
  font-weight:800;
  letter-spacing:.12em;
  text-transform:uppercase;

  color:#f5a623;

  margin-bottom:16px;
}

/* =========================
   MENU ITEMS
========================= */

.mega-item{
  display:flex;
  align-items:center;
  justify-content:space-between;

  padding:12px 14px;

  border-radius:12px;

  cursor:pointer;

  font-size:15px;
  font-weight:500;

  color:#2d2d2d;

  transition:all .25s ease;
}

.mega-item:hover{
  background:#fff8ea;

  color:#0b3d2e;

  transform:translateX(4px);
}

.mega-item.active{
  background:#0b3d2e;
  color:white;
}

/* =========================
   LEFT & CENTER COLUMNS
========================= */

.mega-column{
  display:flex;
  flex-direction:column;
  gap:4px;
}

/* =========================
   DRILL PANEL
========================= */

.drill-panel{
  background:#faf7f2;

  border:1px solid rgba(11,61,46,.08);

  border-radius:18px;

  padding:18px;

  min-height:320px;
}

.drill-panel h4{
  margin:0 0 14px;

  color:#0b3d2e;

  font-size:18px;
  font-weight:700;
}

/* =========================
   SUBCATEGORIES
========================= */

.drill-subcategory{
  padding:10px 12px;

  border-radius:10px;

  cursor:pointer;

  transition:.25s ease;

  color:#555;
}

.drill-subcategory:hover{
  background:white;

  color:#0b3d2e;

  transform:translateX(4px);
}


/* PROFILE DROPDOWN */

.user-menu-wrapper{
  position:relative;
}

.user-dropdown{
  position:absolute;
  top:60px;
  right:0;

  width:180px;

  background:white;
  border-radius:16px;

  overflow:hidden;

  box-shadow:
    0 20px 50px rgba(0,0,0,.12);

  border:1px solid #eee;

  z-index:9999;
}

.user-dropdown button{
  width:100%;
  border:none;
  background:none;

  padding:14px 18px;

  text-align:left;
  cursor:pointer;

  font-size:14px;
  font-weight:500;

  transition:.25s ease;
}

.user-dropdown button:hover{
  background:#fff8ea;
}

/* =========================
   PREVIEW CARD
========================= */

.drill-preview{
  margin-top:18px;

  background:white;

  border-radius:16px;

  overflow:hidden;

  box-shadow:
    0 8px 24px rgba(0,0,0,.05);
}

.drill-preview img{
  width:100%;
  height:140px;

  object-fit:cover;

  display:block;
}

.drill-preview-content{
  padding:14px;
}

.drill-preview-content h5{
  margin:0 0 6px;

  color:#0b3d2e;

  font-size:16px;
}

.drill-preview-content p{
  margin:0;

  font-size:13px;
  color:#777;
}

/* =========================
   SHOP LINK
========================= */

.shop-trigger{
  display:flex;
  align-items:center;
  gap:6px;
}

.shop-trigger svg{
  transition:.25s ease;
}

.shop-menu-wrapper:hover .shop-trigger svg{
  transform:rotate(180deg);
}

/* =========================
   MOBILE
========================= */

@media(max-width:1100px){

  .shop-mega-menu{
    width:800px;
    left:-140px;
  }

}

@media(max-width:900px){

  .shop-mega-menu{
    display:none;
  }

}


.modern-header{
  position:sticky;
  top:0;
  z-index:9999;
   background:rgba(246,239,230,.78);

  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);

  border-bottom:1px solid rgba(255,255,255,.4);

  // background:rgba(11,61,46,.08);

  // backdrop-filter:blur(24px);
  // -webkit-backdrop-filter:blur(24px);

  // border-bottom:1px solid rgba(255,255,255,.3);
}

// .modern-header::before{
//   content:"";
//   position:absolute;
//   inset:0;

//   background:
//     linear-gradient(
//       135deg,
//       rgba(255,255,255,.45),
//       rgba(255,255,255,.08)
//     );

//   pointer-events:none;
// }

.modern-header::before{
  display:none;
}


.modern-header-inner{
  max-width:1400px;
  margin:auto;

  display:flex;
  align-items:center;
  justify-content:space-between;

  padding:12px 32px;
  gap:30px;
}

.modern-logo{
  width:90px;
  height:60px;
  display:flex;
  align-items:center;
}

.modern-logo img{
  width:100%;
  height:auto;
  max-height:60px;
}

.modern-nav{
  display:flex;
  align-items:center;
  gap:40px;
}

.modern-nav-link{
  text-decoration:none;
  color:#444;
  
  font-size:14px;
  font-weight:700;
  transition:.3s;
}

.modern-nav-link:hover{
  color:#f7931e;
}

.modern-nav-link.active{
  background:#f7a61c;
  color:white;
  padding:8px 18px;
  border-radius:20px;
}

.modern-search{
  width:360px;
  height:48px;

  // background:rgba(255,255,255,.4);

  backdrop-filter:blur(10px);

  border:1px solid rgba(255,255,255,.4);

  border-radius:24px;

  display:flex;
  align-items:center;

  padding:0 14px;
  gap:10px;
}

.modern-search input{
  flex:1;
  border:none;
  background:transparent;
  outline:none;
  font-size:13px;
}

.modern-search svg{
  color:#888;
}

.modern-actions{
  display:flex;
  align-items:center;
  gap:14px;
}

.modern-icon-btn{
  width:48px;
  height:48px;

  background:#ffffff;

  border:none;
  border-radius:50%;

  display:flex;
  align-items:center;
  justify-content:center;

  cursor:pointer;

  color:#0b5c4b;

  box-shadow:
    0 2px 10px rgba(0,0,0,.06);

  transition:all .25s ease;
}

.modern-icon-btn svg{
  width:20px;
  height:20px;
  stroke-width:2.2;
}

.modern-icon-btn:hover{
  transform:translateY(-2px);
  box-shadow:
    0 8px 20px rgba(0,0,0,.08);

  color:#f7931e;
}

@media(max-width:1024px){

  .modern-nav{
    display:none;
  }

  .modern-search{
    width:220px;
  }
}

@media(max-width:768px){

  .modern-search{
    display:none;
  }

  .modern-header-inner{
    padding:12px 16px;
  }
}
      `}</style>
    </>
  );
}
