import { fetchImages } from './PixabayAPI';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Masonry from 'masonry-layout';
import { options } from './PixabayAPI';

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadNextGallery = document.querySelector('.next-btn');

let msnry = new Masonry('.gallery', {
  itemSelector: '.photo-item',
  columnWidth: '.grid__col-sizer',
  gutter: '.grid__gutter-sizer',
  percentPosition: true,
  stagger: 30,
  // nicer reveal transition
  visibleStyle: { transform: 'translateY(0)', opacity: 1 },
  hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
});

searchForm.addEventListener('submit', onSearchForm);

async function onSearchForm(event) {
  event.preventDefault();
  window.addEventListener('scroll', onScroll);

  let valueInput = searchForm.elements.searchQuery.value;
  if (valueInput.trim() === '') {
    return Notiflix.Notify.failure('Vvedite Svoi Zapros');
  }
  options.query = valueInput;
  options.page = 1;

  let array = await fetchImages(options);
  let data = renderGallery(array.hits);
  if (data.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  gallery.innerHTML = data;
  Notiflix.Notify.info(`Hooray! We found ${array.totalHits} images.`);
  msnry.appended(document.querySelectorAll('.gallery__link'));

  let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function renderGallery(images) {
  const markup = images
    .map(
      ({
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a class="gallery__link grid__col-sizer grid__gutter-sizer" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
      }
    )
    .join('');
  return markup;
}
///___________________________________________________________________///

async function onScroll() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight * 0.9
  ) {
    options.page++;

    if (options.page < options.totalPage) {
      let array = await fetchImages(options);
      let data = renderGallery(array.hits);
      if ((data.length = 0)) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      gallery.innerHTML += data;
    } else {
      window.removeEventListener('scroll', onScroll);
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    let lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionsData: 'alt',
      captionDelay: 250,
    });
  }

  return;
}
