<script>
import { RouterLink } from "vue-router";
import dataStore from "@/store/datastore";
import { mapState, mapActions } from "pinia";
import EditModal from "@/components/EditModal.vue";
export default {
  data() {
    return {
      voteName: "",
      editModal: false,
      idList: [],
    };
  },
  computed: {
    ...mapState(dataStore, ["loginObj", "voteList", "countList"]),
  },
  components: {
    RouterLink,
    EditModal,
  },
  methods: {
    ...mapActions(dataStore, ["setLoginObj", "setCount", "setVoteList"]),
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
          this.setVoteList(data.voteList);
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
          let voteItem = this.voteList.find((item) => item.id === itemId);
          if (voteItem) {
            voteItem.count = data.count;
          }
          console.log(this.voteList);
          this.setCount(this.voteList);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      // return this.count;
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
    select() {
      console.log(this.idList);
      let voteIdStr = this.idList.join(";");
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
          if (data.message === "Success!!") {
            alert("新增成功");
            this.showEdit();
          } else if (data.message === "Duplicated Fill in") {
            alert("同一員工只能投票一次");
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      this.idList = [];
      this.clearAndSearch();
    },
    logout() {
      this.loginObj.userName === "";
      this.loginObj.userId === "";
    },
    showEdit() {
      // 更新投票項目的彈跳視窗的開關
      this.editModal = !this.editModal;
    },
  },
  created() {
    this.search();
    this.logout();
  },
  mounted() {},
};
</script>

<template>
  <div class="bg">
    <!-- <table class="vote">
      <thead>
        <th scope="col" class="thead">項目編號</th>
        <th scope="col" class="thead">投票項目</th>
        <th scope="col" class="thead">累積票數</th>
        <th scope="col" class="thead">點此投票</th>
      </thead>
      <tbody>
        <tr class="content" v-for="(item, index) in this.countList">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.count }}</td>
          <td>
            <input type="checkbox" v-model="this.idList" :value="item.id" />
          </td>
        </tr>
      </tbody>
    </table> -->
    <!-- ============================================ -->
    <div class="allVoteItem">
      <div
        class="cardArea"
        v-for="(item, index) in this.countList"
        :key="index"
      >
        <div class="card">
          <div class="card-header">項目名稱：{{ item.name }}</div>
          <div class="card-body">
            <h5 class="card-title">{{ item.intro }}</h5>
            <p class="card-text">目前累積票數：{{ item.count }}</p>
            <input
              type="checkbox"
              v-model="this.idList"
              :value="item.id"
              style="
                margin-left: 211px;
                margin-top: -27px;
                width: 25px;
                height: 25px;
              "
            />
            <!-- <div
              class=""
              style="
                display: flex;
                justify-content: space-between;
                width: 100%;
                background-color: transparent;
                margin-left: 200px;
                margin-top: -34px;
              "
            > -->

            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
    <button type="submit" @click="this.select()" class="submit">提交</button>
    <a href="#top"><i class="fa-regular fa-circle-up"></i></a>
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-color: #d8e7e799;
  // height: 100vh;
}
.allVoteItem {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 53px; // 卡片間距
  padding: 20px;
}
.cardArea {
  flex: 1 1 calc(33.333% - 40px); /* 每个卡片占据父容器的 1/3 减去间距 */
  max-width: 300px;
  box-sizing: border-box;
}
.footerArea {
  height: 55px;
}
.card {
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  h5 {
    background-color: transparent;
  }
  p {
    background-color: transparent;
  }
}

.card-header {
  background-color: #009691;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: 600;
  font-size: 1.2em;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-title {
  margin-bottom: 10px;
  font-size: 1.25rem;
  text-align: center;
}

.card-text {
  margin-bottom: 10px;
  text-align: center;
}
.submit {
  width: 84px;
  height: 43px;
  border-radius: 12px;
  border: none;
  background: #5abeb9;
  margin-bottom: 18px;
  margin-left: 621px;
  margin-top: 16px;
  font-size: 1.2em;
  &:hover{
    cursor: pointer;
    background-color: #77a6a4;
  }
}
a{
  color: #009691;
  &:hover{
    color: #87cecb;
  }
}
.fa-circle-up {
    font-size: 30px;
    margin-bottom: 18px;
    margin-left: 500px;
}
</style>
