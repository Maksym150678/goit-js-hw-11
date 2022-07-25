import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayApi } from './js/pixabay-api';
import galleryCard from './templates/gallery-card.hbs';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const pixabayApi = new PixabayApi();
const loadMoreBtnEl = document.querySelector('.load-more');

searchFormEl.addEventListener('submit', onSearchFormSubmt);
loadMoreBtnEl.addEventListener('click', onClickLoadMore);

async function onClickLoadMore(event) {
  try {
   
   if (!pixabayApi.isNextDataExsist()) {
     Notiflix.Notify.info(
       "We're sorry, but you've reached the end of search results"
     );
     
     loadMoreBtnEl.classList.add('is-hidden');
     return;
   }
      const response = await pixabayApi.fetchPhotosByQuery();
      
      smoothScroll();
      renderCards(response.data.hits);
      console.log(pixabayApi);
 } catch (error) {
   console.log(error);
 }
}

function renderCards(data) {
  const card = galleryCard(data);
  galleryEl.insertAdjacentHTML('beforeend', card);
  lightbox.refresh();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}


const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

async function onSearchFormSubmt(event) {
    event.preventDefault();
    pixabayApi.page = 1;

    loadMoreBtnEl.classList.add('is-hidden');
    pixabayApi.resetPage();

    try {
        pixabayApi.searchQuery = event.currentTarget.elements.searchQuery.value;
        const response = await pixabayApi.fetchPhotosByQuery();
        pixabayApi.totalHits = response.data.totalHits;

        if (response.data.total === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            galleryEl.innerHTML = '';
            loadMoreBtnEl.classList.add('is-hidden');
            return;
        }else if(response.data.total > 0) {
            Notiflix.Notify.success(`We founded: ${response.data.totalHits} images.`);
            galleryEl.innerHTML = galleryCard(response.data.hits);
            lightbox.refresh();
            loadMoreBtnEl.classList.remove('is-hidden');
        }
      
    }catch(err) {
        console.log(err);
    };



// loadMoreBtnEl.addEventListener('click', onClickLoadMore);


}