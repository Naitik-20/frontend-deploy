import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories } from '../services/categoryService';

// ─── All categories matching drsnoopy.co.in live site ─────────────────────
const CATEGORY_TREE = [
  {
    group: '💊 Pharmacy',
    items: ['Pharmacy', 'Prescription Diet', 'Dewormer', 'Tick & Flea',
      'Skin Care', 'Joint Care', 'Gut Health', 'Cardiac Care',
      'Kidney Care', 'Liver Care', 'Eye & Ear Care', 'Vitamins & Supplements',
      'Pain Medication', 'Anti-biotics', 'Oral Care', 'Wound Care', 'Calming Aids'],
  },
  {
    group: '🍖 Food',
    items: ['Food', 'Dry Food', 'Wet Food', 'Puppy Food',
      'Grain Free Food', 'Baked Dry Food', 'Veg Dog Food', 'Premium Dog Food', 'Kitten Food'],
  },
  {
    group: '🦴 Snacks & Treats',
    items: ['Snacks & Treats', 'Biscuits & Cookies', 'Bones & Chews',
      'Dental Treats', 'Jerky Treats', 'Training Treats',
      'Creamy Treats', 'Ice Creams', 'Biryanis'],
  },
  {
    group: '✂️ Grooming',
    items: ['Grooming Essentials', 'Shampoos & Conditioners', 'Tick & Flea Solutions',
      'Brushes & Combs', 'Trimmers & Nail Clippers',
      'Paw & Nail care', 'Deodorants & Perfumes',
      'Towels & Wipes', 'Diapers & Training Pads',
      'Cleaning & Waste Disposal', 'Pet Safe Cleaners'],
  },
  {
    group: '🎀 Accessories',
    items: ['Accessories', 'Collars', 'Leashes', 'Harnesses',
      'Bowls & Feeders', 'Bedding', 'Clothing',
      'Carriers & Travel Supplies', 'Cages & Crates'],
  },
  {
    group: '🎾 Toys',
    items: ['Toys', 'Cat Teasers', 'Ball & Chaser Toys', 'Catnip Toys',
      'Cat Trees & Scratchers', 'Chew Toys', 'Smart & Interactive Toys',
      'Plush & Soft Toys', 'Rope & Tug Toys', 'Ball & Fetch Toys', 'Squeaky Toys'],
  },
  {
    group: '🐾 Species',
    items: ['Dogs', 'Cats', 'Birds', 'Large Animals', 'Others'],
  },
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────
export default function Sidebar({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  isOpen,       // mobile: true/false
  onClose,      // mobile: close callback
}) {
  const [openGroups, setOpenGroups] = useState({ '💊 Pharmacy': true });

  const [dynamicCategoryTree, setDynamicCategoryTree] = useState([]);

  useEffect(() => {
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (!ignore) {
          const tree = data.map((category) => ({
            group: [category.icon, category.label].filter(Boolean).join(' '),
            items: [category.label, ...(category.sub || [])],
          }));
          setDynamicCategoryTree(tree);
          if (tree[0]?.group) {
            setOpenGroups((prev) => ({ ...prev, [tree[0].group]: true }));
          }
        }
      } catch {
        setDynamicCategoryTree([]);
      }
    };

    fetchCategories();
    return () => { ignore = true; };
  }, []);

  const categoryTree = dynamicCategoryTree.length > 0 ? dynamicCategoryTree : CATEGORY_TREE;

  const toggleGroup = (group) =>
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    onClose(); // auto-close on mobile after pick
  };

  const handleReset = () => {
    setSelectedCategory('All Products');
    setPriceRange(5000);
    onClose();
  };

  const sidebarContent = (
    <aside className="sidebar-panel">
      {/* Header */}
      <div className="sidebar-head">
        <div className="sidebar-head-left">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </div>
        <div className="sidebar-head-right">
          <button className="sidebar-reset-btn" onClick={handleReset}>Reset All</button>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close filters">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div className="sidebar-block">
        <h3 className="sidebar-block-title">Price Range</h3>
        <div className="price-range-labels">
          <span>₹0</span>
          <span className="price-current">Up to ₹{priceRange.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={0}
          max={5000}
          step={50}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="price-slider"
        />
        <div className="price-range-ends">
          <span>₹0</span>
          <span>₹5,000</span>
        </div>
      </div>

      {/* All Products shortcut */}
      <div className="sidebar-block">
        <button
          className={`sidebar-all-btn ${selectedCategory === 'All Products' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('All Products')}
        >
          🛍️ All Products
        </button>
      </div>

      {/* Category Tree */}
      <div className="sidebar-block">
        <h3 className="sidebar-block-title">Browse Categories</h3>
        {categoryTree.map(({ group, items }) => (
          <div key={group} className="sidebar-group">
            <button
              className="sidebar-group-header"
              onClick={() => toggleGroup(group)}
            >
              <span>{group}</span>
              {openGroups[group] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {openGroups[group] && (
              <ul className="sidebar-group-items">
                {items.map((cat) => (
                  <li key={cat}>
                    <button
                      className={`sidebar-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      {selectedCategory === cat && <span className="cat-active-dot" />}
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Styles */}
      <style>{`
        /* ── Sidebar Panel ── */
        .sidebar-panel {
          width: 260px;
          min-width: 260px;
          flex-shrink: 0;
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          height: fit-content;
          position: sticky;
          top: 120px;
          box-shadow: var(--shadow-sm);
        }

        .sidebar-slot {
          width: 260px;
          min-width: 260px;
          justify-self: start;
          align-self: start;
        }

        .sidebar-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-light);
          background: var(--bg-main);
          position: sticky;
          top: 0;
          z-index: 4;
        }

        .sidebar-head-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 800;
          color: var(--text-dark);
        }

        .sidebar-head-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sidebar-reset-btn {
          background: none;
          border: none;
          font-size: 12px;
          font-weight: 700;
          color: var(--secondary-color);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }

        .sidebar-reset-btn:hover {
          background: #fff7ed;
        }

        .sidebar-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-medium);
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }

        .sidebar-close-btn:hover {
          background: var(--border-light);
          color: var(--text-dark);
        }

        /* ── Price Range ── */
        .sidebar-block {
          padding: 16px;
          border-bottom: 1px solid var(--border-light);
        }

        .sidebar-block-title {
          font-size: 13px;
          font-weight: 800;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 14px;
        }

        .price-range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-medium);
          margin-bottom: 8px;
        }

        .price-current {
          font-weight: 800;
          color: var(--primary-color);
        }

        .price-slider {
          width: 100%;
          accent-color: var(--primary-color);
          cursor: pointer;
          height: 4px;
        }

        .price-range-ends {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-light);
          margin-top: 6px;
        }

        /* ── All Products btn ── */
        .sidebar-all-btn {
          width: 100%;
          background: var(--bg-main);
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-dark);
          cursor: pointer;
          text-align: left;
          transition: var(--transition-smooth);
        }

        .sidebar-all-btn.active,
        .sidebar-all-btn:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        /* ── Category Groups ── */
        .sidebar-group {
          margin-bottom: 4px;
        }

        .sidebar-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 9px 10px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          color: var(--text-dark);
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }

        .sidebar-group-header:hover {
          background: var(--bg-main);
          color: var(--primary-color);
        }

        .sidebar-group-items {
          list-style: none;
          padding: 0 0 6px 10px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-cat-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          background: none;
          border: none;
          padding: 7px 10px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-medium);
          cursor: pointer;
          text-align: left;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }

        .sidebar-cat-btn:hover {
          background: var(--bg-main);
          color: var(--primary-color);
        }

        .sidebar-cat-btn.active {
          color: var(--primary-color);
          font-weight: 700;
          background: rgba(10, 88, 164, 0.06);
        }

        .cat-active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--secondary-color);
          flex-shrink: 0;
        }

        /* ── MOBILE OVERLAY ── */
        @media (max-width: 768px) {
          .sidebar-slot {
            width: 0;
            min-width: 0;
          }

          .sidebar-panel {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 2000;
            width: 300px;
            border-radius: 0;
            overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            box-shadow: 4px 0 30px rgba(0,0,0,0.15);
          }
          .sidebar-panel.mobile-open {
            transform: translateX(0);
          }

          .mobile-open .sidebar-panel {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );

  // On mobile: add class + backdrop
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 1999, display: window.innerWidth <= 768 ? 'block' : 'none',
          }}
          onClick={onClose}
        />
      )}
      <div className={`sidebar-slot ${isOpen ? 'mobile-open' : ''}`}>
        {sidebarContent}
      </div>
    </>
  );
}
