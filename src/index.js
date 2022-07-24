import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import { PixabayApi } from './js/pixabay-api';
import galleryCard from './templates/gallery-card.hbs';
const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const pixabayApi = new PixabayApi();
const loadMoreBtnEl = document.querySelector('.load-more');

searchFormEl.addEventListener('submit', onSearchFormSubmt);

const libraryLightBox = new SimpleLightbox('.gallery', {
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
            Notiflix.Notify.success(`We founded: ${response.data.total} images.`);
            galleryEl.innerHTML = galleryCard(response.data.hits);
            loadMoreBtnEl.classList.remove('is-hidden');
        }
      
    }catch(err) {
        console.log(err);
    };

function renderCards(data) {
  const card = galleryCard(data);
  galleryEl.insertAdjacentHTML('beforeend', card);
  libraryLightBox.refresh();
}
//создаем функцию плавного скролла
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

loadMoreBtnEl.addEventListener('click', onClickLoadMore);
// //Создаем асинхронную функцию по событию click
async function onClickLoadMore(event) {
   try {
     //если условие метода равно false, то выводим сообщениео том, что картинок для подзагрузки уже нет
    if (!pixabayApi.isNextDataExsist()) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results"
      );
      //прячем кнопку
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    }
       const response = await pixabayApi.fetchPhotosByQuery();
       //рендерим картинки
       smoothScroll();
       renderCards(response.data.hits);
       console.log(pixabayApi);
  } catch (error) {
    console.log(error);
  }
}
}