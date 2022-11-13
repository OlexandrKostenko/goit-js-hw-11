import axios from 'axios';
import Notiflix from 'notiflix';

export default class PixabayAPIService{
    constructor (){
        this.searchQuery = '';
        this.page = 1;
        this.perPage = 40;
        this.totalHits = 0;
    }
    async fetchImages(searchQuery) { const response = await axios.get(`https://pixabay.com/api/?key=30972640-fd90cea4a7431b6e8e60cb6a9&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
    
        if(!response.data.hits) {
            throw Error(response.statusText);
            
        }
    
    
        if(response.data.totalHits === 0){
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } 
        else
        this.incrementPage();
        this.totalHits = response.data.totalHits;
        return response.data.hits;
    };
     
    

    getIMGNum() {
        return this.perPage * this.page;
     }

    incrementPage () {
        this.page +=1;
    }

    resetPage () {
        this.page = 1;
    }

    get query (){
        return this.searchQuery;
    }

    set query (newQuery){
        this.searchQuery = newQuery;
    }

    
}