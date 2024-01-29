const { defineStore } = Pinia;
import { baseUrl, apiPath } from '../views/config.js';
// import productsStore from './productsStore.js';

export default defineStore('cartsStore', {
  state: ()=>({
    // 購物車資料
    cartsData: [],
    isLoading: false,
  }),
  getters: {

  },
  actions: {
    // 取得所有購物車資訊
    getCart() {
      this.isLoading = true;
      const url = `${baseUrl}/v2/api/${apiPath}/cart`;
      axios.get(url)
        .then(res=>{
          // 購物車資料
          this.cartsData = res.data.data.carts;
          // 總金額
          console.log(this.cartsData);
          this.isLoading = false;
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
    // 加入購物車商品方法
    postCart(productId, qty) {
      const url = `${baseUrl}/v2/api/${apiPath}/cart`;
      const data = {
        "data": {
          "product_id": productId,
          "qty": qty,
        }
      };
      axios.post(url, data)
        .then(res=>{
          console.log('res', res);
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
    // 修改購物車商品數量方法
    putCart(productCartId, productId, qty) {
      console.log(productId, qty);

      const url = `${baseUrl}/v2/api/${apiPath}/cart/${productCartId}`;
      const data = {
        "data": {
          "product_id": productId,
          "qty": qty,
        }
      };
      axios.put(url, data)
        .then(res=>{
          console.log('res', res);
          this.getCart();
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
  },
});