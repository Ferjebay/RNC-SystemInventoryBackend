import{Q as p,a}from"./QBreadcrumbs.10e17445.js";import{u as f,_}from"./FormEmpresa.15b5e54a.js";import{d as u}from"./date.6fd6b604.js";import{d as h,C as q,o as i,c as r,e as t,af as v,ae as s,f as o,g,aj as E}from"./index.cfa4c6fc.js";import"./QFile.b74ddbe7.js";import"./QSelect.37bb8027.js";import"./format.b474c67d.js";import"./QForm.aeee0fbe.js";import"./provincias.d5c49733.js";import"./useHelpers.79731713.js";import"./use-quasar.87a49eb3.js";import"./axios.b700cc31.js";import"./ClosePopup.4d8fbb44.js";import"./index.2065a85c.js";import"./vue3-q-tel-input.esm.09c93f9f.js";const w={class:"q-ma-lg q-pt-md"},x={class:"row q-col-gutter-md"},b={key:0,class:"offset-1"},$=t("label",{class:"text-h6 text-center",style:{position:"relative",top:"-8px",left:"-10px"}}," Editar Empresa ",-1),y=[$],B={class:"q-px-md"},C={class:"row q-col-gutter-md"},O=h({__name:"EditEmpresa",setup(V){const{api:c,isValid:l,formEmpresa:d,route:m}=f(),n=async()=>{const{data:e}=await c.get("/companies/find/"+m.params.empresa_id);d.value={...e[0],telefono:e[0].telefono==null?"":e[0].telefono,logo:null,logo_old:e[0].logo==null?null:e[0].logo,archivo_certificado:null,archivo_certificado_old:e[0].archivo_certificado,fecha_caducidad_certificado:u.formatDate(e[0].fecha_caducidad_certificado,"DD/MM/YYYY HH:mma")}};return l.value=!1,q(()=>{n()}),(e,Y)=>(i(),r(E,null,[t("div",w,[t("div",x,[e.$q.screen.width>1022?(i(),r("div",b)):v("",!0),t("div",{class:s(["col-xs-12 q-pl-none",[e.$q.screen.width<1022?"q-pt-sm col-md-6":"col-md-5"]])},[o(p,{class:s(["row q-mr-xs",[e.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:g(()=>[o(a,{label:"Inicio",icon:"home",to:"/"}),o(a,{label:"Empresas",icon:"fa-solid fa-list",to:"/empresas"}),o(a,{label:"Editar",icon:"add_circle"})]),_:1},8,["class"])],2),t("div",{class:s(["col-xs-12",[e.$q.screen.width<1022?"text-center q-pt-sm col-md-6":"text-right col-md-5"]])},y,2)])]),t("div",B,[t("div",C,[t("div",{class:s(["col-xs-12 col-md-10 q-pt-xs",e.$q.screen.width<1022?"":"offset-1"])},[o(_,{edit:!0})],2)])])],64))}});export{O as default};