import PixabayAPIService from "./js/pixabayService";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from "lodash.throttle";

const form = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.btn-load-more');
const gallery = document.querySelector('.gallery');

let markup = '';

form.addEventListener('submit', onSearch);
/* btnLoadMore.addEventListener('click', onLoadMore); */
window.addEventListener('scroll', throttle(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollHeight - clientHeight === Number.parseInt(scrollTop)) {
    onLoadMore();
  }
}), 500);


const pixabayAPIService = new PixabayAPIService();
let lightbox = new SimpleLightbox('.gallery a');

async function onSearch (event) {
event.preventDefault();
pixabayAPIService.query = event.currentTarget.elements.searchQuery.value;
pixabayAPIService.resetPage();
clearGallery();

await pixabayAPIService.fetchImages().then(createGalleryMarkup);
if(pixabayAPIService.totalHits){Notiflix.Notify.info(`Hooray! We found ${pixabayAPIService.totalHits} images.`)};
await lightbox.refresh(); 
/* btnLoadMore.classList.remove('is-hidden'); */
}

async function onLoadMore(){
    /* btnLoadMore.classList.add('is-hidden') */
    await pixabayAPIService.fetchImages().then(createGalleryMarkup);
    /* await btnLoadMore.classList.remove('is-hidden'); */
    await lightbox.refresh();
    scrollToTop();    
    if (pixabayAPIService.totalHits <= pixabayAPIService.getIMGNum()) {
      Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`); 
      return
    }
}

function createGalleryMarkup(hits){
    const markup = hits
    .map(hit => {
        return `<div class="photo-card">
        <a href="${hit.largeImageURL}">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width=360px height=240px/>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${hit.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${hit.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${hit.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${hit.downloads}
          </p>
        </div>
      </div>`
    }).join('');
    gallery.insertAdjacentHTML("beforeend", markup);
};

function clearGallery(){
  gallery.innerHTML = '';
}

function scrollToTop () {
const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
})};
