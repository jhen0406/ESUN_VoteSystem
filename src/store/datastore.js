import { defineStore } from "pinia";

export default defineStore("datastore", {
  state: () => ({
    // 存放全域變數的地方
    editObj: {},
    loginObj:{},
  }),
  getters: {
    // 返回變數或數據
    getEditObj: (state) => state.editObj,
  },
  actions: {
    // 處理數據
    setEditObj(obj) {
      this.editObj = obj;
    },
    setLoginObj(obj){
        this.loginObj = obj;
    },
  },
});
