import{Q as d,a}from"./QBreadcrumbs.a981dbbb.js";import{d as n,o as u,c as m,e as s,ae as o,f as e,g as c,aU as p,aj as _}from"./index.13566412.js";import{_ as f}from"./FormSucursal.2e6bd3b8.js";import{u as h}from"./useSucursal.42c0a2ac.js";import"./QSelect.2041d059.js";import"./format.0600ee5c.js";import"./QForm.f072a861.js";import"./axios.b6890a1e.js";import"./useHelpers.4c16a44e.js";import"./use-quasar.a444182f.js";const q={class:"q-ma-lg q-pt-md"},g={class:"row q-col-gutter-md",style:{"justify-content":"center"}},x=s("label",{class:"text-h6 text-center",style:{position:"relative",top:"-8px",left:"17px"}}," Editar Sucursal ",-1),y=[x],w={class:"row q-col-gutter-md",style:{"justify-content":"center"}},v={class:"col-xs-11 col-md-11 q-pt-xs"},F=n({__name:"EditSucursal",setup(S){const{api:r,route:l,formSucursal:i}=h();return(async()=>{const{data:t}=await r.get(`/sucursal/find/${l.params.sucursal_id}/sucursal`);i.value={...t[0],company_id:t[0].company_id.id}})(),(t,j)=>(u(),m(_,null,[s("div",q,[s("div",g,[s("div",{class:o(["col-xs-12 q-pl-none",[t.$q.screen.width<1022?"q-pt-sm col-md-6":"col-md-6"]])},[e(d,{class:o(["row q-mr-xs",[t.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:c(()=>[e(a,{label:"Inicio",icon:"home",to:"/"}),e(a,{label:"Sucursales",icon:"fa-solid fa-list",to:"/sucursales"}),e(a,{label:"Agregar",icon:"add_circle"})]),_:1},8,["class"])],2),s("div",{class:o(["col-xs-12",[t.$q.screen.width<1022?"text-center q-pt-sm col-md-6":"text-right col-md-5"]])},y,2)])]),s("div",w,[s("div",v,[e(p,{flat:"",class:"shadow_custom"},{default:c(()=>[e(f,{edit:!0})]),_:1})])])],64))}});export{F as default};