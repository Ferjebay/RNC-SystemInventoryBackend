import{Q as d,a as o}from"./QBreadcrumbs.e9ac4f05.js";import{d as m,o as p,c as _,e as t,ae as r,f as s,g as a,aU as u,aj as f}from"./index.a62a3008.js";import{u as h}from"./useInternet.f9bc5623.js";import{_ as q}from"./FormInternet.1407c27f.js";import"./axios.478b8a0e.js";import"./useHelpers.96580f8c.js";import"./use-quasar.83346572.js";import"./QBadge.0d89a839.js";import"./QSelect.0ac283ab.js";import"./format.790b9b88.js";import"./QForm.bf2ca002.js";const g={class:"q-ma-lg q-pt-md"},x={class:"row q-col-gutter-md",style:{"justify-content":"center"}},v=t("label",{class:"text-h6 text-center",style:{position:"relative",top:"-8px",left:"17px"}}," Editar Perfil ",-1),w=[v],y={class:"row q-col-gutter-md",style:{"justify-content":"center"}},b={class:"col-xs-11 col-md-11 q-pt-xs"},U=m({__name:"EditPage",setup(I){const{api:i,quitarErrores:n,formInternet:c,route:l}=h();return(async()=>{const{data:e}=await i.get("/internet/find/"+l.params.id);c.value={...e,router_id:e.router_id.id}})(),n(),(e,B)=>(p(),_(f,null,[t("div",g,[t("div",x,[t("div",{class:r(["col-xs-12 q-pl-none",[e.$q.screen.width<1022?"q-pt-sm col-md-6":"col-md-6"]])},[s(d,{class:r(["row q-mr-xs",[e.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:a(()=>[s(o,{label:"Inicio",icon:"home",to:"/"}),s(o,{label:"Internet",icon:"fa-solid fa-list",to:"/servicios/internet"}),s(o,{label:"Agregar",icon:"add_circle"})]),_:1},8,["class"])],2),t("div",{class:r(["col-xs-12",[e.$q.screen.width<1022?"text-center q-pt-sm col-md-6 q-pl-none":"text-right col-md-5"]])},w,2)])]),t("div",y,[t("div",b,[s(u,{flat:"",class:"shadow_custom"},{default:a(()=>[s(q,{edit:!0})]),_:1})])])],64))}});export{U as default};