<script>
import { RouterLink, RouterView } from "vue-router";
import EditModal from "./EditModal.vue";
import dataStore from "@/store/datastore";
import { mapState, mapActions } from "pinia";

export default {
  data() {
    return {
      editModal: false,
      userName: "",
      userId: "",
      statisticsData: {},
      editModal: false,
    };
  },
  // 在 template 當標籤使用的方法或是元件，import進來後要宣告在components:{}裡面
  components: {
    RouterLink,
    EditModal,
  },
  computed: {
    ...mapState(dataStore, ["loginObj", "page", "voteList", "countList"]),
    adminRoute() {
      return this.$route.path.startsWith("/manage");
    },
    userRoute() {
      return this.$route.path.startsWith("/user");
    },
  },
  methods: {
    ...mapActions(dataStore, ["setLoginObj", "setVoteList", "setCount"]),
    login() {
      this.editModal = true;
    },
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
          // 比對 voteList 和統計結果 的id
          let voteItem = this.voteList.find((item) => item.id === itemId);
          if (voteItem) {
            voteItem.count = data.count;
          }
          console.log(this.voteList);
          this.setCount(this.voteList);
          // this.statisticsData[itemId] = data.count;
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      // return this.count;
    },
    // getStatistics(itemId) {
    //   // 如果沒有統計數據，返回加載中的提示
    //   return this.statisticsData[itemId];
    // },
    clearAndSearch() {
      this.voteName = "";
      this.search();
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
        this.showEdit();
        console.log("目前登入員工資料", this.loginObj);
        this.userName = "";
        this.userId = "";
      }
    },
    showEdit() {
      // 更新投票項目的彈跳視窗的開關
      this.editModal = !this.editModal;
    },
    logout() {
      this.userName === "";
      this.userId === "";
      this.setLoginObj(this.userName, this.userId);
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
        this.showEdit();
      }
    },
  },
  created() {
    this.logout();
  },
};
</script>

<template>
  <div class="adminHeaderArea headerArea" v-if="adminRoute">
    <img src="/src/assets/photo/圖片1.jpg" alt="" />
    <RouterLink to="/" class="change admin"
      >切換使用者&ensp;&ensp;<i class="fa-solid fa-right-from-bracket"></i
    ></RouterLink>
    <!-- <RouterLink to="/managePage">投票項目總覽</RouterLink> -->
    <RouterLink
      class="routerItem"
      :class="{ selectedPage: this.page === 1 }"
      to="/manageVote"
      >管理投票項目</RouterLink
    >
  </div>
  <div
    class="userHeaderArea headerArea"
    v-else-if="userRoute"
    style="position: relative"
  >
    <img
      src="/src/assets/photo/41aecb10-c957-49db-b5f1-51bd73d2b080.jpg"
      alt=""
    />
    <!-- 搜尋列 -->
    <span
      style="
        position: absolute;
        top: 25px;
        left: 361px;
        font-size: 1.3em;
        color: #009691;
        font-weight: 600;
      "
      >投票項目</span
    >
    <input
      type="text"
      v-model="this.voteName"
      style="
        position: absolute;
        top: 25px;
        left: 474px;
        width: 224px;
        height: 30px;
        border: 2px solid #009691;
        border-radius: 19px;
        padding: 10px;
      "
    />
    <button @click="search()" class="search">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
    <button @click="clearAndSearch()" class="clear">清空並顯示全部</button>
    <!-- 員工名字顯示 -->
    <span
      v-if="this.loginObj.userName"
      style="position: absolute; top: 10px; right: 198px"
      >{{ this.loginObj.userName }}，您好</span
    >
    <span v-else>
      <!-- 登入 -->
      <button @click="this.login()" class="loginBtn">
        員工登入 &nbsp;<i class="fa-solid fa-user"></i>
      </button>
    </span>
    <!-- 切換使用者 -->
    <RouterLink to="/" class="change user" @click="this.logout()"
      >切換使用者&ensp;&ensp;<i class="fa-solid fa-right-from-bracket"></i
    ></RouterLink>
  </div>
  <div class="" v-else></div>
  <editModal v-if="this.editModal" @alertModal="this.showEdit()">
    <!--這個'slotModal'-->
    <template v-slot:header>
      <p style="font-size: 2em; position: absolute; top: 39px; left: 227px">
        使用者登入
      </p>
    </template>
    <template v-slot:content>
      <span
        style="position: absolute; top: 113px; font-size: 1.5em; left: 100px"
        >員工姓名</span
      >
      <input
        type="text"
        v-model="this.userName"
        class="loginInput"
        style="top: 113px"
      />
      <span
        style="position: absolute; top: 184px; font-size: 1.5em; left: 100px"
        >員工編號</span
      >
      <input
        type="text"
        v-model="this.userId"
        class="loginInput"
        style="top: 182px"
      />
    </template>
    <template v-slot:footer>
      <button @click="this.saveUserData()" class="memberBtn check">確認</button>
      <button @click="this.showEdit()" class="memberBtn cancel">取消</button>
    </template>
  </editModal>
</template>

<style scoped lang="scss">
* {
  background-color: transparent;
}
.headerArea {
  height: 15vh;
  width: 100%;
  position: relative;
}
.adminHeaderArea {
  overflow: hidden;
  img {
    height: 112%;
    margin-top: -5px;
  }
  background-color: #019e97;
  .routerItem {
    font-size: 24px;
    margin: 0px 1%;
    text-decoration: none;
    text-align: center;
    position: absolute;
    bottom: 18px;
    width: 16%;
    height: 57%;
    padding-top: 7px;
    left: 55%;
    background: white;
    border-radius: 50px;
  }
}
.change {
  position: absolute;
  top: 10px;
  right: 41px;
  text-decoration: none;
  font-weight: 600;
}
.admin {
  color: white;
  &:hover {
    color: #000000;
  }
}
.user {
  color: black;
  &:hover {
    color: #389792;
  }
}
.userHeaderArea {
  img {
    height: 74%;
    margin-top: 12px;
    margin-left: 10px;
  }
  box-shadow: -1px 5px 20px 0px #06211f2b;
}
.search {
  position: absolute;
  top: 28px;
  left: 720px;
  border: none;
  font-size: 1.3em;
  color: #009691;
  &:hover {
    cursor: pointer;
    color: #000000;
  }
}
.clear {
  position: absolute;
  top: 25px;
  right: 387px;
  border: none;
  background: #009691;
  width: 126px;
  height: 30px;
  border-radius: 20px;
  color: #fff;
  font-weight: 700;
  &:hover {
    cursor: pointer;
    background-color: #5abeb9;
  }
  &:active {
    scale: 95%;
  }
}
.loginBtn {
  position: absolute;
  top: 25px;
  right: 224px;
  border: none;
  width: 106px;
  height: 30px;
  font-size: 1.2em;
  color: gray;
  font-weight: 600;
  &:hover {
    cursor: pointer;
    color: #115f5c;
    scale: 105%;
  }
}
.loginInput {
  position: absolute;
  width: 244px;
  left: 237px;
  height: 36px;
  border: 2px solid #009691;
  border-radius: 13px;
  padding: 10px;
}
.memberBtn {
  position: absolute;
  bottom: 37px;
  width: 68px;
  height: 39px;
  border-radius: 12px;
  font-size: 1.2em;
  &:active {
    scale: 95%;
  }
}
.check {
  border: none;
  background: #257a77;
  left: 215px;
  color: white;
  &:hover {
    cursor: pointer;
    background-color: #8bafae;
  }
}
.cancel {
  left: 346px;
  border: 2px solid #009691;
  &:hover {
    cursor: pointer;
    background-color: #8bafae;
    border: none;
    color: white;
  }
}
</style>
