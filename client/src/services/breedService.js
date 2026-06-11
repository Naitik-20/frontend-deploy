const BACKEND_URL = 'https://dr-snoopy2.onrender.com';

export const getBreedPath = (name) => `/category/${encodeURIComponent(name)}`;

const getBreedImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${BACKEND_URL}${image}`;
  return `${BACKEND_URL}/uploads/${image}`;
};

export const normalizeBreed = (breed) => ({
  ...breed,
  name: breed.name || 'Breed',
  img: getBreedImageUrl(breed.image || breed.img),
});

export const getBreeds = async () => {
  const response = await fetch(`${BACKEND_URL}/api/breeds`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load breeds');
  }

  return Array.isArray(data) ? data.map(normalizeBreed) : [];
};
