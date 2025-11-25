import axios from 'axios';

const API_KEY = '53360478-1bf245edf032d22b013a2c514';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  if (!query) return null;

  const pageNum =
    typeof page === 'number' && Number.isFinite(page)
      ? page
      : Number(page) || 1;

  const url =
    BASE_URL +
    `?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNum}&per_page=15`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw err;
  }
}
