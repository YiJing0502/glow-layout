console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.11/vue.esm-browser.min.js';
import { baseUrl, apiPath } from './config.js';
let myProductModal;
let myDeleModal;
const app = createApp({
  data() {
    return {
      productsData: [],
      showData: {},
      inEditProductMode: true,
      inDeleProductMode: true,

    };
  },
  methods: {
    // modal, 打開編輯產品modal
    getAdminProductModal(id) {
      this.inEditProductMode = true;
      this.showData = JSON.parse(JSON.stringify(this.productsData[id]));
      myProductModal.show();
      console.log(this.showData);
    },
    // modal, 打開新增產品 modal
    getAdminAddProductModal(){
      this.inEditProductMode = false;
      this.showData = {
        imagesUrl: [],
      };
      myProductModal.show();
    },
    // modal, 打開刪除產品modal
    getAdminDelProductModal(id) {
      this.inDeleProductMode = true;
      this.showData = JSON.parse(JSON.stringify(this.productsData[id]));
      myDeleModal.show();
    },
    // // modal, 刪除特定圖片
    deleteImage(myIndex){
      // 複製一份imagesUrl陣列，以免修改原陣列
      let imagesUrlArray = [...this.showData.imagesUrl];
      // 過濾掉符合條件的元素
      imagesUrlArray = imagesUrlArray.filter((item, index) => index !== myIndex);
      // 重新賦值給this.showData.imagesUrl
      this.showData.imagesUrl = imagesUrlArray;
    },
    // ajax, 確認使用者是否登入
    postApiUserCheck() {
      const url = `${baseUrl}/v2/api/user/check`;
      axios.post(url)
        .then((res)=>{
          if(res.data.success){
            // alert('成功進入GLOW後台，祝您有個美好的一天');
            this.getAdminProductsAll();
            console.log('ok');
          }
        })
        .catch((err)=>{
          if(!err.data.success){
            alert(err.data.message);
            window.location = 'login.html';
          }
        });
    },
    // ajax, 取得所有產品資料
    getAdminProductsAll() {
      const url = `${baseUrl}/v2/api/${apiPath}/admin/products/all`;
      axios.get(url)
        .then((res)=>{
          if(res.data.success){
            this.productsData = res.data.products;
            console.log(this.productsData);
          }
        })
        .catch((err)=>{
          if(!err.data.success){
            alert(err.data.message);
          }
        })
    },
    // // ajax, 新增特定產品資料
    // postAdminProduct() {
    //   const url = `${baseUrl}/v2/api/${apiPath}/admin/product`;
    //   const data = {
    //     data: this.showData,
    //   };
    //   axios.post(url, data)
    //     .then(res=>{
    //       if(res.data.success){
    //         this.getAdminProductsAll();
    //         alert(res.data.message);
    //         myProductModal.hide();
    //       };
    //     })
    //     .catch(err=>{
    //       if(!err.data.success){
    //         alert(err.data.message);
    //       }
    //     });
    // },
    // // ajax, 更新特定產品資料
    // putAdminProduct(id){
    //   const url = `${baseUrl}/v2/api/${apiPath}/admin/product/${id}`;
    //   const data = {
    //     data: this.showData
    //   };
    //   axios.put(url, data)
    //     .then(res=>{
    //       if(res.data.success){
    //         this.getAdminProductsAll();
    //         alert(res.data.message);
    //       };
    //     })
    //     .catch(err=>{
    //       if(!err.data.success){
    //         alert(err.data.message);
    //       }
    //     });
    // },
    // // ajax, 刪除特定產品資料
    // deleteAdminProduct(){
    //   const id = this.showData.id;
    //   const url = `${baseUrl}/v2/api/${apiPath}/admin/product/${id}`;
    //   axios.delete(url)
    //     .then(res=>{
    //       if(res.data.success){
    //         myDeleModal.hide();
    //         this.getAdminProductsAll();
    //         alert(res.data.message);
    //       }
    //     })
    //     .catch(err=>{
    //       if(!err.data.success){
    //         alert(err.data.message);
    //       }
    //     })
    // },
    scrollToBottom() {
      // 獲取滾動元素的引用
      const scrollContainer = this.$refs.scrollContainer;

      // 使用scrollIntoView方法使元素滾動到可視區域的底部
      scrollContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    },
  },
  mounted() { // 在 Vue 實例掛載到 DOM 元素後執行程式碼
    // 取得先前儲存在 cookie 中 adminAccount 的值
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)adminAccount\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    // 將token夾帶在HTTP的Header中的Authorization
    // 將驗證信息夾帶在每一個請求中，以確保後端能夠識別用戶
    // 只要加入一次就之後會自動將驗證的token夾帶在後續所有由前端發送到後端的請求，就不必在每一個請求中都單獨處理身份驗證的相關邏輯
    axios.defaults.headers.common['Authorization'] = token;
    // 觸發確認是否登入的方法
    this.postApiUserCheck();
    // 獲取 productModal ＤＯＭ
    const bsProductModal = document.querySelector('.bsProductModal');
    // 建立 bootstrap modal 實體
    // myProductModal = new bootstrap.Modal(productModal, {backdrop: 'static', keyboard: false});
    myProductModal = new bootstrap.Modal(bsProductModal);
    // 獲取 delProductModal ＤＯＭ
    const bsDeleModal = document.querySelector('.bsDeleModal');
    // 建立 bootstrap modal 實體
    myDeleModal = new bootstrap.Modal(bsDeleModal);

  },
});
app.mount('#app');

// const productModalBtn = document.querySelector('.productModalBtn');
// const bsProductModal = document.querySelector('.myProductModal');
// myProductModal = new bootstrap.Modal(myProductModal);
// productModalBtn.addEventListener('click', () => {
//   bsProductModal.show();
// })
// const delProductModalBtn = document.querySelector('.delProductModalBtn');
// const bsDeleModal = document.querySelector('.myDeleModal');

// bsDeleModal.show();
// delProductModalBtn.addEventListener('click', () => {
// })
