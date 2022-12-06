# SystemJS模块化解决方案
> Github：https://github.com/systemjs/systemjs

## 概述
在微前端架构中，微应用被打包成模块，但浏览器不支持模块化，需要使用systemjs实现浏览器中的模块化。

systemjs 是一个用于实现模块化的 JavaScript 库，有属于自己的模块化规范。

在开发阶段我们可以使用ES模块规范，然后使用webpack将其转换为systemjs支持的模块。

## 使用
通过 webpack 将 react 应用打包为 systemjs 模块，在通过 systemjs 在浏览器中加载模块。
```shell
npm install webpack@5.17.0 webpack-cli@4.4.0 webpack-dev-server@3.11.2 html-webpackplugin@4.5.1 @babel/core@7.12.10 @babel/cli@7.12.10 @babel/preset-env@7.12.11 @babel/preset-react@7.12.10 babel-loader@8.2.2
```

```js
// package.json
{
  "name": "systemjs-react",
  "scripts": {
    "start": "webpack serve"
 },
  "dependencies": {
    "@babel/cli": "^7.12.10",
    "@babel/core": "^7.12.10",
    "@babel/preset-env": "^7.12.11",
    "@babel/preset-react": "^7.12.10",
    "babel-loader": "^8.2.2",
    "html-webpack-plugin": "^4.5.1",
    "webpack": "^5.17.0",
    "webpack-cli": "^4.4.0",
    "webpack-dev-server": "^3.11.2"
 }
}
```

```js
// webpack.config.js
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "build"),
    filename: "index.js",
    libraryTarget: "system"
 },
  devtool: "source-map",
  devServer: {
    port: 9000,
    contentBase: path.join(__dirname, "build"),
    historyApiFallback: true
 },
  module: {
    rules: [
     {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/react"]
         }
       }
     }
   ]
 },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: "./src/index.html"
   })
 ],
  externals: ["react", "react-dom", "react-router-dom"]
}
```
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>systemjs-react</title>
    <script type="systemjs-importmap">
     {
       "imports": {
         "react": 
"https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js",
         "react-dom": "https://cdn.jsdelivr.net/npm/react-dom/umd/reactdom.production.min.js",
         "react-router-dom": "https://cdn.jsdelivr.net/npm/react-routerdom@5.2.0/umd/react-router-dom.min.js"
       }
     }
    </script>
    <script
src="https://cdn.jsdelivr.net/npm/systemjs@6.8.0/dist/system.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      System.import("./index.js")
    </script>
  </body>
</html>
```

