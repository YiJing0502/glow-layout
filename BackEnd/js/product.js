console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.11/vue.esm-browser.min.js';
import { baseUrl, apiPath } from './config.js';
let myProductModal;
let myDeleModal;
let myResultModal;
// 分頁元件
const PageBtn = {
  props: ['page', 'currentPage'],
  emits: ['change-page'],
  template: `<li class="page-item"><button type="button" class="page-link" :class="{active: currentPage == page}" :data-page="page"  @click="$emit('change-page', page)">{{page}}</button></li>`
};
const PrevPageBtn = {
  props: ['isEnabled',],
  emits: ['change-page',],
  template: `<li class="page-item"><button type="button" class="page-link" :class="{disabled: !isEnabled,}" @click="$emit('change-page')">Previous</button></li>`,
};
const NextPageBtn = {
  props: ['isEnabled',],
  emits: ['change-page',],
  template: `<li class="page-item"><button type="button" class="page-link" :class="{disabled: !isEnabled,}" @click="$emit('change-page')">Next</button></li>`,
};
// 刪除 Modal 元件
const DeleteModal = {
  methods:{
    deleteAdminProduct(){
      this.$emit('delete-admin-product');
    },
  },
  props: ['showData',],
  emits: ['delete-admin-product',],
  template: `<div class="modal fade" id="bsDeleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-main-spec text-main-light">
        <h3 class="modal-title fs-5" id="exampleModalLabel">
          刪除產品
        </h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>是否刪除<strong class="text-main-spec">{{showData.title}}</strong>？</p>
        <p>刪除後將無法恢復</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-normal-gray" data-bs-dismiss="modal">關閉</button>
        <button type="button" class="btn btn-normal-spec" @click="deleteAdminProduct">刪除此產品</button>
      </div>
    </div>
  </div>
</div>`
};
// 結果 Modal 元件
const ResultModal = {
  props: ['serverMessage',],
  template: `<div class="modal fade" id="bsResultModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2"
  tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">
          {{ serverMessage.success ? '成功' : '失敗'}}
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        {{ serverMessage.message }}
      </div>
      <div class="modal-footer">
        <button class="btn btn-normal-gray" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">關閉</button>
      </div>
    </div>
  </div>
</div>`,
};
// 產品 Modal 元件
const ProductModal = {
  methods: {
    uploadImages(){
      this.$emit('upload-images')
    },
    addImage(){
      this.$emit('add-image');
    },
    putAdminProduct(id){
      this.$emit('put-admin-product', id);
    },
    postAdminProduct(){
      this.$emit('post-admin-product');
    }
  },
  props: ['showData', 'inEditProductMode'],
  emits: ['upload-images', 'add-image', 'put-admin-product', 'post-admin-product'],
  template: `<div class="modal fade" id="bsProductModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
  aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">{{inEditProductMode ? '編輯產品' : '新增產品'}}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active w-50" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home"
              type="button" role="tab" aria-controls="nav-home" aria-selected="true">商品內容</button>
            <button class="nav-link w-50" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
              type="button" role="tab" aria-controls="nav-profile" aria-selected="false">商品圖片</button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"
            tabindex="0">
            <div class="row mt-3">
              <div class="row">
                <div class="col-10">
                  <div class="mb-3">
                    <label for="title" class="form-label">標題</label>
                    <input type="text" class="form-control" id="title" placeholder="請輸入標題" v-model="showData.title">
                  </div>
                </div>
                <div class="col-2 d-flex align-items-center">
                  <div class="form-check mt-3">
                    <input type="checkbox" class="form-check-input" id="is_enabled" placeholder="請輸入標題"
                      :true-value="1" :false-value="0" v-model="showData.is_enabled">
                    <label for="is_enabled" class="form-check-label">是否啟用</label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col">
                  <label for="category" class="form-label">分類</label>
                  <input type="text" class="form-control" id="category" placeholder="請輸入分類"
                    v-model="showData.category">
                </div>
                <div class="mb-3 col">
                  <label for="unit" class="form-label">單位</label>
                  <input type="text" class="form-control" id="unit" placeholder="請輸入單位" v-model="showData.unit">
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col">
                  <label for="original_price" class="form-label">原價</label>
                  <input type="number" class="form-control" id="original_price" placeholder="請輸入原價"
                    v-model.number="showData.origin_price">
                </div>
                <div class="mb-3 col">
                  <label for="price" class="form-label">售價</label>
                  <input type="number" class="form-control" id="price" placeholder="請輸入售價"
                    v-model.number="showData.price">
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col">
                  <label for="cost_price" class="form-label">成本價</label>
                  <input type="number" class="form-control" id="cost_price" placeholder="請輸入成本價"
                    v-model.number="showData.cost_price">
                </div>
                <div class="mb-3 col">
                  <label for="inventory" class="form-label">庫存量</label>
                  <input type="number" class="form-control" id="inventory" placeholder="請輸入庫存量"
                    v-model.number="showData.inventory">
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="mb-3">
                    <label for="description" class="form-label">產品描述</label>
                    <textarea class="form-control" id="description" rows="3"
                      v-model="showData.description"></textarea>
                  </div>
                </div>
                <div class="col">
                  <div class="mb-3">
                    <label for="content" class="form-label">說明內容</label>
                    <textarea class="form-control" id="content" rows="3" v-model="showData.content"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"
            tabindex="0">
            <div class="row row-cols-4 mt-3">
              <div class="col mb-3">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">輸入主要圖片網址</label>
                  <input type="text" class="form-control" placeholder="請輸入主要圖片連結" v-model="showData.imageUrl">
                </div>
                <img :src="showData.imageUrl" :alt="showData.title" class="img-fluid">
              </div>
              <div class="col mb-3" v-for="(item,index) in showData.imagesUrl">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">輸入其他圖片網址</label>
                  <button type="button" class="btn-close float-end" aria-label="Close" @click="deleteImage(index)">
                  </button>
                  <input type="text" class="form-control" placeholder="請輸入其他圖片連結"
                    v-model="showData.imagesUrl[index]">
                </div>
                <img v-if="showData.imagesUrl[index]" :src="showData.imagesUrl[index]" :alt="showData.title+index"
                  class="img-fluid">
              </div>
              <div class="col mb-3">
                <div class="card">
                  <div class="card-body">
                    <label for="formFile" class="form-label">上傳圖片檔案</label>
                    <input class="form-control" type="file" ref="myImgUploadInput" @change="uploadImages"
                      accept="image/jpeg, image/jpg, image/png" multiple>
                    <hr>
                    <button class="btn btn-solid-gray w-100" @click="addImage">手動新增圖片</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-normal-gray" data-bs-dismiss="modal">關閉</button>
        <button type="button" class="btn btn-solid-spec"
          @click="inEditProductMode ? putAdminProduct(showData.id) : postAdminProduct()">{{inEditProductMode ? '更新'
          : '新增'}}</button>
      </div>
    </div>
  </div>
</div>`,

}
const app = createApp({
  data() {
    return {
      productsData: [],
      paginationData: [],
      pageData: {},
      infoData: [],
      showData: {},
      inEditProductMode: true,
      inDeleProductMode: true,
      serverMessage: {
        message: '',
        success: true,
      },
      productsCategory: [],
      searchInputValue: '',
    };
  },
  components:{
    PageBtn,
    PrevPageBtn,
    NextPageBtn,
    DeleteModal,
    ResultModal,
    ProductModal,
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
            this.paginationData = res.data.products;
            this.pagination(1);
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
          this.serverMessage.message = err.response.data.message;
          this.serverMessage.success = err.response.data.success;
          myResultModal.show();
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
    // fn, 分頁
    pagination(nowPage){
      const data = this.paginationData;
      // 取得全部資料長度
      const dataLength = Object.keys(data).length;
      // 設定每頁資料量
      const perPage = 10;
      // 取得總頁數，使用無條件進位
      const totalPage = Math.ceil(dataLength/perPage);
      // 設定當前頁數，變數
      let currentPage = nowPage;
      // 防呆：避免當前頁數比總頁數大
      if(currentPage > totalPage){
        currentPage = totalPage;
      };
      // 計算當前分頁顯示的資料範圍的最小值
      const minPerPageData = ((currentPage * perPage) - perPage) + 1;
      // 計算當前分頁顯示的資料範圍的最大值
      const maxPerPageData = (currentPage * perPage);
      // 建立新陣列，存放我們每頁的資料
      const newData = [];
      Object.keys(data).forEach((item,index)=>{
        // 因為所有的索引都會被加一，所以其實不影響運作，只是方便我們計算，所以用num，帶替原本的 index
        let num = index + 1;
        if(num >= minPerPageData && num <= maxPerPageData){
          newData.push(data[item]);
        };
      });
      this.infoData = newData;
      // 用物件方式來傳遞資料
      const page = {
        totalPage,
        currentPage,
        // 是否有上一頁
        hasPrevPage: currentPage > 1,
        // 是否有下一頁
        hasNextPage: currentPage < totalPage,
      };
      this.pageData = page;
    },
    // fn, 至底部
    scrollToBottom() {
      // 獲取滾動元素的引用
      const scrollContainer = this.$refs.scrollContainer;

      // 使用scrollIntoView方法使元素滾動到可視區域的底部
      scrollContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    },
    // fn,取得最新 category
    getCategory(){
      // 使用 Set 來確保類別的唯一性
      const uniqueCategories = new Set();
      Object.keys(this.productsData).forEach((element)=>{
        const category = this.productsData[element].category;
        uniqueCategories.add(category);
      });
      // 轉換 Set 為陣列，然後將它設置到 data 中的 productsCategory
      this.productsCategory = Array.from(uniqueCategories);
    },
    // fn,篩選 category
    filterCategory(category){
      this.paginationData = [];
      Object.keys(this.productsData).forEach((element, index)=>{
        const item = this.productsData[element];
        if(item.category === category){
          this.paginationData.push(item)
        };
      });
      this.pagination(1);
    },
    //fn, 搜尋
    searchProduct(){
      const newData = [];
      const lowerCaseData = this.searchInputValue.toLowerCase();
      console.log(lowerCaseData);
      Object.keys(this.productsData).forEach(element => {
        if(this.productsData[element].title.toLowerCase().match(lowerCaseData)){
          newData.push(this.productsData[element]);
        };
      });
      this.paginationData = newData;
      this.pagination(1);
    }
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

