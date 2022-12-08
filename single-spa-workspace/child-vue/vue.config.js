const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9003
  },
  
  chainWebpack: config => {
    config.externals(["vue", "vue-router"])
  }
})
