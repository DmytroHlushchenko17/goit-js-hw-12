import axios from 'axios';
import { showLoader, hideLoader } from './render-functions.js';

const API_KEY = '53360478-1bf245edf032d22b013a2c514';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  if (!query) return null;

  const pageNum = Math.max(1, Number(page) || 1);

  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageNum,
    per_page: 15,
  };

  showLoader();
  try {
    const { data } = await axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    throw error;
  }
}
