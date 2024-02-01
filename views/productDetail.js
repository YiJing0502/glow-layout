const { createApp } = Vue;
// 元件
import QuantityControlBtns from '../components/QuantityControlBtns.js';
const { createPinia, mapState, mapActions } = Pinia;
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
    ...mapState(cartsStore, ['cartsData','isSmLoading']),
  },
  methods: {
    // 增加數量
    plusNum(){
      this.currentNum = parseInt(this.currentNum);
      if(this.currentNum >= 1 && this.currentNum<this.showData.inventory){
        this.currentNum += 1;
      };
    },
    // 減少數量
    minusNum(){
      this.currentNum = parseInt(this.currentNum);
      if(this.currentNum > 1){
        this.currentNum -= 1;
      };
    },
    // 輸入, 自訂數量
    blurNum(e){
      this.currentNum = parseInt(e.target.value);
      if(this.currentNum > this.showData.inventory){
        this.currentNum = this.showData.inventory;
      }else if(this.currentNum <= 0){
        this.currentNum = 1;
      };
    },
    validateQuantity(currentNum, inventory) {
      if (parseInt(currentNum) > inventory) {
        alert(`無法將所選的數量加入到購物車，因為已經超過庫存的${inventory}件商品`);
        return false;
      } else if (parseInt(currentNum) < 0) {
        alert(`無法將所選的數量加入到購物車，因為商品數量不得低於1`);
        return false;
      }
      return true;
    },
    validateCartQuantity(productId, currentNum, inventory) {
      for (let index = 0; index < this.cartsData.length; index++) {
        const element = this.cartsData[index];
        if (element.product.id === productId) {
          if (element.qty >= inventory) {
            alert(`無法將所選的數量加入到購物車，因為購物車已經有${element.qty}件商品，請至購物車頁面查看`);
            return false;
          } else if (element.qty + parseInt(currentNum) >= inventory + 1) {
            alert(`無法將所選的數量加入到購物車，因為購物車已經有${element.qty}件商品，加入所選的數量會超過庫存，請重新選擇後再送出`);
            return false;
          }
        }
      }
      return true;
    },
    goToPostCart(productId,currentNum,inventory){
      this.getCart(false)
      if(this.isSmLoading && this.validateQuantity(currentNum, inventory) && this.validateCartQuantity(productId, currentNum, inventory)){
        this.postCart(productId, parseInt(currentNum));
      };
    },
    ...mapActions(productsStore, ['getProduct',]),
    ...mapActions(cartsStore, ['getCart','postCart'])
  },
  mounted() {
    this.getProduct();
    this.getCart(false);
  },
});

const pinia = createPinia();
app.use(pinia);
// vueLoadingComponent
app.component('loading', VueLoading.Component);
app.mount('#app');