import { defineStore } from "pinia";

export default defineStore("datastore", {
  state: () => ({
    // 存放全域變數的地方
    editObj: {},
    loginObj:{},
    page: 1, // 讀取當頁頁碼
    statisticsData:{},
    voteList:[],
    countList:{},
  }),
  getters: {
    // 返回變數或數據
    getEditObj: (state) => state.editObj,
    getPage: (state) => state.page,
  },
  actions: {
    // 處理數據
    setPage(params) {
      this.page = params;
    },
    setEditObj(obj) {
      this.editObj = obj;
    },
    setLoginObj(obj){
        this.loginObj = obj;
    },
    clearAndSearch(voteName) {
      voteName = "";
      this.search();
    },
    setVoteList(voteList){
      this.voteList = voteList;
    },
    search(voteName) {
      // 搜尋全部投票紀錄
      let searchObj = {
        name: voteName
      };
      // url
      fetch("http://localhost:8080/vote/search", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("pinia的搜尋結果",data);
          this.voteList = data.voteList;
          this.setVoteList(data.voteList);
          this.loadStatistics(); // 加載統計數據
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    },
    loadStatistics() {
      // 遍歷每個投票項目的累積票數
      console.log(this.voteList);
      this.voteList.forEach((item) => {
        this.statistics(item.id);
      });
    },
    statistics(itemId) {
      //  統計票數
      let statisticsObj = {
        voteId: itemId,
      };
      // url
      fetch("http://localhost:8080/vote/statistics", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statisticsObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.statisticsData[itemId] = data.count;
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      // return this.count;
    },
    getStatistics(itemId) {
      // 如果沒有統計數據，返回加載中的提示
      return this.statisticsData[itemId];
    },
    setCount(obj){
      this.countList = obj
    }
  },
});
