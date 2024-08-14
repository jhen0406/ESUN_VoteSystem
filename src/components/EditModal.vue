<script>
export default {};
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <div class="slotArea">
    <!-- 彈出視窗的整個頁面 -->
    <div class="block">
      <!-- 彈出視窗的框框 -->
      <slot name="header">
      </slot>

      <button type="button" class="close" @click="$emit('alertModal')">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <slot name="content"></slot>
      <slot name="footer"></slot>
      <!-- <button type="button" class="closefooter" @click="$emit('alertModal')">
        取消
      </button> -->
    </div>
    <div class="bg"></div>
    <!-- 彈出視窗框框外的背景-->
  </div>
</template>