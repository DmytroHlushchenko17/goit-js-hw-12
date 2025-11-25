import axios from 'axios';

const API_KEY = '53360478-1bf245edf032d22b013a2c514';
const BASE_URL = 'https://pixabay.com/api/';

export function getImagesByQuery(query) {
  if (!query) return Promise.resolve(null);

  const url =
    BASE_URL +
    `?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true`;

  return axios.get(url).then(function (response) {
    return response.data;
  });
}
