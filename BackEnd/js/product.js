console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.11/vue.esm-browser.min.js';
import { baseUrl, apiPath } from './config.js';
let myProductModal;
let myDeleModal;
let myResultModal;
const app = createApp({
  data() {
    return {
      productsData: [],
      showData: {},
      inEditProductMode: true,
      inDeleProductMode: true,
      serverMessage: {
        message: '',
        success: true,
      },
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
        imagesUrl: [''],
      };
      myProductModal.show();
    },
    // modal, 打開刪除產品modal
    getAdminDelProductModal(id) {
      this.inDeleProductMode = true;
      this.showData = JSON.parse(JSON.stringify(this.productsData[id]));
      myDeleModal.show();
    },
    // fn, 刪除特定圖片
    deleteImage(myIndex){
      // 複製一份imagesUrl陣列，以免修改原陣列
      let imagesUrlArray = [...this.showData.imagesUrl];
      // 過濾掉符合條件的元素
      imagesUrlArray = imagesUrlArray.filter((item, index) => index !== myIndex);
      // 重新賦值給this.showData.imagesUrl
      this.showData.imagesUrl = imagesUrlArray;
    },
    // fn, 新增特定圖片
    addImage(){
      if(this.showData.imagesUrl === undefined) {
        this.showData.imagesUrl = ['',];
      }else{
        this.showData.imagesUrl.push('');
      };
    },
    // fn, 上傳多張圖片
    uploadImages(){
      const uploadServerMessage = {
        message: '',
        success: true,
      };
      const fileInput = this.$refs.myImgUploadInput;
      const multipleFilesArray = [...fileInput.files];
      // 驗證檔案大小、檔案類型
      for (let index = 0; index < multipleFilesArray.length; index++) {
        const element = multipleFilesArray[index];
        const fileSizeInBytes = element.size;
        const limitedFileSize = 3 * 1024 * 1024;
        console.log(element.type);
        if(fileSizeInBytes > limitedFileSize) {
          this.serverMessage.message = '圖片檔案不可超過3MB';
          this.serverMessage.success = false;
          myResultModal.show();
          return;
        };
        if(element.type !== 'image/jpeg' && element.type !== 'image/jpg' && element.type !== 'image/png') {
          this.serverMessage.message = '只接收「jpg」、「jpeg」、「png」類型的圖片檔案';
          this.serverMessage.success = false;
          myResultModal.show();
          return;
        };
      };
      // 上傳檔案
      multipleFilesArray.forEach((item,index)=>{
        console.log(item);
        // 產生一個新的上傳表單格式
        const formData = new FormData();
        // 夾帶欄位與要上傳的檔案
        formData.append('file-to-upload', item);
        // 上傳檔案
        axios.post(`${baseUrl}/api/${apiPath}/admin/upload`, formData)
          .then(res=>{
            console.log(res, 'res');
            if(res.data.success){
              uploadServerMessage.success = res.data.success;
              uploadServerMessage.message = '上傳成功';
              if(this.showData.imagesUrl === undefined) {
                this.showData.imagesUrl = [];
                this.showData.imagesUrl.push(res.data.imageUrl);
              }else{
                this.showData.imagesUrl.push(res.data.imageUrl);
              };
              this.serverMessage.message = uploadServerMessage.message;
              this.serverMessage.success = uploadServerMessage.success;
              myResultModal.show();
            }else{
              this.serverMessage.success = res.data.success;
              this.serverMessage.message = res.data.message;
              myResultModal.show();
            }
          })
          .catch(err=>{
            this.serverMessage.message = err.response.data.message;
            this.serverMessage.success = err.response.data.success;
            myResultModal.show();
          })
      });
    },
    // ajax, 確認使用者是否登入
    postApiUserCheck() {
      const url = `${baseUrl}/v2/api/user/check`;
      axios.post(url)
        .then((res)=>{
          if(res.data.success){
            this.serverMessage.message = '您已進入GLOW後台，祝您有個美好的一天';
            this.serverMessage.success = res.data.success;
            myResultModal.show();
            this.getAdminProductsAll();
            console.dir(myResultModal._isShown);
          }
        })
        .catch((err)=>{
          this.serverMessage.message = err.response.data.message;
          this.serverMessage.success = err.response.data.success;
          myResultModal.show();
          window.location = 'login.html';
        });
    },
    // ajax, 取得所有產品資料
    getAdminProductsAll() {
      const url = `${baseUrl}/v2/api/${apiPath}/admin/products/all`;
      axios.get(url)
        .then((res)=>{
          if(res.data.success){
            this.productsData = res.data.products;
          }
        })
        .catch((err)=>{
          this.serverMessage.message = err.response.data.message;
          this.serverMessage.success = err.response.data.success;
          myResultModal.show();
        })
    },
    // // ajax, 新增特定產品資料
    postAdminProduct() {
      const url = `${baseUrl}/v2/api/${apiPath}/admin/product`;
      const data = {
        data: this.showData,
      };
      axios.post(url, data)
        .then(res=>{
          this.getAdminProductsAll();
          this.serverMessage.message = res.data.message;
          this.serverMessage.success = res.data.success;
          myProductModal.hide();
          myResultModal.show();
        })
        .catch(err=>{
          this.serverMessage.message = err.response.data.message;
          this.serverMessage.success = err.response.data.success;
          myResultModal.show();
        });
    },
    // // ajax, 更新特定產品資料
    putAdminProduct(id){
      const url = `${baseUrl}/v2/api/${apiPath}/admin/product/${id}`;
      const data = {
        data: this.showData
      };
      axios.put(url, data)
        .then(res=>{
          if(res.data.success){
            this.getAdminProductsAll();
            this.serverMessage.message = res.data.message;
            this.serverMessage.success = res.data.success;
            myProductModal.hide();
            myResultModal.show();
          };
        })
        .catch(err=>{
          if(!err.data.success){
            this.serverMessage.message = err.response.data.message;
            this.serverMessage.success = err.response.data.success;
            myResultModal.show();
          }
        });
    },
    // ajax, 刪除特定產品資料
    deleteAdminProduct(){
      const id = this.showData.id;
      const url = `${baseUrl}/v2/api/${apiPath}/admin/product/${id}`;
      axios.delete(url)
        .then(res=>{
          if(res.data.success){
            myDeleModal.hide();
            this.getAdminProductsAll();
            this.serverMessage.message = res.data.message;
            this.serverMessage.success = res.data.success;
            myResultModal.show();
          }
        })
        .catch(err=>{
          myDeleModal.hide();
          this.serverMessage.message = err.response.data.message;
          this.serverMessage.success = err.response.data.success;
          myResultModal.show();
        })
    },
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
    // 獲取 bsProductModal ＤＯＭ
    const bsProductModal = document.querySelector('#bsProductModal', {backdrop: 'static', keyboard: false});
    // 建立 bootstrap modal 實體
    myProductModal = new bootstrap.Modal(bsProductModal);
    // 獲取 bsDeleModal ＤＯＭ
    const bsDeleModal = document.querySelector('#bsDeleModal');
    // 建立 bootstrap modal 實體
    myDeleModal = new bootstrap.Modal(bsDeleModal);
    // 獲取 bsResultModal DOM
    const bsResultModal = document.querySelector('#bsResultModal');
    // 建立 bootstrap modal 實體
    myResultModal = new bootstrap.Modal(bsResultModal);

  },
});
app.mount('#app');

