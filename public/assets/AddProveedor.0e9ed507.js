import{r as u,C as j,v as O,d as D,o as z,a9 as Q,g,ad as e,e as s,f as n,Q as p,h as M,aU as R,aa as $,O as B,aV as U,ah as E}from"./index.cfa4c6fc.js";import{C as F}from"./ClosePopup.4d8fbb44.js";import{Q as h}from"./QSelect.37bb8027.js";import{Q as K}from"./QForm.aeee0fbe.js";import{p as P}from"./provincias.d5c49733.js";import{u as A}from"./useHelpers.79731713.js";const N=u(!1),q=u(!1),w=u([]),y=u([]),f=u(!1),x=u(!1),l=u({razon_social:"",tipo_documento:"",numero_documento:"",email:"",celular:"",provincia:"",ciudad:"",direccion:""}),S=()=>{const{api:m,claim:c,mostrarNotify:o}=A(),v=()=>{l.value.razon_social="",l.value.tipo_documento="",l.value.numero_documento="",l.value.email="",l.value.celular="",l.value.provincia="",l.value.ciudad="",l.value.direccion=""},b=()=>{l.value.numero_documento=l.value.numero_documento.replace(/\D/g,""),l.value.celular=l.value.celular.replace(/\D/g,"")};return j(()=>{Object.entries(P).forEach(i=>{i[1].provincia!==void 0&&w.value.push(i[1].provincia)}),O(l.value,(i,V)=>{if(l.value.razon_social=i.razon_social.toUpperCase(),i.provincia!==""){const d=Object.entries(P).find(t=>t[1].provincia===i.provincia);y.value=[],Object.entries(d[1].cantones).forEach(t=>{y.value.push(t[1].canton)})}if(i.tipo_documento!==""&&i.tipo_documento!=="RUC"&&l.value.numero_documento.length>10){const _=i.numero_documento.length-10,d=i.numero_documento.substring(0,i.numero_documento.length-_);l.value.numero_documento=d}})}),{actualizarLista:x,formProveedor:l,listProvincias:w,listCantones:y,loading:f,limpiarFormulario:v,allowOnlyNumber:b,modalAgregarProveedor:N,modalEditarProveedor:q,validateNumDocument:[r=>r.length>=(l.value.tipo_documento==="RUC"?13:10)||`Debes completar ${l.value.tipo_documento==="RUC"?13:10} digitos`],validateNumCelular:[r=>r.length>=10||"Debes completar 10 digitos"],onSubmit:async r=>{try{f.value=!0;let i={"company-id":c.company.id};r?await m.patch("/providers/"+l.value.id,l.value,{headers:i}):await m.post("/providers",l.value,{headers:i}),x.value=!0,N.value=!1,q.value=!1,x.value=!0,o("positive","Proveedor Agregado","top"),f.value=!1}catch(i){o("warning",i.response.data.message),f.value=!1}}}},L={class:"row q-pt-lg q-gutter-lg justify-center"},T={class:"col-xs-12 col-sm-5"},k=s("label",null,"Razon Social:",-1),G={class:"col-xs-12 col-sm-5"},H=s("label",null,"Email:",-1),I={class:"col-xs-12 col-sm-5"},J=s("label",null,"Tipo de Documento:",-1),W={class:"col-xs-12 col-sm-5"},X=s("label",null,"Numero de Documento:",-1),Y={class:"col-xs-12 col-sm-5"},Z=s("label",null,"Celular:",-1),ee={class:"col-xs-12 col-sm-5"},oe=s("label",null,"Direcci\xF3n:",-1),le={class:"col-xs-12 col-sm-5"},te=s("label",null,"Provincia:",-1),ae={class:"col-xs-12 col-sm-5"},se=s("label",null,"Ciudad:",-1),ie={class:"col-xs-9 col-sm-12 flex justify-center"},ne=D({__name:"FormProveedor",props:{edit:{type:Boolean}},setup(m){const c=m,{formProveedor:o,listProvincias:v,listCantones:b,loading:C,allowOnlyNumber:r,validateNumDocument:i,validateNumCelular:V,onSubmit:_}=S();return(d,a)=>(z(),Q(K,{onSubmit:a[8]||(a[8]=t=>e(_)(c.edit))},{default:g(()=>[s("div",L,[s("div",T,[k,n(p,{modelValue:e(o).razon_social,"onUpdate:modelValue":a[0]||(a[0]=t=>e(o).razon_social=t),modelModifiers:{trim:!0},dense:"",filled:"",required:""},null,8,["modelValue"])]),s("div",G,[H,n(p,{modelValue:e(o).email,"onUpdate:modelValue":a[1]||(a[1]=t=>e(o).email=t),modelModifiers:{trim:!0},type:"email",dense:"",filled:"",required:""},null,8,["modelValue"])]),s("div",I,[J,n(h,{dense:"",modelValue:e(o).tipo_documento,"onUpdate:modelValue":a[2]||(a[2]=t=>e(o).tipo_documento=t),modelModifiers:{trim:!0},filled:"",options:["Cedula","RUC","Pasaporte"]},null,8,["modelValue"])]),s("div",W,[X,n(p,{type:d.$q.platform.is.mobile?"number":"text",modelValue:e(o).numero_documento,"onUpdate:modelValue":a[3]||(a[3]=t=>e(o).numero_documento=t),readonly:e(o).tipo_documento==="",counter:"",maxlength:e(o).tipo_documento==="RUC"?13:10,rules:e(i),"lazy-rules":"",dense:"",filled:"",required:"",onKeyup:e(r)},null,8,["type","modelValue","readonly","maxlength","rules","onKeyup"])]),s("div",Y,[Z,n(p,{type:d.$q.platform.is.mobile?"number":"text",modelValue:e(o).celular,"onUpdate:modelValue":a[4]||(a[4]=t=>e(o).celular=t),modelModifiers:{trim:!0},counter:"",maxlength:"10",rules:e(V),"lazy-rules":"",onKeyup:e(r),dense:"",filled:"",required:""},null,8,["type","modelValue","rules","onKeyup"])]),s("div",ee,[oe,n(p,{modelValue:e(o).direccion,"onUpdate:modelValue":a[5]||(a[5]=t=>e(o).direccion=t),modelModifiers:{trim:!0},dense:"",filled:"",required:""},null,8,["modelValue"])]),s("div",le,[te,n(h,{filled:"",modelValue:e(o).provincia,"onUpdate:modelValue":a[6]||(a[6]=t=>e(o).provincia=t),modelModifiers:{trim:!0},dense:"",options:e(v)},null,8,["modelValue","options"])]),s("div",ae,[se,n(h,{filled:"",modelValue:e(o).ciudad,"onUpdate:modelValue":a[7]||(a[7]=t=>e(o).ciudad=t),modelModifiers:{trim:!0},dense:"",options:e(b)},null,8,["modelValue","options"])]),s("div",ie,[n(M,{label:d.edit?"Editar":"Guardar",loading:e(C),class:"q-px-xl",type:"submit",color:"green-9"},null,8,["label","loading"])])])]),_:1}))}}),re={class:"text-h6 text-center"},_e=D({__name:"AddProveedor",setup(m){const{limpiarFormulario:c}=S();return c(),(o,v)=>(z(),Q(R,{style:{width:"740px !important","max-width":"fit-content"}},{default:g(()=>[n(U,null,{default:g(()=>[s("div",re,[$(" Nuevo Proveedor "),B(n(M,{round:"",flat:"",dense:"",icon:"close",class:"float-right",color:"grey-8"},null,512),[[F]])])]),_:1}),n(E,{inset:""}),n(U,{class:"q-pt-none"},{default:g(()=>[n(ne,{edit:!1})]),_:1})]),_:1}))}});export{ne as _,_e as a,S as u};