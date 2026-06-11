// import { useState, useEffect, useCallback, useRef } from 'react';
// import { Routes, Route, useParams, useNavigate, Link} from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import ProductCard from './components/ProductCard';
// import ProductDetailModal from './components/ProductDetailModal';
// import CartDrawer from './components/CartDrawer';
// import CheckoutPage from './components/CheckoutPage';
// import InvoicePage from './components/InvoicePage';
// import AuthModal from './components/AuthModal';
// import Footer from './components/Footer';
// import TermsPage from "./components/TermsPage";
// import ShippingPolicyPage from "./components/ShippingPolicyPage";
// import RefundPolicyPage from "./components/RefundPolicyPage";
// import ServicesPage from './components/ServicesPage';
// import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
// import BookingCalendarPage from './components/BookingCalendarPage';
// import OnlineConsultationPage from './components/OnlineConsultationPage';
// import ContactPage from './components/ContactPage';
// import OrderSummary from './components/OrderSummary';
// import AboutUs from './components/AboutUs';
// import UserProfilePage from '../../user/UserProfilePage';
// import WholesalerResetPasswordPage from './components/WholesalerResetPasswordPage';
// import WholesalerProfilePage from '../../wholesaler/WholesalerProfilePage';
// import HomePage from './pages/HomePage';
// import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
// import { getCategories } from './services/categoryService';

// const BACKEND_URL = 'https://dr-snoopy2.onrender.com';

// // const getProductImage = (product) => {
// //   const image = product.thumbnail || product.image || product.images?.[0] || '';
// //   if (!image || image.startsWith('http') || image.startsWith('/')) return image;
// //   return `/uploads/${image}`;
// // };

// const getProductImage = (product) => {
//   const image =
//     product.thumbnail ||
//     product.image ||
//     product.images?.[0] ||
//     '';

//   if (!image) {
//     return 'https://placehold.co/400x300';
//   }

//   if (image.startsWith('http')) {
//     return image;
//   }

//   if (image.startsWith('/')) {
//     return `${BACKEND_URL}${image}`;
//   }

//   return `${BACKEND_URL}/uploads/${image}`;
// };

// const mapProductFromApi = (product) => ({
//   ...product,
//   id: product._id || product.id,
//   img: getProductImage(product),
//   price: Number(product.retailPrice ?? product.price ?? 0),
//   mrp: Number(product.mrp ?? product.retailPrice ?? product.price ?? 0),
//   wholesalePrice: Number(product.wholesalerPrice ?? product.wholesalePrice ?? 0),
//   retailPrice: Number(product.retailPrice ?? product.price ?? 0),
//   wholesalerPrice: Number(product.wholesalerPrice ?? product.wholesalePrice ?? 0),
//   normalMoq: Number(product.normalMoq ?? product.moq ?? 1),
//   wholesalerMoq: Number(product.wholesalerMoq ?? product.moq ?? 1),
//   moq: Number(product.normalMoq ?? product.moq ?? 1),
//   deliveryPrice: Number(product.deliveryPrice ?? 0),
//   stock: Number(product.stock ?? 0),
// });

// function CategoryUpdater({ setSelectedCategory }) {
//   const { categoryName } = useParams();
//   useEffect(() => {
//     if (categoryName) {
//       setSelectedCategory(decodeURIComponent(categoryName));
//     } else {
//       setSelectedCategory('All Products');
//     }
//     // High-fidelity page scroll to top on category transition
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [categoryName, setSelectedCategory]);
//   return null;
// }

// function App() {
//   // State for products and filtering
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All Products');
//   const [priceRange, setPriceRange] = useState(5000);
//   const [sortBy, setSortBy] = useState('Recommended');
//   const [shopCategories, setShopCategories] = useState([]);

//   // UI Modals toggles
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isAuthOpen, setIsAuthOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // Business state
//   const [user, setUser] = useState(null);
//   const [cartItems, setCartItems] = useState([]);
//   const shopCategoryScroller = useRef(null);
  
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isWholesalerProfile = location.pathname === '/wholesaler/profile';
//   const isUserProfile = location.pathname === '/profile';
//   const isWholesalerUser = user?.role === 'wholesaler' || user?.role === 'wholeseller' || user?.isWholesaler;
//   const hideLayout =
//   location.pathname === '/checkout' || location.pathname.startsWith('/invoice');
//   const handleCategoryChange = (category) => {
//     if (category === 'All Products') {
//       navigate('/shop');
//     } else {
//       navigate(`/category/${encodeURIComponent(category)}`);
//     }
//   };

//   useEffect(() => {
//     let ignore = false;

//     const fetchShopCategories = async () => {
//       try {
//         const data = await getCategories();
//         if (!ignore) {
//           setShopCategories(data);
//         }
//       } catch (error) {
//         console.error('Error fetching shop categories:', error);
//         if (!ignore) setShopCategories([]);
//       }
//     };

//     fetchShopCategories();
//     return () => { ignore = true; };
//   }, []);



//   // Fetch products from backend based on filters
//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams();
//       queryParams.set('category', selectedCategory);
//       queryParams.set('search', searchTerm);
//       queryParams.set(
//         'sort',
//         sortBy === 'Price: Low to High' ? 'price-asc' :
//         sortBy === 'Price: High to Low' ? 'price-desc' :
//         sortBy === 'Popularity' ? 'popularity' : 'Recommended'
//       );

//       if (priceRange < 5000) {
//         queryParams.set('maxPrice', priceRange.toString());
//       }

//       const res = await fetch(`${BACKEND_URL}/api/products?${queryParams}`);
//       if (!res.ok) {
//         throw new Error(`Products request failed with status ${res.status}`);
//       }

//       const data = await res.json();
//       const productList = Array.isArray(data) ? data : data.data || data.products || [];

//       setProducts(productList.map(mapProductFromApi));
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedCategory, searchTerm, priceRange, sortBy]);

//   useEffect(() => {
//     // Debounce search input to avoid spamming the backend
//     const timeoutId = setTimeout(() => {
//       fetchProducts();
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [fetchProducts]);

//   // Cart operations
//   const handleAddToCart = (product, quantity) => {
//     const minimumQty = Math.max(1, Number(product.moq || product.normalMoq || product.wholesalerMoq || 1));
//     const cartProduct = isWholesalerUser
//       ? {
//           ...product,
//           price: Number(product.wholesalePrice || product.price || 0),
//           mrp: Number(product.mrp || product.price || 0),
//           moq: Number(product.wholesalerMoq || product.moq || 1),
//           moqLabel: 'Wholesaler MOQ',
//         }
//       : {
//           ...product,
//           moq: minimumQty,
//           moqLabel: 'MOQ',
//         };
//     const addQuantity = Math.max(1, Number(quantity || cartProduct.moq || 1));
//     setCartItems((prevItems) => {
//       const existing = prevItems.find((item) => item.id === cartProduct.id);
//       if (existing) {
//         return prevItems.map((item) =>
//           item.id === cartProduct.id ? { ...item, quantity: item.quantity + addQuantity } : item
//         );
//       }
//       return [...prevItems, { ...cartProduct, quantity: addQuantity }];
//     });
    
//     // Auto-open cart for premium micro-experience feedback
//     setIsCartOpen(true);
//   };

//   const handleUpdateCartQuantity = (id, quantity) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) => {
//         if (item.id !== id) return item;
//         const minimumQty = Math.max(1, Number(item.moq || 1));
//         return { ...item, quantity: Math.max(minimumQty, quantity) };
//       })
//     );
//   };

//   const handleRemoveCartItem = (id) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
//   };

//   const handleClearCart = () => {
//     setCartItems([]);
//   };

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch {
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/shop");
//   };

//   const handleLoginSuccess = (userData) => {
//   setUser(userData);
//   setIsAuthOpen(false);

//   const role = (userData?.role || '').toLowerCase();

//   if (role === "admin") {
//     const token = localStorage.getItem("token");

//     window.location.href =
//       `${CLIENT_URL}/?token=${token}`;
//     return;
//   }

//   if (role === 'wholesaler' || role === 'wholeseller' || userData?.isWholesaler) {
//     navigate('/wholesaler/profile');
//     return;
//   }

//   navigate('/profile');
// };

//   const productCategoryTabs = shopCategories.filter((category) =>
//     !['species', 'pet', 'pets'].includes(String(category.label || category.name || '').toLowerCase())
//   );
//   const currentShopTitle = selectedCategory === 'All Products' ? 'All Products' : selectedCategory;
//   const hasScrollableShopCategories = productCategoryTabs.length > 6;

//   const scrollShopCategories = (direction) => {
//     if (!shopCategoryScroller.current) return;
//     shopCategoryScroller.current.scrollBy({
//       left: direction * 260,
//       behavior: 'smooth',
//     });
//   };

//   return (
//     <div className={`app-layout${isWholesalerProfile || isUserProfile ? ' app-layout--fixed-dashboard' : ''}`}>
//       <Routes>
//         <Route path="/" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
//         <Route path="/shop" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
//         <Route path="/category/:categoryName" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
//         <Route path="/services" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
//         <Route path="/contact" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
//         <Route path="/consultation" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />}/>
//         <Route path="/online-consultation/:serviceId" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
//       </Routes>
      
//       {/* Site Header */}
//       {!hideLayout && (
//       <Header
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
//         onCartClick={() => setIsCartOpen(true)}
//         onLoginClick={() => setIsAuthOpen(true)}
//         user={user}
//         onLogout={handleLogout}
//         onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
//       />
//       )}

//       <div className={`app-content-region${isWholesalerProfile || isUserProfile ? ' app-dashboard-scroll-region' : ''}`}>
//       {/* Dynamic Main Body Content based on Path */}
//       <Routes>
//         {/* Booking Calendar / Online Consultation Route */}
//         <Route path="/online-consultation/:serviceId" element={<BookingCalendarPage />} />

//         <Route path="/wholesaler-reset-password/:token" element={<WholesalerResetPasswordPage backendUrl={BACKEND_URL} />} />
//         <Route
//           path="/wholesaler/profile"
//           element={
//             <WholesalerProfilePage
//               backendUrl={BACKEND_URL}
//               user={user}
//               onUserUpdate={setUser}
//               onLogout={handleLogout}
//             />
//           }
//         />

//         {/* Services Page Route */}
//         <Route path="/services" element={<ServicesPage />} />

//         {/* Contact Page Route */}
//         <Route path="/contact" element={<ContactPage />} />

//         <Route
//           path="/profile"
//           element={
//             <UserProfilePage
//               backendUrl={BACKEND_URL}
//               user={user}
//               onUserUpdate={setUser}
//               onLogout={handleLogout}
//             />
//           }
//         />

//         {/* Checkout Page Route */}
//         <Route
//           path="/checkout"
//           element={
//             <CheckoutPage
//               cartItems={cartItems}
//               user={user}
//               onLoginClick={() => setIsAuthOpen(true)}
//               onUpdateQuantity={handleUpdateCartQuantity}
//               onRemoveItem={handleRemoveCartItem}
//               onClearCart={handleClearCart}
//               backendUrl={BACKEND_URL}
//             />
//           }
//         />

//         <Route path="/invoice/:orderId" element={<InvoicePage backendUrl={BACKEND_URL} />} />
        
//         {/* Online Consultation Route */}
//         <Route path="/consultation" element={ <OnlineConsultationPage onLoginClick={() => setIsAuthOpen(true)}  /> } />    

//          <Route path="/terms" element={<TermsPage />} />


//           <Route
//   path="/about"
//   element={
//     <AboutUs />
//   }
// />


// <Route
//   path="/privacy-policy"
//   element={<PrivacyPolicyPage />}
// />

// <Route
//   path="/shipping-policy"
//   element={<ShippingPolicyPage />}
// />

// <Route
//   path="/refund-policy"
//   element={<RefundPolicyPage />}
// />     
// <Route
//   path="/order-summary"
//   element={
//     <OrderSummary
//       cartItems={cartItems}
//       user={user}
//       backendUrl={BACKEND_URL}
//     />
//   }
// />
      
//         {/* Home Page Route */}
//         <Route path="/" element={<HomePage user={user} />} />

//         {/* Catalog Main Layout (Catch-all for /shop and /category/*) */}
//         <Route 
//           path="/*" 
//           element={
//             <main className="main-content-layout container">
//               {/* Breadcrumb strip */}
//               {/* <div className="breadcrumb-strip">
//                 <span>Home</span>
//                 <span className="breadcrumb-arrow">&gt;</span>
//                 <span className="active-breadcrumb">{selectedCategory}</span>
//               </div> */}

//               {/* Title and sorting headers */}
//               <div className="shop-page-header">

//   <div className="shop-title-wrap">
//     <span className="shop-subtitle">
//       Browse Product Categories
//     </span>

//     <h1 className="shop-main-title">
//       {currentShopTitle === 'All Products' ? (
//         <>Shop By <span>Category</span></>
//       ) : (
//         <>Shop <span>{currentShopTitle}</span></>
//       )}
//     </h1>

//     <p className="shop-result-count">
//       {loading ? 'Loading products...' : `${products.length} product${products.length === 1 ? '' : 's'} found`}
//     </p>
//   </div>

//   <div className="shop-control-bar">
//     <button
//       type="button"
//       className="mobile-filter-trigger shop-filter-trigger"
//       onClick={() => setIsMobileSidebarOpen(true)}
//     >
//       <SlidersHorizontal size={16} />
//       Filters
//     </button>

//     <label className="shop-sort-control">
//       <ArrowUpDown size={16} />
//       <select
//         value={sortBy}
//         onChange={(event) => setSortBy(event.target.value)}
//         aria-label="Sort products"
//       >
//         <option>Recommended</option>
//         <option>Popularity</option>
//         <option>Price: Low to High</option>
//         <option>Price: High to Low</option>
//       </select>
//     </label>
//   </div>

//   <div className="shop-category-tabs-shell">
//     {hasScrollableShopCategories && (
//       <button
//         type="button"
//         className="shop-category-scroll-btn shop-category-scroll-left"
//         onClick={() => scrollShopCategories(-1)}
//         aria-label="Scroll categories left"
//       >
//         <ChevronLeft size={20} />
//       </button>
//     )}

//     <div
//       ref={shopCategoryScroller}
//       className={`shop-category-tabs ${hasScrollableShopCategories ? 'shop-category-tabs-scroll' : ''}`}
//       aria-label="Shop by product category"
//     >
//       <button
//         type="button"
//         className={`shop-category-tab ${selectedCategory === 'All Products' ? 'active' : ''}`}
//         onClick={() => handleCategoryChange('All Products')}
//       >
//         All Products
//       </button>

//       {productCategoryTabs.map((category) => (
//         <button
//           key={category.label}
//           type="button"
//           className={`shop-category-tab ${selectedCategory === category.label ? 'active' : ''}`}
//           onClick={() => handleCategoryChange(category.label)}
//         >
//           {category.label}
//         </button>
//       ))}
//     </div>

//     {hasScrollableShopCategories && (
//       <button
//         type="button"
//         className="shop-category-scroll-btn shop-category-scroll-right"
//         onClick={() => scrollShopCategories(1)}
//         aria-label="Scroll categories right"
//       >
//         <ChevronRight size={20} />
//       </button>
//     )}
//   </div>

// </div>

//               {/* Workspace Body Grid */}
//               <div className="catalog-body-grid">
//                 {/* Desktop Sidebar Filters */}
//                 <Sidebar
//                   selectedCategory={selectedCategory}
//                   setSelectedCategory={handleCategoryChange}
//                   priceRange={priceRange}
//                   setPriceRange={setPriceRange}
//                   isOpen={isMobileSidebarOpen}
//                   onClose={() => setIsMobileSidebarOpen(false)}
//                 />

//                 {/* Products Content Area */}
//                 <div className="products-grid-wrapper">
//                   {loading ? (
//                     /* Skeletal Loaders */
//                     <div className="products-grid">
//                       {[...Array(4)].map((_, i) => (
//                         <div key={i} className="product-skeleton-card">
//                           <div className="skeleton skeleton-img"></div>
//                           <div className="skeleton-details">
//                             <div className="skeleton skeleton-text short"></div>
//                             <div className="skeleton skeleton-text title"></div>
//                             <div className="skeleton skeleton-text desc"></div>
//                             <div className="skeleton-footer">
//                               <div className="skeleton skeleton-text price"></div>
//                               <div className="skeleton skeleton-btn"></div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : products.length === 0 ? (
//                     /* Empty Search Results */
//                     <div className="catalog-empty-state">
//                       <div className="empty-dog-illustration">🐕💨</div>
//                       <h3>No products found</h3>
//                       <p>We couldn't find matches. Try adjusting your category filters or search keywords.</p>
//                       <button 
//                         className="reset-filters-btn"
//                         onClick={() => {
//                           setSearchTerm('');
//                           handleCategoryChange('All Products');
//                           setPriceRange(5000);
//                         }}
//                       >
//                         Reset All Filters
//                       </button>
//                     </div>
//                   ) : (
//                     /* Products Cards Grid */
//                     <div className="products-grid animate-fade">
//                       {products.map((product) => {
//                         const displayProduct = isWholesalerUser
//                           ? {
//                               ...product,
//                               price: Number(product.wholesalePrice || product.price || 0),
//                               mrp: Number(product.mrp || product.price || 0),
//                               moq: Number(product.wholesalerMoq || product.moq || 1),
//                               moqLabel: 'Wholesaler MOQ',
//                             }
//                           : {
//                               ...product,
//                               moq: Number(product.normalMoq || product.moq || 1),
//                               moqLabel: 'MOQ',
//                             };
//                         return (
//                        <Link
//   key={product.id}
//   to={`/product/${product.id}`}
//   className="featured-product-card"
// >

 
//   <div className="featured-product-image">
//     <img
//       src={displayProduct.img}
//       alt={displayProduct.name}
//       onError={(e) => {
//         e.currentTarget.src = 'https://placehold.co/400x300';
//       }}
//     />
  

//     {/* <img
//   src="https://dr-snoopy2.onrender.com/uploads/1780942794108-joinus.webp"
//   alt=""
// /> */}
//   </div>

//   <div className="featured-product-content">
//     <p className="featured-brand">
//       {displayProduct.brand || "Dr Snoopy"}
//     </p>

//     <h3>{displayProduct.name}</h3>

//     <p className="featured-weight">
//       {displayProduct.moqLabel}: {displayProduct.moq || 1}
//     </p>

//     <div className="featured-rating">
//       ★★★★★ <span>(124 Reviews)</span>
//     </div>

//     <div className="featured-bottom">
//       <div>
//         <div className="featured-price">
//           ₹{displayProduct.price}
//         </div>

//         {displayProduct.mrp > displayProduct.price && (
//           <span className="featured-old-price">
//             ₹{displayProduct.mrp}
//           </span>
//         )}
//       </div>

//       <button
//         className="add-btn"
//         onClick={(e) => {
//           e.preventDefault();
//           handleAddToCart(displayProduct);
//         }}
//       >
//         + Add
//       </button>
//     </div>
//   </div>
// </Link>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </main>
//           }
//         />
//       </Routes>

//       {/* Slide-out Shopping Cart Drawer */}
//       <CartDrawer
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         cartItems={cartItems}
//         onUpdateQuantity={handleUpdateCartQuantity}
//         onRemoveItem={handleRemoveCartItem}
//         backendUrl={BACKEND_URL}
//       />

//       {/* Login / Auth Modal */}
//       <AuthModal
//         isOpen={isAuthOpen}
//         onClose={() => setIsAuthOpen(false)}
//         onLoginSuccess={handleLoginSuccess}
//         backendUrl={BACKEND_URL}
//       />

//       {/* Product Detailed Modal */}
//       {selectedProduct && (
//         <ProductDetailModal
//           product={selectedProduct}
//           onClose={() => setSelectedProduct(null)}
//           onAddToCart={handleAddToCart}
//           backendUrl={BACKEND_URL}
//         />
//       )}

//       {/* Footer */}
//       {!hideLayout &&
//       <Footer />
// }
//       </div>

//       {/* Localized custom scoped CSS styles */}
//       <style>{`


// /* SHOP PRODUCT CARD */

// .featured-product-card{
//   position:relative;
//   background:#fff;
//   border-radius:12px;
//   overflow:hidden;
//   text-decoration:none;
//   color:#222;
//   box-shadow:0 4px 12px rgba(0,0,0,.08);
//   transition:.25s;
  
  
// }

// .featured-product-card:hover{
//   transform:translateY(-8px);
//   box-shadow:0 20px 40px rgba(0,0,0,.12);
// }

// .featured-product-image{
//   height:140px;
//   overflow:hidden;
// }

// .featured-product-image img{
//   width:100%;
//   height:100%;
//   object-fit:cover;
//   display:block;
//    transition:transform .6s ease;
// }

// .featured-product-card:hover .featured-product-image img{
//   transform:scale(1.08);
// }

// .sale-badge{
//   position:absolute;
//   top:12px;
//   left:12px;
//   background:#25b35b;
//   color:#fff;
//   font-size:10px;
//   font-weight:600;
//   padding:7px 12px;
//   border-radius:5px;
//   z-index:2;
// }

// .featured-product-content{
//   padding:10px 12px;
// }

// .featured-brand{
//   font-size:11px;
//   color:#777;
//   text-transform:uppercase;
//   margin-bottom:6px;
// }

// .featured-product-content{
//   padding:10px;
// }

// .featured-product-content h3{
//   font-size:15px;
//   font-weight:600;
//   line-height:1.35;
//   margin-bottom:6px;

//   display:-webkit-box;
//   -webkit-line-clamp:2;
//   -webkit-box-orient:vertical;
//   overflow:hidden;

//   min-height:36px;
// }

// .featured-weight{
//   font-size:12px;
//   color:#888;
//   margin-bottom:8px;
// }

// .featured-rating{
//   color:#f5a623;
//   font-size:12px;
//   margin-bottom:14px;
// }

// .featured-rating span{
//   color:#666;
//   margin-left:6px;
// }

// .featured-bottom{
//   display:flex;
//   justify-content:space-between;
//   align-items:flex-end;
// }

// .featured-price{
//   font-size:18px;
//   font-weight:700;
//   color:#143d32;
// }

// .featured-old-price{
//   display:block;
//   font-size:12px;
//   color:#888;
//   text-decoration:line-through;
// }

// .add-btn{
//   border:none;
//   background:#0b3d2e;
//   color:#fff;
//   border-radius:22px;
//   padding:10px 18px;
//   font-size:14px;
//   font-weight:600;
//   cursor:pointer;
// }

// // .add-btn:hover{
// //   background:#e59400;
// // }


// .products-grid{
//   display:grid;
//   grid-template-columns:repeat(4,1fr);
//   gap:20px;
// }

// @media(max-width:1200px){
//   .products-grid{
//     grid-template-columns:repeat(3,1fr);
//   }
// }

// @media(max-width:900px){
//   .products-grid{
//     grid-template-columns:repeat(2,1fr);
//   }
// }

// @media(max-width:600px){
//   .products-grid{
//     grid-template-columns:1fr;
//   }
// }

//         .app-layout {
//           min-height: 100vh;
//           display: flex;
//           flex-direction: column;
//         }

//         .app-layout--fixed-dashboard {
//           height: 100dvh;
//           overflow: hidden;
//         }

//         .app-layout--fixed-dashboard .ds-header {
//           flex: 0 0 auto;
//         }

//         .app-content-region {
//           flex: 1 0 auto;
//           display: flex;
//           flex-direction: column;
//         }

//         .app-dashboard-scroll-region {
//           flex: 1 1 auto;
//           min-height: 0;
//           overflow-y: auto;
//           overflow-x: hidden;
//         }

//         .app-layout--fixed-dashboard .wholesaler-dashboard-page {
//           min-height: 100%;
//         }

//         .app-layout--fixed-dashboard .footer {
//           margin-top: 0;
//         }

//         @media (max-width: 900px) {
//           .app-layout--fixed-dashboard {
//             height: auto;
//             min-height: 100vh;
//             overflow: visible;
//           }

//           .app-dashboard-scroll-region {
//             overflow: visible;
//           }
//         }

//         @media (min-width: 901px) {
//           .app-layout--fixed-dashboard .app-dashboard-scroll-region {
//             display: flex;
//             flex-direction: column;
//           }

//           .app-layout--fixed-dashboard .wholesaler-dashboard-page {
//             flex: 1 0 auto;
//           }
//         }

//         .main-content-layout {
//           flex-grow: 1;
//           width: 100%;
//           padding-top: 24px;
//           padding-bottom: 60px;
//         }

//         /* Breadcrumb navigation */
//         .breadcrumb-strip {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 14px;
//           font-weight: 500;
//           color: var(--text-medium);
//           margin-bottom: 24px;
//         }

//         .breadcrumb-arrow {
//           font-size: 12px;
//           color: var(--text-light);
//         }

//         .active-breadcrumb {
//           color: var(--text-dark);
//           font-weight: 600;
//         }

//         /* Catalog Title & Sort block */
//         .catalog-header-row {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 36px;
//         }

//         .catalog-main-title {
//           font-size: 44px;
//           font-weight: 850;
//           color: var(--secondary-color);
//           font-family: var(--font-headers);
//           line-height: 1.1;
//         }

//         .catalog-actions-row {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }

//         .mobile-filter-trigger {
//           display: none;
//           background: white;
//           border: 1px solid var(--border-light);
//           padding: 8px 16px;
//           border-radius: var(--radius-sm);
//           font-size: 14px;
//           font-weight: 600;
//           align-items: center;
//           gap: 8px;
//           cursor: pointer;
//           color: var(--text-dark);
//           box-shadow: var(--shadow-sm);
//         }

//         .sort-dropdown-container {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .sort-label {
//           font-size: 14px;
//           font-weight: 600;
//           color: var(--text-medium);
//         }

//         .sort-select-wrapper {
//           position: relative;
//           display: flex;
//           align-items: center;
//         }

//         .sort-select {
//           appearance: none;
//           -webkit-appearance: none;
//           background: white;
//           border: 1px solid var(--border-light);
//           padding: 8px 36px 8px 16px;
//           font-size: 14px;
//           font-weight: 600;
//           color: var(--text-dark);
//           border-radius: var(--radius-sm);
//           outline: none;
//           cursor: pointer;
//           transition: var(--transition-smooth);
//         }

//         .sort-select:focus {
//           border-color: var(--secondary-color);
//           box-shadow: 0 0 0 3px rgba(247, 147, 30, 0.1);
//         }

//         .sort-icon-chevron {
//           position: absolute;
//           right: 12px;
//           pointer-events: none;
//           color: var(--text-medium);
//         }

//         /* Workspace Grid */
//         // .catalog-body-grid {
//         //   display: flex;
//         //   gap: 30px;
//         // }
//         .catalog-body-grid{
//   display:grid;
//   grid-template-columns:280px minmax(0,1fr);
//   gap:32px;
//   align-items:start;
//   width:100%;
//   min-width:0;
// }

//         .products-grid-wrapper {
//           flex-grow: 1;
//           width:100%;
//           min-width:0;
//         }

//         // .products-grid {
//         //   display: grid;
//         //   grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
//         //   gap: 20px;
//         // }
//         .products-grid{
//   display:grid;
//   grid-template-columns:repeat(4,1fr);
//   gap:20px;
// }

//         /* Skeleton Loaders Styling */
//         .product-skeleton-card {
//           background: white;
//           border: 1px solid var(--border-light);
//           border-radius: var(--radius-md);
//           overflow: hidden;
//           height: 380px;
//           display: flex;
//           flex-direction: column;
//         }

//         .skeleton-img {
//           height: 200px;
//           width: 100%;
//         }

//         .skeleton-details {
//           padding: 16px;
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//           flex-grow: 1;
//         }

//         .skeleton-text {
//           height: 12px;
//           border-radius: var(--radius-sm);
//         }

//         .skeleton-text.short {
//           width: 40%;
//         }

//         .skeleton-text.title {
//           height: 18px;
//           width: 80%;
//         }

//         .skeleton-text.desc {
//           height: 32px;
//           width: 100%;
//         }

//         .skeleton-footer {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-top: auto;
//         }

//         .skeleton-text.price {
//           height: 18px;
//           width: 30%;
//         }

//         .skeleton-btn {
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//         }

//         /* Empty state search and filter triggers */
//         .catalog-empty-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//           padding: 60px 20px;
//           background: white;
//           border-radius: var(--radius-lg);
//           border: 1px solid var(--border-light);
//           box-shadow: var(--shadow-sm);
//           width:100%;
//           min-height:380px;
//         }

//         .empty-dog-illustration {
//           font-size: 54px;
//           margin-bottom: 16px;
//         }

//         .catalog-empty-state h3 {
//           font-size: 20px;
//           font-weight: 800;
//           color: var(--text-dark);
//           margin-bottom: 6px;
//         }

//         .catalog-empty-state p {
//           color: var(--text-medium);
//           font-size: 14.5px;
//           max-width: 400px;
//           line-height: 1.5;
//           margin-bottom: 24px;
//         }

//         .reset-filters-btn {
//           background-color: var(--secondary-color);
//           color: white;
//           border: none;
//           padding: 12px 28px;
//           border-radius: 9999px;
//           font-weight: 700;
//           cursor: pointer;
//           transition: var(--transition-smooth);
//         }

//         .reset-filters-btn:hover {
//           background-color: var(--secondary-hover);
//         }


//         @media (max-width: 768px) {
//           .catalog-body-grid {
//             grid-template-columns: minmax(0, 1fr);
//             gap: 0;
//           }

//           .catalog-main-title {
//             font-size: 32px;
//           }

//           .catalog-header-row {
//             margin-bottom: 24px;
//           }

//           .mobile-filter-trigger {
//             display: flex;
//           }

//           .sort-label {
//             display: none; /* hide label on mobile to save space */
//           }

//           .products-grid {
//             grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
//             gap: 12px;
//           }

//           .product-skeleton-card {
//             height: 320px;
//           }

//           .skeleton-img {
//             height: 140px;
//           }
//         }


//         .shop-page-header{
//   margin-bottom:32px;
// }

// .shop-title-wrap{
//   text-align:center;
//   margin-bottom:18px;
// }

// .shop-subtitle{
//   display:block;
//   color:#f6a400;
//   font-size:14px;
//   font-weight:600;
//   letter-spacing:.08em;
//   text-transform:uppercase;
//   margin-bottom:10px;
// }

// .shop-main-title{
//   font-family:'Playfair Display', serif;
//   font-size:52px;
//   font-weight:700;
//   color:#0b3d2e;
//   margin:0;
// }

// .shop-main-title span{
//   color:#f6a400;
// }

// .shop-result-count{
//   margin:12px 0 0;
//   color:#647067;
//   font-size:14px;
//   font-weight:700;
// }

// .shop-control-bar{
//   display:flex;
//   align-items:center;
//   justify-content:center;
//   gap:12px;
//   margin-bottom:22px;
//   flex-wrap:wrap;
// }

// .shop-filter-trigger{
//   height:42px;
//   display:none;
//   border-radius:999px;
// }

// .shop-sort-control{
//   height:42px;
//   display:inline-flex;
//   align-items:center;
//   gap:8px;
//   background:#fff;
//   border:1px solid #e4e4e4;
//   border-radius:999px;
//   padding:0 14px;
//   color:#0b3d2e;
//   font-weight:800;
//   box-shadow:0 6px 18px rgba(11,61,46,.06);
// }

// .shop-sort-control select{
//   border:0;
//   background:transparent;
//   color:#0b3d2e;
//   font-size:14px;
//   font-weight:800;
//   outline:none;
//   cursor:pointer;
// }

// .shop-category-tabs-shell{
//   position:relative;
//   max-width:980px;
//   margin:0 auto;
// }

// .shop-category-tabs{
//   display:flex;
//   justify-content:center;
//   gap:12px;
//   padding:6px 4px 12px;
//   flex-wrap:wrap;
//   scroll-behavior:smooth;
// }

// .shop-category-tabs-scroll{
//   justify-content:flex-start;
//   flex-wrap:nowrap;
//   overflow-x:auto;
//   overflow-y:hidden;
//   padding:6px 54px 14px;
//   scroll-snap-type:x mandatory;
//   scrollbar-width:thin;
//   scrollbar-color:#f6a400 transparent;
// }

// .shop-category-tabs-scroll::-webkit-scrollbar{
//   height:7px;
// }

// .shop-category-tabs-scroll::-webkit-scrollbar-thumb{
//   background:#f6a400;
//   border-radius:999px;
// }

// .shop-category-tab{
//   min-width:max-content;
//   height:44px;
//   padding:0 22px;
//   border:1px solid rgba(11,61,46,.14);
//   border-radius:999px;
//   background:#fff;
//   color:#0b3d2e;
//   cursor:pointer;
//   font-size:14px;
//   font-weight:800;
//   box-shadow:0 6px 18px rgba(11,61,46,.06);
//   transition:.25s ease;
//   scroll-snap-align:center;
// }

// .shop-category-tab.active{
//   background:#083d2d;
//   color:white;
//   border-color:#083d2d;
//   box-shadow:0 12px 28px rgba(8,61,45,.22);
// }

// .shop-category-tab:hover{
//   transform:translateY(-2px);
//   border-color:#f6a400;
// }

// .shop-category-scroll-btn{
//   position:absolute;
//   top:7px;
//   z-index:2;
//   width:40px;
//   height:40px;
//   border-radius:50%;
//   border:1px solid rgba(11,61,46,.14);
//   background:#fff;
//   color:#0b3d2e;
//   display:flex;
//   align-items:center;
//   justify-content:center;
//   cursor:pointer;
//   box-shadow:0 8px 22px rgba(11,61,46,.12);
//   transition:.25s ease;
// }

// .shop-category-scroll-btn:hover{
//   background:#083d2d;
//   color:#fff;
//   transform:translateY(-2px);
// }

// .shop-category-scroll-left{
//   left:0;
// }

// .shop-category-scroll-right{
//   right:0;
// }

// @media(max-width:768px){
//   .shop-main-title{
//     font-size:38px;
//   }

//   .shop-filter-trigger{
//     display:inline-flex;
//   }

//   .shop-category-tabs,
//   .shop-category-tabs-scroll{
//     justify-content:flex-start;
//   }
// }

//       `}</style>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useParams, useNavigate, Link} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutPage from './components/CheckoutPage';
import InvoicePage from './components/InvoicePage';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import TermsPage from "./components/TermsPage";
import ShippingPolicyPage from "./components/ShippingPolicyPage";
import RefundPolicyPage from "./components/RefundPolicyPage";
import ServicesPage from './components/ServicesPage';
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import BookingCalendarPage from './components/BookingCalendarPage';
import OnlineConsultationPage from './components/OnlineConsultationPage';
import ContactPage from './components/ContactPage';
import OrderSummary from './components/OrderSummary';
import UserProfilePage from '../../user/UserProfilePage';
import WholesalerResetPasswordPage from './components/WholesalerResetPasswordPage';
import WholesalerProfilePage from '../../wholesaler/WholesalerProfilePage';
import HomePage from './pages/HomePage';
import AboutUs from './components/AboutUs';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategories } from './services/categoryService';

const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5174';
//       `${CLIENT_URL}/?token=${token}`;

// const getProductImage = (product) => {
//   const image = product.thumbnail || product.image || product.images?.[0] || '';
//   if (!image || image.startsWith('http') || image.startsWith('/')) return image;
//   return `/uploads/${image}`;
// };

const getProductImage = (product) => {
  const image =
    product.thumbnail ||
    product.image ||
    product.images?.[0] ||
    '';

  if (!image) {
    return 'https://placehold.co/400x300';
  }

  if (image.startsWith('http')) {
    return image;
  }

  if (image.startsWith('/')) {
    return `${BACKEND_URL}${image}`;
  }

  return `${BACKEND_URL}/uploads/${image}`;
};

const mapProductFromApi = (product) => ({
  ...product,
  id: product._id || product.id,
  img: getProductImage(product),
  price: Number(product.retailPrice ?? product.price ?? 0),
  mrp: Number(product.mrp ?? product.retailPrice ?? product.price ?? 0),
  wholesalePrice: Number(product.wholesalerPrice ?? product.wholesalePrice ?? 0),
  retailPrice: Number(product.retailPrice ?? product.price ?? 0),
  wholesalerPrice: Number(product.wholesalerPrice ?? product.wholesalePrice ?? 0),
  normalMoq: Number(product.normalMoq ?? product.moq ?? 1),
  wholesalerMoq: Number(product.wholesalerMoq ?? product.moq ?? 1),
  moq: Number(product.normalMoq ?? product.moq ?? 1),
  deliveryPrice: Number(product.deliveryPrice ?? 0),
  stock: Number(product.stock ?? 0),
});

function CategoryUpdater({ setSelectedCategory }) {
  const { categoryName } = useParams();
  useEffect(() => {
    if (categoryName) {
      setSelectedCategory(decodeURIComponent(categoryName));
    } else {
      setSelectedCategory('All Products');
    }
    // High-fidelity page scroll to top on category transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryName, setSelectedCategory]);
  return null;
}

function App() {
  // State for products and filtering
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [priceRange, setPriceRange] = useState(5000);
  const [sortBy, setSortBy] = useState('Recommended');
  const [shopCategories, setShopCategories] = useState([]);

  // UI Modals toggles
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Business state
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const shopCategoryScroller = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const isWholesalerProfile = location.pathname === '/wholesaler/profile';
  const isUserProfile = location.pathname === '/profile';
  const isWholesalerUser = user?.role === 'wholesaler' || user?.role === 'wholeseller' || user?.isWholesaler;
  const hideLayout =
  location.pathname === '/checkout' || location.pathname.startsWith('/invoice');
  const handleCategoryChange = (category) => {
    if (category === 'All Products') {
      navigate('/shop');
    } else {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchShopCategories = async () => {
      try {
        const data = await getCategories();
        if (!ignore) {
          setShopCategories(data);
        }
      } catch (error) {
        console.error('Error fetching shop categories:', error);
        if (!ignore) setShopCategories([]);
      }
    };

    fetchShopCategories();
    return () => { ignore = true; };
  }, []);



  // Fetch products from backend based on filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('category', selectedCategory);
      queryParams.set('search', searchTerm);
      queryParams.set(
        'sort',
        sortBy === 'Price: Low to High' ? 'price-asc' :
        sortBy === 'Price: High to Low' ? 'price-desc' :
        sortBy === 'Popularity' ? 'popularity' : 'Recommended'
      );

      if (priceRange < 5000) {
        queryParams.set('maxPrice', priceRange.toString());
      }

      const res = await fetch(`${BACKEND_URL}/api/products?${queryParams}`);
      if (!res.ok) {
        throw new Error(`Products request failed with status ${res.status}`);
      }

      const data = await res.json();
      const productList = Array.isArray(data) ? data : data.data || data.products || [];

      setProducts(productList.map(mapProductFromApi));
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, priceRange, sortBy]);

  useEffect(() => {
    // Debounce search input to avoid spamming the backend
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  // Cart operations
  const handleAddToCart = (product, quantity) => {
    const minimumQty = Math.max(1, Number(product.moq || product.normalMoq || product.wholesalerMoq || 1));
    const cartProduct = isWholesalerUser
      ? {
          ...product,
          price: Number(product.wholesalePrice || product.price || 0),
          mrp: Number(product.mrp || product.price || 0),
          moq: Number(product.wholesalerMoq || product.moq || 1),
          moqLabel: 'Wholesaler MOQ',
        }
      : {
          ...product,
          moq: minimumQty,
          moqLabel: 'MOQ',
        };
    const addQuantity = Math.max(1, Number(quantity || cartProduct.moq || 1));
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === cartProduct.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === cartProduct.id ? { ...item, quantity: item.quantity + addQuantity } : item
        );
      }
      return [...prevItems, { ...cartProduct, quantity: addQuantity }];
    });
    
    // Auto-open cart for premium micro-experience feedback
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;
        const minimumQty = Math.max(1, Number(item.moq || 1));
        return { ...item, quantity: Math.max(minimumQty, quantity) };
      })
    );
  };

  const handleRemoveCartItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/shop");
  };

  const handleLoginSuccess = (userData) => {
  setUser(userData);
  setIsAuthOpen(false);

  const role = (userData?.role || '').toLowerCase();

  if (role === "admin") {
    const token = localStorage.getItem("token");

    window.location.href =
      `${CLIENT_URL}/?token=${token}`;
      `${CLIENT_URL}/?token=${token}`;
    return;
  }

  if (role === 'wholesaler' || role === 'wholeseller' || userData?.isWholesaler) {
    navigate('/wholesaler/profile');
    return;
  }

  navigate('/profile');
};

  const productCategoryTabs = shopCategories.filter((category) =>
    !['species', 'pet', 'pets'].includes(String(category.label || category.name || '').toLowerCase())
  );
  const currentShopTitle = selectedCategory === 'All Products' ? 'All Products' : selectedCategory;
  const hasScrollableShopCategories = productCategoryTabs.length > 6;

  const scrollShopCategories = (direction) => {
    if (!shopCategoryScroller.current) return;
    shopCategoryScroller.current.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`app-layout${isWholesalerProfile || isUserProfile ? ' app-layout--fixed-dashboard' : ''}`}>
      <Routes>
        <Route path="/" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
        <Route path="/shop" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
        <Route path="/category/:categoryName" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
        <Route path="/services" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
        <Route path="/contact" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
        <Route path="/consultation" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />}/>
        <Route path="/online-consultation/:serviceId" element={<CategoryUpdater setSelectedCategory={setSelectedCategory} />} />
      </Routes>
      
      {/* Site Header */}
      {!hideLayout && (
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />
      )}

      <div className={`app-content-region${isWholesalerProfile || isUserProfile ? ' app-dashboard-scroll-region' : ''}`}>
      {/* Dynamic Main Body Content based on Path */}
      <Routes>
        {/* Booking Calendar / Online Consultation Route */}
        <Route path="/online-consultation/:serviceId" element={<BookingCalendarPage />} />

        <Route path="/wholesaler-reset-password/:token" element={<WholesalerResetPasswordPage backendUrl={BACKEND_URL} />} />
        <Route
          path="/wholesaler/profile"
          element={
            <WholesalerProfilePage
              backendUrl={BACKEND_URL}
              user={user}
              onUserUpdate={setUser}
              onLogout={handleLogout}
            />
          }
        />
        <Route
   path="/about"
  element={
     <AboutUs />
   }
 />

        {/* Services Page Route */}
        <Route path="/services" element={<ServicesPage />} />

        {/* Contact Page Route */}
        <Route path="/contact" element={<ContactPage />} />

        <Route
          path="/profile"
          element={
            <UserProfilePage
              backendUrl={BACKEND_URL}
              user={user}
              onUserUpdate={setUser}
              onLogout={handleLogout}
            />
          }
        />

        {/* Checkout Page Route */}
        {/* <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              user={user}
              onLoginClick={() => setIsAuthOpen(true)}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
              backendUrl={BACKEND_URL}
            />
          }
        /> */}

        <Route
  path="/checkout"
  element={
    <>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      <CheckoutPage
        cartItems={cartItems}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        backendUrl={BACKEND_URL}
      />

      <Footer />
    </>
  }
/>

        <Route path="/invoice/:orderId" element={<InvoicePage backendUrl={BACKEND_URL} />} />
        
        {/* Online Consultation Route */}
        <Route path="/consultation" element={ <OnlineConsultationPage onLoginClick={() => setIsAuthOpen(true)}  /> } />    

         <Route path="/terms" element={<TermsPage />} />

<Route
  path="/privacy-policy"
  element={<PrivacyPolicyPage />}
/>

<Route
  path="/shipping-policy"
  element={<ShippingPolicyPage />}
/>

<Route
  path="/refund-policy"
  element={<RefundPolicyPage />}
/>     
<Route
  path="/order-summary"
  element={
    <OrderSummary
      cartItems={cartItems}
      user={user}
      backendUrl={BACKEND_URL}
    />
  }
/>
      
        {/* Home Page Route */}
        <Route path="/" element={<HomePage user={user}   onAddToCart={handleAddToCart} />} />

        {/* Catalog Main Layout (Catch-all for /shop and /category/*) */}
        <Route 
          path="/*" 
          element={
            <main className="main-content-layout container">
              {/* Breadcrumb strip */}
              {/* <div className="breadcrumb-strip">
                <span>Home</span>
                <span className="breadcrumb-arrow">&gt;</span>
                <span className="active-breadcrumb">{selectedCategory}</span>
              </div> */}

              {/* Title and sorting headers */}
              <div className="shop-page-header">

  <div className="shop-title-wrap">
    <span className="shop-subtitle">
      Browse Product Categories
    </span>

    <h1 className="shop-main-title">
      {currentShopTitle === 'All Products' ? (
        <>Shop By <span>Category</span></>
      ) : (
        <>Shop <span>{currentShopTitle}</span></>
      )}
    </h1>

    <p className="shop-result-count">
      {loading ? 'Loading products...' : `${products.length} product${products.length === 1 ? '' : 's'} found`}
    </p>
  </div>

  <div className="shop-control-bar">
    <button
      type="button"
      className="mobile-filter-trigger shop-filter-trigger"
      onClick={() => setIsMobileSidebarOpen(true)}
    >
      <SlidersHorizontal size={16} />
      Filters
    </button>

    <label className="shop-sort-control">
      <ArrowUpDown size={16} />
      <select
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
        aria-label="Sort products"
      >
        <option>Recommended</option>
        <option>Popularity</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
    </label>
  </div>

  <div className="shop-category-tabs-shell">
    {hasScrollableShopCategories && (
      <button
        type="button"
        className="shop-category-scroll-btn shop-category-scroll-left"
        onClick={() => scrollShopCategories(-1)}
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={20} />
      </button>
    )}

    <div
      ref={shopCategoryScroller}
      className={`shop-category-tabs ${hasScrollableShopCategories ? 'shop-category-tabs-scroll' : ''}`}
      aria-label="Shop by product category"
    >
      <button
        type="button"
        className={`shop-category-tab ${selectedCategory === 'All Products' ? 'active' : ''}`}
        onClick={() => handleCategoryChange('All Products')}
      >
        All Products
      </button>

      {productCategoryTabs.map((category) => (
        <button
          key={category.label}
          type="button"
          className={`shop-category-tab ${selectedCategory === category.label ? 'active' : ''}`}
          onClick={() => handleCategoryChange(category.label)}
        >
          {category.label}
        </button>
      ))}
    </div>

    {hasScrollableShopCategories && (
      <button
        type="button"
        className="shop-category-scroll-btn shop-category-scroll-right"
        onClick={() => scrollShopCategories(1)}
        aria-label="Scroll categories right"
      >
        <ChevronRight size={20} />
      </button>
    )}
  </div>

</div>

              {/* Workspace Body Grid */}
              <div className="catalog-body-grid">
                {/* Desktop Sidebar Filters */}
                <Sidebar
                  selectedCategory={selectedCategory}
                  setSelectedCategory={handleCategoryChange}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  isOpen={isMobileSidebarOpen}
                  onClose={() => setIsMobileSidebarOpen(false)}
                />

                {/* Products Content Area */}
                <div className="products-grid-wrapper">
                  {loading ? (
                    /* Skeletal Loaders */
                    <div className="products-grid">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="product-skeleton-card">
                          <div className="skeleton skeleton-img"></div>
                          <div className="skeleton-details">
                            <div className="skeleton skeleton-text short"></div>
                            <div className="skeleton skeleton-text title"></div>
                            <div className="skeleton skeleton-text desc"></div>
                            <div className="skeleton-footer">
                              <div className="skeleton skeleton-text price"></div>
                              <div className="skeleton skeleton-btn"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    /* Empty Search Results */
                    <div className="catalog-empty-state">
                      <div className="empty-dog-illustration">🐕💨</div>
                      <h3>No products found</h3>
                      <p>We couldn't find matches. Try adjusting your category filters or search keywords.</p>
                      <button 
                        className="reset-filters-btn"
                        onClick={() => {
                          setSearchTerm('');
                          handleCategoryChange('All Products');
                          setPriceRange(5000);
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    /* Products Cards Grid */
                    <div className="products-grid animate-fade">
                      {products.map((product) => {
                        const displayProduct = isWholesalerUser
                          ? {
                              ...product,
                              price: Number(product.wholesalePrice || product.price || 0),
                              mrp: Number(product.mrp || product.price || 0),
                              moq: Number(product.wholesalerMoq || product.moq || 1),
                              moqLabel: 'Wholesaler MOQ',
                            }
                          : {
                              ...product,
                              moq: Number(product.normalMoq || product.moq || 1),
                              moqLabel: 'MOQ',
                            };
                        return (
                       <Link
  key={product.id}
  to={`/product/${product.id}`}
  className="featured-product-card"
  onClick={(e) => {
    e.preventDefault();
    setSelectedProduct({
      ...displayProduct,
      image: displayProduct.img,
    });
  }}
>

 
  <div className="featured-product-image">
    <img
      src={displayProduct.img}
      alt={displayProduct.name}
      onError={(e) => {
        e.currentTarget.src = 'https://placehold.co/400x300';
      }}
    />
  

    {/* <img
  src="https://dr-snoopy2.onrender.com/uploads/1780942794108-joinus.webp"
  alt=""
/> */}
  </div>

  <div className="featured-product-content">
    <p className="featured-brand">
      {displayProduct.brand || "Dr Snoopy"}
    </p>

    <h3>{displayProduct.name}</h3>

    <p className="featured-weight">
      {displayProduct.moqLabel}: {displayProduct.moq || 1}
    </p>

    <div className="featured-rating">
      ★★★★★ <span>(124 Reviews)</span>
    </div>

    <div className="featured-bottom">
      <div>
        <div className="featured-price">
          ₹{displayProduct.price}
        </div>

        {displayProduct.mrp > displayProduct.price && (
          <span className="featured-old-price">
            ₹{displayProduct.mrp}
          </span>
        )}
      </div>

      <button
        className="add-btn"
        onClick={(e) => {
          e.preventDefault();
          handleAddToCart(displayProduct);
        }}
      >
        + Add
      </button>
    </div>
  </div>
</Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </main>
          }
        />
      </Routes>

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        backendUrl={BACKEND_URL}
      />

      {/* Login / Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        backendUrl={BACKEND_URL}
      />

      {/* Product Detailed Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          backendUrl={BACKEND_URL}
        />
      )}

      {/* Footer */}
      {!hideLayout &&
      <Footer />
}
      </div>

      {/* Localized custom scoped CSS styles */}
      <style>{`


/* SHOP PRODUCT CARD */

.featured-product-card{
  position:relative;
  background:#fff;
  border-radius:12px;
  overflow:hidden;
  text-decoration:none;
  color:#222;
  box-shadow:0 4px 12px rgba(0,0,0,.08);
  transition:.25s;
  
  
}

.featured-product-card:hover{
  transform:translateY(-8px);
  box-shadow:0 20px 40px rgba(0,0,0,.12);
}

.featured-product-image{
  height:140px;
  overflow:hidden;
}

.featured-product-image img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
   transition:transform .6s ease;
}

.featured-product-card:hover .featured-product-image img{
  transform:scale(1.08);
}

.sale-badge{
  position:absolute;
  top:12px;
  left:12px;
  background:#25b35b;
  color:#fff;
  font-size:10px;
  font-weight:600;
  padding:7px 12px;
  border-radius:5px;
  z-index:2;
}

.featured-product-content{
  padding:10px 12px;
}

.featured-brand{
  font-size:11px;
  color:#777;
  text-transform:uppercase;
  margin-bottom:6px;
}

.featured-product-content{
  padding:10px;
}

.featured-product-content h3{
  font-size:15px;
  font-weight:600;
  line-height:1.35;
  margin-bottom:6px;

  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;

  min-height:36px;
}

.featured-weight{
  font-size:12px;
  color:#888;
  margin-bottom:8px;
}

.featured-rating{
  color:#f5a623;
  font-size:12px;
  margin-bottom:14px;
}

.featured-rating span{
  color:#666;
  margin-left:6px;
}

.featured-bottom{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
}

.featured-price{
  font-size:18px;
  font-weight:700;
  color:#143d32;
}

.featured-old-price{
  display:block;
  font-size:12px;
  color:#888;
  text-decoration:line-through;
}

.add-btn{
  border:none;
  background:#0b3d2e;
  color:#fff;
  border-radius:22px;
  padding:10px 18px;
  font-size:14px;
  font-weight:600;
  cursor:pointer;
}

// .add-btn:hover{
//   background:#e59400;
// }


.products-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:20px;
}

@media(max-width:1200px){
  .products-grid{
    grid-template-columns:repeat(3,1fr);
  }
}

@media(max-width:900px){
  .products-grid{
    grid-template-columns:repeat(2,1fr);
  }
}

@media(max-width:600px){
  .products-grid{
    grid-template-columns:1fr;
  }
}

        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-layout--fixed-dashboard {
          height: 100dvh;
          overflow: hidden;
        }

        .app-layout--fixed-dashboard .ds-header {
          flex: 0 0 auto;
        }

        .app-content-region {
          flex: 1 0 auto;
          display: flex;
          flex-direction: column;
        }

        .app-dashboard-scroll-region {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .app-layout--fixed-dashboard .wholesaler-dashboard-page {
          min-height: 100%;
        }

        .app-layout--fixed-dashboard .footer {
          margin-top: 0;
        }

        @media (max-width: 900px) {
          .app-layout--fixed-dashboard {
            height: auto;
            min-height: 100vh;
            overflow: visible;
          }

          .app-dashboard-scroll-region {
            overflow: visible;
          }
        }

        @media (min-width: 901px) {
          .app-layout--fixed-dashboard .app-dashboard-scroll-region {
            display: flex;
            flex-direction: column;
          }

          .app-layout--fixed-dashboard .wholesaler-dashboard-page {
            flex: 1 0 auto;
          }
        }

        .main-content-layout {
          flex-grow: 1;
          width: 100%;
          padding-top: 24px;
          padding-bottom: 60px;
        }

        /* Breadcrumb navigation */
        .breadcrumb-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-medium);
          margin-bottom: 24px;
        }

        .breadcrumb-arrow {
          font-size: 12px;
          color: var(--text-light);
        }

        .active-breadcrumb {
          color: var(--text-dark);
          font-weight: 600;
        }

        /* Catalog Title & Sort block */
        .catalog-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 36px;
        }

        .catalog-main-title {
          font-size: 44px;
          font-weight: 850;
          color: var(--secondary-color);
          font-family: var(--font-headers);
          line-height: 1.1;
        }

        .catalog-actions-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mobile-filter-trigger {
          display: none;
          background: white;
          border: 1px solid var(--border-light);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: var(--text-dark);
          box-shadow: var(--shadow-sm);
        }

        .sort-dropdown-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-medium);
        }

        .sort-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sort-select {
          appearance: none;
          -webkit-appearance: none;
          background: white;
          border: 1px solid var(--border-light);
          padding: 8px 36px 8px 16px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-dark);
          border-radius: var(--radius-sm);
          outline: none;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .sort-select:focus {
          border-color: var(--secondary-color);
          box-shadow: 0 0 0 3px rgba(247, 147, 30, 0.1);
        }

        .sort-icon-chevron {
          position: absolute;
          right: 12px;
          pointer-events: none;
          color: var(--text-medium);
        }

        /* Workspace Grid */
        // .catalog-body-grid {
        //   display: flex;
        //   gap: 30px;
        // }
        .catalog-body-grid{
  display:grid;
  grid-template-columns:280px minmax(0,1fr);
  gap:32px;
  align-items:start;
  width:100%;
  min-width:0;
}

        .products-grid-wrapper {
          flex-grow: 1;
          width:100%;
          min-width:0;
        }

        // .products-grid {
        //   display: grid;
        //   grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        //   gap: 20px;
        // }
        .products-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:20px;
}

        /* Skeleton Loaders Styling */
        .product-skeleton-card {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
          height: 380px;
          display: flex;
          flex-direction: column;
        }

        .skeleton-img {
          height: 200px;
          width: 100%;
        }

        .skeleton-details {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .skeleton-text {
          height: 12px;
          border-radius: var(--radius-sm);
        }

        .skeleton-text.short {
          width: 40%;
        }

        .skeleton-text.title {
          height: 18px;
          width: 80%;
        }

        .skeleton-text.desc {
          height: 32px;
          width: 100%;
        }

        .skeleton-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .skeleton-text.price {
          height: 18px;
          width: 30%;
        }

        .skeleton-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }

        /* Empty state search and filter triggers */
        .catalog-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          width:100%;
          min-height:380px;
        }

        .empty-dog-illustration {
          font-size: 54px;
          margin-bottom: 16px;
        }

        .catalog-empty-state h3 {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 6px;
        }

        .catalog-empty-state p {
          color: var(--text-medium);
          font-size: 14.5px;
          max-width: 400px;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .reset-filters-btn {
          background-color: var(--secondary-color);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 9999px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .reset-filters-btn:hover {
          background-color: var(--secondary-hover);
        }


        @media (max-width: 768px) {
          .catalog-body-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 0;
          }

          .catalog-main-title {
            font-size: 32px;
          }

          .catalog-header-row {
            margin-bottom: 24px;
          }

          .mobile-filter-trigger {
            display: flex;
          }

          .sort-label {
            display: none; /* hide label on mobile to save space */
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 12px;
          }

          .product-skeleton-card {
            height: 320px;
          }

          .skeleton-img {
            height: 140px;
          }
        }


        .shop-page-header{
  margin-bottom:32px;
}

.shop-title-wrap{
  text-align:center;
  margin-bottom:18px;
}

.shop-subtitle{
  display:block;
  color:#f6a400;
  font-size:14px;
  font-weight:600;
  letter-spacing:.08em;
  text-transform:uppercase;
  margin-bottom:10px;
}

.shop-main-title{
  font-family:'Playfair Display', serif;
  font-size:52px;
  font-weight:700;
  color:#0b3d2e;
  margin:0;
}

.shop-main-title span{
  color:#f6a400;
}

.shop-result-count{
  margin:12px 0 0;
  color:#647067;
  font-size:14px;
  font-weight:700;
}

.shop-control-bar{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:12px;
  margin-bottom:22px;
  flex-wrap:wrap;
}

.shop-filter-trigger{
  height:42px;
  display:none;
  border-radius:999px;
}

.shop-sort-control{
  height:42px;
  display:inline-flex;
  align-items:center;
  gap:8px;
  background:#fff;
  border:1px solid #e4e4e4;
  border-radius:999px;
  padding:0 14px;
  color:#0b3d2e;
  font-weight:800;
  box-shadow:0 6px 18px rgba(11,61,46,.06);
}

.shop-sort-control select{
  border:0;
  background:transparent;
  color:#0b3d2e;
  font-size:14px;
  font-weight:800;
  outline:none;
  cursor:pointer;
}

.shop-category-tabs-shell{
  position:relative;
  max-width:980px;
  margin:0 auto;
}

.shop-category-tabs{
  display:flex;
  justify-content:center;
  gap:12px;
  padding:6px 4px 12px;
  flex-wrap:wrap;
  scroll-behavior:smooth;
}

.shop-category-tabs-scroll{
  justify-content:flex-start;
  flex-wrap:nowrap;
  overflow-x:auto;
  overflow-y:hidden;
  padding:6px 54px 14px;
  scroll-snap-type:x mandatory;
  scrollbar-width:thin;
  scrollbar-color:#f6a400 transparent;
}

.shop-category-tabs-scroll::-webkit-scrollbar{
  height:7px;
}

.shop-category-tabs-scroll::-webkit-scrollbar-thumb{
  background:#f6a400;
  border-radius:999px;
}

.shop-category-tab{
  min-width:max-content;
  height:44px;
  padding:0 22px;
  border:1px solid rgba(11,61,46,.14);
  border-radius:999px;
  background:#fff;
  color:#0b3d2e;
  cursor:pointer;
  font-size:14px;
  font-weight:800;
  box-shadow:0 6px 18px rgba(11,61,46,.06);
  transition:.25s ease;
  scroll-snap-align:center;
}

.shop-category-tab.active{
  background:#083d2d;
  color:white;
  border-color:#083d2d;
  box-shadow:0 12px 28px rgba(8,61,45,.22);
}

.shop-category-tab:hover{
  transform:translateY(-2px);
  border-color:#f6a400;
}

.shop-category-scroll-btn{
  position:absolute;
  top:7px;
  z-index:2;
  width:40px;
  height:40px;
  border-radius:50%;
  border:1px solid rgba(11,61,46,.14);
  background:#fff;
  color:#0b3d2e;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow:0 8px 22px rgba(11,61,46,.12);
  transition:.25s ease;
}

.shop-category-scroll-btn:hover{
  background:#083d2d;
  color:#fff;
  transform:translateY(-2px);
}

.shop-category-scroll-left{
  left:0;
}

.shop-category-scroll-right{
  right:0;
}

@media(max-width:768px){
  .shop-main-title{
    font-size:38px;
  }

  .shop-filter-trigger{
    display:inline-flex;
  }

  .shop-category-tabs,
  .shop-category-tabs-scroll{
    justify-content:flex-start;
  }
}

      `}</style>
    </div>
  );
}

export default App;