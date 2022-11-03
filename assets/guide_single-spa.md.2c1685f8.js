import{_ as s,c as n,o as a,d as p}from"./app.faaf2d4f.js";const l="/Micro-Frontends/application/single-spa/1.jpg",d=JSON.parse('{"title":"single-spa\u6E90\u7801\u89E3\u6790","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5E94\u7528\u6CE8\u518C","slug":"\u5E94\u7528\u6CE8\u518C","link":"#\u5E94\u7528\u6CE8\u518C","children":[]},{"level":2,"title":"\u8DEF\u7531\u76D1\u542C","slug":"\u8DEF\u7531\u76D1\u542C","link":"#\u8DEF\u7531\u76D1\u542C","children":[]},{"level":2,"title":"\u751F\u547D\u5468\u671F","slug":"\u751F\u547D\u5468\u671F","link":"#\u751F\u547D\u5468\u671F","children":[]}],"relativePath":"guide/single-spa.md"}'),o={name:"guide/single-spa.md"},e=p('<h1 id="single-spa\u6E90\u7801\u89E3\u6790" tabindex="-1">single-spa\u6E90\u7801\u89E3\u6790 <a class="header-anchor" href="#single-spa\u6E90\u7801\u89E3\u6790" aria-hidden="true">#</a></h1><blockquote><p>\u5B98\u65B9\u6587\u6863\uFF1A<a href="https://zh-hans.single-spa.js.org/" target="_blank" rel="noreferrer">https://zh-hans.single-spa.js.org/</a></p></blockquote><p>single-spa\u662F\u4E00\u4E2A\u5C0F\u4E8E5kb\uFF08gzip\uFF09npm\u5305\uFF0C\u7528\u4E8E\u534F\u8C03\u5FAE\u524D\u7AEF\u7684\u6302\u8F7D\u548C\u5378\u8F7D\u3002\u53EA\u505A\u4E24\u4EF6\u4E8B\uFF1A 1. \u63D0\u4F9B\u751F\u547D\u5468\u671F\uFF0C\u5E76\u8D1F\u8D23\u8C03\u5EA6\u5B50\u5E94\u7528\u7684\u751F\u547D\u5468\u671F\u30022. \u631F\u6301 url \u53D8\u5316\uFF0Curl \u53D8\u5316\u65F6\u5339\u914D\u5BF9\u5E94\u5B50\u5E94\u7528\uFF0C\u5E76\u6267\u884C\u751F\u547D\u5468\u671F\u6D41\u7A0B\u3002</p><p>\u4E3B\u8981\u7528\u4E8E\u524D\u7AEF\u5FAE\u670D\u52A1\u5316\u7684JavaScript\u524D\u7AEF\u89E3\u51B3\u65B9\u6848 (\u672C\u8EAB\u6CA1\u6709\u5904\u7406\u6837\u5F0F\u9694\u79BB\u3001js\u6267\u884C\u9694\u79BB) \uFF0C\u5B9E\u73B0\u4E86\u8DEF\u7531\u52AB\u6301\u548C\u5E94\u7528\u52A0\u8F7D\u6D41\u7A0B\u3002</p><p>\u6211\u4EEC\u5148\u4ECEGithub\u4E0A\u4E0B\u8F7Dsingle-spa\u7684\u6E90\u7801\uFF1A<a href="https://github.com/single-spa/single-spa" target="_blank" rel="noreferrer">https://github.com/single-spa/single-spa</a></p><p><img src="'+l+`" alt=""></p><p>\u6574\u4E2A\u6E90\u7801\u91C7\u7528rollup\u6765\u6784\u5EFA\u7684\uFF0C\u53EF\u4EE5\u4ECErollup.config.js\u4E2D\u627E\u5230\u5165\u53E3\u6587\u4EF6\uFF0C\u5728src/single-spa.js\u4E2D\uFF0C\u5BF9\u5916\u63D0\u4F9B\u4E86\u4E00\u7CFB\u5217\u7684\u65B9\u6CD5\uFF0C\u50CFstart\u3001registerApplication\u7B49\u3002</p><p>single-spa\u6700\u4E3B\u8981\u7684\u5B9E\u73B0\u4E86\u5E94\u7528\u7684\u6CE8\u518C\u3001\u8DEF\u7531\u7684\u4FEE\u6539\u548C\u76D1\u542C\u3002\u5176\u4E2D\u8DEF\u7531\u7684\u76D1\u542C\u5728src/navigation/navigation-events.js\u4E2D\uFF0C\u5E94\u7528\u7684\u6CE8\u518C\u4E3B\u8981\u5305\u62EC\u4E86\u5E94\u7528\u7684\u751F\u547D\u5468\u671F\u76F8\u5173\u5185\u5BB9\u5728src/lifecycles/xxx.js\u4E2D\u3002</p><h2 id="\u5E94\u7528\u6CE8\u518C" tabindex="-1">\u5E94\u7528\u6CE8\u518C <a class="header-anchor" href="#\u5E94\u7528\u6CE8\u518C" aria-hidden="true">#</a></h2><p>\u5E94\u7528\u6CE8\u518C\u63D0\u4F9B\u4E86registerApplication\u65B9\u6CD5\uFF0C\u6E90\u7801\u5982\u4E0B\uFF1A</p><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">registerApplication</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#A6ACCD;">appNameOrConfig</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#A6ACCD;">appOrLoadApp</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#A6ACCD;">activeWhen</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#A6ACCD;">customProps</span></span>
<span class="line"><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">registration</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">sanitizeArguments</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">appNameOrConfig</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">appOrLoadApp</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">activeWhen</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">customProps</span></span>
<span class="line"><span style="color:#F07178;">  )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#82AAFF;">getAppNames</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">indexOf</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">registration</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">!==</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">throw</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">Error</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#82AAFF;">formatErrorMessage</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#F78C6C;">21</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">__DEV__</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">There is already an app registered with name </span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">registration</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">}\`</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">registration</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name</span></span>
<span class="line"><span style="color:#F07178;">      )</span></span>
<span class="line"><span style="color:#F07178;">    )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">apps</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">push</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">assign</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        loadErrorTime</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">null,</span></span>
<span class="line"><span style="color:#F07178;">        status</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">NOT_LOADED</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        parcels</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{},</span></span>
<span class="line"><span style="color:#F07178;">        devtools</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">          overlays</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">            options</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{},</span></span>
<span class="line"><span style="color:#F07178;">            selectors</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> []</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">registration</span></span>
<span class="line"><span style="color:#F07178;">    )</span></span>
<span class="line"><span style="color:#F07178;">  )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">isInBrowser</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">ensureJQuerySupport</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">reroute</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u9996\u5148\u5BF9\u8C03\u7528\u4E86sanitizeArguments\u5BF9registerApplication\u7684\u53C2\u6570\u8FDB\u884C\u6574\u5408\uFF0C\u7136\u540E\u5224\u65AD\u5B50\u5E94\u7528\u662F\u5426\u6CE8\u518C\u8FC7\uFF0C\u6CE8\u518C\u8FC7\u5219\u629B\u51FA\u5F02\u5E38\uFF0C\u7136\u540E\u5C06\u5B50\u5E94\u7528\u6DFB\u52A0\u5230apps\u8FD9\u4E2A\u6570\u7EC4\u4E2D\uFF0C\u7B49\u5230\u8C03\u7528start\u65B9\u6CD5\u65F6\u6765\u8FDB\u884C\u5BF9\u5E94\u7684\u6E32\u67D3\u3002</p><h2 id="\u8DEF\u7531\u76D1\u542C" tabindex="-1">\u8DEF\u7531\u76D1\u542C <a class="header-anchor" href="#\u8DEF\u7531\u76D1\u542C" aria-hidden="true">#</a></h2><p>\u5728navigation-events.js\u4E2D\u5B9A\u4E49\u4E86\u8BB8\u591A\u7684\u65B9\u6CD5\uFF0C</p><p>\u5176\u4E2D\u8DEF\u7531\u76D1\u542C\u90E8\u5206\u4EE3\u7801\u5982\u4E0B\uFF1A</p><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#89DDFF;">if</span><span style="color:#A6ACCD;"> (isInBrowser) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// We will trigger an app change for any routing events.</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">addEventListener</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">hashchange</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">urlReroute</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">addEventListener</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">popstate</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">urlReroute</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// Monkeypatch addEventListener so that we can ensure correct timing</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">originalAddEventListener</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">addEventListener</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">originalRemoveEventListener</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">removeEventListener</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">addEventListener</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">eventName</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">fn</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">typeof</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">fn</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">function</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">routingEventsListeningTo</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">indexOf</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">eventName</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">&gt;=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">!</span><span style="color:#82AAFF;">find</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">capturedEventListeners</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">eventName</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">listener</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">listener</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">fn</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">      ) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">capturedEventListeners</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">eventName</span><span style="color:#F07178;">]</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">push</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">fn</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">return</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">originalAddEventListener</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">arguments</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">removeEventListener</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">eventName</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">listenerFn</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">typeof</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">listenerFn</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">===</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">function</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">routingEventsListeningTo</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">indexOf</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">eventName</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">&gt;=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">capturedEventListeners</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">eventName</span><span style="color:#F07178;">] </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">capturedEventListeners</span><span style="color:#F07178;">[</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#A6ACCD;">eventName</span></span>
<span class="line"><span style="color:#F07178;">        ]</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">filter</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">fn</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">fn</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">!==</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">listenerFn</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">return</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">originalRemoveEventListener</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">arguments</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">history</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">pushState</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">patchedUpdateState</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">history</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">pushState</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">pushState</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#F07178;">  )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">history</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">replaceState</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">patchedUpdateState</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">history</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">replaceState</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">replaceState</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#F07178;">  )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">singleSpaNavigate</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">warn</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#82AAFF;">formatErrorMessage</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#F78C6C;">41</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">__DEV__</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">single-spa has been loaded twice on the page. This can result in unexpected behavior.</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#F07178;">      )</span></span>
<span class="line"><span style="color:#F07178;">    )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">else</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#676E95;">/* For convenience in \`onclick\` attributes, we expose a global function for navigating to</span></span>
<span class="line"><span style="color:#676E95;">     * whatever an &lt;a&gt; tag&#39;s href is.</span></span>
<span class="line"><span style="color:#676E95;">     */</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">singleSpaNavigate</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">navigateToUrl</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u5BF9hashchange\u548Cpopstate\u8FDB\u884C\u76D1\u542C\uFF0C\u5982\u679C\u6709\u8DEF\u7531\u5207\u6362\u7684\u64CD\u4F5C\u5C31\u4F1A\u6267\u884CurlReroute\u51FD\u6570\uFF0C\u7136\u540E\u5BF9history\u7684pushState\u548CreplaceState\u8FDB\u884C\u4E86\u4E00\u5C42\u5C01\u88C5\uFF0C\u901A\u8FC7patchedUpdateState\u65B9\u6CD5\u6765\u63D0\u4F9B\u3002</p><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">patchedUpdateState</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">updateState</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;">methodName</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">function</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">urlBefore</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">location</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">href</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">result</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">updateState</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">arguments</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">urlAfter</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">location</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">href</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#89DDFF;">!</span><span style="color:#A6ACCD;">urlRerouteOnly</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">||</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">urlBefore</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">!==</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">urlAfter</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">if</span><span style="color:#F07178;"> (</span><span style="color:#82AAFF;">isStarted</span><span style="color:#F07178;">()) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// fire an artificial popstate event once single-spa is started,</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// so that single-spa applications know about routing that</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// occurs in a different application</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">dispatchEvent</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">          </span><span style="color:#82AAFF;">createPopStateEvent</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">window</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">history</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">state</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">methodName</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">        )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">else</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// do not fire an artificial popstate event before single-spa is started,</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// since no single-spa applications need to know about routing events</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;">// outside of their own router.</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#82AAFF;">reroute</span><span style="color:#F07178;">([])</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">result</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>patchedUpdateState\u8FD9\u4E2A\u65B9\u6CD5\u5BF9\u65E7\u8DEF\u7531\u548C\u65B0\u8DEF\u7531\u8FDB\u884C\u4E00\u4E2A\u5BF9\u7167\uFF0C\u5982\u679C\u65E7\u8DEF\u7531\u4E0D\u7B49\u4E8E\u65B0\u8DEF\u7531\uFF0C\u8868\u793A\u5B50\u5E94\u7528\u8FDB\u884C\u5207\u6362\u4E86\uFF0C\u5219\u6267\u884C\u5FAE\u524D\u7AEF\u81EA\u5B9A\u4E49\u7684\u64CD\u4F5C\u4EE3\u7801\u3002</p><h2 id="\u751F\u547D\u5468\u671F" tabindex="-1">\u751F\u547D\u5468\u671F <a class="header-anchor" href="#\u751F\u547D\u5468\u671F" aria-hidden="true">#</a></h2><p>\u5728src/navigation/reroute.js\u4E2D\uFF0C\u5C06\u5B50\u5E94\u7528\u5206\u4E3A\u56DB\u7C7B\uFF1AappsToUnload(\u9700\u8981\u88AB\u79FB\u9664),appsToUnmount(\u9700\u8981\u88AB\u5378\u8F7D),appsToLoad(\u9700\u8981\u88AB\u52A0\u8F7D),appsToMount(\u9700\u8981\u88AB\u6302\u8F7D),single-spa\u901A\u8FC7\u4FEE\u6539app.status\u6765\u4F5C\u4E3A\u53C2\u7167\u3002</p>`,21),t=[e];function c(r,F,y,D,i,A){return a(),n("div",null,t)}const u=s(o,[["render",c]]);export{d as __pageData,u as default};
