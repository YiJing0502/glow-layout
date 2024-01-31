console.clear();
const { createApp } = Vue;
import { baseUrl, apiPath } from './config.js';
// 元件
import QuantityControlBtns from '../components/QuantityControlBtns.js';
const { createPinia, mapState, mapActions, mapGetters } = Pinia;
import productsStore from '../stores/productsStore.js';
import cartsStore from '../stores/cartsStore.js';

const app = createApp({
  data() {
    return {
      currentNum: 1,

    }
  },
  components: {
    QuantityControlBtns,
  },
  computed: {
    ...mapState(productsStore, ['isLoading', 'showData',]),
  },
  methods: {
    // 增加數量
    plusNum(){
      if(this.currentNum >= 1 && this.currentNum<this.showData.inventory){
        this.currentNum += 1;
      }else{
        this.currentNum = 1;
      }
    },
    // 減少數量
    minusNum(){
      if(this.currentNum > 1){
        this.currentNum -= 1;
      }else{
        this.currentNum = 1;
      }
    },
    // 限制數量
    inputNum(e){
      if(e.target.value > this.showData.inventory){
        this.currentNum = this.showData.inventory;
      }
    },
    ...mapActions(productsStore, ['getProduct',]),
    ...mapActions(cartsStore, ['postCart'])
  },
  mounted() {
    this.getProduct()
  },
});

const pinia = createPinia();
app.use(pinia);
// vueLoadingComponent
app.component('loading', VueLoading.Component);
app.mount('#app');