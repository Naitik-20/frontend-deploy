const BACKEND_URL = 'https://dr-snoopy2.onrender.com';

const getBrandImage = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/${image}`;
};

export const normalizeBrandWeLove = (brand) => ({
  ...brand,
  name: brand.name || 'Brand',
  image: getBrandImage(brand.image || ''),
});

export const getBrandsWeLove = async () => {
  const response = await fetch(`${BACKEND_URL}/api/brands-we-love`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load brands');
  }

  return Array.isArray(data) ? data.map(normalizeBrandWeLove) : [];
};
