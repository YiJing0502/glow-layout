console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.11/vue.esm-browser.min.js';
import { baseUrl, apiPath } from './config.js';

const { createPinia, mapState, mapActions, mapGetters } = Pinia;
import productsStore from '../stores/productsStore.js';
const app = createApp({
  data() {
    return {
      productsData: [],
    }
  },
  methods: {
    getProductsAll() {
      const url = `${baseUrl}/v2/api/${apiPath}/products/all`;
      axios.get(url)
        .then(res=>{
          this.productsData = res.data.products;
          console.log('res', this.productsData);
        })
        .catch(err=>{
          console.log('err', err);
        });
    },
    ...mapActions(productsStore, ['getProduct']),
  },
  computed(){
    
  },
  mounted() {
    this.getProductsAll();
  },
});

const pinia = createPinia();
app.use(pinia);

app.mount('#app');