<script>
import { RouterLink } from "vue-router";
export default {
  data() {
    return {};
  },
  computed: {

  },
  components: {
    RouterLink,
  },
  created() {},
};
</script>

<template>
  <h1>請選擇身分</h1>
  <RouterLink to="/manageVote">後台管理者</RouterLink>
  <RouterLink to="/userPage">前台使用者</RouterLink>
</template>
