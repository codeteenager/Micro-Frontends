const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    externals: {
      vue: "Vue",
      'vue-router': 'VueRouter',
      // vuex: 'Vuex',
      // 'element-ui': 'ELEMENT',
      // 'axios': 'axios',
    }
  }
})
