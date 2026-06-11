import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as productService from '../services/productService';
import * as orderService from '../services/orderService';
import * as categoryService from '../services/categoryService';
import * as breedService from '../services/breedService';
import * as brandWeLoveService from '../services/brandWeLoveService';
import * as deliveryService from '../services/deliveryService';
import * as serviceService from '../services/serviceService';
import * as consultationService from '../services/consultationService';
import * as consultationScheduleService from '../services/consultationScheduleService';
import * as wholesalerService from '../services/wholesalerService';

const AdminDashboardContext = createContext(null);
const BACKEND_URL = 'https://dr-snoopy2.onrender.com';
const syncTokenFromUrl = () => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');

  if (!token) return;

  localStorage.setItem('token', token);
  url.searchParams.delete('token');
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
};

const getAdminImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/${image}`;
};
const DEFAULT_CATEGORIES = [];
const ORDER_TO_SHIPMENT_STATUS = {
  PLACED: 'PENDING',
  CONFIRMED: 'CREATED',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
  FAILED: 'FAILED',
};
const SHIPMENT_TO_ORDER_STATUS = {
  PENDING: 'PLACED',
  CREATED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
};
const emptyProduct = {
  name: '', brand: '', manufacturer: '', category: '', sku: '', retailPrice: '',
  wholesalerPrice: '', normalMoq: '', wholesalerMoq: '', moq: '', deliveryPrice: '',
  stock: '', description: '', composition: '', dosage: '', weightGroup: '', petCategory: '',
  newArrival: false, bestseller: false, featuredCollection: false, trendingProducts: false,
};
const emptyCategory = { name: '', description: '', icon: '', image: '', color: '#ffffff', accent: '#0a58a4', subcategories: '', sortOrder: '', isActive: true };
const emptyBreed = { name: '', image: '', sortOrder: '', isActive: true };
const emptyBrandWeLove = { name: '', image: '', sortOrder: '', isActive: true };
const emptyDeliveryMethod = { code: 'HOME_DELIVERY', name: 'Home Delivery', description: '', baseCharge: '', useProductDeliveryCharge: true, logisticsPartner: '', servicePincodes: '', isActive: true };
const emptyPickupStore = { name: '', phone: '', address: '', city: '', state: '', pincode: '', isActive: true };
const DEFAULT_SERVICE_SLOTS = [
  '10:00 am', '10:30 am', '11:00 am', '11:30 am',
  '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm',
  '2:00 pm', '2:30 pm',
];
const getDateInputValue = (offsetDays = 1) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};
const createAvailabilityEntry = (date = getDateInputValue()) => ({
  date,
  slots: DEFAULT_SERVICE_SLOTS.join('\n'),
  isActive: true,
});
const emptyService = {
  title: '',
  slug: '',
  description: '',
  price: '',
  duration: '',
  features: '',
  availability: [createAvailabilityEntry()],
  color: '#0a58a4',
  bg: '#eff6ff',
  isActive: true,
};
const emptyConsultation = { title: '', highlight: '', image: '', sortOrder: '', isActive: true };
const emptyConsultationSchedule = {
  timezoneLabel: 'India Standard Time (IST)',
  advanceBookingLimitDays: 30,
  sameDayBookingEnabled: false,
  bookingCutoffTime: '18:00',
  cancellationWindowHours: 24,
  rescheduleWindowHours: 24,
  doctors: [],
  dates: [],
};
const createScheduleDoctor = () => ({
  doctorId: `doctor-${Date.now()}`,
  name: '',
  speciality: '',
  isActive: true,
  leaveDates: '',
});
const createScheduleDate = () => ({
  date: getDateInputValue(),
  status: 'AVAILABLE',
  isActive: true,
  reason: '',
  slots: [],
});
const createScheduleSlot = () => ({
  time: '10:00 am',
  doctorId: '',
  isActive: true,
  isBlocked: false,
  blockReason: '',
});
const emptyWholesaler = {
  name: '',
  shopName: '',
  phone: '',
  email: '',
  password: '',
  gstNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  isActive: true,
};

export const DELIVERY_METHOD_OPTIONS = [
  { code: 'HOME_DELIVERY', label: 'Home Delivery' },
  { code: 'STORE_PICKUP', label: 'Store Pickup' },
  { code: 'ONLINE_DELIVERY', label: 'Online Delivery' },
];

export function AdminDashboardProvider({ children }) {
  const navigate = useNavigate();
  const tokenSyncedRef = useRef(false);

  if (!tokenSyncedRef.current) {
    syncTokenFromUrl();
    tokenSyncedRef.current = true;
  }

  const [activeTabValue, setActiveTabValue] = useState('overview');
  const setActiveTab = useCallback((tab) => {
    setActiveTabValue(tab);
    const routes = {
      overview: '/admin/dashboard',
      manage: '/admin/products',
      add: '/admin/products/add',
      orders: '/admin/orders',
      categories: '/admin/categories',
      breeds: '/admin/pet-categories',
      brandsWeLove: '/admin/brands-we-love',
      delivery: '/admin/delivery',
      services: '/admin/services',
      consultations: '/admin/consultations',
      wholesalers: '/admin/wholesalers',
      users: '/admin/users',
    };
    if (routes[tab]) navigate(routes[tab]);
  }, [navigate]);
  const fileInputRef = useRef(null);
  const dragRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [brandsWeLove, setBrandsWeLove] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [pickupStores, setPickupStores] = useState([]);
  const [services, setServices] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [wholesalers, setWholesalers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBreeds, setLoadingBreeds] = useState(false);
  const [loadingBrandsWeLove, setLoadingBrandsWeLove] = useState(false);
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [loadingConsultationSchedule, setLoadingConsultationSchedule] = useState(false);
  const [loadingWholesalers, setLoadingWholesalers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderTypeView, setOrderTypeView] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [breedForm, setBreedForm] = useState(emptyBreed);
  const [brandWeLoveForm, setBrandWeLoveForm] = useState(emptyBrandWeLove);
  const [deliveryMethodForm, setDeliveryMethodForm] = useState(emptyDeliveryMethod);
  const [pickupStoreForm, setPickupStoreForm] = useState(emptyPickupStore);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [consultationForm, setConsultationForm] = useState(emptyConsultation);
  const [consultationScheduleForm, setConsultationScheduleForm] = useState(emptyConsultationSchedule);
  const [wholesalerForm, setWholesalerForm] = useState(emptyWholesaler);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingBreed, setEditingBreed] = useState(null);
  const [editingBrandWeLove, setEditingBrandWeLove] = useState(null);
  const [editingDeliveryMethod, setEditingDeliveryMethod] = useState(null);
  const [editingPickupStore, setEditingPickupStore] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [editingWholesaler, setEditingWholesaler] = useState(null);
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [breedImageFile, setBreedImageFile] = useState(null);
  const [brandWeLoveImageFile, setBrandWeLoveImageFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [removedGalleryImages, setRemovedGalleryImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const notify = (type, message) => {
    setActionStatus({ type, message });
    setTimeout(() => setActionStatus(null), 2500);
  };

  const fetchAllProducts = async () => { setLoadingProducts(true); try { const data = await productService.getProducts(); setProducts(Array.isArray(data) ? data : []); } catch (e) { notify('error', e.message); } finally { setLoadingProducts(false); } };
  const fetchCategories = async () => { setLoadingCategories(true); try { const data = await categoryService.getCategories(); setCategories(Array.isArray(data) ? data : []); } catch (e) { notify('error', e.message); } finally { setLoadingCategories(false); } };
  const fetchBreeds = async () => { setLoadingBreeds(true); try { const data = await breedService.getBreeds(); setBreeds(Array.isArray(data) ? data : []); } catch (e) { notify('error', e.message); } finally { setLoadingBreeds(false); } };
  const fetchBrandsWeLove = async () => { setLoadingBrandsWeLove(true); try { const data = await brandWeLoveService.getBrandsWeLove(); setBrandsWeLove(Array.isArray(data) ? data : []); } catch (e) { notify('error', e.message); } finally { setLoadingBrandsWeLove(false); } };
  const fetchOrders = async () => { setLoadingOrders(true); try { const data = await orderService.getOrders(orderTypeView); setOrders(Array.isArray(data) ? data : []); } catch (e) { notify('error', e.message); } finally { setLoadingOrders(false); } };
  const fetchDeliverySettings = async () => { setLoadingDelivery(true); try { const [methods, stores] = await Promise.all([deliveryService.getDeliveryMethods(), deliveryService.getPickupStores()]); setDeliveryMethods(Array.isArray(methods) ? methods : []); setPickupStores(Array.isArray(stores) ? stores : []); } catch (e) { notify('error', e.message); } finally { setLoadingDelivery(false); } };
  const fetchServices = async () => { setLoadingServices(true); try { const data = await serviceService.getServices(); setServices(Array.isArray(data) ? data : []); } catch (e) { notify('error', e.message); } finally { setLoadingServices(false); } };
  const fetchConsultations = async () => { setLoadingConsultations(true); try { const data = await consultationService.getConsultations(); setConsultations(Array.isArray(data) ? data : []); } catch (e) { notify('error', e.message); } finally { setLoadingConsultations(false); } };
  const fetchConsultationSchedule = async () => { setLoadingConsultationSchedule(true); try { const data = await consultationScheduleService.getConsultationSchedule(); setConsultationScheduleForm({ ...emptyConsultationSchedule, ...data, doctors: (data.doctors || []).map((doctor) => ({ ...doctor, leaveDates: Array.isArray(doctor.leaveDates) ? doctor.leaveDates.join('\n') : '' })), dates: data.dates || [] }); } catch (e) { notify('error', e.message); } finally { setLoadingConsultationSchedule(false); } };
  const fetchWholesalers = async () => { setLoadingWholesalers(true); try { const data = await wholesalerService.getWholesalers(); setWholesalers(Array.isArray(data) ? data : []); } catch (e) { notify('error', e.message); } finally { setLoadingWholesalers(false); } };

  useEffect(() => { fetchAllProducts(); fetchCategories(); fetchBreeds(); fetchBrandsWeLove(); fetchDeliverySettings(); fetchServices(); fetchConsultations(); fetchConsultationSchedule(); fetchWholesalers(); }, []);
  useEffect(() => { fetchOrders(); }, [orderTypeView]);

  const handleChange = (e) => setForm((p) => ({
    ...p,
    [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
  }));
  const handleFileChange = (file) => { if (!file) return; setThumbnailFile(file); const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result); reader.readAsDataURL(file); };
  const handleDrop = (e) => { e.preventDefault(); dragRef.current?.classList.remove('drag-over'); handleFileChange(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); dragRef.current?.classList.add('drag-over'); };
  const handleDragLeave = () => dragRef.current?.classList.remove('drag-over');
  const handleReset = () => { setForm(emptyProduct); setEditingProduct(null); setThumbnailFile(null); setGalleryFiles([]); setRemovedGalleryImages([]); setImagePreview(null); };
  const handleEditProduct = (product) => { setEditingProduct(product); setForm({ ...emptyProduct, ...product }); setThumbnailFile(null); setGalleryFiles([]); setRemovedGalleryImages([]); setImagePreview(product.thumbnail ? getAdminImageUrl(product.thumbnail) : null); navigate(`/admin/products/edit/${product._id}`); };
  const handleAddGalleryFiles = (files) => {
    const nextFiles = Array.from(files || []);
    if (nextFiles.length) setGalleryFiles((prev) => [...prev, ...nextFiles]);
  };
  const handleRemoveGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };
  const handleRemoveSavedGalleryImage = (image) => {
    setRemovedGalleryImages((prev) => (prev.includes(image) ? prev : [...prev, image]));
  };
  const handleSubmit = async (e) => { e.preventDefault(); setUploading(true); try { const data = new FormData(); Object.entries(form).forEach(([k, v]) => data.append(k, v ?? '')); if (removedGalleryImages.length) data.append('removedImages', JSON.stringify(removedGalleryImages)); if (thumbnailFile) data.append('thumbnail', thumbnailFile); galleryFiles.forEach((file) => data.append('images', file)); const result = await productService.saveProduct(data, editingProduct); notify('success', `${result.product?.name || form.name} saved successfully.`); await fetchAllProducts(); handleReset(); navigate('/admin/products'); } catch (err) { notify('error', err.message); } finally { setUploading(false); } };
  const handleDeleteProduct = async (id, name) => { if (!window.confirm(`Delete "${name}"?`)) return; try { await productService.deleteProduct(id); notify('success', `${name} deleted successfully.`); fetchAllProducts(); } catch (e) { notify('error', e.message); } };

  const handleCategoryChange = (e) => setCategoryForm((p) => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const handleCategoryImageChange = (file) => { if (file) setCategoryImageFile(file); };
  const handleResetCategory = () => { setCategoryForm(emptyCategory); setEditingCategory(null); setCategoryImageFile(null); };
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(categoryForm).forEach(([key, value]) => data.append(key, value ?? ''));
      if (categoryImageFile) data.set('image', categoryImageFile);
      await categoryService.saveCategory(data, editingCategory);
      notify('success', 'Category saved.');
      handleResetCategory();
      fetchCategories();
    } catch (err) {
      notify('error', err.message);
    }
  };
  const handleEditCategory = (category) => { setEditingCategory(category); setCategoryImageFile(null); setCategoryForm({ ...emptyCategory, ...category, subcategories: Array.isArray(category.subcategories) ? category.subcategories.join('\n') : category.subcategories || '' }); };
  const handleDeleteCategory = async (category) => { if (!window.confirm(`Delete category "${category.name}"?`)) return; try { await categoryService.deleteCategory(category._id); notify('success', 'Category deleted.'); fetchCategories(); } catch (e) { notify('error', e.message); } };

  const handleBreedChange = (e) => setBreedForm((p) => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const handleBreedImageChange = (file) => { if (file) setBreedImageFile(file); };
  const handleResetBreed = () => { setBreedForm(emptyBreed); setEditingBreed(null); setBreedImageFile(null); };
  const handleSubmitBreed = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries({ ...breedForm, sortOrder: Number(breedForm.sortOrder || 0) }).forEach(([key, value]) => data.append(key, value ?? ''));
      if (breedImageFile) data.set('image', breedImageFile);
      await breedService.saveBreed(data, editingBreed);
      notify('success', 'Breed saved.');
      handleResetBreed();
      fetchBreeds();
    } catch (err) {
      notify('error', err.message);
    }
  };
  const handleEditBreed = (breed) => { setEditingBreed(breed); setBreedImageFile(null); setBreedForm({ ...emptyBreed, ...breed }); };
  const handleDeleteBreed = async (breed) => { if (!window.confirm(`Delete breed "${breed.name}"?`)) return; try { await breedService.deleteBreed(breed._id); notify('success', 'Breed deleted.'); fetchBreeds(); } catch (e) { notify('error', e.message); } };

  const handleBrandWeLoveChange = (e) => setBrandWeLoveForm((p) => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const handleBrandWeLoveImageChange = (file) => { if (file) setBrandWeLoveImageFile(file); };
  const handleResetBrandWeLove = () => { setBrandWeLoveForm(emptyBrandWeLove); setEditingBrandWeLove(null); setBrandWeLoveImageFile(null); };
  const handleSubmitBrandWeLove = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', brandWeLoveForm.name || '');
      data.append('sortOrder', Number(brandWeLoveForm.sortOrder || 0));
      data.append('isActive', brandWeLoveForm.isActive !== false);
      if (brandWeLoveImageFile) data.append('image', brandWeLoveImageFile);
      await brandWeLoveService.saveBrandWeLove(data, editingBrandWeLove);
      notify('success', 'Brand saved.');
      handleResetBrandWeLove();
      fetchBrandsWeLove();
    } catch (err) {
      notify('error', err.message);
    }
  };
  const handleEditBrandWeLove = (brand) => { setEditingBrandWeLove(brand); setBrandWeLoveImageFile(null); setBrandWeLoveForm({ ...emptyBrandWeLove, ...brand }); };
  const handleDeleteBrandWeLove = async (brand) => { if (!window.confirm(`Delete brand "${brand.name}"?`)) return; try { await brandWeLoveService.deleteBrandWeLove(brand._id); notify('success', 'Brand deleted.'); fetchBrandsWeLove(); } catch (e) { notify('error', e.message); } };

  const handleDeliveryMethodChange = (e) => setDeliveryMethodForm((p) => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const handlePickupStoreChange = (e) => setPickupStoreForm((p) => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const resetDeliveryMethodForm = () => { setDeliveryMethodForm(emptyDeliveryMethod); setEditingDeliveryMethod(null); };
  const resetPickupStoreForm = () => { setPickupStoreForm(emptyPickupStore); setEditingPickupStore(null); };
  const handleSubmitDeliveryMethod = async (e) => { e.preventDefault(); try { await deliveryService.saveDeliveryMethod({ ...deliveryMethodForm, baseCharge: Number(deliveryMethodForm.baseCharge || 0) }, editingDeliveryMethod); notify('success', 'Delivery method saved.'); resetDeliveryMethodForm(); fetchDeliverySettings(); } catch (err) { notify('error', err.message); } };
  const handleEditDeliveryMethod = (method) => { setEditingDeliveryMethod(method); setDeliveryMethodForm({ ...emptyDeliveryMethod, ...method, servicePincodes: Array.isArray(method.servicePincodes) ? method.servicePincodes.join('\n') : method.servicePincodes || '' }); };
  const handleDeleteDeliveryMethod = async (method) => { if (!window.confirm(`Delete delivery method "${method.name}"?`)) return; try { await deliveryService.deleteDeliveryMethod(method._id); notify('success', 'Delivery method deleted.'); fetchDeliverySettings(); } catch (e) { notify('error', e.message); } };
  const handleSubmitPickupStore = async (e) => { e.preventDefault(); try { await deliveryService.savePickupStore(pickupStoreForm, editingPickupStore); notify('success', 'Pickup store saved.'); resetPickupStoreForm(); fetchDeliverySettings(); } catch (err) { notify('error', err.message); } };
  const handleEditPickupStore = (store) => { setEditingPickupStore(store); setPickupStoreForm({ ...emptyPickupStore, ...store }); };
  const handleDeletePickupStore = async (store) => { if (!window.confirm(`Delete pickup store "${store.name}"?`)) return; try { await deliveryService.deletePickupStore(store._id); notify('success', 'Pickup store deleted.'); fetchDeliverySettings(); } catch (e) { notify('error', e.message); } };

  const handleServiceChange = (e) => setServiceForm((p) => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value, ...(e.target.name === 'title' && !editingService && !p.slug ? { slug: e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') } : {}) }));
  const resetServiceForm = () => { setServiceForm(emptyService); setEditingService(null); setServiceImageFile(null); };
  const handleAddServiceAvailability = () => {
    setServiceForm((p) => ({
      ...p,
      availability: [...(p.availability || []), createAvailabilityEntry()],
    }));
  };
  const handleServiceAvailabilityChange = (index, field, value) => {
    setServiceForm((p) => ({
      ...p,
      availability: (p.availability || []).map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }));
  };
  const handleRemoveServiceAvailability = (index) => {
    setServiceForm((p) => ({
      ...p,
      availability: (p.availability || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };
  const handleSubmitService = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      const availability = (serviceForm.availability || []).map((item) => ({
        date: item.date,
        slots: String(item.slots || '').split('\n').map((slot) => slot.trim()).filter(Boolean),
        isActive: item.isActive !== false,
      }));
      Object.entries({ ...serviceForm, price: Number(serviceForm.price || 0), availability: JSON.stringify(availability) }).forEach(([key, value]) => {
        data.append(key, value ?? '');
      });
      if (serviceImageFile) data.append('image', serviceImageFile);
      await serviceService.saveService(data, editingService);
      notify('success', 'Service saved.');
      resetServiceForm();
      fetchServices();
    } catch (err) {
      notify('error', err.message);
    }
  };
  const handleEditService = (service) => {
    setEditingService(service);
    setServiceImageFile(null);
    setServiceForm({
      ...emptyService,
      ...service,
      features: (service.features || []).join('\n'),
      availability: Array.isArray(service.availability) && service.availability.length
        ? service.availability.map((item) => ({
            date: item.date || '',
            slots: Array.isArray(item.slots) ? item.slots.join('\n') : '',
            isActive: item.isActive !== false,
          }))
        : [createAvailabilityEntry()],
    });
  };
  const handleDeleteService = async (service) => { if (!window.confirm(`Delete service "${service.title}"?`)) return; try { await serviceService.deleteService(service._id); notify('success', 'Service deleted.'); fetchServices(); } catch (e) { notify('error', e.message); } };

  const handleConsultationChange = (e) => setConsultationForm((p) => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const resetConsultationForm = () => { setConsultationForm(emptyConsultation); setEditingConsultation(null); };
  const handleSubmitConsultation = async (e) => { e.preventDefault(); try { await consultationService.saveConsultation({ ...consultationForm, sortOrder: Number(consultationForm.sortOrder || 0) }, editingConsultation); notify('success', 'Consultation item saved.'); resetConsultationForm(); fetchConsultations(); } catch (err) { notify('error', err.message); } };
  const handleEditConsultation = (item) => { setEditingConsultation(item); setConsultationForm({ ...emptyConsultation, ...item }); };
  const handleDeleteConsultation = async (item) => { if (!window.confirm(`Delete consultation item "${item.title}"?`)) return; try { await consultationService.deleteConsultation(item._id); notify('success', 'Consultation item deleted.'); fetchConsultations(); } catch (e) { notify('error', e.message); } };
  const handleConsultationScheduleChange = (e) => {
    setConsultationScheduleForm((p) => ({
      ...p,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
  };
  const handleAddScheduleDoctor = () => setConsultationScheduleForm((p) => ({ ...p, doctors: [...(p.doctors || []), createScheduleDoctor()] }));
  const handleScheduleDoctorChange = (index, field, value) => {
    setConsultationScheduleForm((p) => ({
      ...p,
      doctors: (p.doctors || []).map((doctor, doctorIndex) => doctorIndex === index ? { ...doctor, [field]: value } : doctor),
    }));
  };
  const handleRemoveScheduleDoctor = (index) => setConsultationScheduleForm((p) => ({ ...p, doctors: (p.doctors || []).filter((_, itemIndex) => itemIndex !== index) }));
  const handleAddScheduleDate = () => setConsultationScheduleForm((p) => ({ ...p, dates: [...(p.dates || []), createScheduleDate()] }));
  const handleScheduleDateChange = (index, field, value) => {
    setConsultationScheduleForm((p) => ({
      ...p,
      dates: (p.dates || []).map((dateItem, dateIndex) => dateIndex === index ? { ...dateItem, [field]: value } : dateItem),
    }));
  };
  const handleRemoveScheduleDate = (index) => setConsultationScheduleForm((p) => ({ ...p, dates: (p.dates || []).filter((_, itemIndex) => itemIndex !== index) }));
  const handleAddScheduleSlot = (dateIndex, doctorId = '') => {
    setConsultationScheduleForm((p) => ({
      ...p,
      dates: (p.dates || []).map((dateItem, itemIndex) => (
        itemIndex === dateIndex ? { ...dateItem, slots: [...(dateItem.slots || []), { ...createScheduleSlot(), doctorId }] } : dateItem
      )),
    }));
  };
  const handleScheduleSlotChange = (dateIndex, slotIndex, field, value) => {
    setConsultationScheduleForm((p) => ({
      ...p,
      dates: (p.dates || []).map((dateItem, itemIndex) => (
        itemIndex === dateIndex
          ? {
              ...dateItem,
              slots: (dateItem.slots || []).map((slot, currentSlotIndex) => (
                currentSlotIndex === slotIndex ? { ...slot, [field]: value } : slot
              )),
            }
          : dateItem
      )),
    }));
  };
  const handleRemoveScheduleSlot = (dateIndex, slotIndex) => {
    setConsultationScheduleForm((p) => ({
      ...p,
      dates: (p.dates || []).map((dateItem, itemIndex) => (
        itemIndex === dateIndex
          ? { ...dateItem, slots: (dateItem.slots || []).filter((_, currentSlotIndex) => currentSlotIndex !== slotIndex) }
          : dateItem
      )),
    }));
  };
  const handleSubmitConsultationSchedule = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...consultationScheduleForm,
        advanceBookingLimitDays: Number(consultationScheduleForm.advanceBookingLimitDays || 0),
        cancellationWindowHours: Number(consultationScheduleForm.cancellationWindowHours || 0),
        rescheduleWindowHours: Number(consultationScheduleForm.rescheduleWindowHours || 0),
        doctors: (consultationScheduleForm.doctors || []).map((doctor) => ({
          ...doctor,
          leaveDates: String(doctor.leaveDates || '').split('\n').map((date) => date.trim()).filter(Boolean),
        })),
      };
      await consultationScheduleService.saveConsultationSchedule(payload);
      notify('success', 'Consultation schedule saved.');
      fetchConsultationSchedule();
    } catch (err) {
      notify('error', err.message);
    }
  };
  const handleResetConsultationSchedule = async () => {
    if (!window.confirm('Reset consultation schedule?')) return;
    try {
      const result = await consultationScheduleService.deleteConsultationSchedule();
      setConsultationScheduleForm({ ...emptyConsultationSchedule, ...(result.schedule || {}) });
      notify('success', 'Consultation schedule reset.');
    } catch (err) {
      notify('error', err.message);
    }
  };

  const handleWholesalerChange = (e) => setWholesalerForm((p) => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const resetWholesalerForm = () => { setWholesalerForm(emptyWholesaler); setEditingWholesaler(null); };
  const handleSubmitWholesaler = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...wholesalerForm };
      if (editingWholesaler && !payload.password) delete payload.password;
      const result = await wholesalerService.saveWholesaler(payload, editingWholesaler);
      if (!editingWholesaler && result.emailSent === false) {
        notify('error', 'Wholesaler added, but email was not sent. Check Gmail app password.');
      } else {
        notify('success', `Wholesaler ${editingWholesaler ? 'updated' : 'added'} successfully.`);
      }
      resetWholesalerForm();
      fetchWholesalers();
    } catch (err) {
      notify('error', err.message);
    }
  };
  const handleEditWholesaler = (wholesaler) => {
    setEditingWholesaler(wholesaler);
    setWholesalerForm({ ...emptyWholesaler, ...wholesaler, password: '' });
  };
  const handleToggleWholesalerStatus = async (wholesaler) => {
    try {
      await wholesalerService.updateWholesalerStatus(wholesaler._id, wholesaler.isActive === false);
      notify('success', `Wholesaler marked ${wholesaler.isActive === false ? 'active' : 'inactive'}.`);
      fetchWholesalers();
    } catch (e) {
      notify('error', e.message);
    }
  };
  const handleDeleteWholesaler = async (wholesaler) => { if (!window.confirm(`Delete wholesaler "${wholesaler.shopName}"?`)) return; try { await wholesalerService.deleteWholesaler(wholesaler._id); notify('success', 'Wholesaler deleted.'); fetchWholesalers(); } catch (e) { notify('error', e.message); } };

  const handleUpdateOrder = async (orderId, updates) => { try { await orderService.updateOrder(orderId, updates); notify('success', 'Order updated.'); fetchOrders(); } catch (e) { notify('error', e.message); } };
  const handleDeleteOrder = async (order) => { if (!window.confirm(`Delete order "${order.orderNumber}"?`)) return; try { await orderService.deleteOrder(order._id); notify('success', 'Order deleted.'); fetchOrders(); } catch (e) { notify('error', e.message); } };

  const categoryOptions = useMemo(() => [...new Set(categories.filter((c) => c.isActive !== false).map((c) => c.name))], [categories]);
  const filteredProducts = products.filter((p) => [p.name, p.brand, p.category, p.sku].some((v) => String(v || '').toLowerCase().includes(searchTerm.toLowerCase())));
  const filteredOrders = orders.filter((o) => [o.orderNumber, o.customer?.name, o.customer?.phone, o.orderType].some((v) => String(v || '').toLowerCase().includes(orderSearchTerm.toLowerCase())));
  const totalOrderRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const normalOrders = orders.filter((order) => (order.orderType || 'NORMAL') === 'NORMAL').length;
  const wholesalerOrders = orders.filter((order) => order.orderType === 'WHOLESALER').length;
  const productDeliveryTotal = products.reduce((sum, product) => sum + Number(product.deliveryPrice || 0), 0);
  const pendingOrders = orders.filter((order) => ['PLACED', 'CONFIRMED'].includes(order.orderStatus)).length;
  const shippedOrders = orders.filter((order) => order.orderStatus === 'SHIPPED').length;
  const deliveredOrders = orders.filter((order) => order.orderStatus === 'DELIVERED').length;
  const cancelledOrders = orders.filter((order) => order.orderStatus === 'CANCELLED').length;
  const activeDeliveryMethods = deliveryMethods.filter((method) => method.isActive !== false).length;
  const recentOrders = orders.slice(0, 5);
  const paidOrders = orders.filter((order) => order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS').length;
  const paymentRate = orders.length ? Math.round((paidOrders / orders.length) * 100) : 0;
  const deliveryReadinessRate = deliveryMethods.length ? Math.round((activeDeliveryMethods / deliveryMethods.length) * 100) : 0;
  const activeCategories = categories.filter((category) => category.isActive !== false).length;
  const activeWholesalers = wholesalers.filter((wholesaler) => wholesaler.isActive !== false).length;
  const emptyStockList = products.filter((product) => Number(product.stock || 0) <= 0);
  const lowStockList = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5);
  const availableStockList = products.filter((product) => Number(product.stock || 0) > 5);
  const emptyStockProducts = emptyStockList.length;
  const availableStockProducts = availableStockList.length;
  const orderStatusChartData = [
    ['Pending', pendingOrders],
    ['Shipped', shippedOrders],
    ['Delivered', deliveredOrders],
    ['Cancelled', cancelledOrders],
  ];
  const categoryChartData = categoryOptions.map((category) => [
    category,
    products.filter((product) => product.category === category).length,
  ]).filter(([, value]) => value > 0);
  const maxOrderStatusCount = Math.max(1, ...orderStatusChartData.map(([, value]) => value));
  const maxCategoryCount = Math.max(1, ...categoryChartData.map(([, value]) => value));
  const renderProductPreview = () => null;
  const value = {
    activeTab: activeTabValue,
    setActiveTab,
    products, orders, categories, breeds, brandsWeLove, deliveryMethods, pickupStores, services, consultations, wholesalers,
    setProducts, setOrders, setCategories, setBreeds, setBrandsWeLove, setDeliveryMethods, setPickupStores, setServices, setConsultations, setWholesalers,
    loadingProducts, loadingOrders, loadingCategories, loadingBreeds, loadingBrandsWeLove, loadingDelivery, loadingServices, loadingConsultations, loadingConsultationSchedule, loadingWholesalers,
    setLoadingProducts, setLoadingOrders, setLoadingCategories, setLoadingBreeds, setLoadingBrandsWeLove, setLoadingDelivery, setLoadingServices, setLoadingConsultations, setLoadingConsultationSchedule, setLoadingWholesalers,
    searchTerm, setSearchTerm, orderSearchTerm, setOrderSearchTerm, orderTypeView, setOrderTypeView,
    selectedOrder, setSelectedOrder, actionStatus, setActionStatus, form, setForm, categoryForm, breedForm, brandWeLoveForm, deliveryMethodForm,
    setCategoryForm, setBreedForm, setBrandWeLoveForm, setDeliveryMethodForm,
    pickupStoreForm, serviceForm, consultationForm, consultationScheduleForm, wholesalerForm, editingProduct, editingCategory, editingBreed, editingBrandWeLove, editingDeliveryMethod,
    setPickupStoreForm, setServiceForm, setConsultationForm, setEditingProduct, setEditingCategory, setEditingBreed, setEditingBrandWeLove, setEditingDeliveryMethod,
    setWholesalerForm, editingPickupStore, editingService, editingConsultation, editingWholesaler, serviceImageFile, setServiceImageFile, categoryImageFile, setCategoryImageFile, breedImageFile, setBreedImageFile, brandWeLoveImageFile, setBrandWeLoveImageFile, thumbnailFile, setThumbnailFile, galleryFiles, removedGalleryImages,
    setEditingPickupStore, setEditingService, setEditingConsultation, setEditingWholesaler,
    setGalleryFiles, handleAddGalleryFiles, handleRemoveGalleryFile, handleRemoveSavedGalleryImage, imagePreview, uploading, setUploading, fileInputRef, dragRef, categoryOptions, filteredProducts, filteredOrders,
    totalProducts: products.length, totalOrders: orders.length, totalBreeds: breeds.length, totalBrandsWeLove: brandsWeLove.length, totalDeliveryMethods: deliveryMethods.length + pickupStores.length,
    totalServices: services.length, totalConsultations: consultations.length, totalWholesalers: wholesalers.length, activeWholesalers, totalOrderRevenue,
    normalOrders, wholesalerOrders, productDeliveryTotal,
    averageOrderValue: orders.length ? totalOrderRevenue / orders.length : 0,
    pendingOrders, shippedOrders, deliveredOrders, cancelledOrders,
    lowStockProducts: products.filter((p) => Number(p.stock || 0) <= 5).length,
    inventoryValue: products.reduce((s, p) => s + Number(p.stock || 0) * Number(p.retailPrice || 0), 0),
    activeDeliveryMethods, recentOrders, paidOrders, paymentRate, deliveryReadinessRate, activeCategories,
    emptyStockList, lowStockList, availableStockList, emptyStockProducts, availableStockProducts,
    orderStatusChartData, categoryChartData, maxOrderStatusCount, maxCategoryCount,
    fetchAllProducts, fetchCategories, fetchBreeds, fetchBrandsWeLove, fetchOrders, fetchDeliverySettings, fetchServices, fetchConsultations, fetchConsultationSchedule, fetchWholesalers,
    handleChange, handleFileChange, handleDrop, handleDragOver, handleDragLeave, handleReset, handleSubmit,
    handleEditProduct, handleDeleteProduct, handleCategoryChange, handleCategoryImageChange, handleResetCategory, handleSubmitCategory,
    handleEditCategory, handleDeleteCategory, handleBreedChange, handleBreedImageChange, handleResetBreed, handleSubmitBreed,
    handleEditBreed, handleDeleteBreed, handleBrandWeLoveChange, handleBrandWeLoveImageChange, handleResetBrandWeLove,
    handleSubmitBrandWeLove, handleEditBrandWeLove, handleDeleteBrandWeLove,
    handleDeliveryMethodChange, handlePickupStoreChange,
    resetDeliveryMethodForm, resetPickupStoreForm, handleSubmitDeliveryMethod, handleEditDeliveryMethod,
    handleDeleteDeliveryMethod, handleSubmitPickupStore, handleEditPickupStore, handleDeletePickupStore,
    handleServiceChange, resetServiceForm, handleSubmitService, handleEditService, handleDeleteService,
    handleAddServiceAvailability, handleServiceAvailabilityChange, handleRemoveServiceAvailability,
    handleConsultationChange, resetConsultationForm, handleSubmitConsultation, handleEditConsultation,
    handleConsultationScheduleChange, handleAddScheduleDoctor, handleScheduleDoctorChange, handleRemoveScheduleDoctor,
    handleAddScheduleDate, handleScheduleDateChange, handleRemoveScheduleDate, handleAddScheduleSlot,
    handleScheduleSlotChange, handleRemoveScheduleSlot, handleSubmitConsultationSchedule, handleResetConsultationSchedule,
    handleDeleteConsultation, handleWholesalerChange, resetWholesalerForm, handleSubmitWholesaler,
    handleEditWholesaler, handleToggleWholesalerStatus, handleDeleteWholesaler,
    handleUpdateOrder, handleDeleteOrder, renderProductPreview,
    DEFAULT_CATEGORIES, DELIVERY_METHOD_OPTIONS, ORDER_TO_SHIPMENT_STATUS, SHIPMENT_TO_ORDER_STATUS, BACKEND_URL, getAdminImageUrl,
  };
  return <AdminDashboardContext.Provider value={value}>{children}</AdminDashboardContext.Provider>;
}

export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) throw new Error('useAdminDashboard must be used inside AdminDashboardProvider');
  return context;
};
