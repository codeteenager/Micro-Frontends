import{_ as a,o as e,c as l,R as i,a4 as r}from"./chunks/framework.98MOWni9.js";const q=JSON.parse('{"title":"介绍","description":"","frontmatter":{},"headers":[],"relativePath":"guide/introduction.md","filePath":"guide/introduction.md","lastUpdated":1690775836000}'),o={name:"guide/introduction.md"},t=i('<h1 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-label="Permalink to &quot;介绍&quot;">​</a></h1><blockquote><p>微前端官网：<a href="https://micro-frontends.org/" target="_blank" rel="noreferrer">https://micro-frontends.org/</a></p></blockquote><p>问题：如何实现多个应用之间的资源共享？</p><p>之前比较多的处理方式是npm包形式抽离和引用，比如多个应用项目之间，可能有某业务逻辑模块或其他是可复用的，便抽离出来以npm包的形式进行管理和使用。但这样却带来了以下几个问题：</p><ul><li>发布效率低下：如果需要迭代npm包内的逻辑业务，需要先发布npm包之后，再每个使用了该npm包的应用都更新一次npm包版本，再各自构建发布一次，过程繁琐。如果涉及到的应用更多的话，花费的人力和精力就更多了。</li><li>多团队协作容易不规范：包含通用模块的npm包作为共享资产，每个人拥有它，但在实践中，这通常意味着没有人拥有它，它很快就会充满杂乱的风格不一致的代码，没有明确的约定或技术愿景。</li></ul><p>这些问题让我们意识到，扩展前端开发规模以便多个团队可以同时开发一个大型且复杂的产品是一个重要但又棘手的难题。因此，早在2016年，微前端概念诞生了。</p><h2 id="微前端概念" tabindex="-1">微前端概念 <a class="header-anchor" href="#微前端概念" aria-label="Permalink to &quot;微前端概念&quot;">​</a></h2><p>“微前端”一词最早于 2016 年底在 <a href="https://www.thoughtworks.com/radar/techniques/micro-frontends" target="_blank" rel="noreferrer">ThoughtWorks Technology Radar</a> 中提出，它将后端的微服务概念扩展到了前端世界。微服务是服务端提出的一个有界上下文、松耦合的架构模式，具体是将应用的服务端拆分成更小的微服务，这些微服务都能独立运行，采用轻量级的通信方式（比如 HTTP ）。</p><p>微前端概念的提出可以借助下面的 Web 应用架构模式演变图来理解。</p><p><img src="'+r+'" alt=""></p><p>最原始的架构模式是单体 Web 应用，整个应用由一个团队来负责开发。</p><p>随着技术的发展，开发职责开始细分，一个项目的负责团队会分化成前端团队和后端团队，即出现了前后端分离的架构方式。</p><p>随着项目变得越来越复杂，先感受到压力的是后端，于是微服务的架构模式开始出现。</p><p>随着前端运行环境进一步提升，Web 应用的发展趋势越来越倾向于富应用，即在浏览器端集成更多的功能，前端层的代码量以及业务逻辑也开始快速增长，从而变得越来越难以维护。于是引入了微服务的架构思想，将网站或 Web 应用按照业务拆分成粒度更小的微应用，由独立的团队负责开发。</p><p>从图上可以看出，微前端、微服务这些架构模式的演变趋势就是不断地将逻辑进行拆分，从而降低项目复杂度，提升可维护性和可复用性。</p><p>所以说微前端是一种类似于微服务的架构，是一种由独立交付的多个前端应用组成整体的架构风格，将前端应用分解成一些更小、更简单的能够独立开发、测试、部署的应用，而在用户看来仍然是内聚的单个产品。有一个基座应用（主应用），来管理各个子应用的加载和卸载。</p><h2 id="组件-vs-微前端" tabindex="-1">组件 VS 微前端 <a class="header-anchor" href="#组件-vs-微前端" aria-label="Permalink to &quot;组件 VS 微前端&quot;">​</a></h2><p>我们再从另外一个角度的去看待微前端，假设将微前端看做组件，是不是就好理解多了，只不过这个组件有点大，功能比较齐全，没有对外提供参数配置。</p><p>但是从两者的实际应用场景来说，还是有很多不同的地方，具体如下：</p><ul><li>从应用场景来看，组件是不可运行，被调用的，是应用中一部分，而微前端是完整可运行的一个应用。应用拆分的粒度是组件，微前端则是将前端应用分解成能够独立开发、测试、部署的子应用，而在用户看来仍然是内聚的单个产品，粒度是应用。</li><li>从技术上来看，组件是基于某个框架实现的，而微前端应用不依赖任何框架，但是微前端架构会依赖某个框架实现</li></ul><h2 id="微前端的应用场景" tabindex="-1">微前端的应用场景 <a class="header-anchor" href="#微前端的应用场景" aria-label="Permalink to &quot;微前端的应用场景&quot;">​</a></h2><p>从上面的演变过程可以看出，微前端架构比较适合大型的 Web 应用，常见的有以下 3 种形式。</p><ul><li>公司内部的平台系统。这些系统之间存在一定的相关性，用户在使用过程中会涉及跨系统的操作，频繁地页面跳转或系统切换将导致操作效率低下。而且，在多个独立系统内部可能会开发一些重复度很高的功能，比如用户管理，这些重复的功能会导致开发成本和用户使用成本上升。</li><li>大型单页应用。这类应用的特点是系统体量较大，导致在日常调试开发的时候需要耗费较多时间，严重影响到开发体验和效率。而且随着业务上的功能升级，项目体积还会不断增大，如果项目要进行架构升级的话改造成本会很高。</li><li>对已有系统的兼容和扩展。比如一些项目使用的是老旧的技术，使用微前端之后，对于新功能的开发可以使用新的技术框架，这样避免了推翻重构，也避免了继续基于过时的技术进行开发。</li></ul><h2 id="微前端的架构模式" tabindex="-1">微前端的架构模式 <a class="header-anchor" href="#微前端的架构模式" aria-label="Permalink to &quot;微前端的架构模式&quot;">​</a></h2><p>微前端架构按集成微应用的位置不同，主要可以分为 2 类：</p><ul><li>在服务端集成微应用，比如通过 Nginx 代理转发；</li><li>在浏览器集成微应用，比如使用 Web Components 的自定义元素功能。</li></ul><h3 id="服务端集成" tabindex="-1">服务端集成 <a class="header-anchor" href="#服务端集成" aria-label="Permalink to &quot;服务端集成&quot;">​</a></h3><p>服务端集成常用的方式是通过反向代理，在服务端进行路由转发，即通过路径匹配将不同请求转发到对应的微应用。这种架构方式实现起来比较容易，改造的工作量也比较小，因为只是将不同的 Web 应用拼凑在一起，严格地说并不能算是一个完整的 Web 应用。当用户从一个微应用跳转到另一个微应用时，往往需要刷新页面重新加载资源。</p><p>这种代理转发的方式和直接跳转到对应的 Web 应用相比具有一个优势，那就是不同应用之间的通信问题变得简单了，因为在同一个域下，所以可以共享 localstorage、cookie 这些数据。譬如每个微应用都需要身份认证信息 token，那么只需要登录后将 token 信息写入 localstorage，后续所有的微应用就都可以使用了，不必再重新登录或者使用其他方式传递登录信息。</p><h3 id="浏览器集成" tabindex="-1">浏览器集成 <a class="header-anchor" href="#浏览器集成" aria-label="Permalink to &quot;浏览器集成&quot;">​</a></h3><p>浏览器集成也称运行时集成，常见的方式有以下 3 种。</p><ul><li>iframe。通过 iframe 的方式将不同的微应用集成到主应用中，实现成本低，但样式、兼容性方面存在一定问题，比如沙箱属性 sandbox 的某些值在 IE 下不支持。</li><li>前端路由。每个微应用暴露出渲染函数，主应用在启动时加载各个微应用的主模块，之后根据路由规则渲染相应的微应用。虽然实现方式比较灵活，但有一定的改造成本。</li><li>Web Components。基于原生的自定义元素来加载不同微应用，借助 Shadow DOM 实现隔离，改造成本比较大。</li></ul><p>这也是一种非常热门的集成方式，代表性的框架有 single-spa 以及基于它修改的乾坤。</p><h2 id="微前端的优势" tabindex="-1">微前端的优势： <a class="header-anchor" href="#微前端的优势" aria-label="Permalink to &quot;微前端的优势：&quot;">​</a></h2><h3 id="同步更新" tabindex="-1">同步更新 <a class="header-anchor" href="#同步更新" aria-label="Permalink to &quot;同步更新&quot;">​</a></h3><p>对比npm包方式抽离，让我们意识到更新流程和效率的重要性，微前端由于是多个子应用的聚合，如果多个业务应用依赖同一个服务应用的功能模块，只需要更新服务应用，其他业务应用就可以立马更新，从而缩短了更新流程和节约了更新成本。</p><h3 id="增量升级" tabindex="-1">增量升级 <a class="header-anchor" href="#增量升级" aria-label="Permalink to &quot;增量升级&quot;">​</a></h3><p>迁移是一项非常耗时且艰难的任务，比如有一个管理系统使用AngularJS开发维护已经有三年时间，但是随着时间的推移和团队成员的变更，无论从开发成本还是用人需求上，AngularJS已经不能满足要求，于是团队想要更新技术栈，想在其他框架中实现新的需求，但是现有项目怎么办？直接迁移是不可能的，在新的框架中完全重写也不太现实。</p><p>使用微前端架构就可以解决问题，在保留原有项目的同时，可以完全使用新的框架开发新的需求，然后再使用微前端架构将旧的项目和新的项目进行整合，这样既可以使产品得到更好的用户体验，也可以使团队成员在技术上得到进步，产品开发成本也降到的最低。</p><h3 id="独立部署与发布" tabindex="-1">独立部署与发布 <a class="header-anchor" href="#独立部署与发布" aria-label="Permalink to &quot;独立部署与发布&quot;">​</a></h3><p>在目前的单页应用架构中，使用组件构建用户界面，应用中的每个组件或功能开发完成或者bug修复完成后，每次都需要对整个产品重新进行构建和发布，任务耗时操作上也比较繁琐。</p><p>在使用了微前端架构后，可以将不能的功能模块拆分成独立的应用，此时功能模块就可以单独构建单独发布了，构建时间也会变得非常快，应用发布后不需要更改其他内容应用就会自动更新，这意味着你可以进行频繁的构建发布操作了。</p><h3 id="独立团队决策" tabindex="-1">独立团队决策 <a class="header-anchor" href="#独立团队决策" aria-label="Permalink to &quot;独立团队决策&quot;">​</a></h3><p>因为微前端架构与框架无关，当一个应用由多个团队进行开发时，每个团队都可以使用自己擅长的技术栈进行开发，也就是它允许适当的让团队决策使用哪种技术，从而使团队协作变得不再僵硬。</p><h2 id="如何实现微前端" tabindex="-1">如何实现微前端 <a class="header-anchor" href="#如何实现微前端" aria-label="Permalink to &quot;如何实现微前端&quot;">​</a></h2><ol><li><p>多个微应用如何进行组合?</p><p>在微前端架构中，除了存在多个微应用以外，还存在一个容器应用，每个微应用都需要被注册到容 器应用中。</p><p>微前端中的每个应用在浏览器中都是一个独立的 JavaScript 模块，通过模块化的方式被容器应用启 动和运行。</p><p>使用模块化的方式运行应用可以防止不同的微应用在同时运行时发生冲突。</p></li><li><p>在微应用中如何实现路由？</p><p>在微前端架构中，当路由发生变化时，容器应用首先会拦截路由的变化，根据路由匹配微前端应 用，当匹配到微应用以后，再启动微应用路由，匹配具体的页面组件。</p></li><li><p>微应用与微应用之间如何实现状态共享?</p><p>在微应用中可以通过发布订阅模式实现状态共享，比如使用 RxJS。</p></li><li><p>微应用与微应用之间如何实现框架和库的共享？</p><p>通过 import-map 和 webpack 中的 externals 属性。</p></li></ol><h2 id="微前端落地方案" tabindex="-1">微前端落地方案 <a class="header-anchor" href="#微前端落地方案" aria-label="Permalink to &quot;微前端落地方案&quot;">​</a></h2><ol><li>自组织模式：通过约定进行互调，但会遇到处理第三方依赖等问题</li><li>基座模式：通过搭建基座、配置中心来管理子应用。如基于Single Spa的乾坤方案，也有基于本身团队业务量身定制的方案。</li><li>去中心模式：脱离基座模式，每个应用之间都可以彼此分享资源，如基于Webpack 5 Module Federation实现的EMP微前端方案，可以实现多个应用彼此共享资源。</li></ol><p>其中，目前值得关注的是去中心模式中的EMP微前端方案，既可以实现跨技术栈调用，又可以在相同技术栈的应用间深度定制共享资源。</p><h2 id="微前端的建设" tabindex="-1">微前端的建设 <a class="header-anchor" href="#微前端的建设" aria-label="Permalink to &quot;微前端的建设&quot;">​</a></h2><p>微前端不是框架、不是工具/库，而是一套架构体系，它包括若干库、工具、中心化治理平台以及相关配套设施。</p><p>微前端包括 3 部分：</p><ul><li>微前端的基础设施。这是目前讨论得最多的，一个微应用如何通过一个组件基座加载进来、脚手架工具、怎么单独构建和部署、怎么联调。</li><li>微前端配置中心：标准化的配置文件格式，支持灰度、回滚、红蓝、A/B 等发布策略。</li><li>微前端的可观察性工具：对于任何分布式特点的架构，线上/线下治理都很重要。</li></ul><p>微前端具体要解决好的 10 个问题：</p><ol><li>微应用的注册、异步加载和生命周期管理</li><li>微应用之间、主从之间的消息机制</li><li>微应用之间的安全隔离措施</li><li>微应用的框架无关、版本无关</li><li>微应用之间、主从之间的公共依赖的库、业务逻辑(utils)以及版本怎么管理</li><li>微应用独立调试、和主应用联调的方式，快速定位报错（发射问题）</li><li>微应用的发布流程</li><li>微应用打包优化问题</li><li>微应用专有云场景的出包方案</li><li>渐进式升级：用微应用方案平滑重构老项目</li></ol>',55),p=[t];function n(h,d,s,c,u,b){return e(),l("div",null,p)}const f=a(o,[["render",n]]);export{q as __pageData,f as default};
