console.clear();
const { createApp } = Vue;
import { baseUrl, apiPath } from './config.js';
import LoadingAnimation from '../components/LoadingAnimation.js';
import StatusMessage from '../components/StatusMessage.js';
import ResultModal from '../components/ResultModal.js';
import DeleteModal from '../components/DeleteModal.js';

import timeStore from '../stores/timeStore.js';
import adminStore from '../stores/adminStore.js';
import { createResultModal, createDeleteModal } from './modal.js'; 

const { createPinia, mapState, mapActions } = Pinia;

let myCouponModal = null;
let myDeleModal = null;
let myResultModal = null;


const app = createApp({
  data() {
    return {
      getRemoteData: false,
      couponsData: [],
      showData: {},
      inEditCouponMode: true,
      serverMessage: {
        message: '',
        success: true,
      },
    }
  },
  components: {
    LoadingAnimation,
    StatusMessage,
    ResultModal,
    DeleteModal,
  },
  methods: {
    // modal, 打開新增優惠券modal
    getAdminAddCouponModal(){
      this.inEditCouponMode = false;
      this.showData = {};
      myCouponModal.show();
    },
    // modal, 打開編輯優惠券modal
    getAdminCouponModal(index){
      this.inEditCouponMode = true;
      this.showData = JSON.parse(JSON.stringify(this.couponsData[index]));
      this.showData.due_date = this.timestamp10CodeToDay(this.showData.due_date)
      myCouponModal.show();
    },
    // modal, 打開刪除優惠券modal
    getAdminDeleCouponModal(index){
      this.showData = JSON.parse(JSON.stringify(this.couponsData[index]));
      myDeleModal.show();
    },
    getAdminCoupons(){
      const url = `${baseUrl}/v2/api/${apiPath}/admin/coupons`;
      axios.get(url)
      .then(res=>{
        this.getRemoteData = res.data.success;
        this.couponsData = res.data.coupons;
      })
      .catch(err=>{
        this.serverMessage.message = err.response.data.message;
        this.serverMessage.success = err.response.data.success;
        myResultModal.show();
      })
    },
    postAdminCoupon(){
      const url = `${baseUrl}/v2/api/${apiPath}/admin/coupon`;
      const data = {
        data: {...this.showData},
      };
      data.data.due_date = this.dayToTimestamp10Code(this.showData.due_date);
      axios.post(url, data)
        .then(res=>{
          this.getAdminCoupons();
          this.serverMessage.message = res.data.message;
          this.serverMessage.success = res.data.success;
          myCouponModal.hide();
          myResultModal.show();
        })
        .catch(err=>{
          this.serverMessage.message = err.response.data.message;
          this.serverMessage.success = err.response.data.success;
          myResultModal.show();
        })
    },
    putAdminCoupon(){
      const id = this.showData.id;
      const url = `${baseUrl}/v2/api/${apiPath}/admin/coupon/${id}`;
      const data = {
        data: {...this.showData},
      };
      data.data.due_date = this.dayToTimestamp10Code(this.showData.due_date);
      axios.put(url, data)
        .then(res=>{
          this.getAdminCoupons();
          this.serverMessage.message = res.data.message;
          this.serverMessage.success = res.data.success;
          myResultModal.show();
        })
        .catch(err=>{
          this.serverMessage.message = err.response.data.message;
          this.serverMessage.success = err.response.data.success;
          myResultModal.show();
        })
    },
    deleteAdminCoupon(){
      const id = this.showData.id;
      const url = `${baseUrl}/v2/api/${apiPath}/admin/coupon/${id}`;
      axios.delete(url)
        .then(res=>{
          this.getAdminCoupons();
          this.serverMessage.message = res.data.message;
          this.serverMessage.success = res.data.success;
          myDeleModal.hide();
          myResultModal.show();
        })
        .catch(err=>{
          this.serverMessage.message = err.response.data.message;
          this.serverMessage.success = err.response.data.success;
          myResultModal.show();
        })
    },
    ...mapActions(adminStore, ['initializeAdmin', 'postApiUserCheck',]),
    ...mapActions(timeStore, ['dayToTimestamp10Code', 'timestamp10CodeToDay',]),
  },
  computed: {
    ...mapState(adminStore, ['loginSuccess',]),
    ...mapState(timeStore, ['currentDate',]),
  },
  mounted() {
    this.initializeAdmin();
    // 觸發確認是否登入的方法
    this.postApiUserCheck()
      .then((res)=>{
        if(this.loginSuccess){
          this.serverMessage.message = '登入成功';
          this.serverMessage.success = this.loginSuccess;
          myResultModal.show();
          this.getAdminCoupons();
        }
      })
      .catch((err)=>{
        this.serverMessage.message = err.response.data.message;
        this.serverMessage.success = err.response.data.success;
        myResultModal.show();
        if(!this.loginSuccess){
          // 只有在使用者未登入時才重新導向
          window.location = 'login.html';
        }
      });
    // 獲取 bsCouponModal DOM
    const bsCouponModal = document.querySelector('#bsCouponModal');
    // 建立 bootstrap modal 實體
    myCouponModal = new bootstrap.Modal(bsCouponModal);

    // 在 mounted 階段生成共用 modal
    myResultModal = createResultModal();
    myDeleModal = createDeleteModal();

  },
});

const pinia = createPinia();
app.use(pinia);

app.mount('#app');