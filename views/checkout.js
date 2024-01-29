console.clear();
const { createApp } = Vue;
const { createPinia, mapActions, mapState } = Pinia;
import cartsStore from '../stores/cartsStore.js';
// 元件
import QuantityControlBtns from '../components/QuantityControlBtns.js';

const app = createApp({
  data() {
    return {
      
      useCoupon: false,
      couponCode: '',
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
      this.useCoupon = false;
      this.postCoupon(this.couponCode);
    },
    ...mapActions(cartsStore, ['getCart', 'putCart', 'deleteCart', 'deleteCarts', 'postCoupon'])
  },
  computed: {
    ...mapState(cartsStore, ['isLoading', 'cartsData', 'successfullyUseCoupon', 'allCartsData'])
  },
  mounted() {
    this.getCart();
  },
});

const pinia = createPinia();
app.use(pinia);

app.mount('#app');