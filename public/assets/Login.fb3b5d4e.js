import{d as f,r as n,o as v,c as _,e as l,w as b,f as a,g as u,Q as c,h as y,i as m}from"./index.29f4c737.js";import{u as x}from"./use-quasar.a55b1bc0.js";import{u as w}from"./useHelpers.c99bee56.js";import"./axios.dda82ddd.js";var h="/assets/inigualitySoft.18dacad3.png";const V={class:"area-login"},k=l("h1",{class:"title"},"\xA0",-1),q={class:"login"},S=l("div",{class:"element-form"},[l("img",{src:h,style:{width:"80%","margin-left":"29px","margin-top":"48px","margin-bottom":"24px"}})],-1),C=["onSubmit"],M=f({__name:"Login",setup(I){const r=n(!0),i=n(!1),t=n({email:"",password:""}),{api:p,mostrarNotify:d}=w(),g=async()=>{try{i.value=!0;const{data:{token:s,permisos:e}}=await p.post("/auth/login",t.value),o=x();o.setToken(s),o.setPermisos(e),location.href="/"}catch(s){s.response.data.message=="Credentials not valid(password)"&&d("warning","La contrase\xF1a esta incorrecta"),s.response.data.message=="Credentials not valid(email)"&&d("warning","El email esta incorrecto"),i.value=!1}};return(s,e)=>(v(),_("section",V,[k,l("div",q,[S,l("form",{onSubmit:b(g,["prevent"]),class:"element-form q-mt-md"},[a(c,{type:"email","label-color":"blue-grey-10",color:"primary",class:"q-mb-lg custom-input","bg-color":"blue-2",filled:"",label:"Ingresa tu email",rounded:"",outlined:"",modelValue:t.value.email,"onUpdate:modelValue":e[0]||(e[0]=o=>t.value.email=o),modelModifiers:{trim:!0},required:""},{prepend:u(()=>[a(m,{name:"person",color:"blue-grey-10"})]),_:1},8,["modelValue"]),a(c,{type:r.value?"password":"text","label-color":"blue-grey-10",class:"q-mb-lg custom-input","bg-color":"blue-2",filled:"","text-color":"#ffff",label:"Ingresa tu contrase\xF1a",rounded:"",outlined:"",modelValue:t.value.password,"onUpdate:modelValue":e[2]||(e[2]=o=>t.value.password=o),modelModifiers:{trim:!0},required:""},{append:u(()=>[a(m,{name:r.value?"visibility_off":"visibility",color:"blue-grey-10",class:"cursor-pointer",onClick:e[1]||(e[1]=o=>r.value=!r.value)},null,8,["name"])]),prepend:u(()=>[a(m,{name:"key",color:"blue-grey-10"})]),_:1},8,["type","modelValue"]),a(y,{label:"Ingresar",class:"q-px-xl",loading:i.value,type:"submit",color:""},null,8,["loading"])],40,C)])]))}});export{M as default};