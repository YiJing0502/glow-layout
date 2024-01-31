console.clear();
const { createApp } = Vue;
const { createPinia, mapActions, mapState } = Pinia;
import cartsStore from '../stores/cartsStore.js';
import ordersStore from '../stores/ordersStore.js';
// 元件
import QuantityControlBtns from '../components/QuantityControlBtns.js';

const app = createApp({
  data() {
    return {
      // 用來控制使用優惠券與否的切換
      useCoupon: false,
      // 優惠券代碼
      couponCode: '',
      // 是否觀看送出訂單前的事項
      checkOrderInfo: false,
      // 送出訂單資料
      orderData: {
        "data": {
          "user": {
            "name": null,
            "email": null,
            "tel": null,
            "address": null,
          },
          "message": null,
        }
      },
    }
  },
  components: {
    QuantityControlBtns,
  },
  methods: {
    goToPutCart(productCartId,productId,qty){
      console.log('goToPostCart',productCartId,productId,qty);
      this.putCart(productCartId,productId,qty)
    },
    goToPostCoupon(){
      console.log(this.couponCode);
      // this.useCoupon = false;
      this.postCoupon(this.couponCode);
    },
    ...mapActions(cartsStore, ['getCart', 'putCart', 'deleteCart', 'deleteCarts', 'postCoupon',]),
    ...mapActions(ordersStore, ['postOrder',]),
  },
  computed: {
    ...mapState(cartsStore, ['isLoading', 'cartsData', 'allCartsData']),
  },
  mounted() {
    this.getCart();
  },
});

const pinia = createPinia();
app.use(pinia);
// vueLoadingComponent
app.component('loading', VueLoading.Component);
app.mount('#app');