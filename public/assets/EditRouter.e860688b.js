import{Q as d,a as s}from"./QBreadcrumbs.236c6e0b.js";import{d as m,o as p,c as u,e as t,ae as r,f as o,g as a,aU as _,aj as f}from"./index.eb59a388.js";import{u as h,_ as q}from"./FormRouter.4c8a4a5e.js";import"./QSelect.ae46d644.js";import"./format.4a2bf437.js";import"./QBadge.3c297fd3.js";import"./QForm.c3652d24.js";import"./axios.3af51d4e.js";import"./useHelpers.dbaa793f.js";import"./use-quasar.56e73efc.js";import"./ModalMapBox.3b1d386f.js";import"./QBtnGroup.94df0487.js";import"./ClosePopup.621f3dac.js";const x={class:"q-ma-lg q-pt-md"},y={class:"row q-col-gutter-md",style:{"justify-content":"center"}},g=t("label",{class:"text-h6 text-center",style:{position:"relative",top:"-8px",left:"17px"}}," Editar Router ",-1),w=[g],v={class:"row q-col-gutter-md",style:{"justify-content":"center"}},R={class:"col-xs-11 col-md-11 q-pt-xs"},G=m({__name:"EditRouter",setup(b){const{api:i,quitarErrores:c,formRouter:l,route:n}=h();return(async()=>{const{data:e}=await i.get("/router/find/"+n.params.router_id);l.value={...e[0],company_id:e[0].company_id.id}})(),c(),(e,j)=>(p(),u(f,null,[t("div",x,[t("div",y,[t("div",{class:r(["col-xs-12 q-pl-none",[e.$q.screen.width<1022?"q-pt-sm col-md-6":"col-md-6"]])},[o(d,{class:r(["row q-mr-xs",[e.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:a(()=>[o(s,{label:"Inicio",icon:"home",to:"/"}),o(s,{label:"Routers",icon:"fa-solid fa-list",to:"/router"}),o(s,{label:"Editar",icon:"add_circle"})]),_:1},8,["class"])],2),t("div",{class:r(["col-xs-12",[e.$q.screen.width<1022?"text-center q-pt-sm col-md-6 q-pl-none":"text-right col-md-5"]])},w,2)])]),t("div",v,[t("div",R,[o(_,{flat:"",class:"shadow_custom"},{default:a(()=>[o(q,{edit:!0})]),_:1})])])],64))}});export{G as default};