import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  searchForm,
  loadMoreBtn,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

if (!searchForm) {
  console.warn('Search form not found (.form)');
} else {
  searchForm.addEventListener('submit', onSearchFormSubmit);
}

if (loadMoreBtn) loadMoreBtn.addEventListener('click', onLoadMore);

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;
let fetchedCount = 0;

export async function onSearchFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const input = form.elements['search-text'];
  const query = ((input && input.value) || '').trim();

  if (!query) {
    iziToast.warning({ message: 'The input must not be empty' });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  totalHits = 0;
  fetchedCount = 0;

  clearGallery();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, currentPage);

    if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
      clearGallery();
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        color: 'red',
        position: 'center',
      });
      return;
    }

    createGallery(data.hits);

    totalHits = Number(data.totalHits) || 0;
    fetchedCount += data.hits.length;

    if (fetchedCount < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (err) {
    clearGallery();
    iziToast.error({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      color: 'red',
      position: 'bottomCenter',
    });
  }
}

async function onLoadMore(event) {
  if (!currentQuery) return;

  if (loadMoreBtn) loadMoreBtn.disabled = true;

  currentPage += 1;

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but there are no more images to load.",
        position: 'bottomCenter',
      });
      return;
    }

    createGallery(data.hits);

    fetchedCount += data.hits.length;

    try {
      const firstCard = document.querySelector('.gallery .gallery-item');
      if (firstCard) {
        const { height: cardHeight } = firstCard.getBoundingClientRect();
        window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
      }
    } catch (e) {}

    if (fetchedCount >= (Number(totalHits) || 0)) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      showLoadMoreButton();
    }
  } catch (err) {
    console.error(err);
    iziToast.error({
      message: 'Error loading more images — please try again.',
    });
  } finally {
    if (loadMoreBtn) loadMoreBtn.disabled = false;
  }
}
