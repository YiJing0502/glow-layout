console.clear();
const { createApp } = Vue;
import { baseUrl, apiPath } from './config.js';

const { createPinia, mapState, mapActions, mapGetters } = Pinia;
import productsStore from '../stores/productsStore.js';
const app = createApp({
  data() {
    return {
      // productsData: [],
    }
  },
  methods: {
    // getProductsAll() {
    //   const url = `${baseUrl}/v2/api/${apiPath}/products/all`;
    //   axios.get(url)
    //     .then(res=>{
    //       this.productsData = res.data.products;
    //       console.log('res', this.productsData);
    //     })
    //     .catch(err=>{
    //       console.log('err', err);
    //     });
    // },
    ...mapActions(productsStore, ['getProductsAll', 'getProduct', 'changeToProductPage']),
  },
  computed: {
    ...mapState(productsStore, ['isLoading','productsData']),
  },
  mounted() {
    this.getProductsAll();
  },
});

const pinia = createPinia();
app.use(pinia);
// vueLoadingComponent
app.component('loading', VueLoading.Component);
app.mount('#app');