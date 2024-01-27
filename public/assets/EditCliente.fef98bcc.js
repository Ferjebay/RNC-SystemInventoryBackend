import{Q as bt,a as Re}from"./QBreadcrumbs.50604a24.js";import{k as ht,t as De,r as R,n as B,x as Ze,B as yt,bH as Xe,N as te,a6 as ce,p as G,am as He,al as wt,bf as $t,i as le,M as qt,z as Me,bb as Ct,aH as xt,m as ke,au as Fe,V as Ke,v as qe,a0 as kt,K as Pt,L as At,s as Je,H as It,I as Tt,Z as Vt,o as b,a7 as x,g as o,e as a,ac as q,f as t,Q as ae,ab as g,a9 as C,h as U,a8 as w,c as J,ad as H,aP as _e,aQ as Ce,af as Pe,aT as et,ah as xe,bs as tt,a5 as St,bp as Et,bI as Rt,bJ as Dt,ag as Ft,aI as Nt,aS as Mt}from"./index.5d1f09cd.js";import{u as ge}from"./useCliente.cbd82333.js";import{u as Ot,a as Lt,b as Qt,c as Bt,e as be,d as Ut,_ as jt}from"./ServicioInternet.94b14df4.js";import{Q as zt}from"./QResizeObserver.430e10f3.js";import{r as Yt,Q as Ne}from"./QSelect.c4dd2bd4.js";import{Q as oe}from"./QBadge.830994ce.js";import{Q as Ae}from"./QForm.ffdb1aff.js";import{d as me}from"./date.f629cf57.js";import{Q as at,a as Y}from"./QTable.c7b8d510.js";import{a as ue,Q as We}from"./QTooltip.3983f715.js";import{C as ot}from"./ClosePopup.488eb010.js";import{a as de,Q as X,c as Z}from"./QItemLabel.762c223e.js";import{Q as Gt}from"./QList.225b0277.js";import{M as Ht}from"./index.2065a85c.js";import"./useHelpers.087d2c36.js";import"./use-quasar.fbb59c95.js";import"./axios.8d86dbdf.js";import"./touch.3df10340.js";import"./QDate.1246deaf.js";import"./QPopupProxy.d2978973.js";import"./format.2bc25e5f.js";import"./QChip.b975933a.js";import"./ModalMapBox.4e05065c.js";import"./QBtnGroup.0a1fe0b9.js";let Kt=0;const Wt=["click","keydown"],Zt={icon:String,label:[Number,String],alert:[Boolean,String],alertIcon:String,name:{type:[Number,String],default:()=>`t_${Kt++}`},noCaps:Boolean,tabindex:[String,Number],disable:Boolean,contentClass:String,ripple:{type:[Boolean,Object],default:!0}};function Xt(l,h,r,d){const c=ht(Xe,De);if(c===De)return console.error("QTab/QRouteTab component needs to be child of QTabs"),De;const{proxy:k}=Me(),D=R(null),T=R(null),O=R(null),S=B(()=>l.disable===!0||l.ripple===!1?!1:Object.assign({keyCodes:[13,32],early:!0},l.ripple===!0?{}:l.ripple)),L=B(()=>c.currentModel.value===l.name),n=B(()=>"q-tab relative-position self-stretch flex flex-center text-center"+(L.value===!0?" q-tab--active"+(c.tabProps.value.activeClass?" "+c.tabProps.value.activeClass:"")+(c.tabProps.value.activeColor?` text-${c.tabProps.value.activeColor}`:"")+(c.tabProps.value.activeBgColor?` bg-${c.tabProps.value.activeBgColor}`:""):" q-tab--inactive")+(l.icon&&l.label&&c.tabProps.value.inlineLabel===!1?" q-tab--full":"")+(l.noCaps===!0||c.tabProps.value.noCaps===!0?" q-tab--no-caps":"")+(l.disable===!0?" disabled":" q-focusable q-hoverable cursor-pointer")+(d!==void 0?d.linkClass.value:"")),v=B(()=>"q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable "+(c.tabProps.value.inlineLabel===!0?"row no-wrap q-tab__content--inline":"column")+(l.contentClass!==void 0?` ${l.contentClass}`:"")),u=B(()=>l.disable===!0||c.hasFocus.value===!0||L.value===!1&&c.hasActiveTab.value===!0?-1:l.tabindex||0);function p(e,i){if(i!==!0&&D.value!==null&&D.value.focus(),l.disable===!0){d!==void 0&&d.hasRouterLink.value===!0&&He(e);return}if(d===void 0){c.updateModel({name:l.name}),r("click",e);return}if(d.hasRouterLink.value===!0){const s=(f={})=>{let A;const E=f.to===void 0||Ct(f.to,l.to)===!0?c.avoidRouteWatcher=xt():null;return d.navigateToRouterLink(e,{...f,returnRouterError:!0}).catch(V=>{A=V}).then(V=>{if(E===c.avoidRouteWatcher&&(c.avoidRouteWatcher=!1,A===void 0&&(V===void 0||V.message.startsWith("Avoided redundant navigation")===!0)&&c.updateModel({name:l.name})),f.returnRouterError===!0)return A!==void 0?Promise.reject(A):V})};r("click",e,s),e.defaultPrevented!==!0&&s();return}r("click",e)}function F(e){wt(e,[13,32])?p(e,!0):$t(e)!==!0&&e.keyCode>=35&&e.keyCode<=40&&e.altKey!==!0&&e.metaKey!==!0&&c.onKbdNavigate(e.keyCode,k.$el)===!0&&He(e),r("keydown",e)}function j(){const e=c.tabProps.value.narrowIndicator,i=[],s=G("div",{ref:O,class:["q-tab__indicator",c.tabProps.value.indicatorClass]});l.icon!==void 0&&i.push(G(le,{class:"q-tab__icon",name:l.icon})),l.label!==void 0&&i.push(G("div",{class:"q-tab__label"},l.label)),l.alert!==!1&&i.push(l.alertIcon!==void 0?G(le,{class:"q-tab__alert-icon",color:l.alert!==!0?l.alert:void 0,name:l.alertIcon}):G("div",{class:"q-tab__alert"+(l.alert!==!0?` text-${l.alert}`:"")})),e===!0&&i.push(s);const f=[G("div",{class:"q-focus-helper",tabindex:-1,ref:D}),G("div",{class:v.value},qt(h.default,i))];return e===!1&&f.push(s),f}const K={name:B(()=>l.name),rootRef:T,tabIndicatorRef:O,routeData:d};Ze(()=>{c.unregisterTab(K)}),yt(()=>{c.registerTab(K)});function P(e,i){const s={ref:T,class:n.value,tabindex:u.value,role:"tab","aria-selected":L.value===!0?"true":"false","aria-disabled":l.disable===!0?"true":void 0,onClick:p,onKeydown:F,...i};return te(G(e,s,j()),[[ce,S.value]])}return{renderTab:P,$tabs:c}}var pe=ke({name:"QTab",props:Zt,emits:Wt,setup(l,{slots:h,emit:r}){const{renderTab:d}=Xt(l,h,r);return()=>d("div")}});function Jt(l,h,r){const d=r===!0?["left","right"]:["top","bottom"];return`absolute-${h===!0?d[0]:d[1]}${l?` text-${l}`:""}`}const ea=["left","center","right","justify"];var lt=ke({name:"QTabs",props:{modelValue:[Number,String],align:{type:String,default:"center",validator:l=>ea.includes(l)},breakpoint:{type:[String,Number],default:600},vertical:Boolean,shrink:Boolean,stretch:Boolean,activeClass:String,activeColor:String,activeBgColor:String,indicatorColor:String,leftIcon:String,rightIcon:String,outsideArrows:Boolean,mobileArrows:Boolean,switchIndicator:Boolean,narrowIndicator:Boolean,inlineLabel:Boolean,noCaps:Boolean,dense:Boolean,contentClass:String,"onUpdate:modelValue":[Function,Array]},setup(l,{slots:h,emit:r}){const{proxy:d}=Me(),{$q:c}=d,{registerTick:k}=Fe(),{registerTick:D}=Fe(),{registerTick:T}=Fe(),{registerTimeout:O,removeTimeout:S}=Ke(),{registerTimeout:L,removeTimeout:n}=Ke(),v=R(null),u=R(null),p=R(l.modelValue),F=R(!1),j=R(!0),K=R(!1),P=R(!1),e=[],i=R(0),s=R(!1);let f=null,A=null,E;const V=B(()=>({activeClass:l.activeClass,activeColor:l.activeColor,activeBgColor:l.activeBgColor,indicatorClass:Jt(l.indicatorColor,l.switchIndicator,l.vertical),narrowIndicator:l.narrowIndicator,inlineLabel:l.inlineLabel,noCaps:l.noCaps})),Q=B(()=>{const m=i.value,_=p.value;for(let y=0;y<m;y++)if(e[y].name.value===_)return!0;return!1}),W=B(()=>`q-tabs__content--align-${F.value===!0?"left":P.value===!0?"justify":l.align}`),Ie=B(()=>`q-tabs row no-wrap items-center q-tabs--${F.value===!0?"":"not-"}scrollable q-tabs--${l.vertical===!0?"vertical":"horizontal"} q-tabs__arrows--${l.outsideArrows===!0?"outside":"inside"} q-tabs--mobile-with${l.mobileArrows===!0?"":"out"}-arrows`+(l.dense===!0?" q-tabs--dense":"")+(l.shrink===!0?" col-shrink":"")+(l.stretch===!0?" self-stretch":"")),st=B(()=>"q-tabs__content scroll--mobile row no-wrap items-center self-stretch hide-scrollbar relative-position "+W.value+(l.contentClass!==void 0?` ${l.contentClass}`:"")),he=B(()=>l.vertical===!0?{container:"height",content:"offsetHeight",scroll:"scrollHeight"}:{container:"width",content:"offsetWidth",scroll:"scrollWidth"}),ye=B(()=>l.vertical!==!0&&c.lang.rtl===!0),Te=B(()=>Yt===!1&&ye.value===!0);qe(ye,ie),qe(()=>l.modelValue,m=>{Ve({name:m,setCurrent:!0,skipEmit:!0})}),qe(()=>l.outsideArrows,we);function Ve({name:m,setCurrent:_,skipEmit:y}){p.value!==m&&(y!==!0&&l["onUpdate:modelValue"]!==void 0&&r("update:modelValue",m),(_===!0||l["onUpdate:modelValue"]===void 0)&&(nt(p.value,m),p.value=m))}function we(){k(()=>{Oe({width:v.value.offsetWidth,height:v.value.offsetHeight})})}function Oe(m){if(he.value===void 0||u.value===null)return;const _=m[he.value.container],y=Math.min(u.value[he.value.scroll],Array.prototype.reduce.call(u.value.children,(M,I)=>M+(I[he.value.content]||0),0)),N=_>0&&y>_;F.value=N,N===!0&&D(ie),P.value=_<parseInt(l.breakpoint,10)}function nt(m,_){const y=m!=null&&m!==""?e.find(M=>M.name.value===m):null,N=_!=null&&_!==""?e.find(M=>M.name.value===_):null;if(y&&N){const M=y.tabIndicatorRef.value,I=N.tabIndicatorRef.value;f!==null&&(clearTimeout(f),f=null),M.style.transition="none",M.style.transform="none",I.style.transition="none",I.style.transform="none";const $=M.getBoundingClientRect(),z=I.getBoundingClientRect();I.style.transform=l.vertical===!0?`translate3d(0,${$.top-z.top}px,0) scale3d(1,${z.height?$.height/z.height:1},1)`:`translate3d(${$.left-z.left}px,0,0) scale3d(${z.width?$.width/z.width:1},1,1)`,T(()=>{f=setTimeout(()=>{f=null,I.style.transition="transform .25s cubic-bezier(.4, 0, .2, 1)",I.style.transform="none"},70)})}N&&F.value===!0&&ne(N.rootRef.value)}function ne(m){const{left:_,width:y,top:N,height:M}=u.value.getBoundingClientRect(),I=m.getBoundingClientRect();let $=l.vertical===!0?I.top-N:I.left-_;if($<0){u.value[l.vertical===!0?"scrollTop":"scrollLeft"]+=Math.floor($),ie();return}$+=l.vertical===!0?I.height-M:I.width-y,$>0&&(u.value[l.vertical===!0?"scrollTop":"scrollLeft"]+=Math.ceil($),ie())}function ie(){const m=u.value;if(m===null)return;const _=m.getBoundingClientRect(),y=l.vertical===!0?m.scrollTop:Math.abs(m.scrollLeft);ye.value===!0?(j.value=Math.ceil(y+_.width)<m.scrollWidth-1,K.value=y>0):(j.value=y>0,K.value=l.vertical===!0?Math.ceil(y+_.height)<m.scrollHeight:Math.ceil(y+_.width)<m.scrollWidth)}function Le(m){A!==null&&clearInterval(A),A=setInterval(()=>{dt(m)===!0&&re()},5)}function Qe(){Le(Te.value===!0?Number.MAX_SAFE_INTEGER:0)}function Be(){Le(Te.value===!0?0:Number.MAX_SAFE_INTEGER)}function re(){A!==null&&(clearInterval(A),A=null)}function it(m,_){const y=Array.prototype.filter.call(u.value.children,z=>z===_||z.matches&&z.matches(".q-tab.q-focusable")===!0),N=y.length;if(N===0)return;if(m===36)return ne(y[0]),y[0].focus(),!0;if(m===35)return ne(y[N-1]),y[N-1].focus(),!0;const M=m===(l.vertical===!0?38:37),I=m===(l.vertical===!0?40:39),$=M===!0?-1:I===!0?1:void 0;if($!==void 0){const z=ye.value===!0?-1:1,ee=y.indexOf(_)+$*z;return ee>=0&&ee<N&&(ne(y[ee]),y[ee].focus({preventScroll:!0})),!0}}const ct=B(()=>Te.value===!0?{get:m=>Math.abs(m.scrollLeft),set:(m,_)=>{m.scrollLeft=-_}}:l.vertical===!0?{get:m=>m.scrollTop,set:(m,_)=>{m.scrollTop=_}}:{get:m=>m.scrollLeft,set:(m,_)=>{m.scrollLeft=_}});function dt(m){const _=u.value,{get:y,set:N}=ct.value;let M=!1,I=y(_);const $=m<I?-1:1;return I+=$*5,I<0?(M=!0,I=0):($===-1&&I<=m||$===1&&I>=m)&&(M=!0,I=m),N(_,I),ie(),M}function Ue(m,_){for(const y in m)if(m[y]!==_[y])return!1;return!0}function ut(){let m=null,_={matchedLen:0,queryDiff:9999,hrefLen:0};const y=e.filter($=>$.routeData!==void 0&&$.routeData.hasRouterLink.value===!0),{hash:N,query:M}=d.$route,I=Object.keys(M).length;for(const $ of y){const z=$.routeData.exact.value===!0;if($.routeData[z===!0?"linkIsExactActive":"linkIsActive"].value!==!0)continue;const{hash:ee,query:Se,matched:_t,href:gt}=$.routeData.resolvedLink.value,Ee=Object.keys(Se).length;if(z===!0){if(ee!==N||Ee!==I||Ue(M,Se)===!1)continue;m=$.name.value;break}if(ee!==""&&ee!==N||Ee!==0&&Ue(Se,M)===!1)continue;const se={matchedLen:_t.length,queryDiff:I-Ee,hrefLen:gt.length-ee.length};if(se.matchedLen>_.matchedLen){m=$.name.value,_=se;continue}else if(se.matchedLen!==_.matchedLen)continue;if(se.queryDiff<_.queryDiff)m=$.name.value,_=se;else if(se.queryDiff!==_.queryDiff)continue;se.hrefLen>_.hrefLen&&(m=$.name.value,_=se)}m===null&&e.some($=>$.routeData===void 0&&$.name.value===p.value)===!0||Ve({name:m,setCurrent:!0})}function mt(m){if(S(),s.value!==!0&&v.value!==null&&m.target&&typeof m.target.closest=="function"){const _=m.target.closest(".q-tab");_&&v.value.contains(_)===!0&&(s.value=!0,F.value===!0&&ne(_))}}function vt(){O(()=>{s.value=!1},30)}function $e(){ze.avoidRouteWatcher===!1?L(ut):n()}function je(){if(E===void 0){const m=qe(()=>d.$route.fullPath,$e);E=()=>{m(),E=void 0}}}function pt(m){e.push(m),i.value++,we(),m.routeData===void 0||d.$route===void 0?L(()=>{if(F.value===!0){const _=p.value,y=_!=null&&_!==""?e.find(N=>N.name.value===_):null;y&&ne(y.rootRef.value)}}):(je(),m.routeData.hasRouterLink.value===!0&&$e())}function ft(m){e.splice(e.indexOf(m),1),i.value--,we(),E!==void 0&&m.routeData!==void 0&&(e.every(_=>_.routeData===void 0)===!0&&E(),$e())}const ze={currentModel:p,tabProps:V,hasFocus:s,hasActiveTab:Q,registerTab:pt,unregisterTab:ft,verifyRouteModel:$e,updateModel:Ve,onKbdNavigate:it,avoidRouteWatcher:!1};kt(Xe,ze);function Ye(){f!==null&&clearTimeout(f),re(),E!==void 0&&E()}let Ge;return Ze(Ye),Pt(()=>{Ge=E!==void 0,Ye()}),At(()=>{Ge===!0&&je(),we()}),()=>G("div",{ref:v,class:Ie.value,role:"tablist",onFocusin:mt,onFocusout:vt},[G(zt,{onResize:Oe}),G("div",{ref:u,class:st.value,onScroll:ie},Je(h.default)),G(le,{class:"q-tabs__arrow q-tabs__arrow--left absolute q-tab__icon"+(j.value===!0?"":" q-tabs__arrow--faded"),name:l.leftIcon||c.iconSet.tabs[l.vertical===!0?"up":"left"],onMousedownPassive:Qe,onTouchstartPassive:Qe,onMouseupPassive:re,onMouseleavePassive:re,onTouchendPassive:re}),G(le,{class:"q-tabs__arrow q-tabs__arrow--right absolute q-tab__icon"+(K.value===!0?"":" q-tabs__arrow--faded"),name:l.rightIcon||c.iconSet.tabs[l.vertical===!0?"down":"right"],onMousedownPassive:Be,onTouchstartPassive:Be,onMouseupPassive:re,onMouseleavePassive:re,onTouchendPassive:re})])}}),fe=ke({name:"QTabPanel",props:Ot,setup(l,{slots:h}){return()=>G("div",{class:"q-tab-panel",role:"tabpanel"},Je(h.default))}}),rt=ke({name:"QTabPanels",props:{...Lt,...It},emits:Qt,setup(l,{slots:h}){const r=Me(),d=Tt(l,r.proxy.$q),{updatePanelsList:c,getPanelContent:k,panelDirectives:D}=Bt(),T=B(()=>"q-tab-panels q-panel-parent"+(d.value===!0?" q-tab-panels--dark q-dark":""));return()=>(c(h),Vt("div",{class:T.value},k(),"pan",l.swipeable,()=>D.value))}});const ta={class:"my-card"},aa={class:"q-pt-none"},oa={class:"row q-pt-sm"},la={class:"col-xs-12 col-md-7"},ra={class:"row"},sa=a("div",{class:"col-11 flex justify-start items-center"},[a("label",{class:"text-h6 text-weight-medium"}," >> Datos del Cliente:")],-1),na={class:"col-xs-12 col-md-6 col-sm-6"},ia={class:"col-xs-12 col-md-6 col-sm-6"},ca={class:"col-xs-12 col-md-6 col-sm-6"},da={class:"col-xs-12 col-md-6 col-sm-6"},ua={class:"col-xs-12 col-md-6 col-sm-6"},ma={class:"col-xs-12 col-md-6 col-sm-6"},va={class:"col-xs-11 col-md-5"},pa={class:"row q-col-gutter-sm q-col-gutter-y-md"},fa=a("label",{class:"text-h6 text-weight-medium"}," >> Resumen Notificaciones:",-1),_a=[fa],ga={class:"col-xs-12 col-md-6"},ba={style:{display:"flex"}},ha={style:{width:"30%"},class:"q-mr-xs q-ml-md"},ya={style:{width:"70%","text-align":"left"}},wa=a("br",null,null,-1),$a=a("div",null,"D\xEDa de pago",-1),qa={class:"col-xs-12 col-md-6"},Ca={style:{display:"flex"}},xa={style:{width:"30%"},class:"q-mr-xs q-ml-md"},ka={style:{width:"70%","text-align":"left"}},Pa=a("br",null,null,-1),Aa=a("div",null,"Crear Factura",-1),Ia={class:"col-xs-12 col-md-6"},Ta={style:{display:"flex"}},Va={style:{width:"30%"},class:"q-mr-xs q-ml-md"},Sa={style:{width:"70%","text-align":"left"}},Ea=a("br",null,null,-1),Ra=a("div",null,"D\xEDa de corte",-1),Da={class:"row justify-center q-mt-md"},Fa={__name:"ResumenPage",setup(l){const{api:h,mostrarNotify:r,formCliente:d,validaciones:c,validarDatosPersonales:k}=ge(),{dia_pago:D,dia_corte:T,dia_crear_factura:O}=be(),S=R(!1),L=async()=>{if(!k())try{S.value=!0;const{planInternet:v,created_at:u,updated_at:p,...F}=d.value,{data:j}=await h.put(`/customers/actualizarDatosPersonales/${d.value.id}`,F);d.value={...j.cliente[0]},r("positive",j.msg),S.value=!1}catch(v){S.value=!1,r("warning",v.response.data.message)}};return(n,v)=>(b(),x(Ae,{onSubmit:L},{default:o(()=>[a("div",ta,[a("div",aa,[a("div",oa,[a("div",la,[a("div",ra,[sa,a("div",{class:q(["col-xs-12 col-md-4 flex items-center",[n.$q.screen.width<1022?"justify-center q-mt-sm q-pb-xs":"justify-end"]])},[a("label",{class:q(n.$q.screen.width<1022||"q-pr-md")}," Cliente: ",2)],2),a("div",na,[t(ae,{modelValue:g(d).nombres,"onUpdate:modelValue":[v[0]||(v[0]=u=>g(d).nombres=u),v[1]||(v[1]=u=>(g(d).nombres=g(d).nombres.toUpperCase(),g(c).nombres.isValid=!0))],modelModifiers:{trim:!0},error:!g(c).nombres.isValid,"input-class":"resaltarTextoInput",dense:"",outlined:""},{error:o(()=>[a("label",{class:q(n.$q.dark.isActive?"text-red-4":"text-negative")},C(g(c).nombres.message),3)]),_:1},8,["modelValue","error"])]),a("div",{class:q(["col-xs-12 col-md-4 flex items-center",[n.$q.screen.width<1022?"justify-center q-mt-sm q-pb-xs":"justify-end"]])},[a("label",{class:q(n.$q.screen.width<1022||"q-pr-md")}," Email: ",2)],2),a("div",ia,[t(ae,{modelValue:g(d).email,"onUpdate:modelValue":v[2]||(v[2]=u=>g(d).email=u),modelModifiers:{trim:!0},error:!g(c).email.isValid,"input-class":"resaltarTextoInput",onKeyup:v[3]||(v[3]=u=>g(c).email.isValid=!0),dense:"",outlined:""},{error:o(()=>[a("label",{class:q(n.$q.dark.isActive?"text-red-4":"text-negative")},C(g(c).email.message),3)]),_:1},8,["modelValue","error"])]),a("div",{class:q(["col-xs-12 col-md-4 flex items-center",[n.$q.screen.width<1022?"justify-center q-mt-sm q-pb-xs":"justify-end"]])},[a("label",{class:q(n.$q.screen.width<1022||"q-pr-md")}," Celular: ",2)],2),a("div",ca,[t(ae,{type:n.$q.platform.is.mobile?"number":"text",modelValue:g(d).celular,"onUpdate:modelValue":v[4]||(v[4]=u=>g(d).celular=u),modelModifiers:{trim:!0},counter:"",maxlength:"10","input-class":"resaltarTextoInput",error:!g(c).celular.isValid,onKeyup:v[5]||(v[5]=u=>(g(c).celular.isValid=!0,g(d).celular=g(d).celular.replace(/\D/g,""))),dense:"",outlined:""},{error:o(()=>[a("label",{class:q(n.$q.dark.isActive?"text-red-4":"text-negative")},C(g(c).celular.message),3)]),_:1},8,["type","modelValue","error"])]),a("div",{class:q(["col-xs-12 col-md-4 flex items-center",[n.$q.screen.width<1022?"justify-center q-mt-sm q-pb-xs":"justify-end"]])},[a("label",{class:q(n.$q.screen.width<1022||"q-pr-md")}," Direcci\xF3n: ",2)],2),a("div",da,[t(ae,{modelValue:g(d).direccion,"onUpdate:modelValue":v[6]||(v[6]=u=>g(d).direccion=u),error:!g(c).direccion.isValid,"input-class":"resaltarTextoInput",onKeyup:v[7]||(v[7]=u=>g(c).direccion.isValid=!0),dense:"",outlined:""},{error:o(()=>[a("label",{class:q(n.$q.dark.isActive?"text-red-4":"text-negative")},C(g(c).direccion.message),3)]),_:1},8,["modelValue","error"])]),a("div",{class:q(["col-xs-12 col-md-4 flex items-center",[n.$q.screen.width<1022?"justify-center q-mt-sm q-pb-xs":"justify-end"]])},[a("label",{class:q(n.$q.screen.width<1022||"q-pr-md")}," Tipo de Documento: ",2)],2),a("div",ua,[t(Ne,{dense:"",modelValue:g(d).tipo_documento,"onUpdate:modelValue":[v[8]||(v[8]=u=>g(d).tipo_documento=u),v[9]||(v[9]=u=>g(c).tipo_documento.isValid=!0)],modelModifiers:{trim:!0},outlined:"",error:!g(c).tipo_documento.isValid,"emit-value":"","map-options":"",options:[{label:"RUC",value:"04"},{label:"Cedula",value:"05"},{label:"Pasaporte",value:"06"}]},{error:o(()=>[a("label",{class:q(n.$q.dark.isActive?"text-red-4":"text-negative")},C(g(c).tipo_documento.message),3)]),_:1},8,["modelValue","error"])]),a("div",{class:q(["col-xs-12 col-md-4 flex items-center",[n.$q.screen.width<1022?"justify-center q-mt-sm q-pb-xs":"justify-end"]])},[a("label",{class:q(n.$q.screen.width<1022||"q-pr-md")}," N. Identificaci\xF3n: ",2)],2),a("div",ma,[t(ae,{type:n.$q.platform.is.mobile?"number":"text",modelValue:g(d).numero_documento,"onUpdate:modelValue":v[10]||(v[10]=u=>g(d).numero_documento=u),readonly:g(d).tipo_documento==="","input-class":"resaltarTextoInput",counter:"",maxlength:g(d).tipo_documento==="04"?13:10,error:!g(c).numero_documento.isValid,onKeyup:v[11]||(v[11]=u=>(g(c).numero_documento.isValid=!0,g(d).numero_documento=g(d).numero_documento.replace(/\D/g,""))),dense:"",outlined:""},{error:o(()=>[a("label",{class:q(n.$q.dark.isActive?"text-red-4":"text-negative")},C(g(c).numero_documento.message),3)]),_:1},8,["type","modelValue","readonly","maxlength","error"])])])]),a("div",va,[a("div",pa,[a("div",{class:q(["col-11 flex justify-start items-center",[n.$q.screen.xs?"q-my-md":""]])},_a,2),a("div",ga,[a("div",null,[t(oe,{class:"text-center q-py-sm",style:{width:"100%","text-align":"center","font-size":"15px",display:"block"},color:n.$q.dark.isActive?"indigo-6":"indigo-8",filled:""},{default:o(()=>[a("div",ba,[a("div",ha,[t(le,{name:"calendar_month",style:{"font-size":"32px"}})]),a("div",ya,[a("div",null,C(g(D)),1),wa,$a])])]),_:1},8,["color"])])]),a("div",qa,[a("div",null,[t(oe,{class:"text-center q-py-sm",style:{width:"100%","text-align":"center","font-size":"15px",display:"block"},color:(n.$q.dark.isActive,"orange-9"),filled:""},{default:o(()=>[a("div",Ca,[a("div",xa,[t(le,{name:"calendar_month",style:{"font-size":"32px"}})]),a("div",ka,[a("div",null,C(g(me).formatDate(g(O),"DD/MM/YYYY"))+" 12:00 AM",1),Pa,Aa])])]),_:1},8,["color"])])]),a("div",Ia,[a("div",null,[t(oe,{class:"text-center q-py-sm",style:{width:"100%","text-align":"center","font-size":"15px",display:"block"},color:n.$q.dark.isActive?"red-7":"red-9",filled:""},{default:o(()=>[a("div",Ta,[a("div",Va,[t(le,{name:"calendar_month",style:{"font-size":"32px"}})]),a("div",Sa,[a("div",null,C(g(T)),1),Ea,Ra])])]),_:1},8,["color"])])])])])])]),a("div",Da,[a("div",{class:q(["q-pb-md",[n.$q.screen.width>600||" q-ml-lg"]])},[t(U,{type:"submit",icon:"save",loading:S.value,outline:"",rounded:"",class:"q-mr-lg",style:{color:"#696cff"}},{default:o(()=>[w(" \xA0 Guardar Cambios ")]),_:1},8,["loading"])],2)])])]),_:1}))}};const Na={class:"my-card"},Ma={class:"q-pt-none"},Oa={class:"row q-pt-sm"},La={class:"col-12"},Qa={class:"row"},Ba=a("label",{class:"text-h6 text-weight-medium"}," >> Servicios de Internet:",-1),Ua={class:"text-h6 text-weight-medium"},ja={class:"col-12 q-mt-md"},za={class:"text-h6 text-center"},Ya={__name:"ServiciosPage",setup(l){const h=[{name:"cont",label:"#",align:"center"},{name:"nombre_plan",align:"center",label:"Plan",field:"nombre_plan"},{name:"precio",label:"Costo",field:"precio",align:"center"},{name:"ipv4",label:"IP",field:"ipv4",align:"center"},{name:"router",label:"Router",field:"router",align:"center"},{name:"fecha_instalacion",label:"Instalado",field:"fecha_instalacion",align:"center"},{name:"direccion",label:"Direcci\xF3n",field:"direccion",align:"center"},{name:"estado",label:"Estado",field:"estado",align:"center"},{name:"acciones",label:"Acciones",field:"acciones",align:"center"}],{api:r,client_name:d,route:c,servicios:k,mostrarNotify:D}=be();ge();const T=R([]),O=R(!1),S=R(null);T.value=k.value;const L=async()=>{O.value=!1,S.value=null,k.value=[];const{data:v}=await r.get("/customers/find/"+c.params.client_id);v[0].planInternet.forEach(u=>{k.value.push({detalles:{...u,cliente:d.value},servicio_id:u.id,precio:u.precio,direccion:`${u.direccion==""?"- - - - -":u.direccion}`,fecha_instalacion:u.fecha_instalacion,ipv4:u.ipv4,nombre_plan:u.perfil_internet.nombre_plan,router:u.router_id.nombre,estado:`${u.isActive?"Activo":"Inactivo"}`})}),T.value=k.value},n=async(v,u)=>{tt.create({title:`<div class="text-center">
              <i class="fa-regular fa-circle-question"></i>
                ${u=="activar"?"Activar Servicio":"Suspender Servicio"}
            </div>`,message:`<div class="text-center">                  
                  \xBFEstas seguro que deseas ${u=="activar"?"activar":"suspender"} el servicio al cliente?
              </div>
              <div class="text-center">                  
                ${v.detalles.cliente}
              </div>`,html:!0,ok:{push:!0,label:`Si, ${u=="activar"?"Activar":"Suspender"}`,color:"teal-7"},cancel:{push:!0,color:"blue-grey-8",label:"Cancelar"}}).onOk(async()=>{try{const{data:p}=await r.put(`/customers/activeOrSuspendService/${v.detalles.id}`,{router:v.detalles.router_id,address_list:v.detalles.perfil_internet.address_list,ipv4:v.detalles.ipv4,estado:u});D("positive",`El cliente fue ${u=="activar"?" activado":"suspendido"}`),L()}catch(p){D("negative",p.response.data.message)}})};return(v,u)=>(b(),J(xe,null,[t(Ae,{onSubmit:u[0]||(u[0]=()=>{})},{default:o(()=>[a("div",Na,[a("div",Ma,[a("div",Oa,[a("div",La,[a("div",Qa,[a("div",{class:q(["col-12 flex items-center",v.$q.screen.xs?"justify-center":"justify-between"])},[Ba,a("label",Ua,[t(U,{outline:"",color:"primary",label:"Agregar Servicio",class:q(["q-mr-xs",!v.$q.screen.xs||"q-mt-sm"])},null,8,["class"])])],2),a("div",ja,[t(at,{rows:T.value,columns:h,class:q([v.$q.dark.isActive?"":"my-sticky-header-table3"]),"hide-pagination":!0,"rows-per-page-options":[50],"row-key":"name"},{"body-cell-cont":o(p=>[t(Y,{props:p},{default:o(()=>[w(C(p.rowIndex+1),1)]),_:2},1032,["props"])]),"body-cell-estado":o(p=>[t(Y,{props:p},{default:o(()=>[p.row.estado=="Activo"?(b(),x(oe,{key:0,outline:"",color:"positive",label:"Activo",class:"q-pa-sm"})):(b(),x(oe,{key:1,outline:"",color:"red",label:"Inactivo",class:"q-pa-sm"}))]),_:2},1032,["props"])]),"body-cell-acciones":o(p=>[t(Y,{props:p},{default:o(()=>[p.row.estado!=="Inactivo"?(b(),x(U,{key:0,round:"",color:"blue-grey",onClick:F=>(S.value={...p.row.detalles,estado:p.row.estado},O.value=!0),icon:"edit",class:"q-mr-sm",size:"10px"},null,8,["onClick"])):H("",!0),p.row.estado!=="Inactivo"?(b(),x(U,{key:1,round:"",color:"blue-grey",onClick:F=>n(p.row,"inactivar"),icon:"power_settings_new",class:"q-mr-sm",size:"10px"},{default:o(()=>[t(ue,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:o(()=>[w(" Suspender ")]),_:1})]),_:2},1032,["onClick"])):(b(),x(U,{key:2,round:"",color:"blue-grey",onClick:F=>n(p.row,"activar"),icon:"check_circle",class:"q-mr-sm",size:"10px"},{default:o(()=>[t(ue,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:o(()=>[w(" Activar ")]),_:1})]),_:2},1032,["onClick"]))]),_:2},1032,["props"])]),_:1},8,["rows","class"])])])])])])])]),_:1}),t(et,{modelValue:O.value,"onUpdate:modelValue":u[1]||(u[1]=p=>O.value=p)},{default:o(()=>[t(_e,{style:{width:"900px","max-width":"80vw"}},{default:o(()=>[t(Ce,null,{default:o(()=>[a("div",za,[w(" Editar Servicio "),te(t(U,{round:"",flat:"",dense:"",icon:"close",class:"float-right",color:"grey-8"},null,512),[[ot]])])]),_:1}),t(Pe,{class:"q-mb-md",inset:""}),t(Ce,{class:"q-pt-none"},{default:o(()=>[t(Ut,{servicio:S.value,edit:!0,onActualizarDatos:L},null,8,["servicio"])]),_:1})]),_:1})]),_:1},8,["modelValue"])],64))}},Ga={__name:"ConfiguracionPage",setup(l){return(h,r)=>(b(),x(jt,{edit:!0}))}},Ha=()=>({imprimirAbono:(r,d,c,k)=>`
    <html>
    <head>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial" />
      <style>
        th, td {
          text-align: center;
          white-space: nowrap; /* Omitir espacios en blanco */
        }
      </style>
    </head>
      <body>
        <table border="0" align="center" style="font-size: 8px; width: 230px;">
          <tbody>
            <tr>
              <td>
                <pre>    ${r.company_name}         -</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>       R.U.C.: ${r.ruc}         </pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Direccion: ${r.direccion}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Fecha: ${r.fecha_abono}          Hora: ${r.hora_abono}</pre>
              </td>
            </tr>     
            <tr>
              <td>
                <pre>Cliente: ${d.cliente}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>${d.tipo_documento=="05"?"Cedula:":"R.U.C:"}: ${d.num_doc}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Correo: ${d.email}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>----------------------------------------</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Cant.         Servicio             Total</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>----------------------------------------</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>1     Servicio de Internet        $${(parseFloat(r.monto_pendiente)+parseFloat(r.totalAbonado)).toFixed(2)}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                        IVA(12%): $00.00</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                       Descuento: $00.00</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                   Valor Abonado: $${parseFloat(r.valor).toFixed(2)}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                   Total Abonado: $${parseFloat(r.totalAbonado).toFixed(2)}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                 Valor pendiente: $${parseFloat(r.monto_pendiente).toFixed(2)}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>      Forma de Pago:</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>  ${r.forma_pago}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Atentido Por: ${c}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Gracias por su Compra</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>-</pre>
              </td>
            </tr>
        </table>
      </body>
    </html>
    `,imprimirFactura:(r,d,c,k)=>`
    <html>
    <head>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial" />
      <style>
        th, td {
          text-align: center;
          white-space: nowrap; /* Omitir espacios en blanco */
        }
      </style>
    </head>
      <body>
        <table border="0" align="center" style="font-size: 8px; width: 230px;">
          <tbody>
            <tr>
              <td>
                <pre>    ${r.company_name}         -</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>       R.U.C.: ${r.ruc}         </pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Direccion: ${r.direccion}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Ambiente: PRUEBA         Emision: NORMAL</pre>
              </td>
            </tr>   
            <tr>
              <td>
                <pre>Fecha: ${r.pagos[r.pagos.length-1].fecha_abono}          Hora: ${r.pagos[r.pagos.length-1].hora_abono}</pre>
              </td>
            </tr>     
            <tr>
              <td>
                <pre>Num. Comprobante: ${r.num_comprobante}</pre>
              </td>
            </tr>     
            <tr>
              <td>
                <pre>Clave Acceso:</pre>
              </td>
            </tr>     
            <tr>
              <td>
                <pre>${r.clave_acceso}</pre>
              </td>
            </tr>     
            <tr>
              <td>
                <pre>Cliente: ${d.cliente}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>${d.tipo_documento=="05"?"Cedula:":"R.U.C:"}: ${d.num_doc}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Correo: ${d.email}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>----------------------------------------</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Cant.         Servicio             Total</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>----------------------------------------</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>1     Servicio de Internet        $${parseFloat(r.precio).toFixed(2)}</pre>
              </td>
            </tr>
            <tr>
              <td>
              <pre>                        Subtotal: $${r.precio}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                        IVA(12%): $00.00</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>                       Descuento: $00.00</pre>
              </td>
            </tr>
            <tr>
              <td>
              <pre>                           Total: $${r.precio}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>      Forma de Pago:</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>SIN UTILIZACION DEL SISTEMA FINANCIERO</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Atentido Por: ${c}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>Gracias por su Compra</pre>
              </td>
            </tr>
            <tr>
              <td>
                <pre>-</pre>
              </td>
            </tr>
        </table>
      </body>
    </html>
    `});const ve=l=>(Rt("data-v-1319842c"),l=l(),Dt(),l),Ka={class:"text-h6 text-center"},Wa={class:"row q-pt-lg q-gutter-lg justify-center"},Za={class:"col-12"},Xa=ve(()=>a("label",null,"Forma de pago:",-1)),Ja={class:"col-12 q-mt-sm"},eo=ve(()=>a("label",null,"N\xBA transacci\xF3n:",-1)),to={key:0,class:"col-12 q-mt-sm"},ao=ve(()=>a("label",null,"Pagar Importe Total:",-1)),oo={class:"col-12 q-mt-sm"},lo={key:1,class:"col-12 q-mt-sm"},ro=ve(()=>a("label",null,"Monto Pendiente:",-1)),so={key:2,class:"col-12 q-mt-sm"},no=ve(()=>a("label",null,"Sucursal a Facturar:",-1)),io={class:"col-12 q-mt-none"},co=ve(()=>a("label",null,"Notas:",-1)),uo={class:"col-xs-9 col-sm-12 q-mt-lg q-mb-md flex justify-center"},mo={__name:"ModalPago",props:["servicio","nuevoPago"],emits:["actualizarDatos"],setup(l,{emit:h}){const r=l,d=["forma_pago","montoPendiente","montoCancelar"],{api:c,claim:k,mostrarNotify:D,route:T}=ge(),{showModalPago:O}=be(),S=R([]),L=R(!1),n=R({forma_pago:"",n_transaccion:"",importe_total:!0,sucursal_id:"",montoCancelar:"",montoPendiente:"",detalle:""}),v=R({forma_pago:{message:"",isValid:!0},montoPendiente:{message:"",isValid:!0},montoCancelar:{message:"",isValid:!0},sucursal_id:{message:"",isValid:!0}});if(r.nuevoPago)if(r.servicio.pagos.length==0)n.value.montoPendiente=r.servicio.precio,n.value.montoCancelar=r.servicio.precio;else{let P=0;r.servicio.pagos.forEach(i=>{P+=parseFloat(i.valor)});const e=parseFloat(r.servicio.precio)-P;n.value.montoPendiente=e.toString(),n.value.montoCancelar=e.toString()}else n.value={...r.servicio.pago,montoCancelar:parseFloat(r.servicio.pago.valor).toFixed(2)};const u=P=>{let e=0;e=n.value[P];const i=/^\d{0,9}(\.\d{1,2})?$/;setTimeout(function(){let s=0;if(s=n.value[P],!i.test(s.toString())){const f=parseFloat(e.toString().substring(0,e.toString().length-1));n.value[P]=f}},0)},p=()=>{let P=!1;return r.nuevoPago&&(d.forEach(e=>{(n.value[e].length==0||n.value[e]==0)&&(v.value[e].message="Debes completar este campo",v.value[e].isValid=!1,P=!0)}),(k.roles[0]=="Super-Administrador"||k.roles[0]=="Administrador")&&n.value.sucursal_id==""&&r.servicio.tipo_comprobante!="Recibo"&&parseFloat(n.value.montoCancelar)>=parseFloat(n.value.montoPendiente)&&(v.value.sucursal_id.message="Debes seleccionar una sucursal",v.value.sucursal_id.isValid=!1,P=!0)),P},F=["Efectivo Oficina/Sucursal","Dep\xF3sito Bancario","Transferencia Bancaria","Facilito","Punto Agil"],j=async()=>{if(p())return;const P=Date.now(),e=me.formatDate(P,"DD/MM/YYYY"),i=me.formatDate(P,"HH:mma"),s=parseFloat(n.value.montoPendiente)-parseFloat(n.value.montoCancelar);let f=0;r.nuevoPago&&r.servicio.pagos.forEach(Q=>{f+=parseFloat(Q.valor)});let A;if(r.nuevoPago)A=r.servicio.pagos,A.unshift({valor:n.value.montoCancelar,monto_pendiente:s.toString(),totalAbonado:(f+parseFloat(n.value.montoCancelar)).toString(),fecha_abono:e,hora_abono:i,detalle:n.value.detalle,n_transaccion:n.value.n_transaccion,forma_pago:n.value.forma_pago});else{const Q=r.servicio.pagos.pagos.findIndex(W=>r.servicio.pago.hora_abono==W.hora_abono&&r.servicio.pago.valor==W.valor);r.servicio.pagos.pagos[Q]={...n.value}}let E,V;r.nuevoPago?(E={pagos:A,estadoSRI:s<=0?"PAGADO":"PENDIENTE"},V=r.servicio.pago_id):(E={pagos:r.servicio.pagos.pagos},V=r.servicio.pagos.pago_id);try{let Q={headers:{sucursal_id:n.value.sucursal_id}};L.value=!0;const{data:W}=await c.patch(`/pagos/${V}`,E,Q);if(s<=0&&r.servicio.tipo_comprobante!="Recibo"&&r.nuevoPago){let Ie={customer_id:T.params.client_id,tipo:"EMISION",subtotal:parseFloat(r.servicio.precio),iva:parseFloat(r.servicio.iva),descuento:0,total:parseFloat(r.servicio.precio),entity:"Pagos",pago_id:r.servicio.pago_id,user_id:k.id,products:[{aplicaIva:r.servicio.iva>0,cantidad:1,pvp:r.servicio.precio,descuento:0,nombre:"SERVICIO DE INTERNET",codigoBarra:r.servicio.pago_id.split("-")[0]}]};await c.post("/CE/facturas/generarFacturaElectronica",Ie,Q)}L.value=!1,D("positive",W.msg),O.value=!1,h("actualizarDatos")}catch(Q){console.log(Q)}},K=async P=>{S.value=[];const{data:e}=await c.get(`/sucursal/find/${P}/company`);e.forEach(i=>{S.value.push({label:i.nombre,value:i.id})}),S.value.length==1&&(n.value.sucursal_id=S.value[0].value)};return(k.roles[0]=="Super-Administrador"||k.roles[0]=="Administrador")&&K(k.company.id),(P,e)=>(b(),x(_e,{style:{width:"450px !important","max-width":"fit-content"}},{default:o(()=>[t(Ce,null,{default:o(()=>[a("div",Ka,[w(C(r.nuevoPago?"Agregar Pago:":"Editar Pago")+" ",1),te(t(U,{round:"",flat:"",dense:"",icon:"close",class:"float-right",color:"grey-8"},null,512),[[ot]])])]),_:1}),t(Pe,{inset:""}),t(Ce,{class:"q-pt-none"},{default:o(()=>[t(Ae,{onSubmit:j},{default:o(()=>[a("div",Wa,[a("div",Za,[Xa,t(Ne,{color:"orange","transition-show":"scale","transition-hide":"scale","onUpdate:modelValue":[e[0]||(e[0]=i=>v.value.forma_pago.isValid=!0),e[1]||(e[1]=i=>n.value.forma_pago=i)],error:!v.value.forma_pago.isValid,outlined:"",modelValue:n.value.forma_pago,dense:"",options:F},{error:o(()=>[a("label",{class:q(P.$q.dark.isActive?"text-red-4":"text-negative")},C(v.value.forma_pago.message),3)]),_:1},8,["error","modelValue"])]),a("div",Ja,[eo,t(ae,{modelValue:n.value.n_transaccion,"onUpdate:modelValue":e[2]||(e[2]=i=>n.value.n_transaccion=i),dense:"",outlined:""},null,8,["modelValue"])]),r.nuevoPago?(b(),J("div",to,[ao,t(Et,{color:"green","onUpdate:modelValue":[e[3]||(e[3]=i=>n.value.montoCancelar=n.value.montoPendiente),e[4]||(e[4]=i=>n.value.importe_total=i)],size:"lg",modelValue:n.value.importe_total},null,8,["modelValue"])])):H("",!0),a("div",oo,[a("label",null,C(r.nuevoPago?"Monto a Cancelar:":"Monto Cancelado"),1),t(ae,{modelValue:n.value.montoCancelar,"onUpdate:modelValue":[e[5]||(e[5]=i=>n.value.montoCancelar=i),e[6]||(e[6]=i=>(u("montoCancelar"),v.value.montoCancelar.isValid=!0))],modelModifiers:{trim:!0},readonly:n.value.importe_total||!r.nuevoPago,"input-style":"padding-right: 27px;",type:"number",step:"0.01",error:!v.value.montoCancelar.isValid,"input-class":"resaltarTextoInput",dense:"",outlined:""},{error:o(()=>[a("label",{class:q(P.$q.dark.isActive?"text-red-4":"text-negative")},C(v.value.montoCancelar.message),3)]),prepend:o(()=>[t(le,{name:"attach_money"})]),_:1},8,["modelValue","readonly","error"])]),r.nuevoPago?(b(),J("div",lo,[ro,t(ae,{modelValue:n.value.montoPendiente,"onUpdate:modelValue":[e[7]||(e[7]=i=>n.value.montoPendiente=i),e[8]||(e[8]=i=>(u("montoPendiente"),v.value.montoPendiente.isValid=!0))],modelModifiers:{trim:!0},disable:"",type:"number",step:"0.01",error:!v.value.montoPendiente.isValid,"input-style":"padding-right: 27px;","input-class":"resaltarTextoInput",dense:"",outlined:""},{error:o(()=>[a("label",{class:q(P.$q.dark.isActive?"text-red-4":"text-negative")},C(v.value.montoCancelar.message),3)]),prepend:o(()=>[t(le,{name:"attach_money"})]),_:1},8,["modelValue","error"])])):H("",!0),r.servicio.tipo_comprobante!="Recibo"&&r.nuevoPago&&parseFloat(n.value.montoCancelar)>=parseFloat(n.value.montoPendiente)?(b(),J("div",so,[no,S.value.length>1?(b(),x(Ne,{key:0,modelValue:n.value.sucursal_id,"onUpdate:modelValue":[e[9]||(e[9]=i=>n.value.sucursal_id=i),e[10]||(e[10]=i=>v.value.sucursal_id.isValid=!0)],error:!v.value.sucursal_id.isValid,outlined:"",options:S.value,"emit-value":"","map-options":"",dense:""},{error:o(()=>[a("label",{class:q(P.$q.dark.isActive?"text-red-4":"text-negative")},C(v.value.sucursal_id.message),3)]),"no-option":o(()=>[t(de,null,{default:o(()=>[t(X,{class:"text-grey"},{default:o(()=>[w(" No se encontro sucursal ")]),_:1})]),_:1})]),_:1},8,["modelValue","error","options"])):H("",!0)])):H("",!0),a("div",io,[co,t(ae,{modelValue:n.value.detalle,"onUpdate:modelValue":e[11]||(e[11]=i=>n.value.detalle=i),modelModifiers:{trim:!0},outlined:"",rows:"2",type:"textarea"},null,8,["modelValue"])]),a("div",uo,[t(U,{type:"submit",icon:"save",loading:L.value,outline:"",rounded:"",class:"q-mr-lg",style:{color:"#696cff"}},{default:o(()=>[w(" \xA0 Guardar ")]),_:1},8,["loading"])])])]),_:1})]),_:1})]),_:1}))}};var vo=St(mo,[["__scopeId","data-v-1319842c"]]);const po={class:"my-card"},fo={class:"q-pt-none"},_o={class:"row q-pt-sm"},go={class:"col-12"},bo={class:"row"},ho={class:"col-12 q-mt-md"},yo=a("br",null,null,-1),wo=a("br",null,null,-1),$o=a("br",null,null,-1),qo=a("br",null,null,-1),Co={class:"row q-col-gutter-sm"},xo=a("div",{class:"full-width row flex-center text-lime-10 q-gutter-sm"},[a("span",{class:"text-subtitle1"}," No se encontr\xF3 ningun registros ")],-1),ko={__name:"IndexFacturas",setup(l){const h=R([{name:"x",align:"center",label:" ",field:"x"},{name:"n_comprobantes",align:"center",label:"N. Comprobante",field:"n_comprobantes"},{name:"emitido",label:"Emitido",field:"emitido",align:"center"},{name:"vencimiento",label:"Vencimiento",field:"vencimiento",align:"center"},{name:"precio",label:"Total",field:"precio",align:"center"},{name:"iva",label:"Impuesto",field:"iva",align:"center"},{name:"pagado",label:"Pagado",field:"pagado",align:"center"},{name:"estado",label:"Estado",field:"estado",align:"center"},{name:"acciones",label:"Acciones",field:"acciones",align:"center"}]),r=R(!0),d=R({}),{api:c,servicios:k,pagos:D,showModalPago:T,dia_vencimiento:O}=be(),{claim:S,route:L}=ge();let n;const v=()=>{const e=new Ht("http://205.235.6.108:3000/socket.io/socket.io.js",{extraHeaders:{autentication:S.id}});n==null||n.removeAllListeners(),n=e.socket("/"),n.on("updateStateInvoice",()=>{D.value=[],p()})},u=async()=>{const{data:e}=await c.get("/customers/find/"+L.params.client_id);return e},p=async()=>{try{D.value=[];const{data:e}=await c.get("/pagos/find/"+k.value[0].servicio_id);e.length>0&&e[0].servicio.factura_id.tipo_comprobante=="Recibo"&&(h.value[1].label="Tipo Comprobante"),e.forEach(i=>{var E;let s;i.servicio.factura_id.tipo_impuesto=="Impuestos incluido"?s=`${Math.floor(parseFloat(i.servicio.precio)*.12*100)/100}`:s=0;let f=0;i.pagos.forEach(V=>{f+=parseFloat(V.valor)});const A=(E=i.estadoSRI)==null?void 0:E.trim();D.value.push({ambiente:i.sucursal_id?i.sucursal_id.ambiente:"",clave_acceso:i.clave_acceso,company_name:i.servicio.router_id.company_id.nombre_comercial,num_comprobante:i.num_comprobante,sucursal_id:i.sucursal_id!==null?i.sucursal_id.id:null,pago_id:i.id,ruc:i.servicio.perfil_internet.router_id.company_id.ruc,direccion:i.sucursal_id!==null?i.sucursal_id.direccion:null,emitido:me.formatDate(i.created_at,"DD/MM/YYYY"),vencimiento:me.formatDate(O.value,"DD/MM/YYYY"),precio:`${i.servicio.precio}`,tipo_comprobante:i.servicio.factura_id.tipo_comprobante,iva:s,pagos:i.pagos,pagado:f,estado:A,cancelado:f>=parseFloat(i.servicio.precio),expand:!1,loading:!1})})}catch(e){console.log(e)}},F=async(e,i)=>{D.value[i].loading=!0;let s={headers:{sucursal_id:e.sucursal_id}},f={ambiente:e.ambiente,clave_acceso:e.clave_acceso,company_name:e.company_name,sucursal_id:e.sucursal_id,customer_id:L.params.client_id,num_comprobante:e.num_comprobante,tipo:"EMISION",subtotal:parseFloat(e.precio),iva:parseFloat(e.iva),descuento:0,total:parseFloat(e.precio),entity:"Pagos",pago_id:e.pago_id,user_id:S.id,products:[{aplicaIva:e.iva>0,cantidad:1,pvp:e.precio,descuento:0,nombre:"SERVICIO DE INTERNET",codigoBarra:e.pago_id.split("-")[0]}]};e.estado.trim()=="ERROR ENVIO RECEPCION"&&await c.post("/CE/facturas/recepcionComprobantesOffline",f,s),e.estado.trim()=="RECIBIDA"&&await c.post("/CE/facturas/autorizacionComprobantesOffline",f,s),D.value[i].loading=!1},j=async(e,i,s=null)=>{s&&(e.company_name=s.company_name,e.ruc=s.ruc,e.direccion=s.direccion);const f=await u(),A={cliente:f[0].nombres,tipoDoc:f[0].tipo_documento,num_doc:f[0].numero_documento,email:f[0].email},{imprimirAbono:E,imprimirFactura:V}=Ha();let Q="";i=="Recibo"?Q=E(e,A,S.fullName,i):Q=V(e,A,S.fullName,i);var W=window.open("","_blank");W.document.write(Q),W.print(),W.close()},K=(e,i,s,f)=>{tt.create({title:"\xBFEstas seguro de eliminar este abono?",message:`<span style="display: block;width: 100%;display: flex;align-items: center;">
                  <strong style="display: inline-block;width: 40%;text-align: end;">
                    Fecha abonado:
                  </strong> 
                  <label style="display: inline-block;width: 57%;" class="q-ml-xs">
                    ${e.fecha_abono} ${e.hora_abono}
                  </label>
                </span>
                <span style="display: block;width: 100%;display: flex;align-items: center;">
                  <strong style="display: inline-block;width: 40%;text-align: end;">
                    Forma de pago:
                  </strong> 
                  <label style="display: inline-block;width: 57%;" class="q-ml-xs">
                    ${e.forma_pago} 
                  </label>
                </span>
                <span style="display: block;width: 100%;display: flex;align-items: center;">
                  <strong style="display: inline-block;width: 40%;text-align: end;">
                    Valor Abonado:
                  </strong> 
                  <label style="display: inline-block;width: 57%;" class="q-ml-xs">
                    $${parseFloat(e.valor).toFixed(2)}
                  </label>                
                </span>`,html:!0,ok:{push:!0,label:"Eliminar",color:"teal-7"},cancel:{push:!0,color:"blue-grey-8",label:"Cancelar"}}).onOk(async()=>{try{const A=[...i];let E=0;A.reverse().map((V,Q)=>{e.hora_abono==V.hora_abono&&e.valor==V.valor?V.delete=!0:(V.totalAbonado=(parseFloat(V.valor)+E).toString(),V.monto_pendiente=(parseFloat(s)-parseFloat(V.totalAbonado)).toString(),E+=parseFloat(V.totalAbonado))}),setTimeout(async()=>{const V=A.filter(Q=>Q.delete!==!0);await c.patch(`/pagos/${f}`,{pagos:V}),p()},1e3)}catch(A){mostrarNotify("negative",A.response.data.message)}})},P=async e=>{await c.post(`/CE/facturas/getRide/${e}`,{},{responseType:"blob"}).then(i=>{var s=new Blob([i.data],{type:"application/pdf"}),f=URL.createObjectURL(s);window.open(f)}).catch(i=>{i.response.status==422&&this.$setLaravelErrors(i.response.data.errors)})};return p(),v(),(e,i)=>(b(),J(xe,null,[t(Ae,{onSubmit:i[0]||(i[0]=()=>{})},{default:o(()=>[a("div",po,[a("div",fo,[a("div",_o,[a("div",go,[a("div",bo,[a("div",ho,[t(at,{rows:g(D),columns:h.value,class:q([e.$q.dark.isActive?"":"my-sticky-header-table3"]),"hide-pagination":!0,"rows-per-page-options":[50],"row-key":"name"},{body:o(s=>[t(We,{props:s},{default:o(()=>[s.row.estado!="NO PAGADO"?(b(),x(Y,{key:0,"auto-width":""},{default:o(()=>[t(U,{size:"sm",color:"accent",round:"",dense:"",onClick:f=>s.row.expand=!s.row.expand,icon:s.row.expand?"remove":"add"},null,8,["onClick","icon"])]),_:2},1024)):(b(),x(Y,{key:1,"auto-width":""})),t(Y,{key:"n_comprobantes",props:s},{default:o(()=>[w(C(s.row.tipo_comprobante=="Recibo"?"Recibo":s.row.num_comprobante==""||s.row.num_comprobante==null?"- - - - - -":s.row.num_comprobante),1)]),_:2},1032,["props"]),t(Y,{key:"emitido",props:s},{default:o(()=>[w(C(s.row.emitido),1)]),_:2},1032,["props"]),t(Y,{key:"vencimiento",props:s},{default:o(()=>[w(C(s.row.vencimiento),1)]),_:2},1032,["props"]),t(Y,{key:"precio",props:s},{default:o(()=>[w(" $"+C(s.row.precio),1)]),_:2},1032,["props"]),t(Y,{key:"iva",props:s},{default:o(()=>[w(" $"+C(s.row.iva),1)]),_:2},1032,["props"]),t(Y,{key:"pagado",props:s},{default:o(()=>[w(" $"+C(s.row.pagado),1)]),_:2},1032,["props"]),t(Y,{key:"estado",props:s},{default:o(()=>[s.row.estado=="AUTORIZADO"?(b(),x(oe,{key:0,outline:"",class:"q-py-xs q-px-md",color:"secondary"},{default:o(()=>[w(" PAGADO "),yo,w(" Y "),wo,w(" AUTORIZADO ")]),_:1})):s.row.estado=="NO PAGADO"||s.row.estado=="PENDIENTE"?(b(),x(oe,{key:1,outline:"",class:"q-py-xs q-px-md",color:e.$q.dark.isActive?"blue-grey-3":"blue-grey-7",label:s.row.estado},null,8,["color","label"])):s.row.estado=="PAGADO"?(b(),x(oe,{key:2,outline:"",class:"q-py-xs q-px-md",color:"secondary",label:s.row.estado},null,8,["label"])):(b(),x(oe,{key:3,outline:"",class:"q-py-xs q-px-md",color:e.$q.dark.isActive?"warning":"orange-10"},{default:o(()=>[w(" PAGADO "),$o,w(" - "),qo,w(" "+C(s.row.estado),1)]),_:2},1032,["color"]))]),_:2},1032,["props"]),t(Y,{key:"acciones",props:s},{default:o(()=>[s.row.cancelado?H("",!0):(b(),x(U,{key:0,round:"",color:"blue-grey",onClick:f=>(T.value=!0,d.value=s.row),icon:"done",size:"10px",class:"q-mr-sm"},{default:o(()=>[t(ue,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:o(()=>[w(" Agregar Pago ")]),_:1})]),_:2},1032,["onClick"])),s.row.estado=="ERROR ENVIO RECEPCION"||s.row.estado=="ERROR ENVIO RECEPCION - ANULACION"||s.row.estado=="RECIBIDA"?(b(),x(U,{key:1,round:"",color:"blue-grey",icon:"fa-solid fa-retweet",loading:s.row.loading,onClick:f=>F(s.row,s.rowIndex),size:"10px",class:"q-mr-sm"},{default:o(()=>[t(ue,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:o(()=>[w(" Emitir Factura Electr\xF3nica ")]),_:1})]),_:2},1032,["loading","onClick"])):H("",!0),s.row.estado=="AUTORIZADO"?(b(),x(U,{key:2,round:"",color:"blue-grey",icon:"print",onClick:f=>j(s.row,"factura"),size:"10px",class:"q-mr-sm"},{default:o(()=>[t(ue,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:o(()=>[w(" Imprimir comprobante ")]),_:1})]),_:2},1032,["onClick"])):H("",!0),s.row.estado=="AUTORIZADO"?(b(),x(U,{key:3,round:"",color:"blue-grey",icon:"fa-solid fa-file-pdf",onClick:f=>P(s.row.clave_acceso),size:"10px",class:"q-mr-sm"},{default:o(()=>[t(ue,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:o(()=>[w(" Descargar PDF ")]),_:1})]),_:2},1032,["onClick"])):H("",!0)]),_:2},1032,["props"])]),_:2},1032,["props"]),te(t(We,{props:s},{default:o(()=>[t(Y,{colspan:"100%"},{default:o(()=>[a("div",Co,[(b(!0),J(xe,null,Ft(s.row.pagos,(f,A)=>(b(),J("div",{key:A,class:"col-4"},[t(Gt,{bordered:"",padding:"",dense:""},{default:o(()=>[t(Z,{header:"",class:"text-center"},{default:o(()=>[w(" Fecha Abonado: "+C(f.fecha_abono)+" "+C(f.hora_abono),1)]),_:2},1024),te((b(),x(de,{tag:"label"},{default:o(()=>[t(X,null,{default:o(()=>[t(Z,null,{default:o(()=>[w("Forma de Pago:")]),_:1})]),_:1}),t(X,{side:"",top:"",class:"justify-center"},{default:o(()=>[t(Z,null,{default:o(()=>[w(C(f.forma_pago),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)),[[ce]]),te((b(),x(de,{tag:"label",class:""},{default:o(()=>[t(X,null,{default:o(()=>[t(Z,null,{default:o(()=>[w("Valor Abonado:")]),_:1})]),_:1}),t(X,{side:"",top:"",class:"justify-center"},{default:o(()=>[t(Z,null,{default:o(()=>[w("$"+C(f.valor),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)),[[ce]]),te((b(),x(de,{tag:"label"},{default:o(()=>[t(X,null,{default:o(()=>[t(Z,null,{default:o(()=>[w("N\xBA transacci\xF3n:")]),_:1})]),_:1}),t(X,{side:"",top:"",class:"justify-center"},{default:o(()=>[t(Z,null,{default:o(()=>[w(C(f.n_transaccion),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)),[[ce]]),te((b(),x(de,{tag:"label"},{default:o(()=>[t(X,null,{default:o(()=>[t(Z,null,{default:o(()=>[w("Detalle:")]),_:1})]),_:1}),t(X,{side:"",top:"",class:"justify-center"},{default:o(()=>[t(Z,null,{default:o(()=>[w(C(f.detalle==""?"Sin detalles":f.detalle),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)),[[ce]]),te((b(),x(de,{tag:"label"},{default:o(()=>[t(X,null,{default:o(()=>[t(Z,{class:"text-center"},{default:o(()=>[s.row.estado=="PENDIENTE"?(b(),x(U,{key:0,square:"",onClick:E=>(T.value=!0,d.value={pagos:s.row,pago:f},r.value=!1),color:e.$q.dark.isActive?"blue-grey-2":"blue-grey-7",class:"q-px-md q-mr-md",outline:"",rounded:"",dense:"","icon-right":"edit"},null,8,["onClick","color"])):H("",!0),t(U,{square:"",onClick:E=>j(f,"Recibo",s.row),color:e.$q.dark.isActive?"blue-grey-2":"blue-grey-7",class:"q-px-md",outline:"",rounded:"",dense:"","icon-right":"print"},null,8,["onClick","color"]),s.row.estado=="PENDIENTE"?(b(),x(U,{key:1,square:"",onClick:E=>K(f,s.row.pagos,s.row.precio,s.row.pago_id),color:e.$q.dark.isActive?"blue-grey-2":"blue-grey-7",class:"q-px-md q-ml-md",outline:"",rounded:"",dense:"","icon-right":"delete"},null,8,["onClick","color"])):H("",!0)]),_:2},1024)]),_:2},1024)]),_:2},1024)),[[ce]])]),_:2},1024)]))),128))])]),_:2},1024)]),_:2},1032,["props"]),[[Nt,s.row.expand]])]),"no-data":o(({icon:s})=>[xo]),_:1},8,["rows","columns","class"])])])])])])])]),_:1}),t(et,{modelValue:g(T),"onUpdate:modelValue":i[1]||(i[1]=s=>Mt(T)?T.value=s:null)},{default:o(()=>[t(vo,{servicio:d.value,nuevoPago:r.value,onActualizarDatos:p},null,8,["servicio","nuevoPago"])]),_:1},8,["modelValue"])],64))}},Po={class:"q-gutter-y-md"},Ao={__name:"FacturacionPagos",setup(l){const h=R("facturas");return(r,d)=>(b(),J("div",Po,[t(_e,null,{default:o(()=>[t(lt,{modelValue:h.value,"onUpdate:modelValue":d[0]||(d[0]=c=>h.value=c),draggable:"false",dense:"",class:"text-grey","active-color":"primary","indicator-color":"primary",align:"left","narrow-indicator":""},{default:o(()=>[t(pe,{name:"facturas",label:"Facturas"}),t(pe,{name:"configuracion",label:"Configuraci\xF3n"})]),_:1},8,["modelValue"]),t(Pe),t(rt,{modelValue:h.value,"onUpdate:modelValue":d[1]||(d[1]=c=>h.value=c),animated:""},{default:o(()=>[t(fe,{name:"facturas"},{default:o(()=>[t(ko)]),_:1}),t(fe,{name:"configuracion"},{default:o(()=>[t(Ga)]),_:1})]),_:1},8,["modelValue"])]),_:1})]))}};const Io={class:"q-gutter-y-md"},To={__name:"IndexPage",setup(l){const h=R("resumen");return(r,d)=>(b(),J("div",Io,[t(_e,null,{default:o(()=>[t(lt,{modelValue:h.value,"onUpdate:modelValue":d[0]||(d[0]=c=>h.value=c),draggable:"false",dense:"",class:"text-grey","active-color":"primary","indicator-color":"primary",align:"justify","narrow-indicator":""},{default:o(()=>[t(pe,{name:"resumen",label:"Resumen"}),t(pe,{name:"servicios",label:"Servicios"}),t(pe,{name:"facturacion/pagos",label:"Facturaci\xF3n/Pagos"})]),_:1},8,["modelValue"]),t(Pe),t(rt,{modelValue:h.value,"onUpdate:modelValue":d[1]||(d[1]=c=>h.value=c),animated:""},{default:o(()=>[t(fe,{name:"resumen"},{default:o(()=>[t(Fa)]),_:1}),t(fe,{name:"servicios"},{default:o(()=>[h.value=="servicios"?(b(),x(Ya,{key:0})):H("",!0)]),_:1}),t(fe,{name:"facturacion/pagos"},{default:o(()=>[h.value=="facturacion/pagos"?(b(),x(Ao,{key:0})):H("",!0)]),_:1})]),_:1},8,["modelValue"])]),_:1})]))}},Vo={class:"q-ma-lg q-pt-md"},So={class:"row q-col-gutter-md",style:{"justify-content":"center"}},Eo={class:"text-h6 text-center",style:{position:"relative",top:"-8px",left:"17px"}},Ro={class:"row q-col-gutter-md",style:{"justify-content":"center"}},Do={class:"col-xs-11 col-md-11 q-pt-xs"},nl={__name:"EditCliente",setup(l){const{api:h,route:r,formCliente:d,formFacturacion:c}=ge(),{client_name:k,dia_vencimiento:D,mes_pago:T,servicios:O,dia_pago:S,dia_corte:L}=be(),n=async()=>{const{data:u}=await h.get("/pagos/find/"+O.value[0].servicio_id);u.length>0&&(T.value.dia_pago=u[0].dia_pago,u[0].estadoSRI!=="PAGADO"&&u[0].estadoSRI!=="AUTORIZADO"?T.value.estado="pendiente":T.value.estado="pagado"),T.value.meses_vencidos=u.reduce((p,F)=>p+(F.estadoSRI=="NO PAGADO"||F.estadoSRI=="PENDIENTE"),0),u.forEach((p,F)=>{let j=parseInt(p.servicio.factura_id.dia_gracia.split(" ")[0]);D.value=me.addToDate(p.dia_pago,{days:j+1}),F==0&&(T.value.dia_vencimiento=D.value)})};return(async()=>{O.value=[];const{data:u}=await h.get("/customers/find/"+r.params.client_id);k.value=u[0].nombres,d.value={...u[0]},u[0].planInternet.forEach(p=>{c.value={...p.factura_id},O.value.push({detalles:{...p,cliente:k.value},servicio_id:p.id,precio:p.precio,direccion:`${p.direccion==""?"- - - - -":p.direccion}`,fecha_instalacion:p.fecha_instalacion,ipv4:p.ipv4,nombre_plan:p.perfil_internet.nombre_plan,router:p.router_id.nombre,estado:`${p.isActive?"Activo":"Inactivo"}`})}),n()})(),(u,p)=>(b(),J(xe,null,[a("div",Vo,[a("div",So,[a("div",{class:q(["col-xs-12 q-pl-none",[u.$q.screen.width<1022?"q-pt-sm col-md-6":"col-md-6"]])},[t(bt,{class:q(["row q-mr-xs",[u.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:o(()=>[t(Re,{label:"Inicio",icon:"home",to:"/"}),t(Re,{label:"Clientes",icon:"fa-solid fa-list",to:"/clientes"}),t(Re,{label:"Nuevo",icon:"add_circle"})]),_:1},8,["class"])],2),a("div",{class:q(["col-xs-12",[u.$q.screen.width<1022?"text-center q-pt-sm col-md-6 q-pl-none":"text-right col-md-5"]])},[a("label",Eo,C(g(k)),1)],2)])]),a("div",Ro,[a("div",Do,[t(_e,{flat:"",class:"shadow_custom q-pt-none"},{default:o(()=>[t(To,{edit:!0})]),_:1})])])],64))}};export{nl as default};
