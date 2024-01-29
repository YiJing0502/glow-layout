console.clear();
const { createApp } = Vue;
const { createPinia, mapActions, mapState } = Pinia;
import cartsStore from '../stores/cartsStore.js';
// 元件
import QuantityControlBtns from '../components/QuantityControlBtns.js';

const app = createApp({
  data() {
    return {
      
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
    ...mapActions(cartsStore, ['getCart', 'putCart'])
  },
  computed: {
    ...mapState(cartsStore, ['isLoading', 'cartsData'])
  },
  mounted() {
    this.getCart();
  },
});

const pinia = createPinia();
app.use(pinia);

app.mount('#app');