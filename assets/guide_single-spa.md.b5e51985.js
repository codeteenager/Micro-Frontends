import{_ as s,o as n,c as a,Q as p}from"./chunks/framework.ad12490d.js";const l="/Micro-Frontends/application/single-spa/1.jpg",F=JSON.parse('{"title":"single-spa源码解析","description":"","frontmatter":{},"headers":[],"relativePath":"guide/single-spa.md","filePath":"guide/single-spa.md","lastUpdated":1690454090000}'),o={name:"guide/single-spa.md"},e=p('<h1 id="single-spa源码解析" tabindex="-1">single-spa源码解析 <a class="header-anchor" href="#single-spa源码解析" aria-label="Permalink to &quot;single-spa源码解析&quot;">​</a></h1><p>我们先从Github上下载single-spa的源码：<a href="https://github.com/single-spa/single-spa" target="_blank" rel="noreferrer">https://github.com/single-spa/single-spa</a></p><p><img src="'+l+`" alt=""></p><p>整个源码采用rollup来构建的，可以从rollup.config.js中找到入口文件，在src/single-spa.js中，对外提供了一系列的方法，像start、registerApplication等。</p><p>single-spa最主要的实现了应用的注册、路由的修改和监听。其中路由的监听在src/navigation/navigation-events.js中，应用的注册主要包括了应用的生命周期相关内容在src/lifecycles/xxx.js中。</p><h2 id="应用注册" tabindex="-1">应用注册 <a class="header-anchor" href="#应用注册" aria-label="Permalink to &quot;应用注册&quot;">​</a></h2><p>应用注册提供了registerApplication方法，源码如下：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">//applications/apps</span></span>
<span class="line"><span style="color:#F97583;">**</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> 注册应用，两种方式</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">registerApplication</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;app1&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#B392F0;">loadApp</span><span style="color:#E1E4E8;">(url), </span><span style="color:#B392F0;">activeWhen</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;/app1&#39;</span><span style="color:#E1E4E8;">), customProps)</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">registerApplication</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;"> *    name: </span><span style="color:#9ECBFF;">&#39;app1&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;"> *    app: </span><span style="color:#B392F0;">loadApp</span><span style="color:#E1E4E8;">(url),</span></span>
<span class="line"><span style="color:#E1E4E8;"> *    activeWhen: </span><span style="color:#B392F0;">activeWhen</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;/app1&#39;</span><span style="color:#E1E4E8;">),</span></span>
<span class="line"><span style="color:#E1E4E8;"> *    customProps: {}</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> })</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> @param {</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">} appNameOrConfig 应用名称或者应用配置对象</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> @param {</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">} appOrLoadApp 应用的加载方法，是一个 promise</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> @param {</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">} activeWhen 判断应用是否激活的一个方法，方法返回 </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;"> or </span><span style="color:#79B8FF;">false</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> @param {</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">} customProps 传递给子应用的 props 对象</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*/</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">registerApplication</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">appNameOrConfig</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">appOrLoadApp</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">activeWhen</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">customProps</span></span>
<span class="line"><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 数据整理, 验证传参的合理性, 最后整理得到数据源:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// name: xxx,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// loadApp: xxx,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// activeWhen: xxx,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// customProps: xxx,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">registration</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">sanitizeArguments</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">    appNameOrConfig,</span></span>
<span class="line"><span style="color:#E1E4E8;">    appOrLoadApp,</span></span>
<span class="line"><span style="color:#E1E4E8;">    activeWhen,</span></span>
<span class="line"><span style="color:#E1E4E8;">    customProps</span></span>
<span class="line"><span style="color:#E1E4E8;">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 如果有重名,则抛出错误, 所以 name 应该是要保持唯一值</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">getAppNames</span><span style="color:#E1E4E8;">().</span><span style="color:#B392F0;">indexOf</span><span style="color:#E1E4E8;">(registration.name) </span><span style="color:#F97583;">!==</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Error</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">formatErrorMessage</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">21</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        __DEV__ </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">\`There is already an app registered with name \${</span><span style="color:#E1E4E8;">registration</span><span style="color:#9ECBFF;">.</span><span style="color:#E1E4E8;">name</span><span style="color:#9ECBFF;">}\`</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        registration.name</span></span>
<span class="line"><span style="color:#E1E4E8;">      )</span></span>
<span class="line"><span style="color:#E1E4E8;">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// apps 是 single-spa 的一个全局变量, 用来存储当前的应用数据</span></span>
<span class="line"><span style="color:#E1E4E8;">  apps.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">assign</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">      {</span></span>
<span class="line"><span style="color:#E1E4E8;">        loadErrorTime: </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        status: </span><span style="color:#79B8FF;">NOT_LOADED</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        parcels: {},</span></span>
<span class="line"><span style="color:#E1E4E8;">        devtools: {</span></span>
<span class="line"><span style="color:#E1E4E8;">          overlays: {</span></span>
<span class="line"><span style="color:#E1E4E8;">            options: {},</span></span>
<span class="line"><span style="color:#E1E4E8;">            selectors: [],</span></span>
<span class="line"><span style="color:#E1E4E8;">          },</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">      registration</span></span>
<span class="line"><span style="color:#E1E4E8;">    )</span></span>
<span class="line"><span style="color:#E1E4E8;">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 判断 window 是否为空, 进入条件</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (isInBrowser) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">ensureJQuerySupport</span><span style="color:#E1E4E8;">(); </span><span style="color:#6A737D;">// 确保 jq 可用</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">reroute</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">//applications/apps</span></span>
<span class="line"><span style="color:#D73A49;">**</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> 注册应用，两种方式</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">registerApplication</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;app1&#39;</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">loadApp</span><span style="color:#24292E;">(url), </span><span style="color:#6F42C1;">activeWhen</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;/app1&#39;</span><span style="color:#24292E;">), customProps)</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">registerApplication</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;"> *    name: </span><span style="color:#032F62;">&#39;app1&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;"> *    app: </span><span style="color:#6F42C1;">loadApp</span><span style="color:#24292E;">(url),</span></span>
<span class="line"><span style="color:#24292E;"> *    activeWhen: </span><span style="color:#6F42C1;">activeWhen</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;/app1&#39;</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;"> *    customProps: {}</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> })</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> @param {</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">} appNameOrConfig 应用名称或者应用配置对象</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> @param {</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">} appOrLoadApp 应用的加载方法，是一个 promise</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> @param {</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">} activeWhen 判断应用是否激活的一个方法，方法返回 </span><span style="color:#005CC5;">true</span><span style="color:#24292E;"> or </span><span style="color:#005CC5;">false</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> @param {</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">} customProps 传递给子应用的 props 对象</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">*/</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">registerApplication</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">appNameOrConfig</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">appOrLoadApp</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">activeWhen</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">customProps</span></span>
<span class="line"><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 数据整理, 验证传参的合理性, 最后整理得到数据源:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// name: xxx,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// loadApp: xxx,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// activeWhen: xxx,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// customProps: xxx,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">registration</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">sanitizeArguments</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">    appNameOrConfig,</span></span>
<span class="line"><span style="color:#24292E;">    appOrLoadApp,</span></span>
<span class="line"><span style="color:#24292E;">    activeWhen,</span></span>
<span class="line"><span style="color:#24292E;">    customProps</span></span>
<span class="line"><span style="color:#24292E;">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 如果有重名,则抛出错误, 所以 name 应该是要保持唯一值</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">getAppNames</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">indexOf</span><span style="color:#24292E;">(registration.name) </span><span style="color:#D73A49;">!==</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Error</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">formatErrorMessage</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">21</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        __DEV__ </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">\`There is already an app registered with name \${</span><span style="color:#24292E;">registration</span><span style="color:#032F62;">.</span><span style="color:#24292E;">name</span><span style="color:#032F62;">}\`</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        registration.name</span></span>
<span class="line"><span style="color:#24292E;">      )</span></span>
<span class="line"><span style="color:#24292E;">    );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// apps 是 single-spa 的一个全局变量, 用来存储当前的应用数据</span></span>
<span class="line"><span style="color:#24292E;">  apps.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">assign</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">      {</span></span>
<span class="line"><span style="color:#24292E;">        loadErrorTime: </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        status: </span><span style="color:#005CC5;">NOT_LOADED</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        parcels: {},</span></span>
<span class="line"><span style="color:#24292E;">        devtools: {</span></span>
<span class="line"><span style="color:#24292E;">          overlays: {</span></span>
<span class="line"><span style="color:#24292E;">            options: {},</span></span>
<span class="line"><span style="color:#24292E;">            selectors: [],</span></span>
<span class="line"><span style="color:#24292E;">          },</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">      registration</span></span>
<span class="line"><span style="color:#24292E;">    )</span></span>
<span class="line"><span style="color:#24292E;">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 判断 window 是否为空, 进入条件</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (isInBrowser) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">ensureJQuerySupport</span><span style="color:#24292E;">(); </span><span style="color:#6A737D;">// 确保 jq 可用</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">reroute</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br></div></div><p>首先对调用了sanitizeArguments对registerApplication的参数进行整合，然后判断子应用是否注册过，注册过则抛出异常，然后将子应用添加到apps这个数组中，等到调用start方法时来进行对应的渲染。</p><p>最后调用reroute方法。reroute 是 single-spa 的核心函数, 在注册应用时调用此函数的作用, 就是将应用的 promise 加载函数, 注入一个待加载的数组中 等后面正式启动时再调用, 类似于 ()=&gt;import(&#39;xxx&#39;)</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// navigation/reroute.js</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">reroute</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">pendingPromises</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> [], </span><span style="color:#FFAB70;">eventArguments</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;">// 一开始默认是 false</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (appChangeUnderway) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 如果是 true, 则返回一个 promise, 在队列中添加 resolve 参数等等</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">resolve</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">reject</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      peopleWaitingOnAppChange.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">        resolve,</span></span>
<span class="line"><span style="color:#E1E4E8;">        reject,</span></span>
<span class="line"><span style="color:#E1E4E8;">        eventArguments,</span></span>
<span class="line"><span style="color:#E1E4E8;">      });</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 遍历所有应用数组 apps , 根据 app 的状态, 来分类到这四个数组中</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 会根据 url 和 whenActive 判断是否该 load</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// unload , unmount, to load, to mount</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">appsToUnload</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">appsToUnmount</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">appsToLoad</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">appsToMount</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  } </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getAppChanges</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> appsThatChanged,</span></span>
<span class="line"><span style="color:#E1E4E8;">    navigationIsCanceled </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    oldUrl </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> currentUrl,</span></span>
<span class="line"><span style="color:#E1E4E8;">    newUrl </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (currentUrl </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> window.location.href);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 存储着一个闭包变量, 是否已经启动, 在注册步骤中, 是未启动的</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">isStarted</span><span style="color:#E1E4E8;">()) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    appChangeUnderway </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 合并状态需要变更的 app</span></span>
<span class="line"><span style="color:#E1E4E8;">    appsThatChanged </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> appsToUnload.</span><span style="color:#B392F0;">concat</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">      appsToLoad,</span></span>
<span class="line"><span style="color:#E1E4E8;">      appsToUnmount,</span></span>
<span class="line"><span style="color:#E1E4E8;">      appsToMount</span></span>
<span class="line"><span style="color:#E1E4E8;">    );</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 返回 performAppChanges 函数</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">performAppChanges</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">  } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 未启动, 直接返回 loadApps, 他的定义在下方</span></span>
<span class="line"><span style="color:#E1E4E8;">    appsThatChanged </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> appsToLoad;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">loadApps</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">cancelNavigation</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    navigationIsCanceled </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 返回一个 resolve 的 promise，通过微任务来加载apps</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 将需要加载的应用, map 成一个新的 promise 数组</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 并且用 promise.all 来返回</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 不管成功或者失败, 都会调用 callAllEventListeners 函数, 进行路由通知</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">loadApps</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">().</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// toLoadPromise 主要来定义资源的加载, 以及对应的回调</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">loadPromises</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> appsToLoad.</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">(toLoadPromise);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 通过 Promise.all 来执行, 返回的是 app.loadPromise，这是资源加载</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">all</span><span style="color:#E1E4E8;">(loadPromises)</span></span>
<span class="line"><span style="color:#E1E4E8;">          .</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(callAllEventListeners)</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;">// there are no mounted apps, before start() is called, so we always return []</span></span>
<span class="line"><span style="color:#E1E4E8;">          .</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> [])</span></span>
<span class="line"><span style="color:#E1E4E8;">          .</span><span style="color:#B392F0;">catch</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">err</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">callAllEventListeners</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> err;</span></span>
<span class="line"><span style="color:#E1E4E8;">          })</span></span>
<span class="line"><span style="color:#E1E4E8;">      );</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">performAppChanges</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">().</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// https://github.com/single-spa/single-spa/issues/545</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#6A737D;">//触发自定义事件</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 当前事件触发 getCustomEventDetail</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 主要是 app 的状态, url 的变更, 参数等等</span></span>
<span class="line"><span style="color:#E1E4E8;">      window.</span><span style="color:#B392F0;">dispatchEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">CustomEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">          appsThatChanged.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;single-spa:before-no-app-change&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;single-spa:before-app-change&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">getCustomEventDetail</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">        )</span></span>
<span class="line"><span style="color:#E1E4E8;">      );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      window.</span><span style="color:#B392F0;">dispatchEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">CustomEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">&quot;single-spa:before-routing-event&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">getCustomEventDetail</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">, { cancelNavigation })</span></span>
<span class="line"><span style="color:#E1E4E8;">        )</span></span>
<span class="line"><span style="color:#E1E4E8;">      );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 除非在上一个事件中调用了 cancelNavigation, 才会进入这一步</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (navigationIsCanceled) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        window.</span><span style="color:#B392F0;">dispatchEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">CustomEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#9ECBFF;">&quot;single-spa:before-mount-routing-event&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">getCustomEventDetail</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">          )</span></span>
<span class="line"><span style="color:#E1E4E8;">        );</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 将 peopleWaitingOnAppChange 的数据重新执行 reroute 函数 reroute(peopleWaitingOnAppChange) </span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">finishUpAndReturn</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 更新 url</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">navigateToUrl</span><span style="color:#E1E4E8;">(oldUrl);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 准备卸载的 app</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">unloadPromises</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> appsToUnload.</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">(toUnloadPromise);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 执行子应用中的 unmount 函数, 如果超时也会有报警</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">unmountUnloadPromises</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> appsToUnmount</span></span>
<span class="line"><span style="color:#E1E4E8;">        .</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">(toUnmountPromise)</span></span>
<span class="line"><span style="color:#E1E4E8;">        .</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">unmountPromise</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> unmountPromise.</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(toUnloadPromise));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">allUnmountPromises</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> unmountUnloadPromises.</span><span style="color:#B392F0;">concat</span><span style="color:#E1E4E8;">(unloadPromises);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">unmountAllPromise</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">all</span><span style="color:#E1E4E8;">(allUnmountPromises);</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 所有应用的卸载事件</span></span>
<span class="line"><span style="color:#E1E4E8;">      unmountAllPromise.</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        window.</span><span style="color:#B392F0;">dispatchEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">CustomEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#9ECBFF;">&quot;single-spa:before-mount-routing-event&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">getCustomEventDetail</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">          )</span></span>
<span class="line"><span style="color:#E1E4E8;">        );</span></span>
<span class="line"><span style="color:#E1E4E8;">      });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">/* We load and bootstrap apps while other apps are unmounting, but we</span></span>
<span class="line"><span style="color:#6A737D;">       * wait to mount the app until all apps are finishing unmounting</span></span>
<span class="line"><span style="color:#6A737D;">       */</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 执行 bootstrap 生命周期, tryToBootstrapAndMount 确保先执行 bootstrap</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">loadThenMountPromises</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> appsToLoad.</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toLoadPromise</span><span style="color:#E1E4E8;">(app).</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">tryToBootstrapAndMount</span><span style="color:#E1E4E8;">(app, unmountAllPromise)</span></span>
<span class="line"><span style="color:#E1E4E8;">        );</span></span>
<span class="line"><span style="color:#E1E4E8;">      });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">/* These are the apps that are already bootstrapped and just need</span></span>
<span class="line"><span style="color:#6A737D;">       * to be mounted. They each wait for all unmounting apps to finish up</span></span>
<span class="line"><span style="color:#6A737D;">       * before they mount.</span></span>
<span class="line"><span style="color:#6A737D;">       */</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// 执行 mount 事件</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">mountPromises</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> appsToMount</span></span>
<span class="line"><span style="color:#E1E4E8;">        .</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">appToMount</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> appsToLoad.</span><span style="color:#B392F0;">indexOf</span><span style="color:#E1E4E8;">(appToMount) </span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">        .</span><span style="color:#B392F0;">map</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">appToMount</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">tryToBootstrapAndMount</span><span style="color:#E1E4E8;">(appToMount, unmountAllPromise);</span></span>
<span class="line"><span style="color:#E1E4E8;">        });</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> unmountAllPromise</span></span>
<span class="line"><span style="color:#E1E4E8;">        .</span><span style="color:#B392F0;">catch</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">err</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">callAllEventListeners</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> err;</span></span>
<span class="line"><span style="color:#E1E4E8;">        })</span></span>
<span class="line"><span style="color:#E1E4E8;">        .</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;">/* Now that the apps that needed to be unmounted are unmounted, their DOM navigation</span></span>
<span class="line"><span style="color:#6A737D;">           * events (like hashchange or popstate) should have been cleaned up. So it&#39;s safe</span></span>
<span class="line"><span style="color:#6A737D;">           * to let the remaining captured event listeners to handle about the DOM event.</span></span>
<span class="line"><span style="color:#6A737D;">           */</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">callAllEventListeners</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">all</span><span style="color:#E1E4E8;">(loadThenMountPromises.</span><span style="color:#B392F0;">concat</span><span style="color:#E1E4E8;">(mountPromises))</span></span>
<span class="line"><span style="color:#E1E4E8;">            .</span><span style="color:#B392F0;">catch</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">err</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">              pendingPromises.</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">promise</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> promise.</span><span style="color:#B392F0;">reject</span><span style="color:#E1E4E8;">(err));</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> err;</span></span>
<span class="line"><span style="color:#E1E4E8;">            })</span></span>
<span class="line"><span style="color:#E1E4E8;">            .</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(finishUpAndReturn);</span></span>
<span class="line"><span style="color:#E1E4E8;">        });</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">finishUpAndReturn</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">returnValue</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getMountedApps</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    pendingPromises.</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">promise</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> promise.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">(returnValue));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">try</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">appChangeEventName</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span></span>
<span class="line"><span style="color:#E1E4E8;">        appsThatChanged.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;single-spa:no-app-change&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;single-spa:app-change&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      window.</span><span style="color:#B392F0;">dispatchEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">CustomEvent</span><span style="color:#E1E4E8;">(appChangeEventName, </span><span style="color:#B392F0;">getCustomEventDetail</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"><span style="color:#E1E4E8;">      );</span></span>
<span class="line"><span style="color:#E1E4E8;">      window.</span><span style="color:#B392F0;">dispatchEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">CustomEvent</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;single-spa:routing-event&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#B392F0;">getCustomEventDetail</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"><span style="color:#E1E4E8;">      );</span></span>
<span class="line"><span style="color:#E1E4E8;">    } </span><span style="color:#F97583;">catch</span><span style="color:#E1E4E8;"> (err) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">/* We use a setTimeout because if someone else&#39;s event handler throws an error, single-spa</span></span>
<span class="line"><span style="color:#6A737D;">       * needs to carry on. If a listener to the event throws an error, it&#39;s their own fault, not</span></span>
<span class="line"><span style="color:#6A737D;">       * single-spa&#39;s.</span></span>
<span class="line"><span style="color:#6A737D;">       */</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">setTimeout</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> err;</span></span>
<span class="line"><span style="color:#E1E4E8;">      });</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/* Setting this allows for subsequent calls to reroute() to actually perform</span></span>
<span class="line"><span style="color:#6A737D;">     * a reroute instead of just getting queued behind the current reroute call.</span></span>
<span class="line"><span style="color:#6A737D;">     * We want to do this after the mounting/unmounting is done but before we</span></span>
<span class="line"><span style="color:#6A737D;">     * resolve the promise for the \`reroute\` function.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    appChangeUnderway </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (peopleWaitingOnAppChange.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">/* While we were rerouting, someone else triggered another reroute that got queued.</span></span>
<span class="line"><span style="color:#6A737D;">       * So we need reroute again.</span></span>
<span class="line"><span style="color:#6A737D;">       */</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nextPendingPromises</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> peopleWaitingOnAppChange;</span></span>
<span class="line"><span style="color:#E1E4E8;">      peopleWaitingOnAppChange </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> [];</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">reroute</span><span style="color:#E1E4E8;">(nextPendingPromises);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> returnValue;</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">/* We need to call all event listeners that have been delayed because they were</span></span>
<span class="line"><span style="color:#6A737D;">   * waiting on single-spa. This includes haschange and popstate events for both</span></span>
<span class="line"><span style="color:#6A737D;">   * the current run of performAppChanges(), but also all of the queued event listeners.</span></span>
<span class="line"><span style="color:#6A737D;">   * We want to call the listeners in the same order as if they had not been delayed by</span></span>
<span class="line"><span style="color:#6A737D;">   * single-spa, which means queued ones first and then the most recent one.</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">callAllEventListeners</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    pendingPromises.</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">pendingPromise</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">callCapturedEventListeners</span><span style="color:#E1E4E8;">(pendingPromise.eventArguments);</span></span>
<span class="line"><span style="color:#E1E4E8;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">callCapturedEventListeners</span><span style="color:#E1E4E8;">(eventArguments);</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getCustomEventDetail</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">isBeforeChanges</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">extraProperties</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">newAppStatuses</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {};</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">appsByNewStatus</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// for apps that were mounted</span></span>
<span class="line"><span style="color:#E1E4E8;">      [</span><span style="color:#79B8FF;">MOUNTED</span><span style="color:#E1E4E8;">]: [],</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// for apps that were unmounted</span></span>
<span class="line"><span style="color:#E1E4E8;">      [</span><span style="color:#79B8FF;">NOT_MOUNTED</span><span style="color:#E1E4E8;">]: [],</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// apps that were forcibly unloaded</span></span>
<span class="line"><span style="color:#E1E4E8;">      [</span><span style="color:#79B8FF;">NOT_LOADED</span><span style="color:#E1E4E8;">]: [],</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// apps that attempted to do something but are broken now</span></span>
<span class="line"><span style="color:#E1E4E8;">      [</span><span style="color:#79B8FF;">SKIP_BECAUSE_BROKEN</span><span style="color:#E1E4E8;">]: [],</span></span>
<span class="line"><span style="color:#E1E4E8;">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (isBeforeChanges) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      appsToLoad.</span><span style="color:#B392F0;">concat</span><span style="color:#E1E4E8;">(appsToMount).</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">index</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">addApp</span><span style="color:#E1E4E8;">(app, </span><span style="color:#79B8FF;">MOUNTED</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">      });</span></span>
<span class="line"><span style="color:#E1E4E8;">      appsToUnload.</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">addApp</span><span style="color:#E1E4E8;">(app, </span><span style="color:#79B8FF;">NOT_LOADED</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">      });</span></span>
<span class="line"><span style="color:#E1E4E8;">      appsToUnmount.</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">addApp</span><span style="color:#E1E4E8;">(app, </span><span style="color:#79B8FF;">NOT_MOUNTED</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">      });</span></span>
<span class="line"><span style="color:#E1E4E8;">    } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      appsThatChanged.</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">addApp</span><span style="color:#E1E4E8;">(app);</span></span>
<span class="line"><span style="color:#E1E4E8;">      });</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">result</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      detail: {</span></span>
<span class="line"><span style="color:#E1E4E8;">        newAppStatuses,</span></span>
<span class="line"><span style="color:#E1E4E8;">        appsByNewStatus,</span></span>
<span class="line"><span style="color:#E1E4E8;">        totalAppChanges: appsThatChanged.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        originalEvent: eventArguments?.[</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">],</span></span>
<span class="line"><span style="color:#E1E4E8;">        oldUrl,</span></span>
<span class="line"><span style="color:#E1E4E8;">        newUrl,</span></span>
<span class="line"><span style="color:#E1E4E8;">        navigationIsCanceled,</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (extraProperties) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">assign</span><span style="color:#E1E4E8;">(result.detail, extraProperties);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> result;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">addApp</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">status</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">appName</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toName</span><span style="color:#E1E4E8;">(app);</span></span>
<span class="line"><span style="color:#E1E4E8;">      status </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> status </span><span style="color:#F97583;">||</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">getAppStatus</span><span style="color:#E1E4E8;">(appName);</span></span>
<span class="line"><span style="color:#E1E4E8;">      newAppStatuses[appName] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> status;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">statusArr</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> (appsByNewStatus[status] </span><span style="color:#F97583;">=</span></span>
<span class="line"><span style="color:#E1E4E8;">        appsByNewStatus[status] </span><span style="color:#F97583;">||</span><span style="color:#E1E4E8;"> []);</span></span>
<span class="line"><span style="color:#E1E4E8;">      statusArr.</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(appName);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// navigation/reroute.js</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">reroute</span><span style="color:#24292E;">(</span><span style="color:#E36209;">pendingPromises</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> [], </span><span style="color:#E36209;">eventArguments</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;">// 一开始默认是 false</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (appChangeUnderway) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 如果是 true, 则返回一个 promise, 在队列中添加 resolve 参数等等</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">((</span><span style="color:#E36209;">resolve</span><span style="color:#24292E;">, </span><span style="color:#E36209;">reject</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      peopleWaitingOnAppChange.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">        resolve,</span></span>
<span class="line"><span style="color:#24292E;">        reject,</span></span>
<span class="line"><span style="color:#24292E;">        eventArguments,</span></span>
<span class="line"><span style="color:#24292E;">      });</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 遍历所有应用数组 apps , 根据 app 的状态, 来分类到这四个数组中</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 会根据 url 和 whenActive 判断是否该 load</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// unload , unmount, to load, to mount</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">appsToUnload</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">appsToUnmount</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">appsToLoad</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">appsToMount</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  } </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getAppChanges</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> appsThatChanged,</span></span>
<span class="line"><span style="color:#24292E;">    navigationIsCanceled </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    oldUrl </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> currentUrl,</span></span>
<span class="line"><span style="color:#24292E;">    newUrl </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (currentUrl </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> window.location.href);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 存储着一个闭包变量, 是否已经启动, 在注册步骤中, 是未启动的</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">isStarted</span><span style="color:#24292E;">()) {</span></span>
<span class="line"><span style="color:#24292E;">    appChangeUnderway </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 合并状态需要变更的 app</span></span>
<span class="line"><span style="color:#24292E;">    appsThatChanged </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> appsToUnload.</span><span style="color:#6F42C1;">concat</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">      appsToLoad,</span></span>
<span class="line"><span style="color:#24292E;">      appsToUnmount,</span></span>
<span class="line"><span style="color:#24292E;">      appsToMount</span></span>
<span class="line"><span style="color:#24292E;">    );</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 返回 performAppChanges 函数</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">performAppChanges</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">  } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 未启动, 直接返回 loadApps, 他的定义在下方</span></span>
<span class="line"><span style="color:#24292E;">    appsThatChanged </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> appsToLoad;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">loadApps</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">cancelNavigation</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    navigationIsCanceled </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 返回一个 resolve 的 promise，通过微任务来加载apps</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 将需要加载的应用, map 成一个新的 promise 数组</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 并且用 promise.all 来返回</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 不管成功或者失败, 都会调用 callAllEventListeners 函数, 进行路由通知</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">loadApps</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// toLoadPromise 主要来定义资源的加载, 以及对应的回调</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">loadPromises</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> appsToLoad.</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">(toLoadPromise);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 通过 Promise.all 来执行, 返回的是 app.loadPromise，这是资源加载</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">all</span><span style="color:#24292E;">(loadPromises)</span></span>
<span class="line"><span style="color:#24292E;">          .</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(callAllEventListeners)</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;">// there are no mounted apps, before start() is called, so we always return []</span></span>
<span class="line"><span style="color:#24292E;">          .</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> [])</span></span>
<span class="line"><span style="color:#24292E;">          .</span><span style="color:#6F42C1;">catch</span><span style="color:#24292E;">((</span><span style="color:#E36209;">err</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">callAllEventListeners</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> err;</span></span>
<span class="line"><span style="color:#24292E;">          })</span></span>
<span class="line"><span style="color:#24292E;">      );</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">performAppChanges</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// https://github.com/single-spa/single-spa/issues/545</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#6A737D;">//触发自定义事件</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 当前事件触发 getCustomEventDetail</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 主要是 app 的状态, url 的变更, 参数等等</span></span>
<span class="line"><span style="color:#24292E;">      window.</span><span style="color:#6F42C1;">dispatchEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">CustomEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">          appsThatChanged.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;single-spa:before-no-app-change&quot;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;single-spa:before-app-change&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">getCustomEventDetail</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        )</span></span>
<span class="line"><span style="color:#24292E;">      );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      window.</span><span style="color:#6F42C1;">dispatchEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">CustomEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">&quot;single-spa:before-routing-event&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">getCustomEventDetail</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">, { cancelNavigation })</span></span>
<span class="line"><span style="color:#24292E;">        )</span></span>
<span class="line"><span style="color:#24292E;">      );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 除非在上一个事件中调用了 cancelNavigation, 才会进入这一步</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (navigationIsCanceled) {</span></span>
<span class="line"><span style="color:#24292E;">        window.</span><span style="color:#6F42C1;">dispatchEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">CustomEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#032F62;">&quot;single-spa:before-mount-routing-event&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">getCustomEventDetail</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">          )</span></span>
<span class="line"><span style="color:#24292E;">        );</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 将 peopleWaitingOnAppChange 的数据重新执行 reroute 函数 reroute(peopleWaitingOnAppChange) </span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">finishUpAndReturn</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 更新 url</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">navigateToUrl</span><span style="color:#24292E;">(oldUrl);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 准备卸载的 app</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">unloadPromises</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> appsToUnload.</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">(toUnloadPromise);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 执行子应用中的 unmount 函数, 如果超时也会有报警</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">unmountUnloadPromises</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> appsToUnmount</span></span>
<span class="line"><span style="color:#24292E;">        .</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">(toUnmountPromise)</span></span>
<span class="line"><span style="color:#24292E;">        .</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">unmountPromise</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> unmountPromise.</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(toUnloadPromise));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">allUnmountPromises</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> unmountUnloadPromises.</span><span style="color:#6F42C1;">concat</span><span style="color:#24292E;">(unloadPromises);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">unmountAllPromise</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">all</span><span style="color:#24292E;">(allUnmountPromises);</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 所有应用的卸载事件</span></span>
<span class="line"><span style="color:#24292E;">      unmountAllPromise.</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        window.</span><span style="color:#6F42C1;">dispatchEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">CustomEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#032F62;">&quot;single-spa:before-mount-routing-event&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">getCustomEventDetail</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">true</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">          )</span></span>
<span class="line"><span style="color:#24292E;">        );</span></span>
<span class="line"><span style="color:#24292E;">      });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">/* We load and bootstrap apps while other apps are unmounting, but we</span></span>
<span class="line"><span style="color:#6A737D;">       * wait to mount the app until all apps are finishing unmounting</span></span>
<span class="line"><span style="color:#6A737D;">       */</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 执行 bootstrap 生命周期, tryToBootstrapAndMount 确保先执行 bootstrap</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">loadThenMountPromises</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> appsToLoad.</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">app</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toLoadPromise</span><span style="color:#24292E;">(app).</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">((</span><span style="color:#E36209;">app</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">tryToBootstrapAndMount</span><span style="color:#24292E;">(app, unmountAllPromise)</span></span>
<span class="line"><span style="color:#24292E;">        );</span></span>
<span class="line"><span style="color:#24292E;">      });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">/* These are the apps that are already bootstrapped and just need</span></span>
<span class="line"><span style="color:#6A737D;">       * to be mounted. They each wait for all unmounting apps to finish up</span></span>
<span class="line"><span style="color:#6A737D;">       * before they mount.</span></span>
<span class="line"><span style="color:#6A737D;">       */</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// 执行 mount 事件</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">mountPromises</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> appsToMount</span></span>
<span class="line"><span style="color:#24292E;">        .</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">((</span><span style="color:#E36209;">appToMount</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> appsToLoad.</span><span style="color:#6F42C1;">indexOf</span><span style="color:#24292E;">(appToMount) </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">        .</span><span style="color:#6F42C1;">map</span><span style="color:#24292E;">((</span><span style="color:#E36209;">appToMount</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">tryToBootstrapAndMount</span><span style="color:#24292E;">(appToMount, unmountAllPromise);</span></span>
<span class="line"><span style="color:#24292E;">        });</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> unmountAllPromise</span></span>
<span class="line"><span style="color:#24292E;">        .</span><span style="color:#6F42C1;">catch</span><span style="color:#24292E;">((</span><span style="color:#E36209;">err</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">callAllEventListeners</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> err;</span></span>
<span class="line"><span style="color:#24292E;">        })</span></span>
<span class="line"><span style="color:#24292E;">        .</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;">/* Now that the apps that needed to be unmounted are unmounted, their DOM navigation</span></span>
<span class="line"><span style="color:#6A737D;">           * events (like hashchange or popstate) should have been cleaned up. So it&#39;s safe</span></span>
<span class="line"><span style="color:#6A737D;">           * to let the remaining captured event listeners to handle about the DOM event.</span></span>
<span class="line"><span style="color:#6A737D;">           */</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">callAllEventListeners</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">all</span><span style="color:#24292E;">(loadThenMountPromises.</span><span style="color:#6F42C1;">concat</span><span style="color:#24292E;">(mountPromises))</span></span>
<span class="line"><span style="color:#24292E;">            .</span><span style="color:#6F42C1;">catch</span><span style="color:#24292E;">((</span><span style="color:#E36209;">err</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">              pendingPromises.</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">((</span><span style="color:#E36209;">promise</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> promise.</span><span style="color:#6F42C1;">reject</span><span style="color:#24292E;">(err));</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> err;</span></span>
<span class="line"><span style="color:#24292E;">            })</span></span>
<span class="line"><span style="color:#24292E;">            .</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(finishUpAndReturn);</span></span>
<span class="line"><span style="color:#24292E;">        });</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">finishUpAndReturn</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">returnValue</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getMountedApps</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">    pendingPromises.</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">((</span><span style="color:#E36209;">promise</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> promise.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">(returnValue));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">try</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">appChangeEventName</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span></span>
<span class="line"><span style="color:#24292E;">        appsThatChanged.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;single-spa:no-app-change&quot;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;single-spa:app-change&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      window.</span><span style="color:#6F42C1;">dispatchEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">CustomEvent</span><span style="color:#24292E;">(appChangeEventName, </span><span style="color:#6F42C1;">getCustomEventDetail</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">      );</span></span>
<span class="line"><span style="color:#24292E;">      window.</span><span style="color:#6F42C1;">dispatchEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">CustomEvent</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;single-spa:routing-event&quot;</span><span style="color:#24292E;">, </span><span style="color:#6F42C1;">getCustomEventDetail</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">      );</span></span>
<span class="line"><span style="color:#24292E;">    } </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;"> (err) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">/* We use a setTimeout because if someone else&#39;s event handler throws an error, single-spa</span></span>
<span class="line"><span style="color:#6A737D;">       * needs to carry on. If a listener to the event throws an error, it&#39;s their own fault, not</span></span>
<span class="line"><span style="color:#6A737D;">       * single-spa&#39;s.</span></span>
<span class="line"><span style="color:#6A737D;">       */</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">setTimeout</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> err;</span></span>
<span class="line"><span style="color:#24292E;">      });</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/* Setting this allows for subsequent calls to reroute() to actually perform</span></span>
<span class="line"><span style="color:#6A737D;">     * a reroute instead of just getting queued behind the current reroute call.</span></span>
<span class="line"><span style="color:#6A737D;">     * We want to do this after the mounting/unmounting is done but before we</span></span>
<span class="line"><span style="color:#6A737D;">     * resolve the promise for the \`reroute\` function.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    appChangeUnderway </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (peopleWaitingOnAppChange.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">/* While we were rerouting, someone else triggered another reroute that got queued.</span></span>
<span class="line"><span style="color:#6A737D;">       * So we need reroute again.</span></span>
<span class="line"><span style="color:#6A737D;">       */</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nextPendingPromises</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> peopleWaitingOnAppChange;</span></span>
<span class="line"><span style="color:#24292E;">      peopleWaitingOnAppChange </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> [];</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">reroute</span><span style="color:#24292E;">(nextPendingPromises);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> returnValue;</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">/* We need to call all event listeners that have been delayed because they were</span></span>
<span class="line"><span style="color:#6A737D;">   * waiting on single-spa. This includes haschange and popstate events for both</span></span>
<span class="line"><span style="color:#6A737D;">   * the current run of performAppChanges(), but also all of the queued event listeners.</span></span>
<span class="line"><span style="color:#6A737D;">   * We want to call the listeners in the same order as if they had not been delayed by</span></span>
<span class="line"><span style="color:#6A737D;">   * single-spa, which means queued ones first and then the most recent one.</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">callAllEventListeners</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    pendingPromises.</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">((</span><span style="color:#E36209;">pendingPromise</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">callCapturedEventListeners</span><span style="color:#24292E;">(pendingPromise.eventArguments);</span></span>
<span class="line"><span style="color:#24292E;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">callCapturedEventListeners</span><span style="color:#24292E;">(eventArguments);</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getCustomEventDetail</span><span style="color:#24292E;">(</span><span style="color:#E36209;">isBeforeChanges</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">, </span><span style="color:#E36209;">extraProperties</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">newAppStatuses</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {};</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">appsByNewStatus</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// for apps that were mounted</span></span>
<span class="line"><span style="color:#24292E;">      [</span><span style="color:#005CC5;">MOUNTED</span><span style="color:#24292E;">]: [],</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// for apps that were unmounted</span></span>
<span class="line"><span style="color:#24292E;">      [</span><span style="color:#005CC5;">NOT_MOUNTED</span><span style="color:#24292E;">]: [],</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// apps that were forcibly unloaded</span></span>
<span class="line"><span style="color:#24292E;">      [</span><span style="color:#005CC5;">NOT_LOADED</span><span style="color:#24292E;">]: [],</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// apps that attempted to do something but are broken now</span></span>
<span class="line"><span style="color:#24292E;">      [</span><span style="color:#005CC5;">SKIP_BECAUSE_BROKEN</span><span style="color:#24292E;">]: [],</span></span>
<span class="line"><span style="color:#24292E;">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (isBeforeChanges) {</span></span>
<span class="line"><span style="color:#24292E;">      appsToLoad.</span><span style="color:#6F42C1;">concat</span><span style="color:#24292E;">(appsToMount).</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">((</span><span style="color:#E36209;">app</span><span style="color:#24292E;">, </span><span style="color:#E36209;">index</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">addApp</span><span style="color:#24292E;">(app, </span><span style="color:#005CC5;">MOUNTED</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">      });</span></span>
<span class="line"><span style="color:#24292E;">      appsToUnload.</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">((</span><span style="color:#E36209;">app</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">addApp</span><span style="color:#24292E;">(app, </span><span style="color:#005CC5;">NOT_LOADED</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">      });</span></span>
<span class="line"><span style="color:#24292E;">      appsToUnmount.</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">((</span><span style="color:#E36209;">app</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">addApp</span><span style="color:#24292E;">(app, </span><span style="color:#005CC5;">NOT_MOUNTED</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">      });</span></span>
<span class="line"><span style="color:#24292E;">    } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      appsThatChanged.</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">((</span><span style="color:#E36209;">app</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">addApp</span><span style="color:#24292E;">(app);</span></span>
<span class="line"><span style="color:#24292E;">      });</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">result</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      detail: {</span></span>
<span class="line"><span style="color:#24292E;">        newAppStatuses,</span></span>
<span class="line"><span style="color:#24292E;">        appsByNewStatus,</span></span>
<span class="line"><span style="color:#24292E;">        totalAppChanges: appsThatChanged.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        originalEvent: eventArguments?.[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">],</span></span>
<span class="line"><span style="color:#24292E;">        oldUrl,</span></span>
<span class="line"><span style="color:#24292E;">        newUrl,</span></span>
<span class="line"><span style="color:#24292E;">        navigationIsCanceled,</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">    };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (extraProperties) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">assign</span><span style="color:#24292E;">(result.detail, extraProperties);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> result;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">addApp</span><span style="color:#24292E;">(</span><span style="color:#E36209;">app</span><span style="color:#24292E;">, </span><span style="color:#E36209;">status</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">appName</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toName</span><span style="color:#24292E;">(app);</span></span>
<span class="line"><span style="color:#24292E;">      status </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> status </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getAppStatus</span><span style="color:#24292E;">(appName);</span></span>
<span class="line"><span style="color:#24292E;">      newAppStatuses[appName] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> status;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">statusArr</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> (appsByNewStatus[status] </span><span style="color:#D73A49;">=</span></span>
<span class="line"><span style="color:#24292E;">        appsByNewStatus[status] </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> []);</span></span>
<span class="line"><span style="color:#24292E;">      statusArr.</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(appName);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br><span class="line-number">259</span><br><span class="line-number">260</span><br><span class="line-number">261</span><br><span class="line-number">262</span><br><span class="line-number">263</span><br><span class="line-number">264</span><br><span class="line-number">265</span><br><span class="line-number">266</span><br><span class="line-number">267</span><br><span class="line-number">268</span><br><span class="line-number">269</span><br><span class="line-number">270</span><br><span class="line-number">271</span><br><span class="line-number">272</span><br><span class="line-number">273</span><br><span class="line-number">274</span><br><span class="line-number">275</span><br><span class="line-number">276</span><br><span class="line-number">277</span><br><span class="line-number">278</span><br><span class="line-number">279</span><br><span class="line-number">280</span><br><span class="line-number">281</span><br><span class="line-number">282</span><br><span class="line-number">283</span><br><span class="line-number">284</span><br><span class="line-number">285</span><br><span class="line-number">286</span><br><span class="line-number">287</span><br></div></div><p>我们看一下toLoadPromise，注册流程中 reroute的主要执行函数，它的主要功能是赋值 loadPromise 给 app, 其中 loadPromise 函数中包括了: 执行函数、来加载应用的资源、定义加载完毕的回调函数、状态的修改、还有加载错误的一些处理。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">//lifecycles/load.js</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toLoadPromise</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">().</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 是否重复注册 promise 加载了</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (app.loadPromise) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> app.loadPromise;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 刚注册的就是 NOT_LOADED 状态</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (app.status </span><span style="color:#F97583;">!==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">NOT_LOADED</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> app.status </span><span style="color:#F97583;">!==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">LOAD_ERROR</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> app;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 修改状态为, 加载源码</span></span>
<span class="line"><span style="color:#E1E4E8;">    app.status </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">LOADING_SOURCE_CODE</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> appOpts, isUserErr;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 返回的是 app.loadPromise</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> (app.loadPromise </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">      .</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 这里调用的了 app的 loadApp 函数(由外部传入的), 开始加载资源</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// getProps 用来判断 customProps 是否合法, 最后传值给 loadApp 函数</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">loadPromise</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> app.</span><span style="color:#B392F0;">loadApp</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">getProps</span><span style="color:#E1E4E8;">(app));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 判断 loadPromise 是否是一个 promise</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#B392F0;">smellsLikeAPromise</span><span style="color:#E1E4E8;">(loadPromise)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;">// The name of the app will be prepended to this error message inside of the handleAppError function</span></span>
<span class="line"><span style="color:#E1E4E8;">          isUserErr </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">throw</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Error</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">formatErrorMessage</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#79B8FF;">33</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              __DEV__ </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#9ECBFF;">\`single-spa loading function did not return a promise. Check the second argument to registerApplication(&#39;\${</span><span style="color:#B392F0;">toName</span><span style="color:#9ECBFF;">(</span></span>
<span class="line"><span style="color:#9ECBFF;">                  </span><span style="color:#E1E4E8;">app</span></span>
<span class="line"><span style="color:#9ECBFF;">                )</span><span style="color:#9ECBFF;">}&#39;, loadingFunction, activityFunction)\`</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">toName</span><span style="color:#E1E4E8;">(app)</span></span>
<span class="line"><span style="color:#E1E4E8;">            )</span></span>
<span class="line"><span style="color:#E1E4E8;">          );</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> loadPromise.</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">val</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;">// 资源加载成功</span></span>
<span class="line"><span style="color:#E1E4E8;">          app.loadErrorTime </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          appOpts </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> val;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> validationErrMessage, validationErrCode;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> appOpts </span><span style="color:#F97583;">!==</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;object&quot;</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            validationErrCode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">34</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (__DEV__) {</span></span>
<span class="line"><span style="color:#E1E4E8;">              validationErrMessage </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`does not export anything\`</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#6A737D;">// ES Modules don&#39;t have the Object prototype</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">Object</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">prototype</span><span style="color:#E1E4E8;">.hasOwnProperty.</span><span style="color:#B392F0;">call</span><span style="color:#E1E4E8;">(appOpts, </span><span style="color:#9ECBFF;">&quot;bootstrap&quot;</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">!</span><span style="color:#B392F0;">validLifecycleFn</span><span style="color:#E1E4E8;">(appOpts.bootstrap)</span></span>
<span class="line"><span style="color:#E1E4E8;">          ) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            validationErrCode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">35</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (__DEV__) {</span></span>
<span class="line"><span style="color:#E1E4E8;">              validationErrMessage </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`does not export a valid bootstrap function or array of functions\`</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#B392F0;">validLifecycleFn</span><span style="color:#E1E4E8;">(appOpts.mount)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            validationErrCode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">36</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (__DEV__) {</span></span>
<span class="line"><span style="color:#E1E4E8;">              validationErrMessage </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`does not export a mount function or array of functions\`</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#B392F0;">validLifecycleFn</span><span style="color:#E1E4E8;">(appOpts.unmount)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            validationErrCode </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">37</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (__DEV__) {</span></span>
<span class="line"><span style="color:#E1E4E8;">              validationErrMessage </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">\`does not export a unmount function or array of functions\`</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            }</span></span>
<span class="line"><span style="color:#E1E4E8;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">type</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">objectType</span><span style="color:#E1E4E8;">(appOpts);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (validationErrCode) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> appOptsStr;</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">try</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">              appOptsStr </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">JSON</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">stringify</span><span style="color:#E1E4E8;">(appOpts);</span></span>
<span class="line"><span style="color:#E1E4E8;">            } </span><span style="color:#F97583;">catch</span><span style="color:#E1E4E8;"> {}</span></span>
<span class="line"><span style="color:#E1E4E8;">            console.</span><span style="color:#B392F0;">error</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">formatErrorMessage</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">                validationErrCode,</span></span>
<span class="line"><span style="color:#E1E4E8;">                __DEV__ </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">                  </span><span style="color:#9ECBFF;">\`The loading function for single-spa \${</span><span style="color:#E1E4E8;">type</span><span style="color:#9ECBFF;">} &#39;\${</span><span style="color:#B392F0;">toName</span><span style="color:#9ECBFF;">(</span></span>
<span class="line"><span style="color:#9ECBFF;">                    </span><span style="color:#E1E4E8;">app</span></span>
<span class="line"><span style="color:#9ECBFF;">                  )</span><span style="color:#9ECBFF;">}&#39; resolved with the following, which does not have bootstrap, mount, and unmount functions\`</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                type,</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#B392F0;">toName</span><span style="color:#E1E4E8;">(app),</span></span>
<span class="line"><span style="color:#E1E4E8;">                appOptsStr</span></span>
<span class="line"><span style="color:#E1E4E8;">              ),</span></span>
<span class="line"><span style="color:#E1E4E8;">              appOpts</span></span>
<span class="line"><span style="color:#E1E4E8;">            );</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">handleAppError</span><span style="color:#E1E4E8;">(validationErrMessage, app, </span><span style="color:#79B8FF;">SKIP_BECAUSE_BROKEN</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> app;</span></span>
<span class="line"><span style="color:#E1E4E8;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (appOpts.devtools </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> appOpts.devtools.overlays) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            app.devtools.overlays </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">assign</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">              {},</span></span>
<span class="line"><span style="color:#E1E4E8;">              app.devtools.overlays,</span></span>
<span class="line"><span style="color:#E1E4E8;">              appOpts.devtools.overlays</span></span>
<span class="line"><span style="color:#E1E4E8;">            );</span></span>
<span class="line"><span style="color:#E1E4E8;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;">// 设置app状态为未初始化，表示加载完了</span></span>
<span class="line"><span style="color:#E1E4E8;">          app.status </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">NOT_BOOTSTRAPPED</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;">// 在app对象上挂载生命周期方法，每个方法都接收一个props作为参数，方法内部执行子应用导出的生命周期函数，并确保生命周期函数返回一个promise</span></span>
<span class="line"><span style="color:#E1E4E8;">          app.bootstrap </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">flattenFnArray</span><span style="color:#E1E4E8;">(appOpts, </span><span style="color:#9ECBFF;">&quot;bootstrap&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">          app.mount </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">flattenFnArray</span><span style="color:#E1E4E8;">(appOpts, </span><span style="color:#9ECBFF;">&quot;mount&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">          app.unmount </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">flattenFnArray</span><span style="color:#E1E4E8;">(appOpts, </span><span style="color:#9ECBFF;">&quot;unmount&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">          app.unload </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">flattenFnArray</span><span style="color:#E1E4E8;">(appOpts, </span><span style="color:#9ECBFF;">&quot;unload&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">          app.timeouts </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ensureValidAppTimeouts</span><span style="color:#E1E4E8;">(appOpts.timeouts);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;">// 执行完毕之后删除 loadPromise</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">delete</span><span style="color:#E1E4E8;"> app.loadPromise;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> app;</span></span>
<span class="line"><span style="color:#E1E4E8;">        });</span></span>
<span class="line"><span style="color:#E1E4E8;">      })</span></span>
<span class="line"><span style="color:#E1E4E8;">      .</span><span style="color:#B392F0;">catch</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">err</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 报错也会删除 loadPromise</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">delete</span><span style="color:#E1E4E8;"> app.loadPromise;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 修改状态为 用户的传参报错, 或者是加载出错</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> newStatus;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (isUserErr) {</span></span>
<span class="line"><span style="color:#E1E4E8;">          newStatus </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">SKIP_BECAUSE_BROKEN</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          newStatus </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">LOAD_ERROR</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">          app.loadErrorTime </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Date</span><span style="color:#E1E4E8;">().</span><span style="color:#B392F0;">getTime</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">handleAppError</span><span style="color:#E1E4E8;">(err, app, newStatus);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> app;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }));</span></span>
<span class="line"><span style="color:#E1E4E8;">  });</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">//lifecycles/load.js</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toLoadPromise</span><span style="color:#24292E;">(</span><span style="color:#E36209;">app</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 是否重复注册 promise 加载了</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (app.loadPromise) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> app.loadPromise;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 刚注册的就是 NOT_LOADED 状态</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (app.status </span><span style="color:#D73A49;">!==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NOT_LOADED</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> app.status </span><span style="color:#D73A49;">!==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">LOAD_ERROR</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> app;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 修改状态为, 加载源码</span></span>
<span class="line"><span style="color:#24292E;">    app.status </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">LOADING_SOURCE_CODE</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> appOpts, isUserErr;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 返回的是 app.loadPromise</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> (app.loadPromise </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">      .</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 这里调用的了 app的 loadApp 函数(由外部传入的), 开始加载资源</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// getProps 用来判断 customProps 是否合法, 最后传值给 loadApp 函数</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">loadPromise</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> app.</span><span style="color:#6F42C1;">loadApp</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">getProps</span><span style="color:#24292E;">(app));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 判断 loadPromise 是否是一个 promise</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#6F42C1;">smellsLikeAPromise</span><span style="color:#24292E;">(loadPromise)) {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;">// The name of the app will be prepended to this error message inside of the handleAppError function</span></span>
<span class="line"><span style="color:#24292E;">          isUserErr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">throw</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Error</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">formatErrorMessage</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#005CC5;">33</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              __DEV__ </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">\`single-spa loading function did not return a promise. Check the second argument to registerApplication(&#39;\${</span><span style="color:#6F42C1;">toName</span><span style="color:#032F62;">(</span></span>
<span class="line"><span style="color:#032F62;">                  </span><span style="color:#24292E;">app</span></span>
<span class="line"><span style="color:#032F62;">                )</span><span style="color:#032F62;">}&#39;, loadingFunction, activityFunction)\`</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">toName</span><span style="color:#24292E;">(app)</span></span>
<span class="line"><span style="color:#24292E;">            )</span></span>
<span class="line"><span style="color:#24292E;">          );</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> loadPromise.</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">((</span><span style="color:#E36209;">val</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;">// 资源加载成功</span></span>
<span class="line"><span style="color:#24292E;">          app.loadErrorTime </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          appOpts </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> val;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> validationErrMessage, validationErrCode;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> appOpts </span><span style="color:#D73A49;">!==</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;object&quot;</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">            validationErrCode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">34</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (__DEV__) {</span></span>
<span class="line"><span style="color:#24292E;">              validationErrMessage </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`does not export anything\`</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">// ES Modules don&#39;t have the Object prototype</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">Object</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">prototype</span><span style="color:#24292E;">.hasOwnProperty.</span><span style="color:#6F42C1;">call</span><span style="color:#24292E;">(appOpts, </span><span style="color:#032F62;">&quot;bootstrap&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">!</span><span style="color:#6F42C1;">validLifecycleFn</span><span style="color:#24292E;">(appOpts.bootstrap)</span></span>
<span class="line"><span style="color:#24292E;">          ) {</span></span>
<span class="line"><span style="color:#24292E;">            validationErrCode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">35</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (__DEV__) {</span></span>
<span class="line"><span style="color:#24292E;">              validationErrMessage </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`does not export a valid bootstrap function or array of functions\`</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#6F42C1;">validLifecycleFn</span><span style="color:#24292E;">(appOpts.mount)) {</span></span>
<span class="line"><span style="color:#24292E;">            validationErrCode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">36</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (__DEV__) {</span></span>
<span class="line"><span style="color:#24292E;">              validationErrMessage </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`does not export a mount function or array of functions\`</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#6F42C1;">validLifecycleFn</span><span style="color:#24292E;">(appOpts.unmount)) {</span></span>
<span class="line"><span style="color:#24292E;">            validationErrCode </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">37</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (__DEV__) {</span></span>
<span class="line"><span style="color:#24292E;">              validationErrMessage </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\`does not export a unmount function or array of functions\`</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            }</span></span>
<span class="line"><span style="color:#24292E;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">type</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">objectType</span><span style="color:#24292E;">(appOpts);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (validationErrCode) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> appOptsStr;</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">try</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">              appOptsStr </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">JSON</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">stringify</span><span style="color:#24292E;">(appOpts);</span></span>
<span class="line"><span style="color:#24292E;">            } </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;"> {}</span></span>
<span class="line"><span style="color:#24292E;">            console.</span><span style="color:#6F42C1;">error</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">formatErrorMessage</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">                validationErrCode,</span></span>
<span class="line"><span style="color:#24292E;">                __DEV__ </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">                  </span><span style="color:#032F62;">\`The loading function for single-spa \${</span><span style="color:#24292E;">type</span><span style="color:#032F62;">} &#39;\${</span><span style="color:#6F42C1;">toName</span><span style="color:#032F62;">(</span></span>
<span class="line"><span style="color:#032F62;">                    </span><span style="color:#24292E;">app</span></span>
<span class="line"><span style="color:#032F62;">                  )</span><span style="color:#032F62;">}&#39; resolved with the following, which does not have bootstrap, mount, and unmount functions\`</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                type,</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6F42C1;">toName</span><span style="color:#24292E;">(app),</span></span>
<span class="line"><span style="color:#24292E;">                appOptsStr</span></span>
<span class="line"><span style="color:#24292E;">              ),</span></span>
<span class="line"><span style="color:#24292E;">              appOpts</span></span>
<span class="line"><span style="color:#24292E;">            );</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">handleAppError</span><span style="color:#24292E;">(validationErrMessage, app, </span><span style="color:#005CC5;">SKIP_BECAUSE_BROKEN</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> app;</span></span>
<span class="line"><span style="color:#24292E;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (appOpts.devtools </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> appOpts.devtools.overlays) {</span></span>
<span class="line"><span style="color:#24292E;">            app.devtools.overlays </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">assign</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">              {},</span></span>
<span class="line"><span style="color:#24292E;">              app.devtools.overlays,</span></span>
<span class="line"><span style="color:#24292E;">              appOpts.devtools.overlays</span></span>
<span class="line"><span style="color:#24292E;">            );</span></span>
<span class="line"><span style="color:#24292E;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;">// 设置app状态为未初始化，表示加载完了</span></span>
<span class="line"><span style="color:#24292E;">          app.status </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NOT_BOOTSTRAPPED</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;">// 在app对象上挂载生命周期方法，每个方法都接收一个props作为参数，方法内部执行子应用导出的生命周期函数，并确保生命周期函数返回一个promise</span></span>
<span class="line"><span style="color:#24292E;">          app.bootstrap </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">flattenFnArray</span><span style="color:#24292E;">(appOpts, </span><span style="color:#032F62;">&quot;bootstrap&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">          app.mount </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">flattenFnArray</span><span style="color:#24292E;">(appOpts, </span><span style="color:#032F62;">&quot;mount&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">          app.unmount </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">flattenFnArray</span><span style="color:#24292E;">(appOpts, </span><span style="color:#032F62;">&quot;unmount&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">          app.unload </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">flattenFnArray</span><span style="color:#24292E;">(appOpts, </span><span style="color:#032F62;">&quot;unload&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">          app.timeouts </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ensureValidAppTimeouts</span><span style="color:#24292E;">(appOpts.timeouts);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;">// 执行完毕之后删除 loadPromise</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> app.loadPromise;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> app;</span></span>
<span class="line"><span style="color:#24292E;">        });</span></span>
<span class="line"><span style="color:#24292E;">      })</span></span>
<span class="line"><span style="color:#24292E;">      .</span><span style="color:#6F42C1;">catch</span><span style="color:#24292E;">((</span><span style="color:#E36209;">err</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 报错也会删除 loadPromise</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">delete</span><span style="color:#24292E;"> app.loadPromise;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 修改状态为 用户的传参报错, 或者是加载出错</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> newStatus;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (isUserErr) {</span></span>
<span class="line"><span style="color:#24292E;">          newStatus </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">SKIP_BECAUSE_BROKEN</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          newStatus </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">LOAD_ERROR</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">          app.loadErrorTime </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Date</span><span style="color:#24292E;">().</span><span style="color:#6F42C1;">getTime</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">handleAppError</span><span style="color:#24292E;">(err, app, newStatus);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> app;</span></span>
<span class="line"><span style="color:#24292E;">      }));</span></span>
<span class="line"><span style="color:#24292E;">  });</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br></div></div><h2 id="应用启动" tabindex="-1">应用启动 <a class="header-anchor" href="#应用启动" aria-label="Permalink to &quot;应用启动&quot;">​</a></h2><p>注册完应用之后, 最后是 start 方法执行。调用start之前，应用会被加载，但不会初始化、挂载和卸载，有了start可以更好的控制性能。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// start.js</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">start</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">opts</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 主要作用还是将标记符 started设置为 true 了</span></span>
<span class="line"><span style="color:#E1E4E8;">  started </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (opts </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> opts.urlRerouteOnly) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 使用此参数可以人为地触发事件 popstate</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">setUrlRerouteOnly</span><span style="color:#E1E4E8;">(opts.urlRerouteOnly);</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (isInBrowser) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">reroute</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// start.js</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">start</span><span style="color:#24292E;">(</span><span style="color:#E36209;">opts</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 主要作用还是将标记符 started设置为 true 了</span></span>
<span class="line"><span style="color:#24292E;">  started </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (opts </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> opts.urlRerouteOnly) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 使用此参数可以人为地触发事件 popstate</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">setUrlRerouteOnly</span><span style="color:#24292E;">(opts.urlRerouteOnly);</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (isInBrowser) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">reroute</span><span style="color:#24292E;">();</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>启动后也会调用reroute方法，在reroute方法中，就会触发此函数 performAppChanges，并返回结果，该函数的作用主要是事件的触发, 包括自定义事件和子应用中的一些事件。</p><h2 id="路由监听" tabindex="-1">路由监听 <a class="header-anchor" href="#路由监听" aria-label="Permalink to &quot;路由监听&quot;">​</a></h2><p>在navigation-events.js中定义了许多的方法，路由监听代码被放在全局作用域内，bundle被加载后自动执行。</p><p>其中路由监听部分代码如下：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// navigation/navigation-events.js</span></span>
<span class="line"><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (isInBrowser) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// We will trigger an app change for any routing events.</span></span>
<span class="line"><span style="color:#E1E4E8;">  window.</span><span style="color:#B392F0;">addEventListener</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;hashchange&quot;</span><span style="color:#E1E4E8;">, urlReroute);</span></span>
<span class="line"><span style="color:#E1E4E8;">  window.</span><span style="color:#B392F0;">addEventListener</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;popstate&quot;</span><span style="color:#E1E4E8;">, urlReroute);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// Monkeypatch addEventListener so that we can ensure correct timing</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">originalAddEventListener</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> window.addEventListener;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">originalRemoveEventListener</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> window.removeEventListener;</span></span>
<span class="line"><span style="color:#E1E4E8;">  window.</span><span style="color:#B392F0;">addEventListener</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">eventName</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">fn</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> fn </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;function&quot;</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">        routingEventsListeningTo.</span><span style="color:#B392F0;">indexOf</span><span style="color:#E1E4E8;">(eventName) </span><span style="color:#F97583;">&gt;=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">!</span><span style="color:#B392F0;">find</span><span style="color:#E1E4E8;">(capturedEventListeners[eventName], (</span><span style="color:#FFAB70;">listener</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> listener </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> fn)</span></span>
<span class="line"><span style="color:#E1E4E8;">      ) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        capturedEventListeners[eventName].</span><span style="color:#B392F0;">push</span><span style="color:#E1E4E8;">(fn);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> originalAddEventListener.</span><span style="color:#B392F0;">apply</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">arguments</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">  };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  window.</span><span style="color:#B392F0;">removeEventListener</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">eventName</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">listenerFn</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> listenerFn </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;function&quot;</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (routingEventsListeningTo.</span><span style="color:#B392F0;">indexOf</span><span style="color:#E1E4E8;">(eventName) </span><span style="color:#F97583;">&gt;=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        capturedEventListeners[eventName] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> capturedEventListeners[</span></span>
<span class="line"><span style="color:#E1E4E8;">          eventName</span></span>
<span class="line"><span style="color:#E1E4E8;">        ].</span><span style="color:#B392F0;">filter</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">fn</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> fn </span><span style="color:#F97583;">!==</span><span style="color:#E1E4E8;"> listenerFn);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> originalRemoveEventListener.</span><span style="color:#B392F0;">apply</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">arguments</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">  };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  window.history.pushState </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">patchedUpdateState</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">    window.history.pushState,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;pushState&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  );</span></span>
<span class="line"><span style="color:#E1E4E8;">  window.history.replaceState </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">patchedUpdateState</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">    window.history.replaceState,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;replaceState&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (window.singleSpaNavigate) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">warn</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">formatErrorMessage</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">41</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        __DEV__ </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">&quot;single-spa has been loaded twice on the page. This can result in unexpected behavior.&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      )</span></span>
<span class="line"><span style="color:#E1E4E8;">    );</span></span>
<span class="line"><span style="color:#E1E4E8;">  } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">/* For convenience in \`onclick\` attributes, we expose a global function for navigating to</span></span>
<span class="line"><span style="color:#6A737D;">     * whatever an &lt;a&gt; tag&#39;s href is.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#E1E4E8;">    window.singleSpaNavigate </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> navigateToUrl;</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// navigation/navigation-events.js</span></span>
<span class="line"><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (isInBrowser) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// We will trigger an app change for any routing events.</span></span>
<span class="line"><span style="color:#24292E;">  window.</span><span style="color:#6F42C1;">addEventListener</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;hashchange&quot;</span><span style="color:#24292E;">, urlReroute);</span></span>
<span class="line"><span style="color:#24292E;">  window.</span><span style="color:#6F42C1;">addEventListener</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;popstate&quot;</span><span style="color:#24292E;">, urlReroute);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// Monkeypatch addEventListener so that we can ensure correct timing</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">originalAddEventListener</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> window.addEventListener;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">originalRemoveEventListener</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> window.removeEventListener;</span></span>
<span class="line"><span style="color:#24292E;">  window.</span><span style="color:#6F42C1;">addEventListener</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">eventName</span><span style="color:#24292E;">, </span><span style="color:#E36209;">fn</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> fn </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;function&quot;</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">        routingEventsListeningTo.</span><span style="color:#6F42C1;">indexOf</span><span style="color:#24292E;">(eventName) </span><span style="color:#D73A49;">&gt;=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">!</span><span style="color:#6F42C1;">find</span><span style="color:#24292E;">(capturedEventListeners[eventName], (</span><span style="color:#E36209;">listener</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> listener </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> fn)</span></span>
<span class="line"><span style="color:#24292E;">      ) {</span></span>
<span class="line"><span style="color:#24292E;">        capturedEventListeners[eventName].</span><span style="color:#6F42C1;">push</span><span style="color:#24292E;">(fn);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> originalAddEventListener.</span><span style="color:#6F42C1;">apply</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">arguments</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">  };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  window.</span><span style="color:#6F42C1;">removeEventListener</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">eventName</span><span style="color:#24292E;">, </span><span style="color:#E36209;">listenerFn</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> listenerFn </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;function&quot;</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (routingEventsListeningTo.</span><span style="color:#6F42C1;">indexOf</span><span style="color:#24292E;">(eventName) </span><span style="color:#D73A49;">&gt;=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">        capturedEventListeners[eventName] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> capturedEventListeners[</span></span>
<span class="line"><span style="color:#24292E;">          eventName</span></span>
<span class="line"><span style="color:#24292E;">        ].</span><span style="color:#6F42C1;">filter</span><span style="color:#24292E;">((</span><span style="color:#E36209;">fn</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> fn </span><span style="color:#D73A49;">!==</span><span style="color:#24292E;"> listenerFn);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> originalRemoveEventListener.</span><span style="color:#6F42C1;">apply</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">arguments</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">  };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  window.history.pushState </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">patchedUpdateState</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">    window.history.pushState,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;pushState&quot;</span></span>
<span class="line"><span style="color:#24292E;">  );</span></span>
<span class="line"><span style="color:#24292E;">  window.history.replaceState </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">patchedUpdateState</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">    window.history.replaceState,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;replaceState&quot;</span></span>
<span class="line"><span style="color:#24292E;">  );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (window.singleSpaNavigate) {</span></span>
<span class="line"><span style="color:#24292E;">    console.</span><span style="color:#6F42C1;">warn</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">formatErrorMessage</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">41</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        __DEV__ </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">&quot;single-spa has been loaded twice on the page. This can result in unexpected behavior.&quot;</span></span>
<span class="line"><span style="color:#24292E;">      )</span></span>
<span class="line"><span style="color:#24292E;">    );</span></span>
<span class="line"><span style="color:#24292E;">  } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">/* For convenience in \`onclick\` attributes, we expose a global function for navigating to</span></span>
<span class="line"><span style="color:#6A737D;">     * whatever an &lt;a&gt; tag&#39;s href is.</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#24292E;">    window.singleSpaNavigate </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> navigateToUrl;</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br></div></div><p>对hashchange和popstate进行监听，如果有路由切换的操作就会执行urlReroute函数，然后对history的pushState和replaceState进行了一层封装，通过patchedUpdateState方法来提供。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark has-diff vp-code-dark"><code><span class="line"><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">patchedUpdateState</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">updateState</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">methodName</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> () {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">urlBefore</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> window.location.href;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">result</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> updateState.</span><span style="color:#B392F0;">apply</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">arguments</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">urlAfter</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> window.location.href;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">urlRerouteOnly </span><span style="color:#F97583;">||</span><span style="color:#E1E4E8;"> urlBefore </span><span style="color:#F97583;">!==</span><span style="color:#E1E4E8;"> urlAfter) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#B392F0;">isStarted</span><span style="color:#E1E4E8;">()) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// fire an artificial popstate event once single-spa is started,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// so that single-spa applications know about routing that</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// occurs in a different application</span></span>
<span class="line"><span style="color:#E1E4E8;">        window.</span><span style="color:#B392F0;">dispatchEvent</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">createPopStateEvent</span><span style="color:#E1E4E8;">(window.history.state, methodName)</span></span>
<span class="line"><span style="color:#E1E4E8;">        );</span></span>
<span class="line"><span style="color:#E1E4E8;">      } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// do not fire an artificial popstate event before single-spa is started,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// since no single-spa applications need to know about routing events</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// outside of their own router.</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">reroute</span><span style="color:#E1E4E8;">([]);</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> result;</span></span>
<span class="line"><span style="color:#E1E4E8;">  };</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light has-diff vp-code-light"><code><span class="line"><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">patchedUpdateState</span><span style="color:#24292E;">(</span><span style="color:#E36209;">updateState</span><span style="color:#24292E;">, </span><span style="color:#E36209;">methodName</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> () {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">urlBefore</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> window.location.href;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">result</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> updateState.</span><span style="color:#6F42C1;">apply</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">this</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">arguments</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">urlAfter</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> window.location.href;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">urlRerouteOnly </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> urlBefore </span><span style="color:#D73A49;">!==</span><span style="color:#24292E;"> urlAfter) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#6F42C1;">isStarted</span><span style="color:#24292E;">()) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// fire an artificial popstate event once single-spa is started,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// so that single-spa applications know about routing that</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// occurs in a different application</span></span>
<span class="line"><span style="color:#24292E;">        window.</span><span style="color:#6F42C1;">dispatchEvent</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">createPopStateEvent</span><span style="color:#24292E;">(window.history.state, methodName)</span></span>
<span class="line"><span style="color:#24292E;">        );</span></span>
<span class="line"><span style="color:#24292E;">      } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// do not fire an artificial popstate event before single-spa is started,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// since no single-spa applications need to know about routing events</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// outside of their own router.</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">reroute</span><span style="color:#24292E;">([]);</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> result;</span></span>
<span class="line"><span style="color:#24292E;">  };</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><p>patchedUpdateState这个方法对旧路由和新路由进行一个对照，如果旧路由不等于新路由，表示子应用进行切换了，则执行微前端自定义的操作代码。</p><h2 id="生命周期" tabindex="-1">生命周期 <a class="header-anchor" href="#生命周期" aria-label="Permalink to &quot;生命周期&quot;">​</a></h2><p>子应用生命周期包含bootstrap，mount，unmount三个回调函数。在reroute中的toLoadPromise函数中加载应用的资源、定义加载完毕的回调函数。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">...</span><span style="color:#E1E4E8;">.</span></span>
<span class="line"><span style="color:#6A737D;">// 设置app状态为未初始化，表示加载完了</span></span>
<span class="line"><span style="color:#E1E4E8;">app.status </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">NOT_BOOTSTRAPPED</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#6A737D;">// 在app对象上挂载生命周期方法，每个方法都接收一个props作为参数，方法内部执行子应用导出的生命周期函数，并确保生命周期函数返回一个promise</span></span>
<span class="line"><span style="color:#E1E4E8;">app.bootstrap </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">flattenFnArray</span><span style="color:#E1E4E8;">(appOpts, </span><span style="color:#9ECBFF;">&quot;bootstrap&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">app.mount </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">flattenFnArray</span><span style="color:#E1E4E8;">(appOpts, </span><span style="color:#9ECBFF;">&quot;mount&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">app.unmount </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">flattenFnArray</span><span style="color:#E1E4E8;">(appOpts, </span><span style="color:#9ECBFF;">&quot;unmount&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">app.unload </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">flattenFnArray</span><span style="color:#E1E4E8;">(appOpts, </span><span style="color:#9ECBFF;">&quot;unload&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">app.timeouts </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">ensureValidAppTimeouts</span><span style="color:#E1E4E8;">(appOpts.timeouts);</span></span>
<span class="line"><span style="color:#F97583;">...</span><span style="color:#E1E4E8;">.</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">...</span><span style="color:#24292E;">.</span></span>
<span class="line"><span style="color:#6A737D;">// 设置app状态为未初始化，表示加载完了</span></span>
<span class="line"><span style="color:#24292E;">app.status </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">NOT_BOOTSTRAPPED</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#6A737D;">// 在app对象上挂载生命周期方法，每个方法都接收一个props作为参数，方法内部执行子应用导出的生命周期函数，并确保生命周期函数返回一个promise</span></span>
<span class="line"><span style="color:#24292E;">app.bootstrap </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">flattenFnArray</span><span style="color:#24292E;">(appOpts, </span><span style="color:#032F62;">&quot;bootstrap&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">app.mount </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">flattenFnArray</span><span style="color:#24292E;">(appOpts, </span><span style="color:#032F62;">&quot;mount&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">app.unmount </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">flattenFnArray</span><span style="color:#24292E;">(appOpts, </span><span style="color:#032F62;">&quot;unmount&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">app.unload </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">flattenFnArray</span><span style="color:#24292E;">(appOpts, </span><span style="color:#032F62;">&quot;unload&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">app.timeouts </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">ensureValidAppTimeouts</span><span style="color:#24292E;">(appOpts.timeouts);</span></span>
<span class="line"><span style="color:#D73A49;">...</span><span style="color:#24292E;">.</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>其中flattenFnArray，返回一个接受props作为参数的函数，这个函数负责执行子应用中的生命周期函数，并确保生命周期函数返回的结果为promise。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// lifecycles/lifecycle.helpers.js</span></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * </span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{*}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">appOrParcel</span><span style="color:#6A737D;"> =&gt; window.singleSpa，子应用打包后的对象</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#F97583;">@param</span><span style="color:#6A737D;"> </span><span style="color:#B392F0;">{*}</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">lifecycle</span><span style="color:#6A737D;"> =&gt; 字符串，生命周期名称</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">flattenFnArray</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">appOrParcel</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">lifecycle</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// fns = fn or []</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> fns </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> appOrParcel[lifecycle] </span><span style="color:#F97583;">||</span><span style="color:#E1E4E8;"> [];</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// fns = [] or [fn]</span></span>
<span class="line"><span style="color:#E1E4E8;">  fns </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> Array.</span><span style="color:#B392F0;">isArray</span><span style="color:#E1E4E8;">(fns) </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> fns </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> [fns];</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 有些生命周期函数子应用可能不会设置，比如unload</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (fns.</span><span style="color:#79B8FF;">length</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    fns </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> [() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">()];</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">type</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">objectType</span><span style="color:#E1E4E8;">(appOrParcel);</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">name</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toName</span><span style="color:#E1E4E8;">(appOrParcel);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">props</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 这里最后返回了一个promise链，这个操作似乎没啥必要，因为不可能出现同名的生命周期函数，所以，这里将生命周期函数放数组，没太理解目的是啥</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> fns.</span><span style="color:#B392F0;">reduce</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">resultPromise</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">fn</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">index</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> resultPromise.</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// 执行生命周期函数，传递props给函数，并验证函数的返回结果，必须为promise</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">thisPromise</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">fn</span><span style="color:#E1E4E8;">(props);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">smellsLikeAPromise</span><span style="color:#E1E4E8;">(thisPromise)</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> thisPromise</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">reject</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#B392F0;">formatErrorMessage</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#79B8FF;">15</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                __DEV__ </span><span style="color:#F97583;">&amp;&amp;</span></span>
<span class="line"><span style="color:#E1E4E8;">                  </span><span style="color:#9ECBFF;">\`Within \${</span><span style="color:#E1E4E8;">type</span><span style="color:#9ECBFF;">} \${</span><span style="color:#E1E4E8;">name</span><span style="color:#9ECBFF;">}, the lifecycle function \${</span><span style="color:#E1E4E8;">lifecycle</span><span style="color:#9ECBFF;">} at array index \${</span><span style="color:#E1E4E8;">index</span><span style="color:#9ECBFF;">} did not return a promise\`</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                type,</span></span>
<span class="line"><span style="color:#E1E4E8;">                name,</span></span>
<span class="line"><span style="color:#E1E4E8;">                lifecycle,</span></span>
<span class="line"><span style="color:#E1E4E8;">                index</span></span>
<span class="line"><span style="color:#E1E4E8;">              )</span></span>
<span class="line"><span style="color:#E1E4E8;">            );</span></span>
<span class="line"><span style="color:#E1E4E8;">      });</span></span>
<span class="line"><span style="color:#E1E4E8;">    }, </span><span style="color:#79B8FF;">Promise</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">resolve</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"><span style="color:#E1E4E8;">  };</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// lifecycles/lifecycle.helpers.js</span></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * </span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{*}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">appOrParcel</span><span style="color:#6A737D;"> =&gt; window.singleSpa，子应用打包后的对象</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@param</span><span style="color:#6A737D;"> </span><span style="color:#6F42C1;">{*}</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">lifecycle</span><span style="color:#6A737D;"> =&gt; 字符串，生命周期名称</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">flattenFnArray</span><span style="color:#24292E;">(</span><span style="color:#E36209;">appOrParcel</span><span style="color:#24292E;">, </span><span style="color:#E36209;">lifecycle</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// fns = fn or []</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> fns </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> appOrParcel[lifecycle] </span><span style="color:#D73A49;">||</span><span style="color:#24292E;"> [];</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// fns = [] or [fn]</span></span>
<span class="line"><span style="color:#24292E;">  fns </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Array.</span><span style="color:#6F42C1;">isArray</span><span style="color:#24292E;">(fns) </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> fns </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> [fns];</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 有些生命周期函数子应用可能不会设置，比如unload</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (fns.</span><span style="color:#005CC5;">length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    fns </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> [() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">()];</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">type</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">objectType</span><span style="color:#24292E;">(appOrParcel);</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">name</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toName</span><span style="color:#24292E;">(appOrParcel);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">props</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 这里最后返回了一个promise链，这个操作似乎没啥必要，因为不可能出现同名的生命周期函数，所以，这里将生命周期函数放数组，没太理解目的是啥</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> fns.</span><span style="color:#6F42C1;">reduce</span><span style="color:#24292E;">((</span><span style="color:#E36209;">resultPromise</span><span style="color:#24292E;">, </span><span style="color:#E36209;">fn</span><span style="color:#24292E;">, </span><span style="color:#E36209;">index</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> resultPromise.</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(() </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// 执行生命周期函数，传递props给函数，并验证函数的返回结果，必须为promise</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">thisPromise</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fn</span><span style="color:#24292E;">(props);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">smellsLikeAPromise</span><span style="color:#24292E;">(thisPromise)</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> thisPromise</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">reject</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#6F42C1;">formatErrorMessage</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#005CC5;">15</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                __DEV__ </span><span style="color:#D73A49;">&amp;&amp;</span></span>
<span class="line"><span style="color:#24292E;">                  </span><span style="color:#032F62;">\`Within \${</span><span style="color:#24292E;">type</span><span style="color:#032F62;">} \${</span><span style="color:#24292E;">name</span><span style="color:#032F62;">}, the lifecycle function \${</span><span style="color:#24292E;">lifecycle</span><span style="color:#032F62;">} at array index \${</span><span style="color:#24292E;">index</span><span style="color:#032F62;">} did not return a promise\`</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                type,</span></span>
<span class="line"><span style="color:#24292E;">                name,</span></span>
<span class="line"><span style="color:#24292E;">                lifecycle,</span></span>
<span class="line"><span style="color:#24292E;">                index</span></span>
<span class="line"><span style="color:#24292E;">              )</span></span>
<span class="line"><span style="color:#24292E;">            );</span></span>
<span class="line"><span style="color:#24292E;">      });</span></span>
<span class="line"><span style="color:#24292E;">    }, </span><span style="color:#005CC5;">Promise</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">resolve</span><span style="color:#24292E;">());</span></span>
<span class="line"><span style="color:#24292E;">  };</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br></div></div><h2 id="相关文章" tabindex="-1">相关文章 <a class="header-anchor" href="#相关文章" aria-label="Permalink to &quot;相关文章&quot;">​</a></h2><ul><li><a href="https://mp.weixin.qq.com/s?__biz=MzA3NTk4NjQ1OQ==&amp;mid=2247484245&amp;idx=1&amp;sn=9ee91018578e6189f3b11a4d688228c5&amp;chksm=9f696021a81ee937847c962e3135017fff9ba8fd0b61f782d7245df98582a1410aa000dc5fdc&amp;token=165646905&amp;lang=zh_CN#rd" target="_blank" rel="noreferrer">微前端框架 之 single-spa 从入门到精通</a></li><li><a href="https://maimai.cn/article/detail?fid=1718396902&amp;efid=HcRwxjrNVF7DGQO9pah-XQ" target="_blank" rel="noreferrer">微前端single-spa: 从应用到源码解析，看这一篇就够了！</a></li></ul>`,31),r=[e];function c(t,E,y,i,u,b){return n(),a("div",null,r)}const A=s(o,[["render",c]]);export{F as __pageData,A as default};
