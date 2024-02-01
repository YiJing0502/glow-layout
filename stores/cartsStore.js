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
      return new Promise((resolve, reject)=>{
        this.isSmLoading = true;
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
            this.isSmLoading = false;
            resolve(); // 完成 Promise
          })
          .catch(err=>{
            alert('取得購物車資訊失敗，請稍後再試');
            reject(err); // 拒絕 Promise，傳遞錯誤
          })

      })
    },
    // ajax, 加入購物車商品方法
    async postCart(productId, qty) {
      try {
        const url = `${baseUrl}/v2/api/${apiPath}/cart`;
        const data = {
          "data": {
            "product_id": productId,
            "qty": qty,
          }
        };
        await axios.post(url, data);
        await this.getCart(false);
        alert('加入購物車成功');
      }
      catch {
        alert('加入購物車失敗，請稍後再試')
      }
    },
    // ajax, 修改購物車商品數量方法
    async putCart(productCartId, productId, qty) {
      const url = `${baseUrl}/v2/api/${apiPath}/cart/${productCartId}`;
      const data = {
        "data": {
          "product_id": productId,
          "qty": qty,
        }
      };
      this.isSmLoading = true;
      try {
        await axios.put(url, data);
        await this.getCart(false);
        alert('修改購物車商品數量成功');
        this.isSmLoading = false;
      }
      catch {
        this.isSmLoading = false;
        alert('修改購物車商品數量失敗，請稍後再試')
      };
    },
    // ajax, 刪除購物車商品方法
    async deleteCart(productCartId){
      const url = `${baseUrl}/v2/api/${apiPath}/cart/${productCartId}`;
      try {
        await axios.delete(url);
        await this.getCart(false);
        alert('刪除購物車商品成功');
      }
      catch {
        alert('刪除購物車商品失敗，請稍後再試');
      }
    },
    // ajax, 刪除全部購物車方法
    async deleteCarts(){
      const url = `${baseUrl}/v2/api/${apiPath}/carts`;
      try {
        await axios.delete(url);
        await this.getCart(false);
        alert('刪除所有購物車商品成功');
      }
      catch {
        alert('刪除所有購物車商品失敗，請稍後再試');
      };
    },
    // ajax, 使用優惠券方法
    async postCoupon(code){
      const url = `${baseUrl}/v2/api/${apiPath}/coupon`;
      const data = {
        "data": {
          "code": code,
        }
      };
      try {
        await axios.post(url, data);
        await this.getCart(false);
        alert('使用優惠券成功');
      }
      catch {
        alert('使用優惠券失敗，請稍後再試');
      };
    },
  },
});