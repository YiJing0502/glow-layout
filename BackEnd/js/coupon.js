console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.11/vue.esm-browser.min.js';
import { baseUrl, apiPath } from './config.js';
import LoadingAnimation from '../components/LoadingAnimation.js';
import StatusMessage from '../components/StatusMessage.js';

const app = createApp({
  data() {
    return {
      text: 'hello',
    }
  },
  components: {
    LoadingAnimation,
    StatusMessage,
  },
  methods: {
    
  },
  mounted() {
    
  },
});

app.mount('#app');