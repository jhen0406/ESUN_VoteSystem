<script>
import { RouterLink } from "vue-router";
export default {
  data() {
    return {};
  },
  computed: {},
  components: {
    RouterLink,
  },
  created() {},
};
</script>

<template>
  <div class="bg">
    <h1 class="title">線上投票系統</h1>
    <h1>請選擇身分</h1>
    <RouterLink to="/manageVote" class="manage box"
      ><span>後台管理者</span><i class="fa-solid fa-laptop-file"></i
    ></RouterLink>
    <RouterLink to="/userPage" class="user box"><span>前台使用者</span><i class="fa-solid fa-user-group"></i></RouterLink>
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-image: url("/src/assets/photo/未命名設計.jpg");
  background-size: cover;
  background-position: 5% 10% 5% 5%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100dvh;
  position: relative;
}
h1 {
  position: absolute;
  top: 50%;
  left: 15%;
  font-size: 2.5em;
  color: #076763;
}
.title {
  position: absolute;
  top: 7%;
  left: 50%;
  letter-spacing: 5px;
  color: #04948a;
}
.box {
  width: 30%;
  height: 20%;
  right: 20%;
  position: absolute;
  text-decoration: none;
  padding-top: 2%;
  border-radius: 25px;
  &:hover{
    background-color: #8eaba9;
    scale: 105%;
  }
  &:active{
    scale: 95%;
  }
}
.manage {
  top: 30%;
  background-color: #076763;
  color: white;
}
.user {
  bottom: 20%;
  background-color: #076763;
  color: white;
}
span{
  font-size: 2.5em;
  margin-left: 9%;
  margin-top: 20px;
}
i{
  font-size: 3.5em;
    margin-left: 40px;
    margin-top: -1px;
}
</style>
