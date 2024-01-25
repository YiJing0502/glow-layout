const { defineStore } = Pinia;
import { baseUrl, apiPath } from '../views/config.js';
export default defineStore('productsStore', {
  state: ()=>({
    productsData: [],
    isLoading: false,
  }),
  getters: {
    getProductsData: (state) => state.productsData,
  },
  actions: {
    // 取得所有產品
        // Action to fetch all products
    fetchProductsAll() {
      return new Promise((resolve, reject) => {
        const url = `${baseUrl}/v2/api/${apiPath}/products/all`;
        
        axios.get(url)
          .then(response => {
            this.productsData = response.data.products;
            resolve(response.data.products);
          })
          .catch(error => {
            console.error('Error fetching products:', error);
            reject(error);
          });
      });
    },
  },
});