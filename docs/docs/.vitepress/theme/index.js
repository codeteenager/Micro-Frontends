// 具体参考 https://vitepress.vuejs.org/guide/theme-introduction#using-a-custom-theme
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import AsideBottom from './AsideBottom.vue'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-bottom': () => h(AsideBottom)
    })
  }
}