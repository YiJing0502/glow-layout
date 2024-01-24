const { defineStore } = Pinia;
import { baseUrl, apiPath } from '../views/config.js';

export default defineStore('adminStore', {
  state: ()=>({
    loginSuccess: null,
  }),
  getters: {
  },
  actions: {
    initializeAdmin() {
      // 取得先前儲存在 cookie 中 adminAccount 的值
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)adminAccount\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
      // 將token夾帶在HTTP的Header中的Authorization
      // 將驗證信息夾帶在每一個請求中，以確保後端能夠識別用戶
      // 只要加入一次就之後會自動將驗證的token夾帶在後續所有由前端發送到後端的請求，就不必在每一個請求中都單獨處理身份驗證的相關邏輯
      axios.defaults.headers.common['Authorization'] = token;
    },
    postApiUserCheck() {
      const url = `${baseUrl}/v2/api/user/check`;
      return axios.post(url)
        .then((res)=>{
          this.loginSuccess = res.data.success;
          return res;
        })
        .catch((err)=>{
          this.loginSuccess = err.response.data.success;
          throw err;
        });
    },
  },
});