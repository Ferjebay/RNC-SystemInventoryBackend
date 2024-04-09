import{Q as p,a}from"./QBreadcrumbs.b3989441.js";import{_ as f}from"./FormEmpresa.f53afdc9.js";import{u as _}from"./useEmpresa.d96f3ddd.js";import{d as u}from"./date.996aa7dc.js";import{d as h,C as q,o as i,c as r,e as t,af as v,ae as o,f as s,g,aj as E}from"./index.07952156.js";import"./QBadge.aa17ec2e.js";import"./QFile.b368dbd4.js";import"./QSelect.623e9df1.js";import"./format.bba2c08c.js";import"./QForm.b697e5ee.js";import"./ClosePopup.195cf95f.js";import"./index.2065a85c.js";import"./useHelpers.bf02556f.js";import"./use-quasar.425a6f8f.js";import"./axios.316045a3.js";const w={class:"q-ma-lg q-pt-md"},x={class:"row q-col-gutter-md"},b={key:0,class:"offset-1"},$=t("label",{class:"text-h6 text-center",style:{position:"relative",top:"-8px",left:"-10px"}}," Editar Empresa ",-1),y=[$],B={class:"q-px-md"},C={class:"row q-col-gutter-md"},O=h({__name:"EditEmpresa",setup(V){const{api:c,isValid:d,formEmpresa:l,route:m}=_(),n=async()=>{const{data:e}=await c.get("/companies/find/"+m.params.empresa_id);l.value={...e[0],logo:null,logo_old:e[0].logo==null?null:e[0].logo,archivo_certificado:null,archivo_certificado_old:e[0].archivo_certificado,fecha_caducidad_certificado:u.formatDate(e[0].fecha_caducidad_certificado,"DD/MM/YYYY HH:mma")}};return d.value=!1,q(()=>{n()}),(e,Y)=>(i(),r(E,null,[t("div",w,[t("div",x,[e.$q.screen.width>1022?(i(),r("div",b)):v("",!0),t("div",{class:o(["col-xs-12 q-pl-none",[e.$q.screen.width<1022?"q-pt-sm col-md-6":"col-md-5"]])},[s(p,{class:o(["row q-mr-xs",[e.$q.screen.width<1022?"justify-center q-pt-sm":"justify-start "]])},{default:g(()=>[s(a,{label:"Inicio",icon:"home",to:"/"}),s(a,{label:"Empresas",icon:"fa-solid fa-list",to:"/empresas"}),s(a,{label:"Editar",icon:"add_circle"})]),_:1},8,["class"])],2),t("div",{class:o(["col-xs-12",[e.$q.screen.width<1022?"text-center q-pt-sm col-md-6":"text-right col-md-5"]])},y,2)])]),t("div",B,[t("div",C,[t("div",{class:o(["col-xs-12 col-md-10 q-pt-xs",e.$q.screen.width<1022?"":"offset-1"])},[s(f,{edit:!0})],2)])])],64))}});export{O as default};