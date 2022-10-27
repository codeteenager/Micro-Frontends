const { defineConfig } = require('@vue/cli-service');
const packageName = require('./package.json').name;

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 10520,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: {
    output: {
      library: 'vueApp',
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`,
    }
  }
})
