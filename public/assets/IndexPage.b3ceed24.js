import{m as Y,r as b,n as Z,bk as ee,_ as ae,b5 as le,p as j,z as te,h as V,o as w,a9 as $,g as l,f as a,aV as q,e as n,aa as S,O as T,ah as B,Q as M,ad as I,aU as D,c as A,ba as G,aj as L,ai as oe,af as se,ab as O,bL as E}from"./index.a62a3008.js";import{c as ne,m as W,Q as C,d as F,a as P}from"./format.790b9b88.js";import{Q as R}from"./QList.884235e9.js";import{Q as J}from"./QForm.bf2ca002.js";import{C as X}from"./ClosePopup.a66e8458.js";import{u as z}from"./useHelpers.96580f8c.js";import{a as ue}from"./use-quasar.83346572.js";import"./axios.478b8a0e.js";function U(e,d=new WeakMap){if(Object(e)!==e)return e;if(d.has(e))return d.get(e);const o=e instanceof Date?new Date(e):e instanceof RegExp?new RegExp(e.source,e.flags):e instanceof Set?new Set:e instanceof Map?new Map:typeof e.constructor!="function"?Object.create(null):e.prototype!==void 0&&typeof e.prototype.constructor=="function"?e:new e.constructor;if(typeof e.constructor=="function"&&typeof e.valueOf=="function"){const r=e.valueOf();if(Object(r)!==r){const g=new e.constructor(r);return d.set(e,g),g}}return d.set(e,o),e instanceof Set?e.forEach(r=>{o.add(U(r,d))}):e instanceof Map&&e.forEach((r,g)=>{o.set(g,U(r,d))}),Object.assign(o,...Object.keys(e).map(r=>({[r]:U(e[r],d)})))}var H=Y({name:"QPopupEdit",props:{modelValue:{required:!0},title:String,buttons:Boolean,labelSet:String,labelCancel:String,color:{type:String,default:"primary"},validate:{type:Function,default:()=>!0},autoSave:Boolean,cover:{type:Boolean,default:!0},disable:Boolean},emits:["update:modelValue","save","cancel","beforeShow","show","beforeHide","hide"],setup(e,{slots:d,emit:o}){const{proxy:r}=te(),{$q:g}=r,t=b(null),c=b(""),i=b("");let y=!1;const h=Z(()=>ee({initialValue:c.value,validate:e.validate,set:v,cancel:s,updatePosition:m},"value",()=>i.value,u=>{i.value=u}));function v(){e.validate(i.value)!==!1&&(Q()===!0&&(o("save",i.value,c.value),o("update:modelValue",i.value)),N())}function s(){Q()===!0&&o("cancel",i.value,c.value),N()}function m(){ae(()=>{t.value.updatePosition()})}function Q(){return le(i.value,c.value)===!1}function N(){y=!0,t.value.hide()}function x(){y=!1,c.value=U(e.modelValue),i.value=U(e.modelValue),o("beforeShow")}function p(){o("show")}function f(){y===!1&&Q()===!0&&(e.autoSave===!0&&e.validate(i.value)===!0?(o("save",i.value,c.value),o("update:modelValue",i.value)):o("cancel",i.value,c.value)),o("beforeHide")}function _(){o("hide")}function k(){const u=d.default!==void 0?[].concat(d.default(h.value)):[];return e.title&&u.unshift(j("div",{class:"q-dialog__title q-mt-sm q-mb-sm"},e.title)),e.buttons===!0&&u.push(j("div",{class:"q-popup-edit__buttons row justify-center no-wrap"},[j(V,{flat:!0,color:e.color,label:e.labelCancel||g.lang.label.cancel,onClick:s}),j(V,{flat:!0,color:e.color,label:e.labelSet||g.lang.label.set,onClick:v})])),u}return Object.assign(r,{set:v,cancel:s,show(u){t.value!==null&&t.value.show(u)},hide(u){t.value!==null&&t.value.hide(u)},updatePosition:m}),()=>{if(e.disable!==!0)return j(ne,{ref:t,class:"q-popup-edit",cover:e.cover,onBeforeShow:x,onShow:p,onBeforeHide:f,onHide:_,onEscapeKey:s},k)}}});const re={class:"text-h6 text-center"},ce={class:"row q-pt-lg q-gutter-lg justify-center"},ie={class:"col-xs-12"},de=n("label",{class:"text-center"},"Nombre:",-1),pe={class:"col-xs-12"},fe=n("label",{class:"text-center"},"Descripcion:",-1),me={class:"col-xs-9 col-sm-12 q-mt-lg q-mb-md flex justify-center"},ve={__name:"ModalProforma",props:["clausulas","aceptacion"],emits:["hideModal"],setup(e,{emit:d}){const o=e,{capitalize:r}=W,g=b(!1),t=b({nombre:"",descripcion:""}),{api:c,claim:i,mostrarNotify:y}=z(),h=async()=>{try{o.clausulas.unshift({...t.value});let v={"company-id":i.company.id};await c.post("/proforma/clausula",{clausulas:o.clausulas,aceptacion_proforma:o.aceptacion},{headers:v}),y("positive","Clausula agregada exitosamente"),d("hideModal")}catch(v){console.log(v),y("warning","No se pudo agregar la clausula")}};return(v,s)=>(w(),$(D,{style:{width:"500px !important","max-width":"80vw"}},{default:l(()=>[a(q,null,{default:l(()=>[n("div",re,[S(" Nueva Clausula "),T(a(V,{round:"",flat:"",dense:"",icon:"close",class:"float-right",color:"grey-8"},null,512),[[X]])])]),_:1}),a(B,{inset:""}),a(q,{class:"q-pt-none"},{default:l(()=>[a(J,{onSubmit:h},{default:l(()=>[n("div",ce,[n("div",ie,[de,a(M,{modelValue:t.value.nombre,"onUpdate:modelValue":s[0]||(s[0]=m=>t.value.nombre=m),modelModifiers:{trim:!0},onKeyup:s[1]||(s[1]=m=>t.value.nombre=I(r)(t.value.nombre)),dense:"",filled:"",required:""},null,8,["modelValue"])]),n("div",pe,[fe,a(M,{type:"textarea",rows:"3",onKeyup:s[2]||(s[2]=m=>t.value.descripcion=I(r)(t.value.descripcion)),modelValue:t.value.descripcion,"onUpdate:modelValue":s[3]||(s[3]=m=>t.value.descripcion=m),modelModifiers:{trim:!0},dense:"",filled:"",required:""},null,8,["modelValue"])]),n("div",me,[a(V,{label:"Guardar",loading:g.value,outline:"",rounded:"",class:"q-px-xl",type:"submit",style:{color:"#696cff"}},null,8,["loading"])])])]),_:1})]),_:1})]),_:1}))}},_e={class:"text-h6 text-center"},ge={class:"row q-pt-lg q-gutter-lg justify-center"},ye={class:"col-xs-12"},be=n("label",{class:"text-center"},"Detalle:",-1),xe={class:"col-xs-9 col-sm-12 q-mt-lg q-mb-md flex justify-center"},he={__name:"ModalAceptacionPropuesta",props:["clausulas","aceptacion","proforma_id"],emits:["hideModal"],setup(e,{emit:d}){const o=e,{capitalize:r}=W,g=b(!1),t=b(""),{api:c,claim:i,mostrarNotify:y}=z(),h=async()=>{try{let v={"company-id":i.company.id};await c.post("/proforma/clausula",{clausulas:o.clausulas,aceptacion_proforma:t.value},{headers:v}),y("positive","Clausula agregada exitosamente"),d("hideModal")}catch{y("warning","No se pudo agregar la clausula")}};return(v,s)=>(w(),$(D,{style:{width:"500px !important","max-width":"80vw"}},{default:l(()=>[a(q,null,{default:l(()=>[n("div",_e,[S(" Aceptaci\xF3n de la propuesta "),T(a(V,{round:"",flat:"",dense:"",icon:"close",class:"float-right",color:"grey-8"},null,512),[[X]])])]),_:1}),a(B,{inset:""}),a(q,{class:"q-pt-none"},{default:l(()=>[a(J,{onSubmit:h},{default:l(()=>[n("div",ge,[n("div",ye,[be,a(M,{type:"textarea",rows:"4",modelValue:t.value,"onUpdate:modelValue":s[0]||(s[0]=m=>t.value=m),modelModifiers:{trim:!0},onKeyup:s[1]||(s[1]=m=>t.value=I(r)(t.value)),dense:"",filled:"",required:""},null,8,["modelValue"])]),n("div",xe,[a(V,{label:"Guardar",loading:g.value,outline:"",rounded:"",class:"q-px-xl",type:"submit",style:{color:"#696cff"}},null,8,["loading"])])])]),_:1})]),_:1})]),_:1}))}},Ve={class:"q-ma-lg q-pt-md"},we={class:"row q-col-gutter-lg"},qe={class:"col-xs-12 col-sm-7"},Ce=n("div",{class:"text-h6 q-pt-sm"},"Clausulas de la propuesta",-1),$e={class:"text-weight-medium text-left"},Se={class:"text-weight-medium text-justify"},ke={class:"text-grey-8 q-gutter-xs"},Me={class:"col-xs-12 col-sm-5"},Qe=n("div",{class:"text-h6 q-pt-sm"},"Aceptaci\xF3n de la propuesta",-1),je={class:"text-weight-medium text-justify",id:"text-aceptacion"},Ue={class:"text-grey-8 q-gutter-xs"},Ie={__name:"IndexPage",setup(e){const{api:d,claim:o,mostrarNotify:r,showLoading:g}=z(),t=b([]),c=b(""),i=b("");b(!1);const y=b(!1),h=b(!1),v=ue(),s=async()=>{g(!0);const{data:x}=await d.get(`/proforma/${o.company.id}`);i.value=x.id,t.value=x.clausulas?x.clausulas:[],c.value=x.aceptacion_proforma?x.aceptacion_proforma:"",g(!1)},m=async()=>{setTimeout(async()=>{await d.patch(`/proforma/${i.value}`,{clausulas:t.value,aceptacion_proforma:c.value})},1e3)},Q=x=>{v.dialog({title:"Confirmar",message:"Deseas quitar esta clausula?",ok:{push:!0,label:"Quitar",color:"teal-7"},cancel:{push:!0,color:"blue-grey-8",label:"Cancelar"}}).onOk(async()=>{try{t.value.splice(x,1),m()}catch(p){r("negative",p.response.data.message)}})},N=()=>{v.dialog({title:"Confirmar",message:"Deseas quitar esta aceptaci\xF3n?",ok:{push:!0,label:"Quitar",color:"teal-7"},cancel:{push:!0,color:"blue-grey-8",label:"Cancelar"}}).onOk(async()=>{try{await d.patch(`/proforma/${i.value}`,{clausulas:t.value,aceptacion_proforma:""}),s()}catch(x){r("negative",x.response.data.message)}})};return s(),(x,p)=>(w(),A(L,null,[n("div",Ve,[n("div",we,[n("div",qe,[a(D,{class:"my-card"},{default:l(()=>[a(q,{class:"text-white flex justify-between q-pt-sm q-pb-sm"},{default:l(()=>[Ce,a(V,{onClick:p[0]||(p[0]=f=>y.value=!0),round:"",color:"primary",icon:"add"})]),_:1}),a(B),a(q,{class:"q-pa-none"},{default:l(()=>[a(R,{bordered:"",class:"rounded-borders q-pt-sm"},{default:l(()=>{var f;return[((f=t.value)==null?void 0:f.length)>0?(w(!0),A(L,{key:0},oe(t.value,(_,k)=>(w(),$(P,{key:k},{default:l(()=>[a(C,{top:"",class:"col-2 gt-sm flex flex-center"},{default:l(()=>[n("span",$e,[S(O(_.nombre)+" ",1),a(H,{modelValue:_.nombre,"onUpdate:modelValue":u=>_.nombre=u,buttons:"",onSave:m,"label-set":"Guardar","label-cancel":"Cancelar","auto-save":""},{default:l(u=>[a(M,{modelValue:u.value,"onUpdate:modelValue":K=>u.value=K,dense:"",autofocus:"",counter:"",onKeyup:E(u.set,["enter"])},null,8,["modelValue","onUpdate:modelValue","onKeyup"])]),_:2},1032,["modelValue","onUpdate:modelValue"])])]),_:2},1024),a(C,{top:""},{default:l(()=>[n("span",Se,[S(O(_.descripcion)+" ",1),a(H,{modelValue:_.descripcion,"onUpdate:modelValue":u=>_.descripcion=u,buttons:"",onSave:m,"label-set":"Guardar","label-cancel":"Cancelar","auto-save":""},{default:l(u=>[a(M,{type:"textarea",rows:"4",modelValue:u.value,"onUpdate:modelValue":K=>u.value=K,dense:"",autofocus:"",counter:"",onKeyup:E(u.set,["enter"])},null,8,["modelValue","onUpdate:modelValue","onKeyup"])]),_:2},1032,["modelValue","onUpdate:modelValue"])])]),_:2},1024),a(C,{top:"",side:"",class:"flex flex-center"},{default:l(()=>[n("div",ke,[a(V,{class:"gt-xs",onClick:u=>Q(k),size:"12px",flat:"",dense:"",round:"",icon:"delete"},null,8,["onClick"])])]),_:2},1024)]),_:2},1024))),128)):(w(),$(P,{key:1,class:"text-center"},{default:l(()=>[a(C,{top:"",class:"col-12 gt-sm"},{default:l(()=>[a(F,{class:"q-mt-sm"},{default:l(()=>[S(" No hay clausulas ")]),_:1})]),_:1})]),_:1}))]}),_:1})]),_:1})]),_:1})]),n("div",Me,[a(D,{class:"my-card"},{default:l(()=>[a(q,{class:"text-white flex justify-between q-pt-sm q-pb-sm"},{default:l(()=>{var f;return[Qe,((f=c.value)==null?void 0:f.length)==0?(w(),$(V,{key:0,onClick:p[1]||(p[1]=_=>h.value=!0),round:"",color:"primary",icon:"add"})):se("",!0)]}),_:1}),a(B),a(q,{class:"q-pa-none"},{default:l(()=>[a(R,{bordered:"",class:"rounded-borders q-pt-sm"},{default:l(()=>{var f;return[((f=c.value)==null?void 0:f.length)>0?(w(),$(P,{key:0},{default:l(()=>[a(C,{top:""},{default:l(()=>[n("span",je,[S(O(c.value)+" ",1),a(H,{modelValue:c.value,"onUpdate:modelValue":p[2]||(p[2]=_=>c.value=_),buttons:"",onSave:m,"label-set":"Guardar","label-cancel":"Cancelar","auto-save":""},{default:l(_=>[a(M,{type:"textarea",rows:"4",modelValue:_.value,"onUpdate:modelValue":k=>_.value=k,dense:"",autofocus:"",counter:"",onKeyup:E(_.set,["enter"])},null,8,["modelValue","onUpdate:modelValue","onKeyup"])]),_:1},8,["modelValue"])])]),_:1}),a(C,{top:"",side:""},{default:l(()=>[n("div",Ue,[a(V,{class:"gt-xs",onClick:N,size:"12px",flat:"",dense:"",round:"",icon:"delete"})])]),_:1})]),_:1})):(w(),$(P,{key:1,class:"text-center"},{default:l(()=>[a(C,{top:"",class:"col-12 gt-sm"},{default:l(()=>[a(F,{class:"q-mt-sm"},{default:l(()=>[S(" No hay clausulas ")]),_:1})]),_:1})]),_:1}))]}),_:1})]),_:1})]),_:1})])])]),a(G,{modelValue:y.value,"onUpdate:modelValue":p[4]||(p[4]=f=>y.value=f)},{default:l(()=>[a(ve,{clausulas:t.value,aceptacion:c.value,onHideModal:p[3]||(p[3]=f=>(y.value=!1,s()))},null,8,["clausulas","aceptacion"])]),_:1},8,["modelValue"]),a(G,{modelValue:h.value,"onUpdate:modelValue":p[6]||(p[6]=f=>h.value=f)},{default:l(()=>[a(he,{clausulas:t.value,aceptacion:c.value,proforma_id:i.value,onHideModal:p[5]||(p[5]=f=>(h.value=!1,s()))},null,8,["clausulas","aceptacion","proforma_id"])]),_:1},8,["modelValue"])],64))}};export{Ie as default};