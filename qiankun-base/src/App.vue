<template>
  <div>
    <el-menu
      :router="true"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/vue">主页</el-menu-item>
      <el-menu-item index="/react">关于</el-menu-item>
    </el-menu>
    <router-view />
    <div id="vue"></div>
    <div id="react"></div>
  </div>
</template>

<style>
body, h2, h3, h4, h5, h6, h7, hr, p, blockquote, /* structural elements 结构元素 */
dl, dt, dd, ul, ol, li, /* list elements 列表元素 */
pre, /* text formatting elements 文本格式元素 */
fieldset, lengend, button, input, textarea, /* form elements 表单元素 */
th, td {
  /* table elements 表格元素 */
  margin: 0;
  padding: 0;
}
</style>
