console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.11/vue.esm-browser.min.js';
import { baseUrl, apiPath } from './config.js';
import LoadingAnimation from '../BackEnd/components/LoadingAnimation.js';
import StatusMessage from '../BackEnd/components/StatusMessage.js';

let myCouponModal = null;

const app = createApp({
  data() {
    return {
      couponsData: [],
      showData: {},
      inEditCouponMode: true,
    }
  },
  components: {
    LoadingAnimation,
    StatusMessage,
  },
  methods: {
    getAdminCoupons(){
      const url = `${baseUrl}/v2/api/${apiPath}/admin/coupons`;
      axios.get(url)
      .then(res=>{
        console.log('res', res);
      })
      .catch(err=>{
        console.log('err', err);
      })
    }
  },
  mounted() {
    // this.getAdminCoupons();
    // 獲取 bsCouponModal DOM
    const bsCouponModal = document.querySelector('#bsCouponModal');
    // 建立 bootstrap modal 實體
    myCouponModal = new bootstrap.Modal(bsCouponModal);
    myCouponModal.show();
  },
});

app.mount('#app');