import axios from 'axios';

const key = '29465520-2d9e1b1320995f222d828adc7';
const baseURL = 'https://pixabay.com/api/';
export const fetchImages = async ({ query, page, limit, totalPage }) => {
  const response = await axios.get(
    `${baseURL}?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${limit}`
  );
  options.totalPage = Math.ceil(response.data.totalHits / limit);

  return response.data;
};

export const options = {
  query: '',
  page: 1,
  limit: 16,
  totalPage: 1,
};
