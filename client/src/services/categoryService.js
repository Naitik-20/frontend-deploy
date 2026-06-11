const BACKEND_URL = 'https://dr-snoopy2.onrender.com';

export const getCategoryPath = (name) => `/category/${encodeURIComponent(name)}`;

const getCategoryImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/${image}`;
};

export const normalizeCategory = (category) => ({
  ...category,
  label: category.name || category.label || 'Category',
  path: getCategoryPath(category.name || category.label || 'Category'),
  icon: category.icon || '',
  img: getCategoryImageUrl(category.image || category.img),
  color: category.color || '#ffffff',
  accent: category.accent || '#0a58a4',
  sub: Array.isArray(category.subcategories) ? category.subcategories : [],
});

export const getCategories = async () => {
  const response = await fetch(`${BACKEND_URL}/api/categories`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load categories');
  }

  return Array.isArray(data) ? data.map(normalizeCategory) : [];
};
