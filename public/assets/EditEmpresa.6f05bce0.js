import{Q as p,a}from"./QBreadcrumbs.e9ac4f05.js";import{u as f,_}from"./FormEmpresa.49213dd7.js";import{d as u}from"./date.63b19438.js";import{d as h,C as q,o as i,c,e as t,af as v,ae as s,f as o,g,aj as E}from"./index.a62a3008.js";import"./QFile.133a1f6b.js";import"./QSelect.0ac283ab.js";import"./format.790b9b88.js";import"./QForm.bf2ca002.js";import"./useHelpers.96580f8c.js";import"./use-quasar.83346572.js";import"./axios.478b8a0e.js";import"./ClosePopup.a66e8458.js";import"./index.2065a85c.js";import"./vue3-q-tel-input.esm.16cd5611.js";const w={class:"q-ma-lg q-pt-md"},x={class:"row q-col-gutter-md"},b={key:0,class:"offset-1"},$=t("label",{class:"text-h6 text-center",style:{position:"relative",top:"-8px",left:"-10px"}}," Editar Empresa ",-1),y=[$],B={class:"q-px-md"},C={class:"row q-col-gutter-md"},L=h({__name:"EditEmpresa",setup(V){const{api:r,isValid:l,formEmpresa:d,route:m}=f(),n=async()=>{const{data:e}=await r.get("/companies/find/"+m.params.empresa_id);d.value={...e[0],telefono:e[0].telefono==null?"":e[0].telefono,logo:null,logo_old:e[0].logo==null?null:e[0].logo,archivo_certificado:null,archivo_certificado_old:e[0].archivo_certificado,fecha_caducidad_certificado:u.formatDate(e[0].fecha_caducidad_certificado,"DD/MM/YYYY HH:mma")}};return l.value=!1,q(()=>{n()}),(e,Y)=>(i(),c(E,null,[t("div",w,[t("div",x,[e.$q.screen.width>1022?(i(),c("div",b)):v("",!0),t("div",{class:s(["col-xs-12 q-pl-none",[e.$q.screen.width<1022?"q-pt-sm col-md-6":"col-md-5"]])},[o(p,{class:s(["row q-mr-xs",[e.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:g(()=>[o(a,{label:"Inicio",icon:"home",to:"/"}),o(a,{label:"Empresas",icon:"fa-solid fa-list",to:"/empresas"}),o(a,{label:"Editar",icon:"add_circle"})]),_:1},8,["class"])],2),t("div",{class:s(["col-xs-12",[e.$q.screen.width<1022?"text-center q-pt-sm col-md-6":"text-right col-md-5"]])},y,2)])]),t("div",B,[t("div",C,[t("div",{class:s(["col-xs-12 col-md-10 q-pt-xs",e.$q.screen.width<1022?"":"offset-1"])},[o(_,{edit:!0})],2)])])],64))}});export{L as default};