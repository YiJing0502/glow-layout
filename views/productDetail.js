console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.11/vue.esm-browser.min.js';
import { baseUrl, apiPath } from './config.js';

const { createPinia, mapState, mapActions, mapGetters } = Pinia;
import productsStore from '../stores/productsStore.js';

const app = createApp({
  data() {
    return {
      isLoading: false,
      showData: {},

    }
  },
  computed: {
    // ...mapState(productsStore, ['', '']),
  },
  methods: {
    getProduct(id) {
      console.log(id);
      this.isLoading = true;
      const url = `${baseUrl}/v2/api/${apiPath}/product/${id}`;
      axios.get(url)
        .then(res=>{
          this.showData = {...res.data.product};
          this.showData.content = this.textChanger(this.showData.content);
          this.isLoading = false;
          console.log(this.showData);
        })
        .catch(err=>{
          console.log('err', err);
        })
    },
    textChanger(str){
      return str.split('\n')
    },
    // ...mapActions(productsStore, ['',])
  },
  mounted() {
    this.getProduct('-NoLRz5ol1emgz6xq7j0')
  },
});

const pinia = createPinia();
app.use(pinia);
app.mount('#app');