import{_ as d,v as l,b as _,e as f,f as m,F as c,a5 as o,u as h,Q as r,a6 as A,c as v,A as g,H as b,a7 as y,a8 as P,a9 as w,aa as x,ab as C,ac as F,ad as R,ae as D,af as E,ag as L,ah as T,ai as j,Y as I}from"./chunks/framework.c16e5371.js";import{t as i}from"./chunks/theme.7a733074.js";const O="/Micro-Frontends/weixin.jpeg";const B={},p=e=>(f("data-v-19099dcb"),e=e(),m(),e),H={class:"content"},S=p(()=>c("img",{class:"icon",src:O},null,-1)),V=p(()=>c("span",{class:"text"},"微信公众号",-1)),$=[S,V];function N(e,t){return l(),_("div",H,$)}const G=d(B,[["render",N],["__scopeId","data-v-19099dcb"]]);const M={...i,Layout(){return o(i.Layout,null,{"aside-bottom":()=>o(G)})}};function u(e){if(e.extends){const t=u(e.extends);return{...t,...e,async enhanceApp(a){t.enhanceApp&&await t.enhanceApp(a),e.enhanceApp&&await e.enhanceApp(a)}}}return e}const s=u(M),Q=h({name:"VitePressApp",setup(){const{site:e}=v();return g(()=>{b(()=>{document.documentElement.lang=e.value.lang,document.documentElement.dir=e.value.dir})}),y(),P(),w(),s.setup&&s.setup(),()=>o(s.Layout)}});async function U(){const e=k(),t=Y();t.provide(x,e);const a=C(e.route);return t.provide(F,a),t.component("Content",R),t.component("ClientOnly",D),Object.defineProperties(t.config.globalProperties,{$frontmatter:{get(){return a.frontmatter.value}},$params:{get(){return a.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:t,router:e,siteData:E}),{app:t,router:e,data:a}}function Y(){return L(Q)}function k(){let e=r,t;return T(a=>{let n=j(a);return n?(e&&(t=n),(e||t===n)&&(n=n.replace(/\.js$/,".lean.js")),r&&(e=!1),I(()=>import(n),[])):null},s.NotFound)}r&&U().then(({app:e,router:t,data:a})=>{t.go().then(()=>{A(t.route,a.site),e.mount("#app")})});export{U as createApp};
