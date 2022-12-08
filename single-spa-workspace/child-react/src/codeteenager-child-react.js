import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

// 指定根组件的渲染位置
const domElementGetter = () => document.getElementById("childReactContainer")
// 错误边界函数
const errorBoundary = () => <div>发生错误时此处内容将会被渲染</div>

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  domElementGetter,
  errorBoundary
});

export const { bootstrap, mount, unmount } = lifecycles;
