import{Q as d,a as e}from"./QBreadcrumbs.0184d9c7.js";import{d as m,o as p,c as u,e as s,ae as o,f as a,g as r,aR as _,aj as f}from"./index.9a174042.js";import{u as h}from"./useNap.6bd34d77.js";import{_ as q}from"./FormNap.d4ba668b.js";import"./axios.ba8f4325.js";import"./useHelpers.ae76dc84.js";import"./use-quasar.a805da59.js";import"./QSelect.4c17bc3b.js";import"./QChip.27896cb8.js";import"./QItemLabel.d54ced73.js";import"./format.cbf00d5d.js";import"./QForm.05cb29a7.js";const g={class:"q-ma-lg q-pt-md"},j={class:"row q-col-gutter-md",style:{"justify-content":"center"}},x=s("label",{class:"text-h6 text-center",style:{position:"relative",top:"-8px",left:"17px"}}," Editar Caja NAP ",-1),w=[x],v={class:"row q-col-gutter-md",style:{"justify-content":"center"}},y={class:"col-xs-11 col-md-11 q-pt-xs"},D=m({__name:"EditPage",setup(C){const{api:c,quitarErrores:i,formNap:l,route:n}=h();return(async()=>{const{data:t}=await c.get("/caja-nap/"+n.params.id);l.value={...t,puertos:t.puertos.length,router_id:t.router_id.id}})(),i(),(t,b)=>(p(),u(f,null,[s("div",g,[s("div",j,[s("div",{class:o(["col-xs-12 q-pl-none",[t.$q.screen.width<1022?"q-pt-sm col-md-6":"col-md-6"]])},[a(d,{class:o(["row q-mr-xs",[t.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:r(()=>[a(e,{label:"Inicio",icon:"home",to:"/"}),a(e,{label:"Cajas Nap",icon:"fa-solid fa-list",to:"/cajas-nap"}),a(e,{label:"Editar",icon:"add_circle"})]),_:1},8,["class"])],2),s("div",{class:o(["col-xs-12",[t.$q.screen.width<1022?"text-center q-pt-sm col-md-6 q-pl-none":"text-right col-md-5"]])},w,2)])]),s("div",v,[s("div",y,[a(_,{flat:"",class:"shadow_custom"},{default:r(()=>[a(q,{edit:!0})]),_:1})])])],64))}});export{D as default};