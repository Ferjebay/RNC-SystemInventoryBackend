import{Q as _,a as e}from"./QBreadcrumbs.366f4dd9.js";import{u as f,_ as h}from"./FormUser.9e57a1ea.js";import{d as q,o as g,c as w,e as s,ae as r,f as o,g as x,aj as v}from"./index.679b5d1a.js";import"./format.0bd7e2d7.js";import"./QSelect.5bb9f1e6.js";import"./QFile.41fce7f0.js";import"./TouchPan.55b17ef0.js";import"./touch.3df10340.js";import"./QPopupProxy.75168184.js";import"./date.948ac346.js";import"./QTree.d5680906.js";import"./QSlideTransition.ea05a676.js";import"./QForm.203809fe.js";import"./ClosePopup.d65f2917.js";import"./useHelpers.51e7bd28.js";import"./use-quasar.dbe3b2af.js";import"./axios.4dd92074.js";const U={class:"q-ma-lg q-pt-md"},b={class:"row q-col-gutter-lg"},y=s("label",{class:"text-h6"},"Editar Usuario",-1),B=[y],E={class:"q-px-md"},$={class:"row q-col-gutter-md"},j={class:"col-xs-12 col-md-12 q-pt-xs"},S=q({__name:"EditUser",setup(C){const{api:i,formUser:c,limpiarFormulario:m,route:l}=f(),n=async()=>{const{data:t}=await i.get("/auth/find/"+l.params.term),{password:d,confirmPassword:Q,company:p,foto:a,...u}=t[0];c.value={...u,company:p.id,foto:null,foto_old:a==null?null:a}};return m(),n(),(t,d)=>(g(),w(v,null,[s("div",U,[s("div",b,[s("div",{class:r(["col-xs-12 col-md-6",[t.$q.screen.width<1022?"q-pt-sm":""]])},[o(_,{class:r(["row q-mr-xs",[t.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:x(()=>[o(e,{label:"Inicio",icon:"home",to:"/"}),o(e,{label:"Usuarios",icon:"group",to:"/usuarios"}),o(e,{label:"Usuario",icon:"edit"})]),_:1},8,["class"])],2),s("div",{class:r(["col-xs-12 col-md-6",[t.$q.screen.width<1022?"text-center q-pt-sm":"text-right"]])},B,2)])]),s("div",E,[s("div",$,[s("div",j,[o(h,{edit:!0})])])])],64))}});export{S as default};