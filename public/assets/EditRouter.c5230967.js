import{Q as d,a as s}from"./QBreadcrumbs.7771e4fd.js";import{d as m,o as p,c as u,e as t,ae as r,f as o,g as a,aU as _,aj as f}from"./index.03c4caf6.js";import{u as h,_ as q}from"./FormRouter.78f10bd5.js";import"./QSelect.ff2502db.js";import"./format.4a4a746e.js";import"./QBadge.521b7fbb.js";import"./QForm.b0e74ce0.js";import"./axios.b00b45a2.js";import"./useHelpers.4e2dfead.js";import"./use-quasar.a4369af7.js";import"./ModalMapBox.7463a6e3.js";import"./QBtnGroup.c8d6a229.js";import"./ClosePopup.b853ab80.js";const x={class:"q-ma-lg q-pt-md"},y={class:"row q-col-gutter-md",style:{"justify-content":"center"}},g=t("label",{class:"text-h6 text-center",style:{position:"relative",top:"-8px",left:"17px"}}," Editar Router ",-1),w=[g],v={class:"row q-col-gutter-md",style:{"justify-content":"center"}},R={class:"col-xs-11 col-md-11 q-pt-xs"},G=m({__name:"EditRouter",setup(b){const{api:i,quitarErrores:c,formRouter:l,route:n}=h();return(async()=>{const{data:e}=await i.get("/router/find/"+n.params.router_id);l.value={...e[0],company_id:e[0].company_id.id}})(),c(),(e,j)=>(p(),u(f,null,[t("div",x,[t("div",y,[t("div",{class:r(["col-xs-12 q-pl-none",[e.$q.screen.width<1022?"q-pt-sm col-md-6":"col-md-6"]])},[o(d,{class:r(["row q-mr-xs",[e.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:a(()=>[o(s,{label:"Inicio",icon:"home",to:"/"}),o(s,{label:"Routers",icon:"fa-solid fa-list",to:"/router"}),o(s,{label:"Editar",icon:"add_circle"})]),_:1},8,["class"])],2),t("div",{class:r(["col-xs-12",[e.$q.screen.width<1022?"text-center q-pt-sm col-md-6 q-pl-none":"text-right col-md-5"]])},w,2)])]),t("div",v,[t("div",R,[o(_,{flat:"",class:"shadow_custom"},{default:a(()=>[o(q,{edit:!0})]),_:1})])])],64))}});export{G as default};