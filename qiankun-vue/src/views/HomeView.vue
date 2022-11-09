<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    {{getBirthday}}<button @click="updateBirthday">更改birthday</button><br/>
    <input type="text" v-model="message" placeholder="请输入内容"/>
    {{message}}
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  data() {
    return {
      birthday: 1014228510514,
      message: ''
    };
  },
  mounted(){
    console.log(this.$data);
    console.log(this.$options);
  },
  methods:{
    updateBirthday(){
      this.birthday = 1024334556671;
    }
  },
  computed: {
    getBirthday: function () {
      let m = new Date(this.birthday);
      return m.getFullYear() + "年" + m.getMonth() + "月" + m.getDay() + "日";
    },
  },
};
</script>
