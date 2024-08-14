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
    };
  },
  // 在 template 當標籤使用的方法或是元件，import進來後要宣告在components:{}裡面
  components: {
    RouterLink,
    EditModal,
  },
  computed: {
    ...mapState(dataStore, ["loginObj"]),
    adminRoute() {
      return this.$route.path.startsWith("/manage");
    },
    userRoute() {
      return this.$route.path.startsWith("/user");
    },
  },
  methods: {
    ...mapActions(dataStore, ["setLoginObj"]),
    login() {
      this.editModal = !this.editModal;
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
    logout(){
        this.loginObj.userName === "";
        this.loginObj.userId === "";
    }
  },
  created(){
    this.logout();
  }
};
</script>

<template>
  <div class="adminHeaderArea" v-if="adminRoute">
    <RouterLink to="/" >切換使用者</RouterLink>
    <!-- <RouterLink to="/managePage">投票項目總覽</RouterLink> -->
    <RouterLink to="/manageVote">管理投票項目</RouterLink>
  </div>
  <div class="userHeaderArea" v-else-if="userRoute">
    <RouterLink to="/">切換使用者</RouterLink>
    <span v-if="this.loginObj.userName">{{ this.loginObj.userName }}，您好</span>
    <span v-else></span>
    <button @click="this.login()"><i class="fa-solid fa-user"></i></button>
  </div>
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
</template>

<style scoped lang="scss"></style>
