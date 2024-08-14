<script>
import { RouterLink } from "vue-router";
import dataStore from "@/store/datastore";
import { mapState, mapActions } from "pinia";
import EditModal from "@/components/EditModal.vue";
export default {
  data() {
    return {
      voteName: "",
      voteList: [],
      count: 0,
      statisticsData: {},
      editModal: false,
      idList:[],
    };
  },
  computed: {
    ...mapState(dataStore, ["loginObj"]),
  },
  components: {
    RouterLink,
    EditModal,
  },
  methods: {
    ...mapActions(dataStore, ["setLoginObj"]),
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
      return this.statisticsData[itemId];
    },
    clearAndSearch() {
      this.voteName = "";
      this.search();
    },
    ifLogin() {
      console.log(this.loginObj);
      if (Object.keys(this.loginObj).length === 0) {
        alert("請先登入");
        this.login();
      }
    },
    login() {
      this.editModal = true;
    },
    saveUserData() {
      let obj = {
        userName: this.userName,
        userId: this.userId,
      };
      if (this.userName === "" || this.userId === "") {
        alert("此欄位為必填");
      } else {
        this.setLoginObj(obj);
        alert("登入成功");
        console.log("目前登入員工資料", this.loginObj);
        this.userName = "";
        this.userId = "";
        this.login();
      }
    },
    select(){
      console.log(this.idList);
      let voteIdStr = this.idList.join(';');
      let selectObj = {
        userName: this.loginObj.userName,
        userId: this.loginObj.userId,
        voteIds: voteIdStr,
      };
      // url
      fetch("http://localhost:8080/vote/select", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if(data.message === "Success!!"){
            alert("新增成功")
          } else if(data.message === "Duplicated Fill in"){
            alert("同一員工只能投票一次")
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
        this.idList = [];
        this.clearAndSearch();
    },
    logout(){
        this.loginObj.userName === "";
        this.loginObj.userId === "";
    }
  },
  created() {
    this.search();
    this.logout();
  },
  mounted() {},
};
</script>

<template>
  <editModal v-if="this.editModal" @alertModal="this.login()">
    <!--這個'slotModal'-->
    <template v-slot:header>
      <p>使用者登入</p>
    </template>
    <template v-slot:content>
      <span>員工姓名</span>
      <input type="text" v-model="this.userName" />
      <span>員工編號</span>
      <input type="text" v-model="this.userId" />
    </template>
    <template v-slot:footer>
      <button @click="this.saveUserData()">確認</button>
      <button @click="this.showEdit()">取消</button>
    </template>
  </editModal>
  <span>投票項目：</span>
  <input type="text" v-model="this.voteName" />
  <button @click="search()">搜尋</button>
  <button @click="clearAndSearch()">清空並顯示全部</button>
  <table class="vote">
    <thead>
      <th scope="col" class="thead">項目編號</th>
      <th scope="col" class="thead">投票項目</th>
      <th scope="col" class="thead">累積票數</th>
      <th scope="col" class="thead">點此投票</th>
    </thead>
    <tbody>
      <tr class="content" v-for="(item, index) in voteList">
        <td>{{ index + 1 }}</td>
        <td>{{ item.name }}</td>
        <td>{{ getStatistics(item.id) }}</td>
        <td>
          <input type="checkbox" v-model="this.idList" :value="item.id">
        </td>
      </tr>
    </tbody>
  </table>
  <button type="submit" @click="this.select()">提交</button>
</template>

<style scoped lang="scss"></style>
