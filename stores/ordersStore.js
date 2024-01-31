const { defineStore } = Pinia;
import stringStore from './stringStore.js';
import timeStore from './timeStore.js';
import { baseUrl, apiPath } from '../views/config.js';
export default defineStore('ordersStore', {
  state: ()=>({
    // 是否為載入中
    isLoading: false,
    // 訂單相關的總資料
    showData: {},
    userData: {},
    productData: [],
    couponData: {},
    // 訂單付款資料
    payData: {},
  }),
  getters: {

  },
  actions: {
    // ajax, 送出訂單方法
    postOrder(data){
      const url = `${baseUrl}/v2/api/${apiPath}/order`;
      axios.post(url, data)
      .then(res=>{
        this.changeToIdPage(res.data.orderId, 'payment.html');
        alert('訂單已建立，請接續付款流程');
      })
      .catch(err=>{
        alert('訂單送出失敗，請稍後再試');
      })
    },
    // fn, 跳轉至某個帶有id的頁面
    changeToIdPage(id, html){
      // encodeURIComponent:將特殊字符轉換成安全的URL編碼形式
      const url = `${html}?id=${encodeURIComponent(id)}`;
      window.location.href = url;
    },
    // ajax, 取得特定訂單
    getOrder(){
      // 獲取當前 URL 對象
      const currentUrl = new URL(window.location.href);
      // 從 URL 查詢參數中獲取商品 ID
      const orderId = currentUrl.searchParams.get('id');
      this.isLoading = true;
      const url = `${baseUrl}/v2/api/${apiPath}/order/${orderId}`;
      axios.get(url)
      .then(res=>{
        const { create_at, id, is_paid, message, paid_date, products, total, user } = res.data.order;
        this.showData = {
          create_at,
          id,
          is_paid,
          paid_date,
          total,
          message,
        };
        const { timestamp10CodeToDay } = timeStore();
        this.showData.create_at = timestamp10CodeToDay(create_at);
        this.showData.paid_date = timestamp10CodeToDay(paid_date);
        // 重新整理訂單備註
        const { splitStringByNewline } = stringStore();
        this.showData.message = splitStringByNewline(this.showData.message);
        // 拆分使用者資料
        this.userData = JSON.parse(JSON.stringify(user));
        // 重新整理產品格式為陣列
        Object.keys(products).forEach(item=>{
          const { final_total, id, product, product_id, qty, total } = products[item];
          const newProductData = {
            final_total,
            id,
            product,
            product_id,
            qty,
            total,
          };
          this.productData.push(newProductData);
          // 確認是否使用優惠券
          if(products[item].coupon !== undefined){
            this.couponData = products[item].coupon;
          };
        });
        if(Object.keys(this.couponData).length === 0){
          this.couponData = null;
        };
        this.isLoading = false;
      })
      .catch(err=>{
        alert('很抱歉，查無資訊');
        const url = `productList.html`;
        window.location.href = url;
      });
    },
    // ajax, 付款特定訂單
    postPayOrder(orderId){
      const url = `${baseUrl}/v2/api/${apiPath}/pay/${orderId}`;
      this.isLoading = true;
      axios.post(url)
      .then(res=>{
        this.payData = res.data;
        this.getOrder();
        this.isLoading = false;
        alert('您已付款成功');
      })
      .catch(err=>{
        alert('很抱歉，付款失敗，請稍後再試');
      });
    },
  },
});