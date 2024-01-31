const { defineStore } = Pinia;
import { baseUrl, apiPath } from '../views/config.js';

export default defineStore('cartsStore', {
  state: ()=>({
    // 購物車產品資料
    cartsData: [],
    // 總購物車資料
    allCartsData: [],
    // 是否為載入中（全頁）
    isLoading: false,
    // 是否為載入中(小元件)
    isSmLoading: false,
  }),
  getters: {

  },
  actions: {
    // ajax, 取得所有購物車資訊
    getCart(isInitialLoad = true) {
      if (isInitialLoad) {
        // 顯示整頁的Loading
        this.isLoading = true; 
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
            // 關閉整頁的Loading
            this.isLoading = false;
          };
        })
        .catch(err=>{
          alert('取得購物車資訊失敗，請稍後再試');
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
          this.getCart(false);
          alert(res.data.message);
        })
        .catch(err=>{
          alert('加入購物車失敗，請稍後再試')
        })
    },
    // ajax, 修改購物車商品數量方法
    putCart(productCartId, productId, qty) {
      this.isSmLoading = true;
      const url = `${baseUrl}/v2/api/${apiPath}/cart/${productCartId}`;
      const data = {
        "data": {
          "product_id": productId,
          "qty": qty,
        }
      };
      axios.put(url, data)
        .then(res=>{
          this.getCart(false);
          alert('修改購物車商品數量成功');
          this.isSmLoading = false;
        })
        .catch(err=>{
          alert('修改購物車商品數量失敗，請稍後再試')
        });
    },
    // ajax, 刪除購物車商品方法
    deleteCart(productCartId){
      const url = `${baseUrl}/v2/api/${apiPath}/cart/${productCartId}`;
      axios.delete(url)
        .then(res=>{
          this.getCart(false);
          alert('刪除購物車商品成功');
        })
        .catch(err=>{
          alert('刪除購物車商品失敗，請稍後再試');
        });
    },
    // ajax, 刪除全部購物車方法
    deleteCarts(){
      const url = `${baseUrl}/v2/api/${apiPath}/carts`;
      axios.delete(url)
        .then(res=>{
          this.getCart(false);
          alert('刪除所有購物車商品成功');
        })
        .catch(err=>{
          alert('刪除所有購物車商品失敗，請稍後再試');
        });
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
        this.getCart(false);
        alert('使用優惠券成功');
      })
      .catch(err=>{
        alert('使用優惠券失敗，請稍後再試');
      })
    },
  },
});