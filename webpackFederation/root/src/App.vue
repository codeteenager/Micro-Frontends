<template>
  <div>
    {{ message }}
    <user-list></user-list>
  </div>
</template>
<script>
export default {
  components: { UserList: () => import("user/UserList") },
  data() {
    return {
      message: "消息",
    };
  },
};
</script>
<style scoped>
</style>