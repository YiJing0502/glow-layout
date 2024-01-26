const { defineStore } = Pinia;
import { baseUrl, apiPath } from '../views/config.js';
export default defineStore('productsStore', {
  state: ()=>({
    // 所有產品資料
    productsData: [],
    // 單筆產品詳細資料
    showData: '123',
    isLoading: false,
  }),
  getters: {
    getProductsData: (state) => state.productsData,
  },
  actions: {
    // 取得所有產品
    getProductsAll() {
      this.isLoading = true
      const url = `${baseUrl}/v2/api/${apiPath}/products/all`;
      return axios.get(url)
        .then(res => {
          this.productsData = res.data.products;
          return res
        })
        .catch(err => {
          throw err
        });
      

        

    },
    // 取得特定產品
    getProduct(id) {
      console.log(id);
      this.isLoading = true;
      const url = `${baseUrl}/v2/api/${apiPath}/product/${id}`;
      axios.get(url)
        .then(res=>{
          this.showData = res.data.product;
          this.isLoading = false;
          console.log(this.showData);
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
    
  },
});