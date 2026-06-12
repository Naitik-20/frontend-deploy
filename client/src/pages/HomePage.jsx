import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ShoppingCart, Star,
  Stethoscope, Clock, Shield, HeartPulse, Truck,
  Phone, Mail, MapPin, ArrowRight, Sparkles, Tag,  ShieldCheck,
  BadgeCheck
} from 'lucide-react';
import '../Home.css';
import heroImage from '../uploads/hero.png';

import { getCategories } from '../services/categoryService';
import { getBrandsWeLove } from '../services/brandWeLoveService';
import { getBreeds } from '../services/breedService';

const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const PRODUCT_PLACEHOLDER = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80';

const getProductImage = (product) => {
  const image = product.thumbnail || product.image || product.images?.[0] || '';
  if (!image) return PRODUCT_PLACEHOLDER;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/${image}`;
};

const mapProductFromApi = (product, index) => {
  const price = Number(product.retailPrice ?? product.price ?? 0);
  const mrp = Number(product.mrp ?? product.retailPrice ?? product.price ?? price);
  const retailPrice = Number(product.retailPrice ?? product.price ?? 0);
  const wholesalerPrice = Number(product.wholesalerPrice ?? product.wholesalePrice ?? 0);
  const normalMoq = Number(product.normalMoq ?? product.moq ?? 1);
  const wholesalerMoq = Number(product.wholesalerMoq ?? product.moq ?? 1);
  return {
    id: product._id || product.id || `${product.name}-${index}`,
    name: product.name || 'Product',
    brand: product.brand || product.category || 'Dr. Snoopy',
    category: product.category || '',
    price,
    mrp,
    retailPrice,
    wholesalerPrice,
    normalMoq,
    wholesalerMoq,
    moq: normalMoq,
    img: getProductImage(product),
    tag: product.bestseller ? 'Best Seller' : product.newArrival ? 'New Arrival' : product.trendingProducts ? 'Trending' : 'Featured',
    rating: 4.8,
    newArrival: Boolean(product.newArrival),
    bestseller: Boolean(product.bestseller),
    featuredCollection: Boolean(product.featuredCollection),
    trendingProducts: Boolean(product.trendingProducts),
  };
};



// ─── DATA ──────────────────────────────────────────────────────────────────

// HERO SLIDES — full-width style matching drsnoopy.co.in
// Uses actual Wix images from the live site + gradient fallbacks
const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://static.wixstatic.com/media/0d8787_85d87b25e5a4487ebc803b57dcb8814e~mv2.jpg/v1/fill/w_1920,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-2.jpg',
    fallbackBg: 'linear-gradient(120deg,#0a3a6e 0%,#1268a8 60%,#0f5298 100%)',
    headline: 'Nutritious Meals',
    highlight: 'for Every Paw',
    sub: 'Premium pet food from Royal Canin, Pedigree & more',
    cta: 'Shop Food',
    ctaSecondary: 'Browse All',
    path: '/category/Food',
  },
  {
    id: 2,
    image: 'https://static.wixstatic.com/media/0d8787_5f63d90f1e3848499b17bbb5fa323035~mv2.jpg/v1/fill/w_1920,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-3.jpg',
    fallbackBg: 'linear-gradient(120deg,#4a1942 0%,#7b2d8b 50%,#6a1b9a 100%)',
    headline: 'Treats That Make',
    highlight: 'Them Jump for Joy',
    sub: 'Discover delicious snacks, treats & chews',
    cta: 'Shop Treats',
    ctaSecondary: 'Browse All',
    path: '/category/Snacks & Treats',
  },
  {
    id: 3,
    image: 'https://static.wixstatic.com/media/0d8787_b149c07a1aad40cc89b91344bd966ead~mv2.jpg/v1/fill/w_1920,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-4.jpg',
    fallbackBg: 'linear-gradient(120deg,#1b4332 0%,#2d6a4f 50%,#40916c 100%)',
    headline: 'Grooming & Care',
    highlight: 'for Shiny Happy Pets',
    sub: 'Complete grooming kits, shampoos & spa products',
    cta: 'Shop Grooming',
    ctaSecondary: 'Browse All',
    path: '/category/Grooming Essentials',
  },
  {
    id: 4,
    image: 'https://static.wixstatic.com/media/0d8787_98d13964e2cf4bf9bdb8a855e499575b~mv2.jpg/v1/fill/w_1920,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-5.jpg',
    fallbackBg: 'linear-gradient(120deg,#7c2d12 0%,#c2410c 50%,#ea580c 100%)',
    headline: 'Stylish & Comfortable',
    highlight: 'Essentials for Pets',
    sub: 'Collars, harnesses, beds, clothing & more',
    cta: 'Shop Accessories',
    ctaSecondary: 'Browse All',
    path: '/category/Accessories',
  },
  {
    id: 5,
    image: 'https://static.wixstatic.com/media/0d8787_a589649add3a44eaa3ecb23f52d400f0~mv2.jpg/v1/fill/w_1920,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-6.jpg',
    fallbackBg: 'linear-gradient(120deg,#064e3b 0%,#047857 50%,#10b981 100%)',
    headline: 'Fun & Engaging',
    highlight: 'Toys for Active Pets',
    sub: 'Keep them happy, entertained & mentally sharp',
    cta: 'Shop Toys',
    ctaSecondary: 'Browse All',
    path: '/category/Toys',
  },
  {
    id: 6,
    image: 'https://static.wixstatic.com/media/0d8787_b8cb367b85b64be29891f069e6e194ee~mv2.jpg/v1/fill/w_1920,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-1.jpg',
    fallbackBg: 'linear-gradient(120deg,#0a58a4 0%,#1976d2 50%,#1565c0 100%)',
    headline: 'Health & Wellness',
    highlight: 'for Your Pets',
    sub: 'Vet-approved pharmacy, supplements & care',
    cta: 'Shop Pharmacy',
    ctaSecondary: 'Browse All',
    path: '/category/Pharmacy',
  },
];

const CATEGORIES = [
  { icon: '💊', label: 'Pharmacy', path: '/category/Pharmacy', color: '#fff0f0', accent: '#ef4444', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
  { icon: '🍖', label: 'Food', path: '/category/Food', color: '#fff7ed', accent: '#f97316', img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80' },
  { icon: '🦴', label: 'Snacks & Treats', path: '/category/Snacks & Treats', color: '#fefce8', accent: '#eab308', img: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&q=80' },
  { icon: '✂️', label: 'Grooming', path: '/category/Grooming Essentials', color: '#f0f9ff', accent: '#0ea5e9', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80' },
  { icon: '🎀', label: 'Accessories', path: '/category/Accessories', color: '#fdf4ff', accent: '#a855f7', img: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400&q=80' },
  { icon: '🎾', label: 'Toys', path: '/category/Toys', color: '#f0fdf4', accent: '#22c55e', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80' },
];



const CONSULT_REASONS = [
  { icon: <Stethoscope size={32} />, title: 'Expert Vets', desc: 'BVSC & AH qualified veterinarians with 10+ years experience' },
  { icon: <Clock size={32} />, title: '24/7 Available', desc: 'Round-the-clock online consultation for your pet emergencies' },
  { icon: <Shield size={32} />, title: 'Trusted & Safe', desc: 'Verified prescriptions, safe treatments & zero side-effect products' },
  { icon: <HeartPulse size={32} />, title: 'Pet Health Plans', desc: 'Customized vaccination & wellness schedule for your pet' },
  { icon: <Truck size={32} />, title: 'Home Delivery', desc: 'Medicines & food delivered within 24 hours pan-India' },
  { icon: <Sparkles size={32} />, title: 'Grooming @ Home', desc: 'Professional groomers visit your home at your convenience' },
];

const TOP_BRANDS = ['Royal Canin','Pedigree','Drools','Pedigree Pro','Whiskas','Meo','Purepet','Himalaya','Jerhigh','Canine Creek'];

const TOP_PRODUCTS = [
  { id: 1, name: 'Royal Canin Medium Adult', brand: 'Royal Canin', mrp: 3200, price: 2850, img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80', tag: 'Best Seller', rating: 4.8 },
  { id: 2, name: 'Pedigree Adult Chicken & Rice', brand: 'Pedigree', mrp: 1599, price: 1299, img: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&q=80', tag: 'Top Rated', rating: 4.7 },
  { id: 3, name: 'Simparica Trio Tick & Flea', brand: 'Zoetis', mrp: 2745, price: 2600, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', tag: 'Vet Pick', rating: 4.9 },
  { id: 4, name: 'Drools Focus Puppy Super Premium', brand: 'Drools', mrp: 1999, price: 1699, img: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=500&q=80', tag: 'New Arrival', rating: 4.6 },
  { id: 5, name: 'Whiskas Adult Ocean Fish', brand: 'Whiskas', mrp: 899, price: 749, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80', tag: 'Cat Fav', rating: 4.5 },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: 'First Bark Soft Chicken Tenders 70g', brand: 'First Bark', mrp: 199, price: 190, img: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&q=80' },
  { id: 2, name: 'Jerhigh Chicken Stick Dog Treats', brand: 'Jerhigh', mrp: 150, price: 130, img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80' },
  { id: 3, name: 'Venkys Boww Soap 75g', brand: 'Venkys', mrp: 90, price: 80, img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80' },
  { id: 4, name: 'Tik Out Soap 150g', brand: 'Tick Out', mrp: 147, price: 140, img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80' },
  { id: 5, name: 'Proviboost Syrup 200ml', brand: 'Proviboost', mrp: 300, price: 285, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
  { id: 6, name: 'Vetoquinol Health Up Pro 200ml', brand: 'Vetoquinol', mrp: 280, price: 260, img: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400&q=80' },
  { id: 7, name: 'Eazypet Puppy Dewormer 20ml', brand: 'Eazypet', mrp: 205, price: 190, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80' },
  { id: 8, name: 'Tickfree Shampoo Lavender 75g', brand: 'Tickfree', mrp: 110, price: 105, img: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&q=80' },
];

const FEATURED_COLLECTIONS = [
  {
    title: "Puppy Essentials",
    subtitle: "Everything for your new best friend",
    tag: "New Arrival",
    slug: "puppy-essentials",
    img: "https://i.pinimg.com/736x/05/a7/38/05a73856268a95684ccc0f20250daf41.jpg",
  },
  {
    title: "Luxury Beds",
    subtitle: "Premium comfort for restful sleep",
    tag: "Best Seller",
    slug: "luxury-beds",
    img: "https://i.pinimg.com/736x/51/b4/89/51b489196856d702905a2e774191d828.jpg",
  },
  {
    title: "Healthy Treats",
    subtitle: "Nutritious snacks dogs love",
    tag: "Popular",
    slug: "healthy-treats",
    img: "https://i.pinimg.com/736x/c5/e2/9f/c5e29f905a08e14bed4cf7c177d0c2f4.jpg",
  },
  {
    title: "Outdoor Adventures",
    subtitle: "Gear for walks, hikes & travel",
    tag: "Trending",
    slug: "outdoor-adventure",
    img: "https://i.pinimg.com/736x/bf/0e/85/bf0e85e08613fa9c9529eafb21c67011.jpg",
  },
];

const CARE_FEATURES = [
  {
    icon: "🚚",
    title: "Express Delivery",
    desc: "Same-day delivery in metro cities. Free shipping above ₹799 pan-India."
  },
  {
    icon: "🩺",
    title: "Vet Support",
    desc: "Trusted pet experts available whenever you need guidance."
  },
  {
    icon: "✔️",
    title: "Quality Assured",
    desc: "Only trusted brands and carefully selected products."
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    desc: "Hassle-free returns and quick customer support."
  }
];

const BREEDS = [
  { name: 'Rottweiler', img: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=400&q=80' },
  { name: 'Labrador', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80' },
  { name: 'German Shepherd', img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80' },
  { name: 'Husky', img: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400&q=80' },
  { name: 'Beagle', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80' },
  { name: 'Shih Tzu', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80' },
];

const TRENDING_PRODUCTS = [
  {
    id: 1,
    name: "Premium Dog Bed",
    category: "Beds",
    price: 2499,
    img: "https://i.pinimg.com/736x/89/f0/75/89f07539692ef7d487254cdb7f934ecc.jpg",
  },
  {
    id: 2,
    name: "Chicken Treats",
    category: "Treats",
    price: 399,
    img: "https://i.pinimg.com/736x/e6/7c/64/e67c6447b2aa8496a7504bdd3e098f77.jpg",
  },
  {
    id: 3,
    name: "Pet Harness",
    category: "Accessories",
    price: 899,
    img: "https://i.pinimg.com/736x/6a/1b/8e/6a1b8e0b9bad9630baffd0991f682124.jpg",
  },
  {
    id: 4,
    name: "Interactive Toy",
    category: "Toys",
    price: 599,
    img: "https://i.pinimg.com/736x/d3/51/0e/d3510ed51d1405cd5b13fe25ef26be4a.jpg",
  },
];

const REVIEWS = [
  {
    id: 1,
    initials: "RG",
    name: "Riya Patel",
    subtitle: "Mom to Bruno, Labrador",
    review:
      " DrSnoopy changed how I care for Bruno. The quality of food and the vet support is absolutely unmatched.⭐⭐⭐⭐⭐",
  },
  {
    id: 2,
    initials: "AK",
    name: "Aarav Kumar",
    subtitle: "Dad to Max, Beagle",
    review:
      "Fast delivery, amazing customer service and products my dog genuinely loves.⭐⭐⭐⭐⭐",
  },
  {
    id: 3,
    initials: "SN",
    name: "Sneha Nair",
    subtitle: "Mom to Coco, Shih Tzu",
    review:
      "The grooming collection is fantastic. Coco has never looked happier.⭐⭐⭐⭐⭐",
  },
  {
    id: 4,
    initials: "RP",
    name: "Rahul Patel",
    subtitle: "Dad to Bella, Golden Retriever",
    review:
      " Great experience every time. Premium quality products and easy ordering.⭐⭐⭐⭐⭐",
  },
];



// ─── COMPONENT ─────────────────────────────────────────────────────────────

export default function HomePage({ user, onAddToCart }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [homeProducts, setHomeProducts] = useState([]);
  const [homeCategories, setHomeCategories] = useState(CATEGORIES);
  const [homeBrands, setHomeBrands] = useState([]);
  const [homeBreeds, setHomeBreeds] = useState(BREEDS);
  const [productsLoading, setProductsLoading] = useState(true);
  const navigate = useNavigate();
  const heroTimer = useRef(null);
  const petCategoryScroller = useRef(null);

  const goHero = (index) => {
    if (isHeroTransitioning) return;
    setIsHeroTransitioning(true);
    setHeroIndex(index);
    setTimeout(() => setIsHeroTransitioning(false), 700);
  };

  // Auto-slide hero
  useEffect(() => {
    heroTimer.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(heroTimer.current);
  }, []);

  const handleHeroArrow = (dir) => {
    clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    goHero((heroIndex + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    let ignore = false;
    const fetchHomeProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products?category=All%20Products&search=&sort=Recommended`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.data || data.products || [];
        if (!ignore) setHomeProducts(productList.map(mapProductFromApi));
      } catch (error) {
        console.error('Error fetching home products:', error);
        if (!ignore) setHomeProducts([]);
      } finally {
        if (!ignore) setProductsLoading(false);
      }
    };
    fetchHomeProducts();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchHomeCategories = async () => {
      try {
        const data = await getCategories();
        if (!ignore && data.length > 0) {
          setHomeCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchHomeCategories();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchHomeSupportingData = async () => {
      const [brandsResult, breedsResult] = await Promise.allSettled([
        getBrandsWeLove(),
        getBreeds(),
      ]);

      if (ignore) return;

      if (brandsResult.status === 'fulfilled' && brandsResult.value.length > 0) {
        setHomeBrands(brandsResult.value);
      }

      if (breedsResult.status === 'fulfilled' && breedsResult.value.length > 0) {
        setHomeBreeds(breedsResult.value);
      }
    };

    fetchHomeSupportingData();
    return () => { ignore = true; };
  }, []);

  const productsForHome = homeProducts.length > 0 ? homeProducts : TOP_PRODUCTS;
  const newArrivalProducts = homeProducts.some((product) => product.newArrival)
    ? homeProducts.filter((product) => product.newArrival).slice(0, 4)
    : productsForHome.slice(3, 7);
  const bestsellerProducts = homeProducts.some((product) => product.bestseller)
    ? homeProducts.filter((product) => product.bestseller).slice(0, 4)
    : productsForHome.slice(7, 11);
  const trendingProducts = homeProducts.some((product) => product.trendingProducts)
    ? homeProducts.filter((product) => product.trendingProducts).slice(0, 4)
    : TRENDING_PRODUCTS;
  const featuredCollections = homeProducts.some((product) => product.featuredCollection)
    ? homeProducts
        .filter((product) => product.featuredCollection)
        .slice(0, 4)
        .map((product) => ({
          title: product.name,
          subtitle: product.category || product.brand || 'Featured by DrSnoopy',
          tag: product.tag || 'Featured',
          slug: product.id,
          img: product.img,
          path: '/shop',
        }))
    : FEATURED_COLLECTIONS;
  const featuredProducts = homeProducts.length > 0
    ? (homeProducts.length > 5 ? homeProducts.slice(5, 13) : homeProducts)
    : FEATURED_PRODUCTS;
  const dynamicBrands = [...new Set(productsForHome.map((p) => p.brand).filter(Boolean))];
  const brandItems = homeBrands.length > 0
    ? homeBrands
        .filter((brand) => brand.name)
        .map((brand) => ({ name: brand.name, image: brand.image || '' }))
    : (dynamicBrands.length > 0 ? dynamicBrands : TOP_BRANDS).map((name) => ({ name, image: '' }));
  const brandFilters = ['All', ...dynamicBrands.slice(0, 6)];
  const filteredTopProducts = activeFilter === 'All'
    ? productsForHome
    : productsForHome.filter(p => p.brand === activeFilter);
  const isWholesalerUser = user?.role === 'wholesaler' || user?.role === 'wholeseller' || user?.isWholesaler;
  const getDisplayProduct = (product) => ({
    ...product,
    price: isWholesalerUser ? Number(product.wholesalerPrice || product.price || 0) : Number(product.retailPrice || product.price || 0),
    mrp: Number(product.mrp || product.retailPrice || product.price || 0),
    moq: isWholesalerUser ? Number(product.wholesalerMoq || product.moq || 1) : Number(product.normalMoq || product.moq || 1),
    moqLabel: isWholesalerUser ? 'Wholesaler MOQ' : 'MOQ',
  });


  const [currentIndex, setCurrentIndex] = useState(0);
  
  const visibleReviews = REVIEWS.slice(currentIndex, currentIndex + 3);
  
  const next = () => {
    if (currentIndex + 3 < REVIEWS.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollPetCategories = (direction) => {
    if (!petCategoryScroller.current) return;
    petCategoryScroller.current.scrollBy({
      left: direction * 260,
      behavior: 'smooth',
    });
  };

  return (

    
    <div className="home-page-wrapper">

      {/* ═══════════════════════════════════════════════════
          HERO SLIDER — Full-width, matching drsnoopy.co.in
      ═══════════════════════════════════════════════════ */}

      <link
href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap"
rel="stylesheet"
/>
     <section className="premium-hero">
  <div className="premium-hero-container">

    <div className="premium-hero-left">

      <div className="premium-badge">
        <span className="badge-dot"></span>
        New Summer Collection Just Arrived
      </div>

      <h1 className="premium-title">
        Simplify Your
        <span>Everyday Life</span>
      </h1>

      <p className="premium-desc">
        Premium pet food, healthcare products, grooming essentials
        and expert vet consultations for your furry companion.
      </p>

      

      <Link to="/shop" className="view-all-link">
        View All <ArrowRight size={16}/>
      </Link>

    </div>

  <div className="premium-feature-card">

  <div className="feature-item">
    <ShieldCheck className="feature-icon" />
    Premium Quality
  </div>

  <div className="feature-item">
    <BadgeCheck className="feature-icon" />
    Trusted by Pet Parents
  </div>

  <div className="feature-item">
    <Truck className="feature-icon" />
    Fast & Reliable Delivery
  </div>

</div>

  </div>
</section>



<div className="homepage-content-bg">

<section className="pet-category-section">
  <div className="container">

    <span className="pet-category-tag">
      🐾 BROWSE BY PET 🐾
    </span>

    <h2 className="pet-category-title">
      Shop by pet category
    </h2>

    <div className="pet-category-shell">
      {homeBreeds.length > 5 && (
        <button
          type="button"
          className="pet-scroll-btn pet-scroll-left"
          onClick={() => scrollPetCategories(-1)}
          aria-label="Scroll pet categories left"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div
        ref={petCategoryScroller}
        className={`pet-category-grid ${homeBreeds.length > 5 ? 'pet-category-grid-scroll' : ''}`}
      >
        {homeBreeds.map((breed) => (
          <Link
            key={breed.name}
            to={`/category/${encodeURIComponent(breed.name)}`}
            className="pet-circle-card"
          >
            <img src={breed.img} alt={breed.name} />
            <span>{breed.name}</span>
          </Link>
        ))}
      </div>

      {homeBreeds.length > 5 && (
        <button
          type="button"
          className="pet-scroll-btn pet-scroll-right"
          onClick={() => scrollPetCategories(1)}
          aria-label="Scroll pet categories right"
        >
          <ChevronRight size={20} />
        </button>
      )}

    </div>

  </div>
</section>

      {/* ═══════════════════════════════════════════════════
          SHOP BY CATEGORY
      ═══════════════════════════════════════════════════ */}
     

     <section className="product-category-section">

  <div className="section-heading-row">
    <h2>Shop by product Category</h2>

    <Link to="/shop"  className="view-all-link">
      View All <ArrowRight size={16}/>
    </Link>
  </div>

  

  {/* Pet Tabs */}
<div className="product-category-tabs">

  {homeCategories.slice(0, 6).map((category, index) => (
    <Link
      key={category.label}
      to={category.path}
      className={`product-category-tab ${index === 0 ? 'active' : ''}`}
    >
      {category.img && (
        <span className="product-category-tab-thumb">
          <img src={category.img} alt="" />
        </span>
      )}
      {category.label}
    </Link>
  ))}

</div>

{/* Product Grid */}
<div className="shop-category-products">

  {productsForHome.slice(0,8).map((product) => (
    <Link
      key={product.id}
      to="/shop"
      className="product-card"
    >
      <div className="product-card-image">
        

        <img
          src={product.img}
          
          alt={product.name}
          onError={(e)=>{
            e.target.src="https://placehold.co/400x300";
          }}
        />

      

       {/* <img
  src="https://dr-snoopy2.onrender.com/uploads/1780942794108-joinus.webp"
  alt=""
/> */}

        <span className="product-badge">
          SALE 20% OFF
        </span>

        <button
          className="wishlist-btn"
          onClick={(e)=>e.preventDefault()}
        >
          ♡
        </button>

      </div>

      <div className="product-card-content">

        <span className="product-brand">
          {product.brand}
        </span>

        <h3>{product.name}</h3>

        <p className="product-weight">
          MOQ: {product.moq || 1}
        </p>

        <div className="product-rating">
          ★★★★★ <span>(124)</span>
        </div>

        <div className="product-bottom">

          <div>
            <div className="product-price">
              ₹{product.price}
            </div>

            <div className="product-old-price">
              ₹{product.mrp}
            </div>
          </div>

         <button
  className="add-cart-btn"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    const displayProduct = getDisplayProduct(product);

    onAddToCart?.(
      {
        ...displayProduct,
        image: product.img,
      },
      displayProduct.moq || 1
    );
  }}
>
  + Add
</button>

        </div>

      </div>
    </Link>
  ))}

</div>

</section>

 {/* ═══════════════════════════════════════════════════
        NEW ARRIVALS SECTION
      ═══════════════════════════════════════════════════ */}

<section className="new-arrivals-section">

  <div className="section-heading-row">
    <h2>New Arrivals</h2>

    <Link to="/shop" className="view-all-link">
      View All <ArrowRight size={16}/>
    </Link>
  </div>

  <div className="shop-category-products">

    {newArrivalProducts.map(product => (
      <Link
  key={product.id}
  to="/shop"
  className="product-card"
>
  <div className="product-card-image">

    <img
      src={product.img}
      alt={product.name}
      onError={(e)=>{
        e.target.src="https://placehold.co/400x300";
      }}
    />

    <span className="product-badge">
      NEW
    </span>

    <button
      className="wishlist-btn"
      onClick={(e)=>e.preventDefault()}
    >
      ♡
    </button>

  </div>

  <div className="product-card-content">

    <span className="product-brand">
      {product.brand}
    </span>

    <h3>{product.name}</h3>

    <p className="product-weight">
      MOQ: {product.moq || 1}
    </p>

    <div className="product-rating">
      ★★★★★ <span>(124)</span>
    </div>

    <div className="product-bottom">

      <div>
        <div className="product-price">
          ₹{product.price}
        </div>

        <div className="product-old-price">
          ₹{product.mrp}
        </div>
      </div>

    <button
  className="add-cart-btn"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    const displayProduct = getDisplayProduct(product);

    onAddToCart?.(
      {
        ...displayProduct,
        image: product.img,
      },
      displayProduct.moq || 1
    );
  }}
>
  + Add
</button>

    </div>

  </div>
</Link>
    ))}

  </div>

</section>

 {/* ═══════════════════════════════════════════════════
          BESTSELLERS
      ═══════════════════════════════════════════════════ */}
     

<section className="new-arrivals-section">

  <div className="section-heading-row">
    <h2>Bestsellers</h2>

    <Link to="/shop" className="view-all-link">
      View all <ArrowRight size={16}/>
    </Link>
  </div>

  <div className="shop-category-products">

    {bestsellerProducts.map(product => (
      <Link
  key={product.id}
  to="/shop"
  className="product-card"
>
  <div className="product-card-image">

    <img
      src={product.img}
      alt={product.name}
      onError={(e)=>{
        e.target.src="https://placehold.co/400x300";
      }}
    />

    <span className="product-badge">
      NEW
    </span>

    <button
      className="wishlist-btn"
      onClick={(e)=>e.preventDefault()}
    >
      ♡
    </button>

  </div>

  <div className="product-card-content">

    <span className="product-brand">
      {product.brand}
    </span>

    <h3>{product.name}</h3>

    <p className="product-weight">
      MOQ: {product.moq || 1}
    </p>

    <div className="product-rating">
      ★★★★★ <span>(124)</span>
    </div>

    <div className="product-bottom">

      <div>
        <div className="product-price">
          ₹{product.price}
        </div>

        <div className="product-old-price">
          ₹{product.mrp}
        </div>
      </div>

     <button
  className="add-cart-btn"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    const displayProduct = getDisplayProduct(product);

    onAddToCart?.(
      {
        ...displayProduct,
        image: product.img,
      },
      displayProduct.moq || 1
    );
  }}
>
  + Add
</button>

    </div>

  </div>
</Link>
    ))}

  </div>

</section>

</div>





 {/* ═══════════════════════════════════════════════════
      FEATURED COLLECTIONS
═══════════════════════════════════════════════════ */}
<section className="section collection-section">
  <div className="container">

    <div className="section-header-row">
      <div>
        <p className="section-eyebrow">✨ Curated Picks</p>
        <h2 className="section-title">Featured Collections</h2>
      </div>

      <Link
        to="/collections"
        className="section-view-all"
      >
        View All <ArrowRight size={15} />
      </Link>
    </div>

    <div className="collection-grid">
      {featuredCollections.map((collection) => (
        <Link
          key={collection.title}
          to={collection.path || `/collections/${collection.slug}`}
          className="collection-card"
        >
          <div className="collection-img-wrap">
            <img
              src={collection.img}
              alt={collection.title}
              className="collection-img"
              loading="lazy"
            />
            <div className="collection-gradient" />
          </div>

          <div className="collection-content">
            <span className="collection-tag">
              {collection.tag}
            </span>

            <h3 className="collection-title">
              {collection.title}
            </h3>

            <p className="collection-subtitle">
              {collection.subtitle}
            </p>
            
          </div>
          <div className="collection-btn">
  Shop Collection
</div>
        </Link>
      ))}
    </div>

  </div>
</section>

{/* ═══════════════════════════════════════════════════
      TRENDING PRODUCTS
═══════════════════════════════════════════════════ */}
<section className="section trending-section">
  <div className="container">

    <div className="section-header-row">
      <div>
        <p className="section-eyebrow">🔥 Most Loved</p>
        <h2 className="section-title">Trending Products</h2>
      </div>

      <Link
        to="/shop"
        className="section-view-all"
      >
        View All <ArrowRight size={15} />
      </Link>
    </div>

    <div className="trending-grid">
      {trendingProducts.map((product) => (
        <Link
          key={product.id}
          to={product.id ? `/product/${product.id}` : '/shop'}
          className="trending-card"
        >
          <div className="trending-img-wrap">
            <img
              src={product.img}
              alt={product.name}
              className="trending-img"
              loading="lazy"
            />
            <div className="trending-gradient" />
          </div>

          <div className="trending-content">
            <span className="trending-category">
              {product.category}
            </span>

            <h3 className="trending-name">
              {product.name}
            </h3>

            <p className="trending-price">
              ₹{product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>

  </div>
</section>

{/* ═══════════════════════════════════════════════════
      FIRST ORDER DISCOUNT
═══════════════════════════════════════════════════ */}

<section className="discount-section">
  <div className="container">

    <div className="discount-banner">

      <img
        src="https://i.pinimg.com/736x/16/85/7e/16857ea9e29cba2805440e39f8079a2e.jpg"
        alt="Discount Banner"
        className="discount-bg"
      />

      <div className="discount-overlay" />

      <div className="discount-content">

        <span className="discount-badge">
          LIMITED TIME
        </span>

        <h2>
          First Order
          <br />
          Exclusive
          <br />
          Discount
        </h2>

        <p>
          New to DrSnoopy? Enjoy a special welcome offer on
          your first order. Use code at checkout and treat
          your pet right.
        </p>

        <button className="discount-btn">
          Claim Offer →
        </button>

      </div>

      <div className="discount-card">

        <h3>15%</h3>

        <span>OFF in Your First Order</span>

        <div className="coupon-code">
          DRSNOOPY15
        </div>

      </div>

    </div>

  </div>
</section>

<section className="care-section">
  <div className="container">

    <div className="care-wrapper">

      {/* Left Image */}
      <div className="care-image-side">

        <img
          src="https://i.pinimg.com/736x/a9/55/4f/a9554f293acb5ad7e744e2906793ccd3.jpg"
          alt="Pet Care"
          className="care-main-image"
        />

        <div className="care-badge">
          <h3>10+</h3>
          <p>
            Years of Premium Pet Care
          </p>
        </div>

      </div>


      {/* Right Content */}
      <div className="care-content-side">

        <p className="care-eyebrow">
          WHY DRSNOOPY
        </p>

        <h2 className="care-title">
          Built Around Your Pet's Wellbeing
        </h2>

        <p className="care-description">
          We're not just a pet store. We're a comprehensive wellness
          platform designed by vets, nutritionists and devoted pet owners.
        </p>

        <div className="care-grid">

          {CARE_FEATURES.map((item) => (
            <div className="care-item" key={item.title}>

              <div className="care-icon">
                {item.icon}
              </div>

              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>

  </div>
</section>

      {/* ═══════════════════════════════════════════════════
      PET PARENTS REVIEWS
═══════════════════════════════════════════════════ */}
<section className="reviews-section">
  <div className="container">

    <div className="reviews-header">
      <p className="section-eyebrow">HAPPY CUSTOMERS</p>
      <h2 className="reviews-title">
        What Pet Parents Say
      </h2>
    </div>

    <div className="reviews-grid">

 {visibleReviews.map((review) => (
  <div key={review.id} className="review-card">
    <div className="quote-mark">"</div>

    <p className="review-text">
      {review.review}
    </p>

    <div className="review-user">
      <div className="review-avatar">
        {review.initials}
      </div>

      <div>
        <h4>{review.name}</h4>
        <span>{review.subtitle}</span>
      </div>
    </div>
    
  </div>
  
))}


    </div>
    <div className="reviews-nav">

  <button onClick={prev} className="nav-arrow">
    ←
  </button>

  <div className="nav-dots">
    {Array.from({
      length: Math.ceil(REVIEWS.length / 3),
    }).map((_, i) => (
      <span
        key={i}
        className={`dot ${currentIndex === i ? "active" : ""}`}
        onClick={() => setCurrentIndex(i)}
      />
    ))}
  </div>

  <button onClick={next} className="nav-arrow">
    →
  </button>

</div>

  </div>
</section>




{/* ═══════════════════════════════════════════════════
      NEWSLETTER
═══════════════════════════════════════════════════ */}

<section className="newsletter-section">
  <div className="newsletter-box">

    <h2>Join the DrSnoopy Family</h2>

    <p>
      Get pet care tips, exclusive offers, and new arrivals
      straight to your inbox.
    </p>

    <form className="newsletter-form">

      <input
        type="email"
        placeholder="Enter your email address"
      />

      <button type="submit">
        Subscribe
      </button>

    </form>

  </div>
</section>

 
<section className="section brand-strip-section brand-bottom-section">
  <div className="container">

    <div className="section-header-row brand-header-row">
      <div>
        <p className="section-eyebrow">Trusted Names</p>
        <h2 className="section-title">Brands We Love</h2>
      </div>

      <Link to="/shop" className="section-view-all">
        View All <ArrowRight size={15} />
      </Link>
    </div>

    <div className="brand-card-grid">
      {brandItems.slice(0, 12).map((brand) => (
        <Link
          key={brand.name}
          to={`/category/${encodeURIComponent(brand.name)}`}
          className={`brand-card ${brand.image ? 'brand-card-with-image' : ''}`}
        >
          {brand.image ? (
            <div className="brand-logo-wrap">
              <img
                src={brand.image}
                alt={brand.name}
                className="brand-logo-img"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="brand-logo-fallback">
              {brand.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <span>{brand.name}</span>
        </Link>
      ))}
    </div>

  </div>
</section>


      {/* ─── All HomePage Styles ─── */}
      <style>{`

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');
/* HERO */

.homepage-content-bg{
  background:#f7f4ef;
  padding-bottom:80px;
}

.premium-hero{
  position:relative;

  min-height:700px;

  background-image:url("${heroImage}");
  background-size:cover;
  background-position:center;

  overflow:hidden;
}

.premium-hero::before{
  content:"";
  position:absolute;
  inset:0;
  background:transparent;
}

.premium-hero-container{
  position:relative;
  z-index:2;

  max-width:1400px;
  margin:auto;

  min-height:700px;

  padding:0 80px;

  display:flex;
  align-items:center;
  justify-content:space-between;
}

.premium-hero-left{
  max-width:560px;
}

.premium-badge{
  display:inline-flex;
  align-items:center;
  gap:10px;

  background:white;

  padding:10px 18px;

  border-radius:999px;

  font-size:13px;
  font-weight:500;

  color:#1f2937;

  box-shadow:
  0 8px 20px rgba(0,0,0,.08);

  margin-bottom:30px;
}

.badge-dot{
  width:8px;
  height:8px;

  border-radius:50%;
  background:#0f5a48;
}

.premium-title{
  font-family:"Playfair Display", serif;

  font-size:82px;

  line-height:1.2;

  font-weight:700;

  color:#111827;

  margin-bottom:20px;
}

.premium-title span{
  display:block;
  color:#f7a61c;
}


.premium-hero-left{
  max-width:540px;

  transform:translateY(-40px);
}

.premium-desc{
  font-size:22px;
  line-height:1.8;

  color:#5b6473;

  max-width:500px;

  margin-bottom:35px;
}

.premium-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;

  background:#f7a623;

  color:white;

  padding:14px 28px;

  border-radius:10px;

  text-decoration:none;

  font-weight:600;

  transition:.25s ease;
}

.premium-btn:hover{
  transform:translateY(-2px);
  box-shadow:
  0 10px 25px rgba(247,166,28,.3);
}

.premium-feature-card{
  position:absolute;

  right:60px;
  top:50%;

  transform:translateY(-50%);

  width:300px;

  background:#0C3D2E;

  border-radius:14px;

  padding:14px 28px;

  color:white;

  box-shadow:
  0 12px 30px rgba(0,0,0,.15);
}


.feature-item{
  display:flex;
  align-items:center;

  gap:12px;

  height:52px;

  font-size:15px;
  font-weight:500;

  white-space:nowrap;

  border-bottom:
  1px solid rgba(255,255,255,.22);
}

.feature-item:last-child{
  border-bottom:none;
}

.feature-icon{
  width:18px;
  height:18px;

  flex-shrink:0;
}

/* RESPONSIVE */

@media(max-width:1024px){

  .premium-title{
    font-size:60px;
  }

  .premium-hero-container{
    padding:0 40px;
  }
}

@media(max-width:768px){

  .premium-hero{
    min-height:auto;
    padding:60px 0;
  }

  .premium-hero-container{
    flex-direction:column;
    align-items:flex-start;
    gap:32px;
    min-height:auto;
    padding:0 24px;
  }

  .premium-title{
    font-size:clamp(32px, 8vw, 48px);
  }

  .premium-desc{
    font-size:16px;
    max-width:100%;
  }

  .premium-feature-card{
    width:100%;
    max-width:100%;
  }

  .premium-badge{
    font-size:13px;
    padding:10px 18px;
  }

  .pet-category-title{
    font-size:clamp(28px, 7vw, 36px);
  }

  .pet-scroll-btn{
    top:56px;
    width:38px;
    height:38px;
  }

  .pet-category-grid{
    gap:20px;
  }
}

@media(max-width:480px){
  .premium-hero{
    padding:40px 0;
  }

  .premium-hero-container{
    padding:0 16px;
  }

  .premium-title{
    font-size:clamp(24px, 10vw, 34px);
    line-height:1.05;
  }

  .premium-desc{
    font-size:15px;
    line-height:1.7;
  }

  .view-all-link{
    padding:10px 14px;
    font-size:14px;
  }

  .premium-feature-card{
    width:100%;
    max-width:100%;
  }

  .pet-category-title{
    font-size:28px;
    margin-bottom:35px;
  }

  .pet-circle-card span{
    font-size:18px;
  }

  .pet-category-grid{
    gap:20px;
  }

  .pet-category-grid-scroll{
    padding:4px 16px 18px;
  }
}


/* PET CATEGORY SECTION */


.pet-category-section{
  padding:90px 0;
  background:#f7f4ef;
  text-align:center;
}

.pet-category-tag{
  display:inline-block;
  color:#f7a61c;
  font-size:14px;
  font-weight:700;
  letter-spacing:1.5px;
  margin-bottom:12px;
}

.pet-category-title{
  font-size:56px;
  font-weight:700;
  color:#0c3528;
  margin-bottom:55px;
  font-family:"Playfair Display", serif;
}

.pet-category-shell{
  position:relative;
  max-width:1120px;
  margin:0 auto;
}

.pet-category-grid{
  display:flex;
  justify-content:center;
  gap:34px;
  flex-wrap:wrap;
  padding:4px 8px 14px;
  scroll-behavior:smooth;
}

.pet-category-grid-scroll{
  justify-content:flex-start;
  flex-wrap:nowrap;
  overflow-x:auto;
  overflow-y:hidden;
  padding:4px 52px 18px;
  scroll-snap-type:x mandatory;
  scrollbar-width:thin;
  scrollbar-color:#f5b942 transparent;
}

.pet-category-grid-scroll::-webkit-scrollbar{
  height:8px;
}

.pet-category-grid-scroll::-webkit-scrollbar-thumb{
  background:#f5b942;
  border-radius:999px;
}

.pet-circle-card{
  text-decoration:none;
  color:#0c3528;
  flex:0 0 180px;
  scroll-snap-align:center;
  text-align:center;
}

.pet-circle-card img{
  width:165px;
  height:165px;
  border-radius:50%;
  object-fit:cover;

  border:4px solid #e7edf8;

  transition:all .3s ease;
}

.pet-circle-card span{
  display:block;
  margin-top:14px;
  font-size:26px;
  font-weight:600;
  color:#123728;
}

.pet-circle-card:hover img{
  transform:translateY(-6px);
  border-color:#f7a61c;
  box-shadow:0 18px 40px rgba(0,0,0,.12);
}

.pet-scroll-btn{
  position:absolute;
  top:72px;
  z-index:3;
  width:42px;
  height:42px;
  border-radius:50%;
  border:1px solid rgba(11,61,46,.12);
  background:#ffffff;
  color:#0b3d2e;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow:0 10px 28px rgba(0,0,0,.12);
  transition:.25s ease;
}

.pet-scroll-btn:hover{
  background:#0b3d2e;
  color:#fff;
  transform:translateY(-2px);
}

.pet-scroll-left{
  left:0;
}

.pet-scroll-right{
  right:0;
}

 /* shopy by product category */

/* ==========================
   PRODUCT SECTION
========================== */

.product-category-section{
  max-width:1200px;
  margin:80px auto;
    background:#f7f4ef;
}

.section-heading-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:30px;
  font-family:"Playfair Display", serif;
}

.view-all-link{
  display:flex;
  align-items:center;
  gap:8px;

  text-decoration:none;

  color:#f5a623;
  font-size:16px;
  font-weight:600;

  transition:.3s ease;
}

.view-all-link:hover{
  color:#e9970b;
  transform:translateX(3px);
}

.view-all-link svg{
  width:16px;
  height:16px;
}

.section-heading-row h2{
  font-family:'Playfair Display', serif;
  font-size:48px;
  font-weight:700;
  color:#0b3d2e;
  margin:0;
}

/* ==========================
   PRODUCT CARDS
========================== */

.product-category-section{
  padding:70px 0;
}

.section-heading-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:30px;
}

.section-heading-row h2{
  font-family:'Playfair Display', serif;
  font-size:42px;
  font-weight:700;
  color:#0b3d2e;
  margin:0;
}

.discover-more-btn{
  background:#f5a623;
  color:#fff;
  text-decoration:none;
  padding:14px 28px;
  border-radius:12px;
  font-weight:600;
  display:flex;
  align-items:center;
  gap:8px;
  transition:.3s;
}

.discover-more-btn:hover{
  transform:translateY(-2px);
}

.product-card-content h3{
  transition:
    color .35s ease,
    transform .35s ease;
}

.product-card-image::after{
  content:"";
  position:absolute;
  inset:0;
  background:rgba(0,0,0,0);
  transition:.4s ease;
}

.product-card:hover .product-card-image::after{
  background:rgba(0,0,0,.08);
}

.add-cart-btn{
  transition:
    background .3s ease,
    transform .3s ease;
}

.product-card:hover .add-cart-btn{
  transform:translateY(-2px);
}

.add-cart-btn:hover{
  background:#ea9800;
}

.product-category-tabs{
  display:flex;
  justify-content:center;
  gap:14px;
  margin:0 auto 38px;
  padding:8px 6px;
  flex-wrap:wrap;
}

.product-category-tab{
  min-height:48px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  background:#fff;
  border:1px solid rgba(11,61,46,.12);
  color:#123728;
  padding:8px 18px 8px 10px;
  border-radius:999px;
  font-size:14px;
  font-weight:800;
  line-height:1.1;
  text-decoration:none;
  box-shadow:0 6px 18px rgba(18,55,40,.06);
  transition:.25s ease;
  max-width:210px;
}

.product-category-tab-thumb{
  width:32px;
  height:32px;
  border-radius:50%;
  overflow:hidden;
  flex:0 0 32px;
  background:#f7f4ef;
  border:1px solid rgba(247,166,28,.28);
}

.product-category-tab-thumb img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

.product-category-tab.active{
  background:#0b3d2e;
  color:#fff;
  border-color:#0b3d2e;
  box-shadow:0 12px 28px rgba(11,61,46,.22);
}

.product-category-tab:hover{
  transform:translateY(-3px);
  border-color:#f7a61c;
  box-shadow:0 14px 30px rgba(0,0,0,.1);
}

.shop-category-products{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:18px;
}

// .product-card{
//   background:#fff;
//   border-radius:16px;
//   overflow:hidden;
//   text-decoration:none;
//   color:#111;
//   box-shadow:0 4px 16px rgba(0,0,0,.06);
//  transition:
//     transform .35s ease,
//     box-shadow .35s ease;
// }

.product-card{
  background:#fff;
  border-radius:14px;
  overflow:hidden;
  text-decoration:none;
  color:#111;
  border:1px solid rgba(11,61,46,.06);

  box-shadow:
    0 10px 30px rgba(0,0,0,.05);

  transition:.35s ease;
   max-width:250px;
}

.product-card-image{
  height:145px; /* was 170 */
}

.product-card-content{
  padding:12px;
}

.product-brand{
  color:#f28c18;
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
  margin-bottom:4px;
}

.product-card-content h3{
  margin:4px 0;
  font-size:16px;   /* was 20 */
  font-weight:600;
  line-height:1.3;

  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;

  min-height:40px;
}

.product-weight{
  color:#777;
  font-size:13px;
  margin-bottom:8px;
}

.product-rating{
  color:#f5a623;
  font-size:12px;
  margin-bottom:10px;
}

.product-rating span{
  color:#777;
  margin-left:4px;
  font-size:12px;
}

.product-bottom{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.product-price{
  font-size:18px; /* was 24 */
  font-weight:700;
  color:#0b3d2e;
  line-height:1;
}

.product-old-price{
  font-size:12px;
  color:#999;
  text-decoration:line-through;
  margin-top:3px;
}

.add-cart-btn{
  border:none;
  background:#0b3d2e;
  color:#fff;

  height:38px;
  padding:0 18px;

  border-radius:999px;

  font-size:14px;
  font-weight:600;
  cursor:pointer;
}


.product-card:hover{
  transform:translateY(-10px);
   transition:
    transform .35s ease,
    box-shadow .35s ease;
}


// .product-card-image{
//   position:relative;
//   height:170px;
//   overflow:hidden;
// }

.product-card-image img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
   transition:
    transform .6s ease;
}


.product-card:hover .product-card-image img{
  transform:scale(1.08);
}


.product-card-content{
  transition:transform .35s ease;
}

.product-card:hover .product-card-content{
  transform:translateY(-3px);
}

.product-badge{
  position:absolute;
  top:10px;
  left:10px;

  background:#f97316;
  color:#fff;

  font-size:10px;
  font-weight:700;

  padding:6px 12px;
  border-radius:999px;
}

.wishlist-btn{
  position:absolute;
  top:10px;
  right:10px;

  width:30px;
  height:34px;

  border:none;
  border-radius:50%;

  background:#fff;

  display:flex;
  align-items:center;
  justify-content:center;

  cursor:pointer;

  box-shadow:0 2px 8px rgba(0,0,0,.08);
}

// .product-card-content{
//   padding:14px;
// }

// .product-brand{
//   color:#f59e0b;
//   font-size:12px;
//   font-weight:700;
//   text-transform:uppercase;
// }

// .product-card-content h3{
//   margin:8px 0;
//   font-size:20px;
//   line-height:1.4;
//   color:#222;

//   display:-webkit-box;
//   -webkit-line-clamp:2;
//   -webkit-box-orient:vertical;
//   overflow:hidden;

//   min-height:52px;
// }

// .product-weight{
//   color:#777;
//   font-size:14px;
//   margin-bottom:10px;
// }

// .product-rating{
//   color:#f5a623;
//   font-size:14px;
//   margin-bottom:14px;
// }

// .product-rating span{
//   color:#777;
//   margin-left:6px;
// }

// .product-bottom{
//   display:flex;
//   justify-content:space-between;
//   align-items:center;
// }

// .product-price{
//   font-size:24px;
//   font-weight:700;
//   color:#0b3d2e;
// }

// .product-old-price{
//   font-size:14px;
//   color:#999;
//   text-decoration:line-through;
// }

// .add-cart-btn{
//   border:none;
//   background:#f5a623;
//   color:#fff;

//   padding:12px 22px;

//   border-radius:999px;

//   font-size:14px;
//   font-weight:600;

//   cursor:pointer;
// }

@media(max-width:1200px){
  .shop-category-products{
    grid-template-columns:repeat(3,1fr);
  }
}

@media(max-width:900px){
  .shop-category-products{
    grid-template-columns:repeat(2,1fr);
  }
}

@media(max-width:600px){
  .shop-category-products{
    grid-template-columns:1fr;
  }

  .section-heading-row{
    flex-direction:column;
    gap:16px;
    align-items:flex-start;
  }

      }


// .wishlist-btn{
//   position:absolute;
//   top:14px;
//   right:14px;

//   width:32px;
//   height:32px;

//   border:none;
//   border-radius:50%;
//   background:#fff;

//   display:flex;
//   align-items:center;
//   justify-content:center;

//   cursor:pointer;

//   color:#777;
//   font-size:16px;

//   z-index:3;
// }

.wishlist-btn:hover{
  color:#f5a623;
}

.featured-product-card{
  position:relative;
}

.new-arrivals-section{
  max-width:1200px;
  margin:80px auto;
}

.new-arrivals-section .section-heading-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:24px;
  padding-bottom:16px;
  border-bottom:1px solid #ddd;
}

.new-arrivals-section h2{
  margin:0;
  font-size:30px;
  font-family:'Playfair Display', serif;
  
  font-weight:700;
  color:#1f1f1f;
  font-weight:700;
}

.view-all-link{
  display:flex;
  align-items:center;
  gap:6px;
  text-decoration:none;
  color:#f5a623;
  font-size:18px;
  font-weight:500;
}

.view-all-link svg{
  width:16px;
  height:16px;
}



    /*****************************************
FEATURED COLLECTIONS
******************************************/
.collection-section{
  background:#f6f4ef;
  padding:90px 0;
}

.collection-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:24px;
  margin-top:50px;
}

/* Card */
.collection-card{
  background:#fff;
  border-radius:28px;
  overflow:hidden;
  text-decoration:none;
  color:#1f1f1f;
  box-shadow:0 8px 20px rgba(0,0,0,.05);
  transition:.35s;
  display:flex;
  flex-direction:column;
}

.collection-card:hover{
  transform:translateY(-8px);
}

/* Image */
.collection-img-wrap{
  position:relative;
  height:280px;
  overflow:hidden;
}

.collection-img{
  width:100%;
  height:100%;
  object-fit:cover;
  transition:.4s;
}

.collection-card:hover .collection-img{
  transform:scale(1.05);
}

/* Optional gradient */
.collection-gradient{
  position:absolute;
  inset:0;
  background:linear-gradient(
    to top,
    rgba(0,0,0,.12),
    transparent
  );
}

/* Content */
.collection-content{
  padding:18px;
  flex:1;
}

/* Badge */
.collection-tag{
  display:inline-block;
  background:#d6a746;
  color:white;
  padding:8px 16px;
  border-radius:50px;
  font-size:12px;
  font-weight:700;
  margin-bottom:16px;
}

/* Category text */
.collection-subtitle{
  color:#7d7d7d;
  font-size:15px;
  line-height:1.6;
  margin-top:10px;
}

/* Product title */
.collection-title{
  font-size:30px;
  font-family:"Playfair Display",serif;
  font-weight:700;
  line-height:1.3;
  margin-bottom:10px;
}

/* Button */
.collection-btn{
  margin:0 18px 18px;
  background:#143c2b;
  color:white;
  height:48px;
  border-radius:50px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:600;
  transition:.3s;
}

.collection-card:hover .collection-btn{
  background:#1b513c;
}

@media (max-width:1200px){
  .collection-grid{
    grid-template-columns:repeat(2,1fr);
  }
}

@media (max-width:768px){

  .collection-section{
    padding:70px 0;
  }

  .collection-grid{
    grid-template-columns:1fr;
    gap:20px;
  }

  .collection-img-wrap{
    height:240px;
  }

  .collection-title{
    font-size:24px;
  }
}
  /* =====================================
   TRENDING PRODUCTS
===================================== */

.trending-section{
    background:#f6f4ef;
    padding:90px 0;
}

/* Center heading */
.trending-section .section-header-row{
    flex-direction:column;
    align-items:center;
    text-align:center;
    gap:12px;
}

.trending-section .section-eyebrow{
    color:#c39232;
    font-size:15px;
    font-weight:600;
    letter-spacing:1px;
}

.trending-section .section-title{
    font-family:"Playfair Display",serif;
    font-size:62px;
    font-weight:700;
    color:#171717;
    margin-bottom:10px;
}

.trending-section .section-view-all{
    margin-top:10px;
    text-decoration:none;
    color:#123728;
    font-weight:600;
}

/* Grid */

.trending-grid{
    margin-top:55px;
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:25px;
}


/* Card */

.trending-card{
    background:#fff;
    border-radius:28px;
    overflow:hidden;
    text-decoration:none;
    color:#1f1f1f;
    box-shadow:0 8px 25px rgba(0,0,0,.06);
    transition:.4s;
}

.trending-card:hover{
    transform:translateY(-10px);
}


/* Image */

.trending-img-wrap{
    position:relative;
    height:300px;
    overflow:hidden;
}

.trending-img{
    width:100%;
    height:100%;
    object-fit:cover;
    transition:.5s;
}

.trending-card:hover .trending-img{
    transform:scale(1.07);
}

.trending-gradient{
    position:absolute;
    inset:0;
    background:linear-gradient(
        to top,
        rgba(0,0,0,.1),
        transparent
    );
}


/* Content */

.trending-content{
    padding:20px;
}

.trending-category{
    color:#d19b34;
    font-size:13px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:1px;
}

.trending-name{
    margin-top:12px;
    font-size:30px;
    font-family:"Playfair Display",serif;
    font-weight:700;
    line-height:1.3;
    color:#161616;
}

.trending-price{
    margin-top:15px;
    font-size:28px;
    font-weight:700;
    color:#123728;
}

/* =====================================
   DISCOUNT SECTION
===================================== */

.discount-section{
    background:#f6f4ef;
    padding-bottom:100px;
}

.discount-banner{
    position:relative;
    overflow:hidden;
    border-radius:40px;
    min-height:520px;
    display:flex;
    align-items:center;
    padding:70px;
}

.discount-bg{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    object-fit:cover;
}

.discount-overlay{
    position:absolute;
    inset:0;
    background:rgba(0,0,0,.45);
}

.discount-content{
    position:relative;
    z-index:2;
    max-width:500px;
    color:white;
}

.discount-badge{
    display:inline-block;
    background:#d39c35;
    color:#fff;
    padding:10px 20px;
    border-radius:50px;
    font-size:13px;
    font-weight:700;
    letter-spacing:1px;
}

.discount-content h2{
    margin-top:25px;
    font-family:"Playfair Display",serif;
    font-size:72px;
    line-height:1.1;
    font-weight:700;
}

.discount-content p{
    margin-top:20px;
    font-size:17px;
    line-height:1.8;
    color:rgba(255,255,255,.9);
}

.discount-btn{
    margin-top:30px;
    border:none;
    background:#123728;
    color:white;
    padding:16px 36px;
    border-radius:60px;
    font-size:16px;
    font-weight:600;
    cursor:pointer;
    transition:.3s;
}

.discount-btn:hover{
    background:#184a35;
}


/* Coupon Card */

.discount-card{
    position:absolute;
    right:70px;
    bottom:70px;
    z-index:2;
    background:white;
    padding:40px;
    border-radius:30px;
    text-align:center;
    min-width:250px;
    box-shadow:0 15px 40px rgba(0,0,0,.15);
}

.discount-card h3{
    font-family:"Playfair Display",serif;
    font-size:70px;
    color:#123728;
    margin-bottom:10px;
}

.discount-card span{
    color:#777;
    font-size:18px;
}

.coupon-code{
    margin-top:25px;
    background:#f6f4ef;
    padding:15px;
    border-radius:15px;
    font-weight:700;
    color:#123728;
    letter-spacing:2px;
}

@media(max-width:1200px){

    .trending-grid{
        grid-template-columns:repeat(2,1fr);
    }

    .discount-content h2{
        font-size:55px;
    }

}

@media(max-width:768px){

    .trending-grid{
        grid-template-columns:1fr;
    }

    .trending-section .section-title{
        font-size:42px;
    }

    .discount-banner{
        padding:40px 25px;
        min-height:auto;
    }

    .discount-card{
        position:static;
        margin-top:40px;
    }

    .discount-content h2{
        font-size:42px;
    }
}

/* ===================================
WHY CHOOSE US
=================================== */

.care-section{
    background:#f6f4ef;
    padding:100px 0;
}

.care-wrapper{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:70px;
    align-items:center;
}


/* LEFT IMAGE */

.care-image-side{
    position:relative;
}

.care-main-image{
    width:100%;
    height:700px;
    object-fit:cover;
    border-radius:40px;
    display:block;
}


/* Floating Badge */

.care-badge{
    position:absolute;
    bottom:-20px;
    right:-25px;
    background:#d39f3a;
    color:white;
    padding:35px;
    border-radius:24px;
    width:180px;
}

.care-badge h3{
    font-family:"Playfair Display",serif;
    font-size:60px;
    margin-bottom:10px;
}

.care-badge p{
    line-height:1.6;
}


/* RIGHT CONTENT */

.care-eyebrow{
    color:#d39f3a;
    letter-spacing:2px;
    font-size:14px;
    font-weight:700;
    margin-bottom:20px;
}

.care-title{
    font-family:"Playfair Display",serif;
    font-size:68px;
    line-height:1.1;
    color:#1d1d1d;
    margin-bottom:30px;
}

.care-description{
    color:#777;
    line-height:1.9;
    font-size:17px;
    max-width:650px;
    margin-bottom:50px;
}


/* Feature Grid */

.care-grid{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:40px;
}

.care-item{
    display:flex;
    gap:18px;
}

.care-icon{
    width:55px;
    height:55px;
    background:#f1f2ec;
    border-radius:50%;
    display:flex;
    justify-content:center;
    align-items:center;
    color:#2c6a4f;
    font-size:22px;
    flex-shrink:0;
}

.care-item h3{
    font-size:22px;
    margin-bottom:10px;
    color:#171717;
}

.care-item p{
    color:#7a7a7a;
    line-height:1.7;
}

@media (max-width:992px){

    .care-wrapper{
        grid-template-columns:1fr;
        gap:50px;
    }

    .care-main-image{
        height:500px;
    }

    .care-title{
        font-size:50px;
    }

    .care-grid{
        grid-template-columns:1fr;
    }

    .care-badge{
        right:20px;
        bottom:20px;
    }
}

@media (max-width:768px){

    .care-title{
        font-size:38px;
    }

    .care-main-image{
        height:400px;
    }

}

/* =====================================
   REVIEWS SECTION (PET PARENTS)
===================================== */

.reviews-section{
  background:#f6f4ef;
  padding:90px 0;
}

/* Header */
.reviews-header{
  text-align:center;
  margin-bottom:55px;
}

.reviews-header .section-eyebrow{
  color:#c39232;
  font-size:15px;
  font-weight:600;
  letter-spacing:1px;
}

.reviews-title{
  font-family:"Playfair Display",serif;
  font-size:58px;
  font-weight:700;
  color:#171717;
  margin-top:10px;
}

/* =========================
   SWIPE CONTAINER
   (IMPORTANT PART)
========================= */

.reviews-grid{
  display:flex;
  gap:25px;
  overflow-x:auto;
  scroll-snap-type:x mandatory;
  scroll-behavior:smooth;
  padding-bottom:10px;

  /* hide scrollbar */
  scrollbar-width:none;
}

.reviews-grid::-webkit-scrollbar{
  display:none;
}

/* =========================
   REVIEW CARD
========================= */

.review-card{
  flex:0 0 calc(33.333% - 17px); /* 3 cards visible */
  background:#fff;
  border-radius:28px;
  padding:30px;
  box-shadow:0 8px 25px rgba(0,0,0,.06);
  position:relative;
  scroll-snap-align:start;
  transition:.4s;
}

.review-card:hover{
  transform:translateY(-8px);
}

/* Quote mark */
.quote-mark{
  font-size:60px;
  font-family:"Playfair Display",serif;
  color:#d6a746;
  line-height:1;
  margin-bottom:10px;
  opacity:.7;
}

/* Review text */
.review-text{
  font-size:16px;
  color:#444;
  line-height:1.7;
  margin-bottom:25px;
}

/* User section */
.review-user{
  display:flex;
  align-items:center;
  gap:14px;
  margin-top:auto;
}

/* Avatar */
.review-avatar{
  width:48px;
  height:48px;
  border-radius:50%;
  background:#123728;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  font-size:14px;
}

/* Name */
.review-user h4{
  font-size:16px;
  font-weight:700;
  margin:0;
  color:#171717;
}

/* Subtitle */
.review-user span{
  font-size:13px;
  color:#777;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width:1200px){
  .review-card{
    flex:0 0 70%;
  }

  .reviews-title{
    font-size:48px;
  }
}

@media (max-width:768px){
  .review-card{
    flex:0 0 85%;
    padding:25px;
  }

  .reviews-title{
    font-size:34px;
  }

  .reviews-section{
    padding:70px 0;
  }
}
  /* =====================================
   NEWSLETTER SECTION (PREMIUM CTA)
===================================== */

.newsletter-section{
  background:#f6f4ef;
  padding:100px 20px;
  display:flex;
  justify-content:center;
}

/* Main Card */
.newsletter-box{
  width:100%;
  max-width:900px;
  background:#ffffff;
  border-radius:32px;
  padding:60px 40px;
  text-align:center;
  box-shadow:0 20px 50px rgba(0,0,0,.08);
  position:relative;
  overflow:hidden;
  transition:.4s;
}

/* soft glow effect */
.newsletter-box::before{
  content:"";
  position:absolute;
  inset:-2px;
  background:radial-gradient(
    circle at top,
    rgba(211, 155, 52, 0.15),
    transparent 60%
  );
  z-index:0;
}

/* keep content above glow */
.newsletter-box > *{
  position:relative;
  z-index:1;
}

/* Title */
.newsletter-box h2{
  font-family:"Playfair Display",serif;
  font-size:48px;
  font-weight:700;
  color:#171717;
  margin-bottom:15px;
}

/* Subtitle */
.newsletter-box p{
  font-size:17px;
  color:#666;
  line-height:1.7;
  max-width:600px;
  margin:0 auto 35px;
}

/* Form */
.newsletter-form{
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
}

/* Input */
.newsletter-form input{
  width:320px;
  height:52px;
  padding:0 18px;
  border-radius:50px;
  border:1px solid #e5e5e5;
  outline:none;
  font-size:15px;
  transition:.3s;
  background:#fafafa;
}

.newsletter-form input:focus{
  border-color:#d6a746;
  background:#fff;
  box-shadow:0 0 0 4px rgba(214,167,70,.15);
}

/* Button */
.newsletter-form button{
  height:52px;
  padding:0 28px;
  border-radius:50px;
  border:none;
  background:#123728;
  color:#fff;
  font-weight:600;
  font-size:15px;
  cursor:pointer;
  transition:.3s;
}

.newsletter-form button:hover{
  background:#1b513c;
  transform:translateY(-2px);
}

/* Hover lift for whole card */
.newsletter-box:hover{
  transform:translateY(-6px);
  box-shadow:0 25px 60px rgba(0,0,0,.12);
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width:768px){
  .newsletter-box{
    padding:40px 25px;
    border-radius:24px;
  }

  .newsletter-box h2{
    font-size:32px;
  }

  .newsletter-form input{
    width:100%;
  }

  .newsletter-form{
    flex-direction:column;
    align-items:stretch;
  }
}

/* =====================================
   REVIEWS NAVIGATION (ARROWS + DOTS)
===================================== */

.reviews-nav{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:20px;
  margin-top:35px;
}

/* Arrow buttons */
.nav-arrow{
  width:42px;
  height:42px;
  border-radius:50%;
  border:none;
  background:#123728;
  color:#fff;
  font-size:18px;
  cursor:pointer;
  transition:.3s;
  display:flex;
  align-items:center;
  justify-content:center;
}

.nav-arrow:hover{
  background:#1b513c;
  transform:translateY(-2px);
}

/* Dots container */
.nav-dots{
  display:flex;
  align-items:center;
  gap:10px;
}

/* Dot style */
.dot{
  width:10px;
  height:10px;
  border-radius:50%;
  background:#cfcfcf;
  cursor:pointer;
  transition:.3s;
}

/* Active dot */
.dot.active{
  background:#d6a746;
  transform:scale(1.3);
}

        /* ══════════════════════════════════════
           ALL OTHER SECTIONS — unchanged from original
        ══════════════════════════════════════ */

        .section { padding: 64px 0; }

        .section-header-row {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 36px; flex-wrap: wrap; gap: 12px;
        }

        .section-eyebrow { font-size: 13px; font-weight: 700; color: var(--secondary-color); margin-bottom: 4px; letter-spacing: 0.5px; }
        .section-title { font-size: clamp(22px, 3.5vw, 34px); font-weight: 850; color: var(--text-dark); font-family: var(--font-headers); margin: 0; }
        .section-view-all {
          display: flex; align-items: center; gap: 6px; font-size: 14px;
          font-weight: 700; color: var(--primary-color); text-decoration: none;
          padding: 8px 16px; border: 2px solid var(--primary-color); border-radius: 8px;
          transition: all 0.3s; white-space: nowrap;
        }
        .section-view-all:hover { background: var(--primary-color); color: white; }

        .category-section-wrap { background: #f8fafc; }

        .category-top-banner {
          display: flex; align-items: center; justify-content: space-between;
          background: linear-gradient(135deg, var(--primary-color), #1a7ad4);
          border-radius: 16px; padding: 20px 28px; margin: 0 auto 36px;
          max-width: 1280px; padding-left: calc(2rem + 20px); padding-right: calc(2rem + 20px);
          flex-wrap: wrap; gap: 16px;
        }

        .cat-banner-left { display: flex; align-items: center; gap: 14px; color: white; }
        .cat-banner-tag { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7); margin: 0 0 4px; letter-spacing: 0.5px; }
        .cat-banner-headline { font-size: 22px; font-weight: 850; color: white; margin: 0; font-family: var(--font-headers); }

        .cat-banner-cta {
          display: flex; align-items: center; gap: 8px; background: white;
          color: var(--primary-color); padding: 10px 22px; border-radius: 8px;
          font-size: 14px; font-weight: 800; text-decoration: none; transition: all 0.3s;
          white-space: nowrap;
        }
        .cat-banner-cta:hover { background: #f7931e; color: white; }

        .category-cards-grid {
          display: grid; grid-template-columns: repeat(6, 1fr);
          gap: 18px; max-width: 1280px; margin: 0 auto; padding: 0 2rem;
        }

        .cat-card {
          text-decoration: none; border-radius: 16px; overflow: hidden;
          background: white; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          border: 2px solid transparent;
        }
        .cat-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 16px 40px rgba(0,0,0,0.14); border-color: var(--cat-accent); }
        .cat-card-img-wrap { position: relative; overflow: hidden; height: 170px; }
        .cat-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .cat-card:hover .cat-card-img { transform: scale(1.12); }
        .cat-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 10px; opacity: 0; transition: opacity 0.35s; }
        .cat-card:hover .cat-card-overlay { opacity: 1; }
        .cat-card-icon { font-size: 28px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4)); }
        .cat-card-footer { padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; }
        .cat-card-label { font-size: 13px; font-weight: 800; color: var(--text-dark); }
        .cat-card-arrow { width: 24px; height: 24px; border-radius: 50%; background: var(--bg-main); display: flex; align-items: center; justify-content: center; color: var(--cat-accent); transition: all 0.3s; }
        .cat-card:hover .cat-card-arrow { background: var(--cat-accent); color: white; transform: translateX(3px); }

        .deal-banner-section { background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); padding: 60px 0; overflow: hidden; position: relative; }
        .deal-banner-inner { display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
        .deal-banner-left { flex: 1; display: flex; align-items: center; gap: 36px; flex-wrap: wrap; }
        .deal-percent-block { display: flex; align-items: flex-start; gap: 4px; flex-shrink: 0; }
        .deal-percent-num { font-size: clamp(80px, 12vw, 140px); font-weight: 900; color: #fcd34d; font-family: 'Outfit', sans-serif; line-height: 1; text-shadow: 0 0 60px rgba(252,211,77,0.4); letter-spacing: -4px; }
        .deal-percent-right { display: flex; flex-direction: column; margin-top: 16px; }
        .deal-percent-sign { font-size: 52px; font-weight: 900; color: #fcd34d; line-height: 1; font-family: 'Outfit', sans-serif; }
        .deal-off-text { font-size: 28px; font-weight: 900; color: #f7931e; letter-spacing: 2px; font-family: 'Outfit', sans-serif; }
        .deal-copy-block { flex: 1; }
        .deal-title { font-size: clamp(20px, 3vw, 34px); font-weight: 900; color: white; font-family: var(--font-headers); margin: 0 0 12px; }
        .deal-sub { font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.65; margin-bottom: 28px; }
        .deal-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .deal-btn-main { padding: 14px 32px; background: #f7931e; color: white; border-radius: 10px; font-size: 16px; font-weight: 800; text-decoration: none; transition: all 0.3s; box-shadow: 0 6px 20px rgba(247,147,30,0.45); }
        .deal-btn-main:hover { background: #db7d14; transform: translateY(-3px); }
        .deal-code-badge { font-size: 14px; color: rgba(255,255,255,0.75); border: 1.5px dashed rgba(255,255,255,0.4); padding: 10px 18px; border-radius: 8px; }
        .deal-code-badge strong { color: #fcd34d; }
        .deal-banner-img-wrap { flex-shrink: 0; width: 320px; position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.4); }
        .deal-banner-img { width: 100%; height: 280px; object-fit: cover; display: block; }
        .deal-banner-sticker { position: absolute; bottom: 16px; right: 16px; background: white; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); font-size: 22px; }
        .sticker-text { font-size: 13px; font-weight: 800; color: var(--primary-color); }

        .top-selling-section { background: white; }
        .ts-filter-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
        .ts-filter-btn { padding: 8px 20px; border-radius: 999px; font-size: 13px; font-weight: 700; background: var(--bg-main); border: 1.5px solid var(--border-light); color: var(--text-medium); cursor: pointer; transition: all 0.25s; }
        .ts-filter-btn.active, .ts-filter-btn:hover { background: var(--primary-color); color: white; border-color: var(--primary-color); }
        .ts-products-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
        .ts-product-card { border-radius: 16px; overflow: hidden; background: white; border: 2px solid var(--border-light); box-shadow: 0 4px 16px rgba(0,0,0,0.06); transition: all 0.35s; }
        .ts-product-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); border-color: var(--primary-color); }
        .ts-card-featured { border-color: var(--secondary-color); }
        .ts-img-wrap { position: relative; overflow: hidden; height: 220px; }
        .ts-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .ts-product-card:hover .ts-img { transform: scale(1.08); }
        .ts-tag { position: absolute; top: 12px; left: 12px; background: var(--secondary-color); color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px; letter-spacing: 0.3px; }
        .ts-card-featured .ts-tag { background: var(--primary-color); }
        .ts-rating { position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.65); color: white; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; backdrop-filter: blur(6px); }
        .ts-info { padding: 14px 16px; }
        .ts-brand { font-size: 11px; font-weight: 700; color: var(--secondary-color); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .ts-name { font-size: 13px; font-weight: 700; color: var(--text-dark); line-height: 1.4; margin-bottom: 10px; }
        .ts-price-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
        .ts-sale { font-size: 18px; font-weight: 900; color: var(--primary-color); }
        .ts-mrp { font-size: 13px; color: var(--text-light); text-decoration: line-through; }
        .ts-off { font-size: 12px; font-weight: 800; color: #16a34a; background: #dcfce7; padding: 2px 8px; border-radius: 999px; }
        .home-moq-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 7px; padding: 5px 8px; margin-bottom: 10px; font-size: 11px; color: var(--text-medium); }
        .home-moq-row strong { color: var(--primary-color); font-weight: 850; }
        .ts-add-btn { width: 100%; padding: 10px; background: var(--primary-color); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 7px; }
        .ts-add-btn:hover { background: var(--primary-hover); transform: translateY(-1px); }

        .brand-strip-section {
          background:#fff8f2;
          border-top:1px solid rgba(247,166,28,.16);
          border-bottom:1px solid rgba(247,166,28,.16);
        }

        .brand-bottom-section {
          padding:72px 0;
        }

        .brand-header-row {
          align-items:center;
        }

        .brand-card-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));
          gap:18px;
        }

        .brand-card {
          min-height:150px;
          background:#fff;
          border:1px solid rgba(18,55,40,.1);
          border-radius:14px;
          padding:18px 14px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:12px;
          text-align:center;
          text-decoration:none;
          color:#123728;
          box-shadow:0 8px 24px rgba(18,55,40,.06);
          transition:.25s ease;
        }

        .brand-card:hover {
          transform:translateY(-5px);
          border-color:#f7a61c;
          box-shadow:0 18px 36px rgba(18,55,40,.12);
        }

        .brand-logo-wrap {
          width:92px;
          height:72px;
          border-radius:12px;
          background:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        }

        .brand-logo-img {
          width:100%;
          height:100%;
          object-fit:contain;
          display:block;
        }

        .brand-logo-fallback {
          width:74px;
          height:74px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#ffd119;
          color:#123728;
          font-size:22px;
          font-weight:900;
          letter-spacing:.04em;
        }

        .brand-card span {
          max-width:100%;
          font-size:14px;
          font-weight:850;
          line-height:1.25;
          overflow-wrap:anywhere;
        }

        .featured-section { background: #f8fafc; }
        .featured-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .feat-card { border-radius: 16px; overflow: hidden; background: white; border: 2px solid var(--border-light); box-shadow: 0 4px 16px rgba(0,0,0,0.05); transition: all 0.35s; display: flex; flex-direction: column; }
        .feat-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); border-color: var(--secondary-color); }
        .feat-img-wrap { position: relative; overflow: hidden; height: 200px; }
        .feat-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .feat-card:hover .feat-img { transform: scale(1.08); }
        .feat-hover-layer { position: absolute; inset: 0; background: rgba(10,88,164,0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
        .feat-card:hover .feat-hover-layer { opacity: 1; }
        .feat-quick-view { background: white; color: var(--primary-color); border: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .feat-quick-view:hover { background: var(--secondary-color); color: white; }
        .feat-info { padding: 14px 16px; flex: 1; display: flex; flex-direction: column; }
        .feat-brand { font-size: 11px; font-weight: 700; color: var(--secondary-color); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .feat-name { font-size: 13px; font-weight: 700; color: var(--text-dark); line-height: 1.4; flex: 1; margin-bottom: 10px; }
        .feat-price-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .feat-sale { font-size: 17px; font-weight: 900; color: var(--primary-color); }
        .feat-mrp { font-size: 12px; color: var(--text-light); text-decoration: line-through; }
        .feat-add-btn { width: 100%; padding: 9px; background: var(--secondary-color); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: auto; }
        .feat-add-btn:hover { background: var(--secondary-hover); transform: translateY(-1px); }

        .breed-section { background: white; }
        .breed-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 18px; }
        .breed-card { position: relative; border-radius: 16px; overflow: hidden; height: 200px; display: block; text-decoration: none; box-shadow: 0 4px 16px rgba(0,0,0,0.1); transition: all 0.35s; }
        .breed-card:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 16px 40px rgba(0,0,0,0.2); }
        .breed-img-wrap { position: absolute; inset: 0; }
        .breed-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s; }
        .breed-card:hover .breed-img { transform: scale(1.12); }
        .breed-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%); }
        .breed-name { position: absolute; bottom: 14px; left: 0; right: 0; text-align: center; color: white; font-size: 14px; font-weight: 800; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }

        .consult-section { background: linear-gradient(135deg, #0d1b2a 0%, #1a2d4a 50%, #0d1b2a 100%); padding: 72px 0; }
        .consult-header { text-align: center; margin-bottom: 52px; }
        .consult-eyebrow { color: #fcd34d !important; }
        .consult-title { font-size: clamp(24px, 4vw, 42px); font-weight: 900; color: white; font-family: var(--font-headers); margin: 0 0 14px; }
        .consult-sub { font-size: 16px; color: rgba(255,255,255,0.6); max-width: 560px; margin: 0 auto; line-height: 1.65; }
        .consult-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
        .consult-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px 28px; transition: all 0.35s; backdrop-filter: blur(10px); text-align: center; }
        .consult-card:hover { background: rgba(255,255,255,0.12); transform: translateY(-6px); border-color: rgba(247,147,30,0.5); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
        .consult-icon-wrap { width: 68px; height: 68px; border-radius: 18px; background: linear-gradient(135deg, var(--secondary-color), #fbbf24); display: flex; align-items: center; justify-content: center; color: white; margin: 0 auto 20px; box-shadow: 0 8px 24px rgba(247,147,30,0.35); }
        .consult-card-title { font-size: 18px; font-weight: 800; color: white; margin-bottom: 10px; font-family: var(--font-headers); }
        .consult-card-desc { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.65; margin: 0; }
        .consult-cta-row { text-align: center; }
        .consult-cta-btn { display: inline-block; padding: 16px 44px; background: var(--secondary-color); color: white; border-radius: 12px; font-size: 16px; font-weight: 800; text-decoration: none; transition: all 0.3s; box-shadow: 0 8px 24px rgba(247,147,30,0.4); }
        .consult-cta-btn:hover { background: var(--secondary-hover); transform: translateY(-3px); box-shadow: 0 14px 36px rgba(247,147,30,0.5); }

        .contact-strip-section { background: white; padding: 64px 0; }
        .contact-strip-title { font-size: clamp(22px, 3vw, 34px); font-weight: 900; color: var(--text-dark); font-family: var(--font-headers); margin-bottom: 32px; }
        .contact-strip-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .contact-strip-card { display: flex; align-items: center; gap: 20px; border-radius: 16px; padding: 24px 28px; text-decoration: none; transition: all 0.35s; border: 2px solid transparent; }
        .contact-phone { background: #eff6ff; }
        .contact-email { background: #f0fdf4; }
        .contact-address { background: #fff7ed; }
        .contact-strip-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
        .contact-phone:hover { border-color: #3b82f6; }
        .contact-email:hover { border-color: #22c55e; }
        .contact-address:hover { border-color: #f97316; }
        .contact-card-icon { width: 58px; height: 58px; border-radius: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .contact-phone .contact-card-icon { background: #3b82f6; color: white; }
        .contact-email .contact-card-icon { background: #22c55e; color: white; }
        .contact-address .contact-card-icon { background: #f97316; color: white; }
        .contact-strip-card:hover .contact-card-icon { transform: scale(1.1) rotate(-5deg); }
        .contact-card-label { font-size: 12px; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px; }
        .contact-card-value { font-size: 15px; font-weight: 800; color: var(--text-dark); margin: 0 0 3px; }
        .contact-card-hint { font-size: 12px; color: var(--text-light); margin: 0; }

        /* ══════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════ */
        @media (max-width: 1100px) {
          .category-cards-grid { grid-template-columns: repeat(3, 1fr); }
          .ts-products-grid { grid-template-columns: repeat(3, 1fr); }
          .featured-grid { grid-template-columns: repeat(2, 1fr); }
          .breed-grid { grid-template-columns: repeat(3, 1fr); }
          .consult-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .hero-section { height: 320px; }
          .hero-headline { font-size: 22px; }
          .hero-sub { font-size: 13px; margin-bottom: 18px; }
          .hero-btn-primary, .hero-btn-outline { font-size: 13px; padding: 10px 20px; }
          .hero-arrow { width: 38px; height: 38px; }
          .hero-arrow-left { left: 10px; }
          .hero-arrow-right { right: 10px; }
          .hero-counter { display: none; }
          .hero-overlay { background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%); }
          .hero-content { align-items: flex-end; padding-bottom: 50px; }
          .hero-text { max-width: 100%; text-align: center; }
          .hero-ctas { justify-content: center; }
          .category-cards-grid { grid-template-columns: repeat(2, 1fr); padding: 0 1rem; }
          .category-top-banner { padding: 16px 1rem; }
          .cat-banner-headline { font-size: 18px; }
          .deal-banner-inner { flex-direction: column; }
          .deal-banner-img-wrap { width: 100%; }
          .deal-percent-num { font-size: 80px; }
          .ts-products-grid { grid-template-columns: repeat(2, 1fr); }
          .featured-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .breed-grid { grid-template-columns: repeat(2, 1fr); }
          .consult-grid { grid-template-columns: 1fr; }
          .contact-strip-cards { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .hero-section { height: 280px; }
          .category-cards-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .ts-products-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .featured-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .breed-grid { grid-template-columns: repeat(2, 1fr); }
          .ts-img-wrap { height: 160px; }
        }
      `}</style>
    </div>
  );
}
