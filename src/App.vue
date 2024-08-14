<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from"./components/Header.vue"
</script>

<template>
  <div class="header">
    <Header />
  </div>

  <RouterView />
</template>

<style scoped lang="scss">
.header {
  width: 100dvw;
  height: 20dvh;
}
</style>
