import{l as F,m as i,n as h,p as fe,r as q,s as tt,t as ce,v as ie,x as at,y as Se,z as te,A as Ae,k as Ie,B as G,C,D as zt,E as ze,F as _t,G as lt,H as nt,I as Qe,J as ot,K as Re,L as He,M as it,N as pe,O as U,R as xt,i as we,S as qt,T as kt,U as Tt,V as Ct,W as $t,X as Lt,Y as Pt,Z as rt,_ as De,$ as $e,a0 as Bt,a1 as Ot,a2 as Ee,a3 as At,a4 as ut,a5 as Mt,a6 as Le,a7 as ge,a8 as It,d as Qt,a9 as Rt,aa as Vt,o as Z,ab as re,g as T,f as S,ac as ue,ad as Me,u as Ht,a as Dt,ae as Et,h as be,af as j,c as Ne,e as R,ag as Pe,ah as Nt,ai as je,aj as jt,ak as Ft,al as Wt}from"./index.88cb05d7.js";import{Q as se,a as Fe,b as K,c as Ut}from"./QItemLabel.232581a5.js";import{Q as Be}from"./QList.d95bd207.js";import{Q as Kt,T as de}from"./TouchPan.91fbda22.js";import{b as ee}from"./format.2bc25e5f.js";import{Q as Gt}from"./QPage.ba8cac2d.js";import{C as ye}from"./ClosePopup.1fc8882d.js";import{u as Xt}from"./use-quasar.7ae79f7d.js";import{u as Jt}from"./auth-user.13acf199.js";var We=F({name:"QToolbarTitle",props:{shrink:Boolean},setup(e,{slots:$}){const r=i(()=>"q-toolbar__title ellipsis"+(e.shrink===!0?" col-shrink":""));return()=>h("div",{class:r.value},fe($.default))}}),Ue=F({name:"QToolbar",props:{inset:Boolean},setup(e,{slots:$}){const r=i(()=>"q-toolbar row no-wrap items-center"+(e.inset===!0?" q-toolbar--inset":""));return()=>h("div",{class:r.value,role:"toolbar"},fe($.default))}});function Yt(){const e=q(!tt.value);return e.value===!1&&ce(()=>{e.value=!0}),e}const st=typeof ResizeObserver!="undefined",Ke=st===!0?{}:{style:"display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;",url:"about:blank"};var ve=F({name:"QResizeObserver",props:{debounce:{type:[String,Number],default:100}},emits:["resize"],setup(e,{emit:$}){let r=null,s,u={width:-1,height:-1};function c(m){m===!0||e.debounce===0||e.debounce==="0"?d():r===null&&(r=setTimeout(d,e.debounce))}function d(){if(r!==null&&(clearTimeout(r),r=null),s){const{offsetWidth:m,offsetHeight:g}=s;(m!==u.width||g!==u.height)&&(u={width:m,height:g},$("resize",u))}}const{proxy:t}=te();if(st===!0){let m;const g=n=>{s=t.$el.parentNode,s?(m=new ResizeObserver(c),m.observe(s),d()):n!==!0&&Se(()=>{g(!0)})};return ce(()=>{g()}),ie(()=>{r!==null&&clearTimeout(r),m!==void 0&&(m.disconnect!==void 0?m.disconnect():s&&m.unobserve(s))}),at}else{let n=function(){r!==null&&(clearTimeout(r),r=null),g!==void 0&&(g.removeEventListener!==void 0&&g.removeEventListener("resize",c,Ae.passive),g=void 0)},w=function(){n(),s&&s.contentDocument&&(g=s.contentDocument.defaultView,g.addEventListener("resize",c,Ae.passive),d())};const m=Yt();let g;return ce(()=>{Se(()=>{s=t.$el,s&&w()})}),ie(n),t.trigger=c,()=>{if(m.value===!0)return h("object",{style:Ke.style,tabindex:-1,type:"text/html",data:Ke.url,"aria-hidden":"true",onLoad:w})}}}}),Zt=F({name:"QHeader",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,revealOffset:{type:Number,default:250},bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(e,{slots:$,emit:r}){const{proxy:{$q:s}}=te(),u=Ie(ze,G);if(u===G)return console.error("QHeader needs to be child of QLayout"),G;const c=q(parseInt(e.heightHint,10)),d=q(!0),t=i(()=>e.reveal===!0||u.view.value.indexOf("H")>-1||s.platform.is.ios&&u.isContainer.value===!0),m=i(()=>{if(e.modelValue!==!0)return 0;if(t.value===!0)return d.value===!0?c.value:0;const v=c.value-u.scroll.value.position;return v>0?v:0}),g=i(()=>e.modelValue!==!0||t.value===!0&&d.value!==!0),n=i(()=>e.modelValue===!0&&g.value===!0&&e.reveal===!0),w=i(()=>"q-header q-layout__section--marginal "+(t.value===!0?"fixed":"absolute")+"-top"+(e.bordered===!0?" q-header--bordered":"")+(g.value===!0?" q-header--hidden":"")+(e.modelValue!==!0?" q-layout--prevent-focus":"")),z=i(()=>{const v=u.rows.value.top,P={};return v[0]==="l"&&u.left.space===!0&&(P[s.lang.rtl===!0?"right":"left"]=`${u.left.size}px`),v[2]==="r"&&u.right.space===!0&&(P[s.lang.rtl===!0?"left":"right"]=`${u.right.size}px`),P});function b(v,P){u.update("header",v,P)}function f(v,P){v.value!==P&&(v.value=P)}function B({height:v}){f(c,v),b("size",v)}function k(v){n.value===!0&&f(d,!0),r("focusin",v)}C(()=>e.modelValue,v=>{b("space",v),f(d,!0),u.animate()}),C(m,v=>{b("offset",v)}),C(()=>e.reveal,v=>{v===!1&&f(d,e.modelValue)}),C(d,v=>{u.animate(),r("reveal",v)}),C(u.scroll,v=>{e.reveal===!0&&f(d,v.direction==="up"||v.position<=e.revealOffset||v.position-v.inflectionPoint<100)});const x={};return u.instances.header=x,e.modelValue===!0&&b("size",c.value),b("space",e.modelValue),b("offset",m.value),ie(()=>{u.instances.header===x&&(u.instances.header=void 0,b("size",0),b("offset",0),b("space",!1))}),()=>{const v=zt($.default,[]);return e.elevated===!0&&v.push(h("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),v.push(h(ve,{debounce:0,onResize:B})),h("header",{class:w.value,style:z.value,onFocusin:k},v)}}});const ne=_t({}),ea=Object.keys(lt);var oe=F({name:"QExpansionItem",props:{...lt,...nt,...Qe,icon:String,label:String,labelLines:[Number,String],caption:String,captionLines:[Number,String],dense:Boolean,toggleAriaLabel:String,expandIcon:String,expandedIcon:String,expandIconClass:[Array,String,Object],duration:Number,headerInsetLevel:Number,contentInsetLevel:Number,expandSeparator:Boolean,defaultOpened:Boolean,hideExpandIcon:Boolean,expandIconToggle:Boolean,switchToggleSide:Boolean,denseToggle:Boolean,group:String,popup:Boolean,headerStyle:[Array,String,Object],headerClass:[Array,String,Object]},emits:[...ot,"click","afterShow","afterHide"],setup(e,{slots:$,emit:r}){const{proxy:{$q:s}}=te(),u=Re(e,s),c=q(e.modelValue!==null?e.modelValue:e.defaultOpened),d=q(null),t=He(),{show:m,hide:g,toggle:n}=it({showing:c});let w,z;const b=i(()=>`q-expansion-item q-item-type q-expansion-item--${c.value===!0?"expanded":"collapsed"} q-expansion-item--${e.popup===!0?"popup":"standard"}`),f=i(()=>{if(e.contentInsetLevel===void 0)return null;const l=s.lang.rtl===!0?"Right":"Left";return{["padding"+l]:e.contentInsetLevel*56+"px"}}),B=i(()=>e.disable!==!0&&(e.href!==void 0||e.to!==void 0&&e.to!==null&&e.to!=="")),k=i(()=>{const l={};return ea.forEach(y=>{l[y]=e[y]}),l}),x=i(()=>B.value===!0||e.expandIconToggle!==!0),v=i(()=>e.expandedIcon!==void 0&&c.value===!0?e.expandedIcon:e.expandIcon||s.iconSet.expansionItem[e.denseToggle===!0?"denseIcon":"icon"]),P=i(()=>e.disable!==!0&&(B.value===!0||e.expandIconToggle===!0)),p=i(()=>({expanded:c.value===!0,detailsId:e.targetUid,toggle:n,show:m,hide:g})),L=i(()=>{const l=e.toggleAriaLabel!==void 0?e.toggleAriaLabel:s.lang.label[c.value===!0?"collapse":"expand"](e.label);return{role:"button","aria-expanded":c.value===!0?"true":"false","aria-controls":t,"aria-label":l}});C(()=>e.group,l=>{z!==void 0&&z(),l!==void 0&&M()});function A(l){B.value!==!0&&n(l),r("click",l)}function V(l){l.keyCode===13&&D(l,!0)}function D(l,y){y!==!0&&d.value!==null&&d.value.focus(),n(l),qt(l)}function E(){r("afterShow")}function Q(){r("afterHide")}function M(){w===void 0&&(w=He()),c.value===!0&&(ne[e.group]=w);const l=C(c,O=>{O===!0?ne[e.group]=w:ne[e.group]===w&&delete ne[e.group]}),y=C(()=>ne[e.group],(O,X)=>{X===w&&O!==void 0&&O!==w&&g()});z=()=>{l(),y(),ne[e.group]===w&&delete ne[e.group],z=void 0}}function ae(){const l={class:[`q-focusable relative-position cursor-pointer${e.denseToggle===!0&&e.switchToggleSide===!0?" items-end":""}`,e.expandIconClass],side:e.switchToggleSide!==!0,avatar:e.switchToggleSide},y=[h(we,{class:"q-expansion-item__toggle-icon"+(e.expandedIcon===void 0&&c.value===!0?" q-expansion-item__toggle-icon--rotated":""),name:v.value})];return P.value===!0&&(Object.assign(l,{tabindex:0,...L.value,onClick:D,onKeyup:V}),y.unshift(h("div",{ref:d,class:"q-expansion-item__toggle-focus q-icon q-focus-helper q-focus-helper--rounded",tabindex:-1}))),h(K,l,()=>y)}function N(){let l;return $.header!==void 0?l=[].concat($.header(p.value)):(l=[h(K,()=>[h(Fe,{lines:e.labelLines},()=>e.label||""),e.caption?h(Fe,{lines:e.captionLines,caption:!0},()=>e.caption):null])],e.icon&&l[e.switchToggleSide===!0?"push":"unshift"](h(K,{side:e.switchToggleSide===!0,avatar:e.switchToggleSide!==!0},()=>h(we,{name:e.icon})))),e.disable!==!0&&e.hideExpandIcon!==!0&&l[e.switchToggleSide===!0?"unshift":"push"](ae()),l}function le(){const l={ref:"item",style:e.headerStyle,class:e.headerClass,dark:u.value,disable:e.disable,dense:e.dense,insetLevel:e.headerInsetLevel};return x.value===!0&&(l.clickable=!0,l.onClick=A,Object.assign(l,B.value===!0?k.value:L.value)),h(se,l,N)}function W(){return U(h("div",{key:"e-content",class:"q-expansion-item__content relative-position",style:f.value,id:t},fe($.default)),[[xt,c.value]])}function o(){const l=[le(),h(Kt,{duration:e.duration,onShow:E,onHide:Q},W)];return e.expandSeparator===!0&&l.push(h(pe,{class:"q-expansion-item__border q-expansion-item__border--top absolute-top",dark:u.value}),h(pe,{class:"q-expansion-item__border q-expansion-item__border--bottom absolute-bottom",dark:u.value})),l}return e.group!==void 0&&M(),ie(()=>{z!==void 0&&z()}),()=>h("div",{class:b.value},[h("div",{class:"q-expansion-item__container relative-position"},o())])}});const{passive:Ge}=Ae,ta=["both","horizontal","vertical"];var ct=F({name:"QScrollObserver",props:{axis:{type:String,validator:e=>ta.includes(e),default:"vertical"},debounce:[String,Number],scrollTarget:{default:void 0}},emits:["scroll"],setup(e,{emit:$}){const r={position:{top:0,left:0},direction:"down",directionChanged:!1,delta:{top:0,left:0},inflectionPoint:{top:0,left:0}};let s=null,u,c;C(()=>e.scrollTarget,()=>{m(),t()});function d(){s!==null&&s();const w=Math.max(0,Tt(u)),z=Ct(u),b={top:w-r.position.top,left:z-r.position.left};if(e.axis==="vertical"&&b.top===0||e.axis==="horizontal"&&b.left===0)return;const f=Math.abs(b.top)>=Math.abs(b.left)?b.top<0?"up":"down":b.left<0?"left":"right";r.position={top:w,left:z},r.directionChanged=r.direction!==f,r.delta=b,r.directionChanged===!0&&(r.direction=f,r.inflectionPoint=r.position),$("scroll",{...r})}function t(){u=kt(c,e.scrollTarget),u.addEventListener("scroll",g,Ge),g(!0)}function m(){u!==void 0&&(u.removeEventListener("scroll",g,Ge),u=void 0)}function g(w){if(w===!0||e.debounce===0||e.debounce==="0")d();else if(s===null){const[z,b]=e.debounce?[setTimeout(d,e.debounce),clearTimeout]:[requestAnimationFrame(d),cancelAnimationFrame];s=()=>{b(z),s=null}}}const{proxy:n}=te();return C(()=>n.$q.lang.rtl,d),ce(()=>{c=n.$el.parentNode,t()}),ie(()=>{s!==null&&s(),m()}),Object.assign(n,{trigger:g,getPosition:()=>r}),at}});const Xe=["vertical","horizontal"],Oe={vertical:{offset:"offsetY",scroll:"scrollTop",dir:"down",dist:"y"},horizontal:{offset:"offsetX",scroll:"scrollLeft",dir:"right",dist:"x"}},Je={prevent:!0,mouse:!0,mouseAllDir:!0},Ye=e=>e>=250?50:Math.ceil(e/5);var Ze=F({name:"QScrollArea",props:{...Qe,thumbStyle:Object,verticalThumbStyle:Object,horizontalThumbStyle:Object,barStyle:[Array,String,Object],verticalBarStyle:[Array,String,Object],horizontalBarStyle:[Array,String,Object],contentStyle:[Array,String,Object],contentActiveStyle:[Array,String,Object],delay:{type:[String,Number],default:1e3},visible:{type:Boolean,default:null},tabindex:[String,Number],onScroll:Function},setup(e,{slots:$,emit:r}){const s=q(!1),u=q(!1),c=q(!1),d={vertical:q(0),horizontal:q(0)},t={vertical:{ref:q(null),position:q(0),size:q(0)},horizontal:{ref:q(null),position:q(0),size:q(0)}},{proxy:m}=te(),g=Re(e,m.$q);let n=null,w;const z=q(null),b=i(()=>"q-scrollarea"+(g.value===!0?" q-scrollarea--dark":""));t.vertical.percentage=i(()=>{const o=t.vertical.size.value-d.vertical.value;if(o<=0)return 0;const l=ee(t.vertical.position.value/o,0,1);return Math.round(l*1e4)/1e4}),t.vertical.thumbHidden=i(()=>(e.visible===null?c.value:e.visible)!==!0&&s.value===!1&&u.value===!1||t.vertical.size.value<=d.vertical.value+1),t.vertical.thumbStart=i(()=>t.vertical.percentage.value*(d.vertical.value-t.vertical.thumbSize.value)),t.vertical.thumbSize=i(()=>Math.round(ee(d.vertical.value*d.vertical.value/t.vertical.size.value,Ye(d.vertical.value),d.vertical.value))),t.vertical.style=i(()=>({...e.thumbStyle,...e.verticalThumbStyle,top:`${t.vertical.thumbStart.value}px`,height:`${t.vertical.thumbSize.value}px`})),t.vertical.thumbClass=i(()=>"q-scrollarea__thumb q-scrollarea__thumb--v absolute-right"+(t.vertical.thumbHidden.value===!0?" q-scrollarea__thumb--invisible":"")),t.vertical.barClass=i(()=>"q-scrollarea__bar q-scrollarea__bar--v absolute-right"+(t.vertical.thumbHidden.value===!0?" q-scrollarea__bar--invisible":"")),t.horizontal.percentage=i(()=>{const o=t.horizontal.size.value-d.horizontal.value;if(o<=0)return 0;const l=ee(Math.abs(t.horizontal.position.value)/o,0,1);return Math.round(l*1e4)/1e4}),t.horizontal.thumbHidden=i(()=>(e.visible===null?c.value:e.visible)!==!0&&s.value===!1&&u.value===!1||t.horizontal.size.value<=d.horizontal.value+1),t.horizontal.thumbStart=i(()=>t.horizontal.percentage.value*(d.horizontal.value-t.horizontal.thumbSize.value)),t.horizontal.thumbSize=i(()=>Math.round(ee(d.horizontal.value*d.horizontal.value/t.horizontal.size.value,Ye(d.horizontal.value),d.horizontal.value))),t.horizontal.style=i(()=>({...e.thumbStyle,...e.horizontalThumbStyle,[m.$q.lang.rtl===!0?"right":"left"]:`${t.horizontal.thumbStart.value}px`,width:`${t.horizontal.thumbSize.value}px`})),t.horizontal.thumbClass=i(()=>"q-scrollarea__thumb q-scrollarea__thumb--h absolute-bottom"+(t.horizontal.thumbHidden.value===!0?" q-scrollarea__thumb--invisible":"")),t.horizontal.barClass=i(()=>"q-scrollarea__bar q-scrollarea__bar--h absolute-bottom"+(t.horizontal.thumbHidden.value===!0?" q-scrollarea__bar--invisible":""));const f=i(()=>t.vertical.thumbHidden.value===!0&&t.horizontal.thumbHidden.value===!0?e.contentStyle:e.contentActiveStyle),B=[[de,o=>{V(o,"vertical")},void 0,{vertical:!0,...Je}]],k=[[de,o=>{V(o,"horizontal")},void 0,{horizontal:!0,...Je}]];function x(){const o={};return Xe.forEach(l=>{const y=t[l];o[l+"Position"]=y.position.value,o[l+"Percentage"]=y.percentage.value,o[l+"Size"]=y.size.value,o[l+"ContainerSize"]=d[l].value}),o}const v=$t(()=>{const o=x();o.ref=m,r("scroll",o)},0);function P(o,l,y){if(Xe.includes(o)===!1){console.error("[QScrollArea]: wrong first param of setScrollPosition (vertical/horizontal)");return}(o==="vertical"?De:$e)(z.value,l,y)}function p({height:o,width:l}){let y=!1;d.vertical.value!==o&&(d.vertical.value=o,y=!0),d.horizontal.value!==l&&(d.horizontal.value=l,y=!0),y===!0&&M()}function L({position:o}){let l=!1;t.vertical.position.value!==o.top&&(t.vertical.position.value=o.top,l=!0),t.horizontal.position.value!==o.left&&(t.horizontal.position.value=o.left,l=!0),l===!0&&M()}function A({height:o,width:l}){t.horizontal.size.value!==l&&(t.horizontal.size.value=l,M()),t.vertical.size.value!==o&&(t.vertical.size.value=o,M())}function V(o,l){const y=t[l];if(o.isFirst===!0){if(y.thumbHidden.value===!0)return;w=y.position.value,u.value=!0}else if(u.value!==!0)return;o.isFinal===!0&&(u.value=!1);const O=Oe[l],X=d[l].value,_e=(y.size.value-X)/(X-y.thumbSize.value),xe=o.distance[O.dist],he=w+(o.direction===O.dir?1:-1)*xe*_e;ae(he,l)}function D(o,l){const y=t[l];if(y.thumbHidden.value!==!0){const O=o[Oe[l].offset];if(O<y.thumbStart.value||O>y.thumbStart.value+y.thumbSize.value){const X=O-y.thumbSize.value/2;ae(X/d[l].value*y.size.value,l)}y.ref.value!==null&&y.ref.value.dispatchEvent(new MouseEvent(o.type,o))}}function E(o){D(o,"vertical")}function Q(o){D(o,"horizontal")}function M(){s.value=!0,n!==null&&clearTimeout(n),n=setTimeout(()=>{n=null,s.value=!1},e.delay),e.onScroll!==void 0&&v()}function ae(o,l){z.value[Oe[l].scroll]=o}function N(){c.value=!0}function le(){c.value=!1}let W=null;return C(()=>m.$q.lang.rtl,o=>{z.value!==null&&$e(z.value,Math.abs(t.horizontal.position.value)*(o===!0?-1:1))}),Lt(()=>{W={top:t.vertical.position.value,left:t.horizontal.position.value}}),Pt(()=>{if(W===null)return;const o=z.value;o!==null&&($e(o,W.left),De(o,W.top))}),ie(v.cancel),Object.assign(m,{getScrollTarget:()=>z.value,getScroll:x,getScrollPosition:()=>({top:t.vertical.position.value,left:t.horizontal.position.value}),getScrollPercentage:()=>({top:t.vertical.percentage.value,left:t.horizontal.percentage.value}),setScrollPosition:P,setScrollPercentage(o,l,y){P(o,l*(t[o].size.value-d[o].value)*(o==="horizontal"&&m.$q.lang.rtl===!0?-1:1),y)}}),()=>h("div",{class:b.value,onMouseenter:N,onMouseleave:le},[h("div",{ref:z,class:"q-scrollarea__container scroll relative-position fit hide-scrollbar",tabindex:e.tabindex!==void 0?e.tabindex:void 0},[h("div",{class:"q-scrollarea__content absolute",style:f.value},rt($.default,[h(ve,{debounce:0,onResize:A})])),h(ct,{axis:"both",onScroll:L})]),h(ve,{debounce:0,onResize:p}),h("div",{class:t.vertical.barClass.value,style:[e.barStyle,e.verticalBarStyle],"aria-hidden":"true",onMousedown:E}),h("div",{class:t.horizontal.barClass.value,style:[e.barStyle,e.horizontalBarStyle],"aria-hidden":"true",onMousedown:Q}),U(h("div",{ref:t.vertical.ref,class:t.vertical.thumbClass.value,style:t.vertical.style.value,"aria-hidden":"true"}),B),U(h("div",{ref:t.horizontal.ref,class:t.horizontal.thumbClass.value,style:t.horizontal.style.value,"aria-hidden":"true"}),k)])}});const et=150;var aa=F({name:"QDrawer",inheritAttrs:!1,props:{...nt,...Qe,side:{type:String,default:"left",validator:e=>["left","right"].includes(e)},width:{type:Number,default:300},mini:Boolean,miniToOverlay:Boolean,miniWidth:{type:Number,default:57},noMiniAnimation:Boolean,breakpoint:{type:Number,default:1023},showIfAbove:Boolean,behavior:{type:String,validator:e=>["default","desktop","mobile"].includes(e),default:"default"},bordered:Boolean,elevated:Boolean,overlay:Boolean,persistent:Boolean,noSwipeOpen:Boolean,noSwipeClose:Boolean,noSwipeBackdrop:Boolean},emits:[...ot,"onLayout","miniState"],setup(e,{slots:$,emit:r,attrs:s}){const u=te(),{proxy:{$q:c}}=u,d=Re(e,c),{preventBodyScroll:t}=At(),{registerTimeout:m,removeTimeout:g}=Bt(),n=Ie(ze,G);if(n===G)return console.error("QDrawer needs to be child of QLayout"),G;let w,z=null,b;const f=q(e.behavior==="mobile"||e.behavior!=="desktop"&&n.totalWidth.value<=e.breakpoint),B=i(()=>e.mini===!0&&f.value!==!0),k=i(()=>B.value===!0?e.miniWidth:e.width),x=q(e.showIfAbove===!0&&f.value===!1?!0:e.modelValue===!0),v=i(()=>e.persistent!==!0&&(f.value===!0||X.value===!0));function P(a,_){if(V(),a!==!1&&n.animate(),H(0),f.value===!0){const I=n.instances[o.value];I!==void 0&&I.belowBreakpoint===!0&&I.hide(!1),J(1),n.isContainer.value!==!0&&t(!0)}else J(0),a!==!1&&ke(!1);m(()=>{a!==!1&&ke(!0),_!==!0&&r("show",a)},et)}function p(a,_){D(),a!==!1&&n.animate(),J(0),H(M.value*k.value),Te(),_!==!0?m(()=>{r("hide",a)},et):g()}const{show:L,hide:A}=it({showing:x,hideOnRouteChange:v,handleShow:P,handleHide:p}),{addToHistory:V,removeFromHistory:D}=Ot(x,A,v),E={belowBreakpoint:f,hide:A},Q=i(()=>e.side==="right"),M=i(()=>(c.lang.rtl===!0?-1:1)*(Q.value===!0?1:-1)),ae=q(0),N=q(!1),le=q(!1),W=q(k.value*M.value),o=i(()=>Q.value===!0?"left":"right"),l=i(()=>x.value===!0&&f.value===!1&&e.overlay===!1?e.miniToOverlay===!0?e.miniWidth:k.value:0),y=i(()=>e.overlay===!0||e.miniToOverlay===!0||n.view.value.indexOf(Q.value?"R":"L")>-1||c.platform.is.ios===!0&&n.isContainer.value===!0),O=i(()=>e.overlay===!1&&x.value===!0&&f.value===!1),X=i(()=>e.overlay===!0&&x.value===!0&&f.value===!1),_e=i(()=>"fullscreen q-drawer__backdrop"+(x.value===!1&&N.value===!1?" hidden":"")),xe=i(()=>({backgroundColor:`rgba(0,0,0,${ae.value*.4})`})),he=i(()=>Q.value===!0?n.rows.value.top[2]==="r":n.rows.value.top[0]==="l"),dt=i(()=>Q.value===!0?n.rows.value.bottom[2]==="r":n.rows.value.bottom[0]==="l"),vt=i(()=>{const a={};return n.header.space===!0&&he.value===!1&&(y.value===!0?a.top=`${n.header.offset}px`:n.header.space===!0&&(a.top=`${n.header.size}px`)),n.footer.space===!0&&dt.value===!1&&(y.value===!0?a.bottom=`${n.footer.offset}px`:n.footer.space===!0&&(a.bottom=`${n.footer.size}px`)),a}),ft=i(()=>{const a={width:`${k.value}px`,transform:`translateX(${W.value}px)`};return f.value===!0?a:Object.assign(a,vt.value)}),ht=i(()=>"q-drawer__content fit "+(n.isContainer.value!==!0?"scroll":"overflow-auto")),mt=i(()=>`q-drawer q-drawer--${e.side}`+(le.value===!0?" q-drawer--mini-animate":"")+(e.bordered===!0?" q-drawer--bordered":"")+(d.value===!0?" q-drawer--dark q-dark":"")+(N.value===!0?" no-transition":x.value===!0?"":" q-layout--prevent-focus")+(f.value===!0?" fixed q-drawer--on-top q-drawer--mobile q-drawer--top-padding":` q-drawer--${B.value===!0?"mini":"standard"}`+(y.value===!0||O.value!==!0?" fixed":"")+(e.overlay===!0||e.miniToOverlay===!0?" q-drawer--on-top":"")+(he.value===!0?" q-drawer--top-padding":""))),gt=i(()=>{const a=c.lang.rtl===!0?e.side:o.value;return[[de,pt,void 0,{[a]:!0,mouse:!0}]]}),bt=i(()=>{const a=c.lang.rtl===!0?o.value:e.side;return[[de,Ve,void 0,{[a]:!0,mouse:!0}]]}),yt=i(()=>{const a=c.lang.rtl===!0?o.value:e.side;return[[de,Ve,void 0,{[a]:!0,mouse:!0,mouseAllDir:!0}]]});function qe(){wt(f,e.behavior==="mobile"||e.behavior!=="desktop"&&n.totalWidth.value<=e.breakpoint)}C(f,a=>{a===!0?(w=x.value,x.value===!0&&A(!1)):e.overlay===!1&&e.behavior!=="mobile"&&w!==!1&&(x.value===!0?(H(0),J(0),Te()):L(!1))}),C(()=>e.side,(a,_)=>{n.instances[_]===E&&(n.instances[_]=void 0,n[_].space=!1,n[_].offset=0),n.instances[a]=E,n[a].size=k.value,n[a].space=O.value,n[a].offset=l.value}),C(n.totalWidth,()=>{(n.isContainer.value===!0||document.qScrollPrevented!==!0)&&qe()}),C(()=>e.behavior+e.breakpoint,qe),C(n.isContainer,a=>{x.value===!0&&t(a!==!0),a===!0&&qe()}),C(n.scrollbarWidth,()=>{H(x.value===!0?0:void 0)}),C(l,a=>{Y("offset",a)}),C(O,a=>{r("onLayout",a),Y("space",a)}),C(Q,()=>{H()}),C(k,a=>{H(),Ce(e.miniToOverlay,a)}),C(()=>e.miniToOverlay,a=>{Ce(a,k.value)}),C(()=>c.lang.rtl,()=>{H()}),C(()=>e.mini,()=>{e.noMiniAnimation||e.modelValue===!0&&(St(),n.animate())}),C(B,a=>{r("miniState",a)});function H(a){a===void 0?Se(()=>{a=x.value===!0?0:k.value,H(M.value*a)}):(n.isContainer.value===!0&&Q.value===!0&&(f.value===!0||Math.abs(a)===k.value)&&(a+=M.value*n.scrollbarWidth.value),W.value=a)}function J(a){ae.value=a}function ke(a){const _=a===!0?"remove":n.isContainer.value!==!0?"add":"";_!==""&&document.body.classList[_]("q-body--drawer-toggle")}function St(){z!==null&&clearTimeout(z),u.proxy&&u.proxy.$el&&u.proxy.$el.classList.add("q-drawer--mini-animate"),le.value=!0,z=setTimeout(()=>{z=null,le.value=!1,u&&u.proxy&&u.proxy.$el&&u.proxy.$el.classList.remove("q-drawer--mini-animate")},150)}function pt(a){if(x.value!==!1)return;const _=k.value,I=ee(a.distance.x,0,_);if(a.isFinal===!0){I>=Math.min(75,_)===!0?L():(n.animate(),J(0),H(M.value*_)),N.value=!1;return}H((c.lang.rtl===!0?Q.value!==!0:Q.value)?Math.max(_-I,0):Math.min(0,I-_)),J(ee(I/_,0,1)),a.isFirst===!0&&(N.value=!0)}function Ve(a){if(x.value!==!0)return;const _=k.value,I=a.direction===e.side,me=(c.lang.rtl===!0?I!==!0:I)?ee(a.distance.x,0,_):0;if(a.isFinal===!0){Math.abs(me)<Math.min(75,_)===!0?(n.animate(),J(1),H(0)):A(),N.value=!1;return}H(M.value*me),J(ee(1-me/_,0,1)),a.isFirst===!0&&(N.value=!0)}function Te(){t(!1),ke(!0)}function Y(a,_){n.update(e.side,a,_)}function wt(a,_){a.value!==_&&(a.value=_)}function Ce(a,_){Y("size",a===!0?e.miniWidth:_)}return n.instances[e.side]=E,Ce(e.miniToOverlay,k.value),Y("space",O.value),Y("offset",l.value),e.showIfAbove===!0&&e.modelValue!==!0&&x.value===!0&&e["onUpdate:modelValue"]!==void 0&&r("update:modelValue",!0),ce(()=>{r("onLayout",O.value),r("miniState",B.value),w=e.showIfAbove===!0;const a=()=>{(x.value===!0?P:p)(!1,!0)};if(n.totalWidth.value!==0){Se(a);return}b=C(n.totalWidth,()=>{b(),b=void 0,x.value===!1&&e.showIfAbove===!0&&f.value===!1?L(!1):a()})}),ie(()=>{b!==void 0&&b(),z!==null&&(clearTimeout(z),z=null),x.value===!0&&Te(),n.instances[e.side]===E&&(n.instances[e.side]=void 0,Y("size",0),Y("offset",0),Y("space",!1))}),()=>{const a=[];f.value===!0&&(e.noSwipeOpen===!1&&a.push(U(h("div",{key:"open",class:`q-drawer__opener fixed-${e.side}`,"aria-hidden":"true"}),gt.value)),a.push(Ee("div",{ref:"backdrop",class:_e.value,style:xe.value,"aria-hidden":"true",onClick:A},void 0,"backdrop",e.noSwipeBackdrop!==!0&&x.value===!0,()=>yt.value)));const _=B.value===!0&&$.mini!==void 0,I=[h("div",{...s,key:""+_,class:[ht.value,s.class]},_===!0?$.mini():fe($.default))];return e.elevated===!0&&x.value===!0&&I.push(h("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),a.push(Ee("aside",{ref:"content",class:mt.value,style:ft.value},I,"contentclose",e.noSwipeClose!==!0&&f.value===!0,()=>bt.value)),h("div",{class:"q-drawer-container"},a)}}}),la=F({name:"QPageContainer",setup(e,{slots:$}){const{proxy:{$q:r}}=te(),s=Ie(ze,G);if(s===G)return console.error("QPageContainer needs to be child of QLayout"),G;ut(Mt,!0);const u=i(()=>{const c={};return s.header.space===!0&&(c.paddingTop=`${s.header.size}px`),s.right.space===!0&&(c[`padding${r.lang.rtl===!0?"Left":"Right"}`]=`${s.right.size}px`),s.footer.space===!0&&(c.paddingBottom=`${s.footer.size}px`),s.left.space===!0&&(c[`padding${r.lang.rtl===!0?"Right":"Left"}`]=`${s.left.size}px`),c});return()=>h("div",{class:"q-page-container",style:u.value},fe($.default))}}),na=F({name:"QLayout",props:{container:Boolean,view:{type:String,default:"hhh lpr fff",validator:e=>/^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(e.toLowerCase())},onScroll:Function,onScrollHeight:Function,onResize:Function},setup(e,{slots:$,emit:r}){const{proxy:{$q:s}}=te(),u=q(null),c=q(s.screen.height),d=q(e.container===!0?0:s.screen.width),t=q({position:0,direction:"down",inflectionPoint:0}),m=q(0),g=q(tt.value===!0?0:Le()),n=i(()=>"q-layout q-layout--"+(e.container===!0?"containerized":"standard")),w=i(()=>e.container===!1?{minHeight:s.screen.height+"px"}:null),z=i(()=>g.value!==0?{[s.lang.rtl===!0?"left":"right"]:`${g.value}px`}:null),b=i(()=>g.value!==0?{[s.lang.rtl===!0?"right":"left"]:0,[s.lang.rtl===!0?"left":"right"]:`-${g.value}px`,width:`calc(100% + ${g.value}px)`}:null);function f(p){if(e.container===!0||document.qScrollPrevented!==!0){const L={position:p.position.top,direction:p.direction,directionChanged:p.directionChanged,inflectionPoint:p.inflectionPoint.top,delta:p.delta.top};t.value=L,e.onScroll!==void 0&&r("scroll",L)}}function B(p){const{height:L,width:A}=p;let V=!1;c.value!==L&&(V=!0,c.value=L,e.onScrollHeight!==void 0&&r("scrollHeight",L),x()),d.value!==A&&(V=!0,d.value=A),V===!0&&e.onResize!==void 0&&r("resize",p)}function k({height:p}){m.value!==p&&(m.value=p,x())}function x(){if(e.container===!0){const p=c.value>m.value?Le():0;g.value!==p&&(g.value=p)}}let v=null;const P={instances:{},view:i(()=>e.view),isContainer:i(()=>e.container),rootRef:u,height:c,containerHeight:m,scrollbarWidth:g,totalWidth:i(()=>d.value+g.value),rows:i(()=>{const p=e.view.toLowerCase().split(" ");return{top:p[0].split(""),middle:p[1].split(""),bottom:p[2].split("")}}),header:ge({size:0,offset:0,space:!1}),right:ge({size:300,offset:0,space:!1}),footer:ge({size:0,offset:0,space:!1}),left:ge({size:300,offset:0,space:!1}),scroll:t,animate(){v!==null?clearTimeout(v):document.body.classList.add("q-body--layout-animate"),v=setTimeout(()=>{v=null,document.body.classList.remove("q-body--layout-animate")},155)},update(p,L,A){P[p][L]=A}};if(ut(ze,P),Le()>0){let A=function(){p=null,L.classList.remove("hide-scrollbar")},V=function(){if(p===null){if(L.scrollHeight>s.screen.height)return;L.classList.add("hide-scrollbar")}else clearTimeout(p);p=setTimeout(A,300)},D=function(E){p!==null&&E==="remove"&&(clearTimeout(p),A()),window[`${E}EventListener`]("resize",V)},p=null;const L=document.body;C(()=>e.container!==!0?"add":"remove",D),e.container!==!0&&D("add"),It(()=>{D("remove")})}return()=>{const p=rt($.default,[h(ct,{onScroll:f}),h(ve,{onResize:B})]),L=h("div",{class:n.value,style:w.value,ref:e.container===!0?void 0:u,tabindex:-1},p);return e.container===!0?h("div",{class:"q-layout-container overflow-hidden",ref:u},[h(ve,{onResize:k}),h("div",{class:"absolute-full",style:z.value},[h("div",{class:"scroll",style:b.value},[L])])]):L}}});const oa=Qt({name:"EssentialLink",props:{title:{type:String,required:!0},caption:{type:String,default:""},link:{type:String,default:"#"},icon:{type:String,default:""}}});function ia(e,$,r,s,u,c){return U((Z(),re(se,{class:"navigation-item q-mx-sm","active-class":"tab-active",to:e.link,exact:"",clickable:""},{default:T(()=>[S(K,{avatar:""},{default:T(()=>[S(we,{name:e.icon},null,8,["name"])]),_:1}),S(K,null,{default:T(()=>[ue(Me(e.title),1)]),_:1})]),_:1},8,["to"])),[[Vt]])}var ra=Rt(oa,[["render",ia]]);const ua=R("span",{class:"text-weight-regular"},"Usuario: ",-1),sa={class:"text-weight-light"},ca=R("span",{class:"text-weight-regular"},"Rol: ",-1),da={class:"text-weight-light"},va={class:"q-mx-sm"},fa=R("img",{src:"https://cdn.quasar.dev/img/avatar2.jpg"},null,-1),ha={style:{height:"calc(100% - 80px)",padding:"10px"}},ma={class:"q-mini-drawer-hide absolute",style:{top:"30px",right:"-17px"}},ga={class:"col"},ba={class:"full-height"},Ca={__name:"MainLayout",setup(e){const $=[{title:"Dashboard",icon:"home",link:"/",permisoRequerido:"Ver Dashboard"},{title:"Proveedores",icon:"fa fa-truck",link:"/proveedores",permisoRequerido:"Ver Proveedores"},{title:"Clientes",icon:"fa fa-user-tag",link:"/clientes",permisoRequerido:"Ver Clientes"},{title:"Productos",icon:"inventory",link:"/productos",permisoRequerido:"Ver Productos"},{title:"Compras",icon:"fa-solid fa-cart-shopping",link:"/compras",permisoRequerido:"Ver Articulos"},{title:"Ventas",icon:"fa fa-cash-register",link:"/ventas",permisoRequerido:"Ver Ventas"}],r=Xt(),s=Ht(),u=Jt();let c="",d="";const{claim:t}=Dt.read(u.token),m=t.fullName.split(" ");if(m.length>3){const b=m.pop();c=`${m.join(" ")} ${b[0]}.`}else c=t.fullName;d=t.roles[0],C(()=>r.dark.isActive,(b,f)=>{u.setModeDark(b)},{deep:!0}),ce(()=>{r.dark.set(u.modeDark)});const g=()=>{u.$reset(),s.push("/login")},n=q(!1),w=q(!1),z=b=>{n.value&&(n.value=!1,b.stopPropagation())};return(b,f)=>{const B=Et("router-view");return Z(),re(na,{view:"lHh LpR lFf"},{default:T(()=>[S(Zt,{class:Pe([j(r).dark.isActive?"q-dark":"bg-white","shadow_custom q-mx-lg q-mt-md q-py-sm"]),style:{right:"8px","border-radius":"4px"}},{default:T(()=>[S(Ue,{class:"no-shadow"},{default:T(()=>[S(be,{flat:"",dense:"",round:"",icon:"menu","aria-label":"Menu",color:"grey",class:"custom-border",onClick:f[0]||(f[0]=k=>w.value=!w.value)}),S(We,{class:"q-ml-sm"},{default:T(()=>[j(r).screen.xs?Nt("",!0):(Z(),Ne("div",{key:0,class:Pe(["row justify-center justify-between text-h6",[j(r).dark.isActive?"":"text-black"]])},[R("div",null,[ua,R("span",sa,Me(j(c)),1)]),R("div",null,[ca,R("span",da,Me(j(d)),1)])],2))]),_:1}),R("div",null,[S(be,{class:"q-mr-xs text-grey-6",flat:"",round:"",onClick:f[1]||(f[1]=k=>j(r).dark.toggle()),icon:j(r).dark.isActive?"nights_stay":"wb_sunny"},null,8,["icon"])]),R("div",va,[S(be,{class:"q-mr-md q-py-xs q-px-sm custom-border",flat:"",color:"grey",icon:"notifications"}),S(je,{class:"cursor-pointer"},{default:T(()=>[fa,S(Ut,null,{default:T(()=>[S(Be,{style:{"min-width":"200px"}},{default:T(()=>[U((Z(),re(se,{clickable:""},{default:T(()=>[S(K,null,{default:T(()=>[ue("John Doe")]),_:1})]),_:1})),[[ye]]),S(pe),U((Z(),re(se,{clickable:""},{default:T(()=>[S(K,null,{default:T(()=>[ue("My Profile")]),_:1})]),_:1})),[[ye]]),U((Z(),re(se,{clickable:""},{default:T(()=>[S(K,null,{default:T(()=>[ue("Billing")]),_:1})]),_:1})),[[ye]]),S(pe),U((Z(),re(se,{onClick:g,clickable:""},{default:T(()=>[S(K,null,{default:T(()=>[ue("Logout")]),_:1})]),_:1})),[[ye]])]),_:1})]),_:1})]),_:1})])]),_:1})]),_:1},8,["class"]),S(aa,{modelValue:w.value,"onUpdate:modelValue":f[4]||(f[4]=k=>w.value=k),"show-if-above":"",width:260,"mini-width":80,mini:!w.value||n.value,onClickCapture:z,class:Pe(j(r).dark.isActive?"":"drawer_cls")},{default:T(()=>[R("div",ha,[S(Ue,{onClick:f[2]||(f[2]=k=>b.$router.push("/")),class:"cursor-pointer",style:{"margin-top":"15px"}},{default:T(()=>[S(je,{rounded:""},{default:T(()=>[S(we,{style:{color:"#696cff"},size:"38px",class:"text-weight-bolder",name:"rocket_launch"})]),_:1}),S(We,{style:{color:"#566a7f","font-size":"1.40rem","letter-spacing":"-.5px"},class:"text-weight-medium"},{default:T(()=>[ue(" Admin CRM ")]),_:1})]),_:1}),S(Ze,{style:{height:"100%"}},{default:T(()=>[S(Be,{padding:""},{default:T(()=>[(Z(),Ne(Ft,null,jt($,k=>S(ra,Wt({key:k.title},k),null,16)),64)),S(Be,{class:"q-ml-sm"},{default:T(()=>[S(oe,{"expand-separator":"",icon:"settings",label:"Ajustes"},{default:T(()=>[S(oe,{"hide-expand-icon":"",icon:"group",class:"item-options","active-class":"bg-light-blue-9",to:{name:"Ver Usuarios"},"dense-toggle":"",label:"Gesti\xF3n Personal","header-inset-level":0}),S(oe,{"hide-expand-icon":"",icon:"mail",class:"item-options","active-class":"bg-light-blue-9",to:j(t).roles[0]=="Super-Administrador"?{name:"emails"}:{name:"email.edit",params:{email_id:j(t).company.id}},"dense-toggle":"",label:"Servidor de Correo","header-inset-level":0},null,8,["to"]),S(oe,{"hide-expand-icon":"",icon:"local_convenience_store",class:"item-options","active-class":"bg-light-blue-9",to:{name:"Ver Empresas"},"dense-toggle":"",label:"Empresa","header-inset-level":0}),S(oe,{"hide-expand-icon":"",icon:"local_convenience_store",class:"item-options","active-class":"bg-light-blue-9",to:{name:"Ver Sucursales"},"dense-toggle":"",label:"Sucursales","header-inset-level":0}),S(oe,{"hide-expand-icon":"",icon:"description",class:"item-options","active-class":"bg-light-blue-9",to:{name:"Factura-Electronica"},"dense-toggle":"",label:"Facturaci\xF3n Electronica","header-inset-level":0}),S(oe,{"hide-expand-icon":"",icon:"paid",class:"item-options","active-class":"bg-light-blue-9","dense-toggle":"",label:"Pasarelas de pagos","header-inset-level":0})]),_:1})]),_:1})]),_:1})]),_:1})]),R("div",ma,[S(be,{dense:"",round:"",style:{"background-color":"#696cff",color:"white",border:"6px solid #f2f2f7"},unelevated:"",icon:"chevron_left",onClick:f[3]||(f[3]=k=>n.value=!0)})])]),_:1},8,["modelValue","mini","class"]),S(la,null,{default:T(()=>[S(Gt,{class:"row no-wrap"},{default:T(()=>[R("div",ga,[R("div",ba,[S(Ze,{class:"col q-pr-sm q-scrollarea--only-vertical full-height",visible:""},{default:T(()=>[S(B)]),_:1})])])]),_:1})]),_:1})]),_:1})}}};export{Ca as default};