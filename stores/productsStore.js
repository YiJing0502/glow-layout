const { defineStore } = Pinia;
import { baseUrl, apiPath } from '../views/config.js';
export default defineStore('productsStore', {
  state: ()=>({
    // 所有產品資料
    productsData: [],
    // 單筆產品詳細資料
    showData: '123',
    // 是否正在載入
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
    // 跳轉至產品頁面
    changeToProductPage(id) {
      const productId = id;
      // encodeURIComponent:將特殊字符轉換成安全的URL編碼形式
      const url = `productDetail.html?id=${encodeURIComponent(productId)}`
      window.location.href = url;
    },
    // 取得特定產品
    getProduct() {
      // 獲取當前 URL 對象
      const currentUrl = new URL(window.location.href);
      // 從 URL 查詢參數中獲取商品 ID
      const productId = currentUrl.searchParams.get('id');
      this.isLoading = true;
      const url = `${baseUrl}/v2/api/${apiPath}/product/${productId}`;
      axios.get(url)
        .then(res=>{
          this.showData = {...res.data.product};
          this.showData.content = this.splitStringByNewline(this.showData.content);
          this.isLoading = false;
          console.log(this.showData);
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
    // 按換行符拆分字串
    splitStringByNewline(str){
      return str.split('\n');
    },
  },
});