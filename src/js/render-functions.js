import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const searchForm = document.querySelector('.form');
export const galleryEl = document.querySelector('.js-gallery');

export function clearGallery() {
  if (galleryEl) galleryEl.innerHTML = '';
}

export const showLoader = () =>
  document.body && document.body.classList.add('is-loading');
export const hideLoader = () =>
  document.body && document.body.classList.remove('is-loading');

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  if (!Array.isArray(images) || !galleryEl) {
    clearGallery();
    return;
  }

  const markup = images
    .map(img => {
      const {
        largeImageURL = '#',
        webformatURL = '',
        tags = '',
        likes = 0,
        views = 0,
        comments = 0,
        downloads = 0,
      } = img || {};

      return `
      <li class="gallery-item">
        <a class="gallery-link js-gallery-link" href="${largeImageURL}">
          <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><span>Likes:</span> ${likes}</p>
          <p class="info-item"><span>Views:</span> ${views}</p>
          <p class="info-item"><span>Comments:</span> ${comments}</p>
          <p class="info-item"><span>Downloads:</span> ${downloads}</p>
        </div>
      </li>`;
    })
    .join('');

  galleryEl.innerHTML = markup;
  if (simpleLightbox && typeof simpleLightbox.refresh === 'function')
    simpleLightbox.refresh();
}
