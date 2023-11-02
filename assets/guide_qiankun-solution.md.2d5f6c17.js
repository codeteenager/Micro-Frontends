import{_ as s,o as n,c as a,Q as p}from"./chunks/framework.ad12490d.js";const l="/Micro-Frontends/application/qiankun/3.png",d=JSON.parse('{"title":"qiankun进阶","description":"","frontmatter":{},"headers":[],"relativePath":"guide/qiankun-solution.md","filePath":"guide/qiankun-solution.md","lastUpdated":1697899642000}'),e={name:"guide/qiankun-solution.md"},o=p('<h1 id="qiankun进阶" tabindex="-1">qiankun进阶 <a class="header-anchor" href="#qiankun进阶" aria-label="Permalink to &quot;qiankun进阶&quot;">​</a></h1><p><img src="'+l+`" alt=""> 对于qiankun框架来说已经提供了很多微前端的基础能力，但是在中后台管理系统复杂场景的也有很多，这时候就需要qiankun提供一些进阶的能力来帮助开发者去更好的开发。</p><h2 id="提取公共库" tabindex="-1">提取公共库 <a class="header-anchor" href="#提取公共库" aria-label="Permalink to &quot;提取公共库&quot;">​</a></h2><p>提取公共依赖可以参考：<a href="https://blog.csdn.net/Lyrelion/article/details/124896392" target="_blank" rel="noreferrer">qiankun 如何提取出公共的依赖库</a></p><ul><li>qiankun不建议共享依赖，担心原型链污染等问题。 single-spa推荐共享大型依赖，需要小心处理污染问题，它们都是推荐使用webpack的external来共享依赖库。</li><li>我们也推荐共享大的公共依赖，也是使用webpack的external来共享依赖库，不过是每个子应用加载时都重复再加载一次库，相当于节省了相同库的下载时间，也保证了不同子应用间不会产生原型链污染，属于折中的方案。</li></ul><h2 id="页签切换优化-keep-alive" tabindex="-1">页签切换优化(keep-alive) <a class="header-anchor" href="#页签切换优化-keep-alive" aria-label="Permalink to &quot;页签切换优化(keep-alive)&quot;">​</a></h2><p>在经典的后端管理系统中，打开一个新页面都会对应打开一个页签，切换回上一个打开的页签并保留原页签的缓存能力是较常见的需求。但qiankun方案在自动匹配加载一个子应用时，会卸载上一个子应用，原本的数据也会丢失，无法实现缓存。对于此问题，我们将基于路由自动匹配加载微应用的方式改为调用api手动加载，同时缓存子应用实例及页面，完美解决页签切换过程中数据丢失问题。</p><h2 id="本地缓存封装" tabindex="-1">本地缓存封装 <a class="header-anchor" href="#本地缓存封装" aria-label="Permalink to &quot;本地缓存封装&quot;">​</a></h2><p>在qiankun微前端技术方案中，各微应用浏览器的本地存储状态是共享的，存在各个业务微应用本地缓存的key值同名隐患，容易引起各业务微应用操作本地存储时数据覆盖、误删除等问题。为了解决这个问题，我们使用代理模式对浏览器本地缓存进行处理，同时新增缓存api，默认为业务微应用统一加上应用唯一标识作为本地存储的key 值前缀，避免同名问题。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">storageProxy</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Proxy</span><span style="color:#E1E4E8;">(window.localStorage, {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">set</span><span style="color:#E1E4E8;">: (</span><span style="color:#FFAB70;">target</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> localStorage, </span><span style="color:#FFAB70;">prop</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">PropertyKey</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">value</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">any</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">receiver</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> prop </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;string&quot;</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">oldValue</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> target[prop];</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#B392F0;">equal</span><span style="color:#E1E4E8;">(oldValue, value)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> Reflect.</span><span style="color:#B392F0;">set</span><span style="color:#E1E4E8;">(target, prop, value, receiver);</span></span>
<span class="line"><span style="color:#E1E4E8;">                    }</span></span>
<span class="line"><span style="color:#E1E4E8;">                }</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">: (</span><span style="color:#FFAB70;">target</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">prop</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">receiver</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 在执行localstorage.setItem方法时，会出现报错</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 发现仅仅一步Reflect.get(target, prop);是不行的</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;">// 所以单独每个方法拿出来重写了一下</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (prop </span><span style="color:#F97583;">===</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;setItem&quot;</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">key</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">value</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">any</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">                        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> Reflect.</span><span style="color:#B392F0;">set</span><span style="color:#E1E4E8;">(target, </span><span style="color:#9ECBFF;">\`\${</span><span style="color:#E1E4E8;">namespace</span><span style="color:#9ECBFF;">}.\${</span><span style="color:#E1E4E8;">key</span><span style="color:#9ECBFF;">}\`</span><span style="color:#E1E4E8;">, value);</span></span>
<span class="line"><span style="color:#E1E4E8;">                    };</span></span>
<span class="line"><span style="color:#E1E4E8;">                } </span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> Reflect.</span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(target, prop, receiver);</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"><span style="color:#E1E4E8;">        });</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">storageProxy</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Proxy</span><span style="color:#24292E;">(window.localStorage, {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">set</span><span style="color:#24292E;">: (</span><span style="color:#E36209;">target</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> localStorage, </span><span style="color:#E36209;">prop</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">PropertyKey</span><span style="color:#24292E;">, </span><span style="color:#E36209;">value</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">any</span><span style="color:#24292E;">, </span><span style="color:#E36209;">receiver</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> prop </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;string&quot;</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">oldValue</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> target[prop];</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#6F42C1;">equal</span><span style="color:#24292E;">(oldValue, value)) {</span></span>
<span class="line"><span style="color:#24292E;">                        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> Reflect.</span><span style="color:#6F42C1;">set</span><span style="color:#24292E;">(target, prop, value, receiver);</span></span>
<span class="line"><span style="color:#24292E;">                    }</span></span>
<span class="line"><span style="color:#24292E;">                }</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">: (</span><span style="color:#E36209;">target</span><span style="color:#24292E;">, </span><span style="color:#E36209;">prop</span><span style="color:#24292E;">, </span><span style="color:#E36209;">receiver</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 在执行localstorage.setItem方法时，会出现报错</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 发现仅仅一步Reflect.get(target, prop);是不行的</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#6A737D;">// 所以单独每个方法拿出来重写了一下</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (prop </span><span style="color:#D73A49;">===</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;setItem&quot;</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">key</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;">, </span><span style="color:#E36209;">value</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">any</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">                        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> Reflect.</span><span style="color:#6F42C1;">set</span><span style="color:#24292E;">(target, </span><span style="color:#032F62;">\`\${</span><span style="color:#24292E;">namespace</span><span style="color:#032F62;">}.\${</span><span style="color:#24292E;">key</span><span style="color:#032F62;">}\`</span><span style="color:#24292E;">, value);</span></span>
<span class="line"><span style="color:#24292E;">                    };</span></span>
<span class="line"><span style="color:#24292E;">                } </span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> Reflect.</span><span style="color:#6F42C1;">get</span><span style="color:#24292E;">(target, prop, receiver);</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"><span style="color:#24292E;">        });</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h2 id="应用通信扩展" tabindex="-1">应用通信扩展 <a class="header-anchor" href="#应用通信扩展" aria-label="Permalink to &quot;应用通信扩展&quot;">​</a></h2><p>qiankun微前端自带的一个实现全局通信的api是initGlobalState，使用不够灵活，在微应用中只能修改已存在的一级属性，并且qiankun会在下一个大版本移除此api。针对此情况，可以扩展新的通信方式，一是通过vuex的方式，在基座主应用维护一个全局的common模块，下发到子应用中，作为各应用可访问的公共状态，实现数据共享；二是使用eventBus的方式，在基座主应用定义并下发eventBus实例，通过发布订阅者模式实现各应用间事件的通信。以上两种方式可以较好的实现项目开发中各种数据通信需求。</p><h2 id="子应用嵌套" tabindex="-1">子应用嵌套 <a class="header-anchor" href="#子应用嵌套" aria-label="Permalink to &quot;子应用嵌套&quot;">​</a></h2><p>子应用嵌套即子应用可以嵌入其它子应用。在qiankun中子应用是可以独立运行的，运行后登录页、Layout基础模块包括菜单、注销，还能正常开发和使用。这个时候就需要把登录页、Layout、App三个模块迁移到common模块，通过引入的方式，然后根据window.__POWERED_BY_QIANKUN__判断当前运行环境是否独立运行做相对应的逻辑处理。</p><h2 id="子应用并行" tabindex="-1">子应用并行 <a class="header-anchor" href="#子应用并行" aria-label="Permalink to &quot;子应用并行&quot;">​</a></h2><p>子应用并行即子应用同时展示，将当前子应用放到另外一个子应用进行展示，同时展示多次，可能是同一个页面，也可能是不同的页面。</p><blockquote><p>注意子应用共存时，Vue子应用需要使用abstract路由，React使用MemoryRouter</p></blockquote><div class="language-vue vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">export const router = new VueRouter({</span></span>
<span class="line"><span style="color:#E1E4E8;">  mode: &#39;hash&#39;,</span></span>
<span class="line"><span style="color:#E1E4E8;">  base: p<wbr>rocess.env.BASE_URL,</span></span>
<span class="line"><span style="color:#E1E4E8;">  routes,</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">export const abstractRouter = new VueRouter({</span></span>
<span class="line"><span style="color:#E1E4E8;">  mode: &#39;abstract&#39;,</span></span>
<span class="line"><span style="color:#E1E4E8;">  base: p<wbr>rocess.env.BASE_URL,</span></span>
<span class="line"><span style="color:#E1E4E8;">  routes,</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">function render(props?: Prop) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  let container: null | HTMLElement = null</span></span>
<span class="line"><span style="color:#E1E4E8;">  if (props &amp;&amp; props.container) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    container = props.container</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">  const vueContainer = container ? (container.querySelector(&#39;#app&#39;) as Element) : &#39;#app&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  if (props?.path) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    routerInstance = abstractRouter</span></span>
<span class="line"><span style="color:#E1E4E8;">  } else {</span></span>
<span class="line"><span style="color:#E1E4E8;">    routerInstance = router</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  instance = new Vue({</span></span>
<span class="line"><span style="color:#E1E4E8;">    router: routerInstance,</span></span>
<span class="line"><span style="color:#E1E4E8;">    pinia: createPinia(),</span></span>
<span class="line"><span style="color:#E1E4E8;">    render: (h) =&gt; h(App),</span></span>
<span class="line"><span style="color:#E1E4E8;">  }).$mount(vueContainer)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  if (props?.path) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    routerInstance.push(props.path)</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">export const router = new VueRouter({</span></span>
<span class="line"><span style="color:#24292E;">  mode: &#39;hash&#39;,</span></span>
<span class="line"><span style="color:#24292E;">  base: p<wbr>rocess.env.BASE_URL,</span></span>
<span class="line"><span style="color:#24292E;">  routes,</span></span>
<span class="line"><span style="color:#24292E;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">export const abstractRouter = new VueRouter({</span></span>
<span class="line"><span style="color:#24292E;">  mode: &#39;abstract&#39;,</span></span>
<span class="line"><span style="color:#24292E;">  base: p<wbr>rocess.env.BASE_URL,</span></span>
<span class="line"><span style="color:#24292E;">  routes,</span></span>
<span class="line"><span style="color:#24292E;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">function render(props?: Prop) {</span></span>
<span class="line"><span style="color:#24292E;">  let container: null | HTMLElement = null</span></span>
<span class="line"><span style="color:#24292E;">  if (props &amp;&amp; props.container) {</span></span>
<span class="line"><span style="color:#24292E;">    container = props.container</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  const vueContainer = container ? (container.querySelector(&#39;#app&#39;) as Element) : &#39;#app&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  if (props?.path) {</span></span>
<span class="line"><span style="color:#24292E;">    routerInstance = abstractRouter</span></span>
<span class="line"><span style="color:#24292E;">  } else {</span></span>
<span class="line"><span style="color:#24292E;">    routerInstance = router</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  instance = new Vue({</span></span>
<span class="line"><span style="color:#24292E;">    router: routerInstance,</span></span>
<span class="line"><span style="color:#24292E;">    pinia: createPinia(),</span></span>
<span class="line"><span style="color:#24292E;">    render: (h) =&gt; h(App),</span></span>
<span class="line"><span style="color:#24292E;">  }).$mount(vueContainer)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  if (props?.path) {</span></span>
<span class="line"><span style="color:#24292E;">    routerInstance.push(props.path)</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div>`,18),r=[o];function c(t,E,i,y,u,b){return n(),a("div",null,r)}const F=s(e,[["render",c]]);export{d as __pageData,F as default};
