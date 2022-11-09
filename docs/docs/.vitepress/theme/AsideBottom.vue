<script setup>
</script>

<template>
  <div class="content">
    <img class="icon" src="/weixin.jpg" />
    <span class="text">微信公众号</span>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  margin-top: 24px;
  border-radius: 12px;
  min-height: 240px;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  font-weight: 500;
  background-color: var(--vp-c-bg-soft);
  transition: color 0.5s, background-color 0.5s;
}
.content .icon {
  width: 130px;
  height: 130px;
}
.content .text {
  display: block;
  margin: 0 auto;
  padding-top: 12px;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}
</style>