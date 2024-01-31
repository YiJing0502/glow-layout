const { defineStore } = Pinia;
import { baseUrl, apiPath } from '../views/config.js';

export default defineStore('cartsStore', {
  state: ()=>({
    // 購物車產品資料
    cartsData: [],
    // 總購物車資料
    allCartsData: [],
    // 是否為載入中
    isLoading: false,
  }),
  getters: {

  },
  actions: {
    // ajax, 取得所有購物車資訊
    getCart(isInitialLoad = true) {
      if (isInitialLoad) {
        this.isLoading = true; // show loading for the entire page
      }
      const url = `${baseUrl}/v2/api/${apiPath}/cart`;
      axios.get(url)
        .then(res=>{
          // 購物車資料
          this.cartsData = [...res.data.data.carts];
          this.allCartsData = {...res.data.data};
          if(this.allCartsData.total !== this.allCartsData.final_total) {
            this.allCartsData.useCoupon = true;
          }else{
            this.allCartsData.useCoupon = false;
          };
          if (isInitialLoad) {
            // Hide loading for the entire page only for the initial load
            this.isLoading = false;
          }
          console.log('res.data.data', res.data.data);
          console.log(this.allCartsData);
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
    // ajax, 加入購物車商品方法
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
          this.getCart();
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
    // ajax, 修改購物車商品數量方法
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
          this.getCart(false);
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
    // ajax, 刪除購物車商品方法
    deleteCart(productCartId){
      const url = `${baseUrl}/v2/api/${apiPath}/cart/${productCartId}`;
      axios.delete(url)
        .then(res=>{
          console.log('res', res);
          this.getCart();
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
    // ajax, 刪除全部購物車方法
    deleteCarts(){
      const url = `${baseUrl}/v2/api/${apiPath}/carts`;
      axios.delete(url)
        .then(res=>{
          console.log('res', res);
          this.getCart();
        })
        .catch(err=>{
          console.log('err', err);
        })
        
    },
    // ajax, 使用優惠券方法
    postCoupon(code){
      const url = `${baseUrl}/v2/api/${apiPath}/coupon`;
      const data = {
        "data": {
          "code": code,
        }
      };
      axios.post(url, data)
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