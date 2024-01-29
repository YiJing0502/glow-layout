console.clear();
const { createApp } = Vue;
import { baseUrl, apiPath } from './config.js';

const { createPinia, mapState, mapActions, mapGetters } = Pinia;
import productsStore from '../stores/productsStore.js';

const app = createApp({
  data() {
    return {
      // isLoading: false,
      // showData: {},

    }
  },
  computed: {
    ...mapState(productsStore, ['isLoading', 'showData',]),
  },
  methods: {
    ...mapActions(productsStore, ['getProduct',])
  },
  mounted() {
    this.getProduct()
  },
});

const pinia = createPinia();
app.use(pinia);
app.mount('#app');