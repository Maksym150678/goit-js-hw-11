import axios from "axios";

export class PixabayApi {
#BASE_URL = 'https://pixabay.com/api/';
#API_KEY = '28761700-bdb95022346d012dceda456a5';

constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.dataPerPage = 40;
    this.totalHits = null;
};
  async fetchPhotosByQuery() {
    const searchParam = new URLSearchParams({
      image_type: this.photo,
      orientation: this.horizontal,
      safesearch: this.true,
      per_page: this.dataPerPage,
    });
    const request = await axios.get(`${this.#BASE_URL}`, {
      params: {
        image_type: this.photo,
        orientation: this.horizontal,
        safesearch: this.true,
        page: this.page,
        per_page: this.dataPerPage,
        q: this.searchQuery,
        key: this.#API_KEY,
      },
    });
    this.incrementPage();
    return request;
  }
  //создаем метод увелчения страниц на 1
  incrementPage() {
    this.page += 1;
  }
  //метод сброса страниц
  resetPage() {
    this.page = 1;
  }
  //создаем метод для проверки, когда все картинки загрузились
  //((тек.кол.страниц(4) - 1) * кол.стр.при выводе(40)) <= общ.кол.стр.
  isNextDataExsist() {
    return (this.page - 1) * this.dataPerPage <= this.totalHits;
  }
  //геттер и сеттер нужного значения query
  get query() {
    return this.searchQuery;
  }
  set query(newquery) {
    this.searchQuery = newquery;
  }
}





