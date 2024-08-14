<script>
import { RouterLink } from "vue-router";
export default {
  data() {
    return {
      voteName: "",
      voteList: [],
      count: 0,
      statisticsData: {},
    };
  },
  computed: {},
  components: {
    RouterLink,
  },
  methods: {
    search() {
      // 搜尋全部投票紀錄
      let searchObj = {
        name: this.voteName,
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
          console.log(data);
          this.voteList = data.voteList;
          this.loadStatistics(); // 加載統計數據
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    },
    loadStatistics() {
      // 遍歷每個投票項目的累積票數
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
      return this.statisticsData[itemId] ;
    },
    clearAndSearch(){
      this.voteName = "";
      this.search();
    }
  },
  created() {
    this.search();
  },
  mounted() {},
};
</script>

<template>
  <span>投票項目：</span>
  <input type="text" v-model="this.voteName" />
  <button @click="search()">搜尋</button>
  <button @click="clearAndSearch()">清空並顯示全部</button>
  <table class="vote">
    <thead>
      <th scope="col" class="thead">項目編號</th>
      <th scope="col" class="thead">投票項目</th>
      <th scope="col" class="thead">累積票數</th>
    </thead>
    <tbody>
      <tr class="content" v-for="(item, index) in voteList">
        <td>{{ index + 1 }}</td>
        <td>{{ item.name }}</td>
        <td>{{ getStatistics(item.id) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss"></style>
