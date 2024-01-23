console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.11/vue.esm-browser.min.js';
import { baseUrl, apiPath } from './config.js';

const app = createApp({
  data() {
    return {
      text: 'hello',
    }
  },
  methods: {
    
  },
  mounted() {
    
  },
});

app.mount('#app');