import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  searchForm,
} from './js/render-functions.js';

if (!searchForm) {
  console.warn('Search form not found (.form)');
} else {
  searchForm.addEventListener('submit', onSearchFormSubmit);
}

export function onSearchFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const input = form.elements['search-text'];
  const query = ((input && input.value) || '').trim();

  if (!query) {
    iziToast.warning({ message: 'The input must not be empty' });
    return;
  }

  showLoader();

  getImagesByQuery(query)
    .then(function (data) {
      if (!data || !Array.isArray(data.hits) || data.hits.length === 0) {
        clearGallery();
        iziToast.info({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          color: 'red',
          position: 'topRight',
        });
        return;
      }

      createGallery(data.hits);
    })
    .catch(function (err) {
      clearGallery();
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        color: 'red',
        position: 'topRight',
      });
      console.error(err);
    })
    .finally(function () {
      hideLoader();
    });
}
