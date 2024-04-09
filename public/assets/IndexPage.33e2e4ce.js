import{Q as Y,a as x,c as Z,b as ee}from"./QTable.b671eb91.js";import{Q as te,a as B}from"./QTooltip.0f8bf4d8.js";import{Q as oe}from"./QSelect.623e9df1.js";import{r as y,v as ae,C as se,o as s,c as m,e as i,f as l,g as r,aU as re,a9 as n,af as d,aj as _,ai as le,ad as U,ae as ne,h as u,Q as ie,bc as E,i as ce,O as D,aa as N,ab as A}from"./index.07952156.js";import{Q as $}from"./QBadge.aa17ec2e.js";import{Q as de}from"./QPageSticky.4c5a7fe6.js";import{C as S}from"./ClosePopup.195cf95f.js";import{a as F}from"./axios.316045a3.js";import{u as ue}from"./useHelpers.bf02556f.js";import{u as me}from"./useRedIpv4.4c8b8de3.js";import{u as pe}from"./useCliente.4d957eb5.js";import"./QList.cbdaff9b.js";import"./format.bba2c08c.js";import"./use-quasar.425a6f8f.js";import"./date.996aa7dc.js";const ge={class:"q-ma-lg q-pt-md"},fe={class:"row q-col-gutter-lg"},ve={class:"col-12"},ye=i("label",{class:"q-mr-sm row items-center"},[i("span",null,"Router: ")],-1),be={key:1,class:"text-center row justify-center",style:{width:"100%"}},he=i("label",{class:"q-mb-sm text-grey-7 text-h6"}," Redes IPv4 ",-1),we=[he],ke={class:"absolute-full flex justify-around"},Ie=i("div",{class:"full-width row flex-center text-lime-10 q-gutter-sm"},[i("span",{class:"text-subtitle1"}," No se encontr\xF3 ningun Resultado ")],-1),Ee={__name:"IndexPage",setup(_e){const{obtenerListaSubred:L,groupedIpsByRed:$e}=pe(),M=[{name:"acciones",label:"acciones",align:"center"},{align:"center",label:"Nombre",field:"nombre",name:"nombre"},{align:"center",label:"Red",field:"red",name:"red"},{align:"center",label:"Uso IPS",field:"uso_ips",name:"uso_ips"},{align:"center",label:"CIDR",name:"cidr",field:"cidr"},{align:"center",label:"Router",field:"router_name",name:"router_name"},{name:"estado",label:"Estado",align:"center",field:"estado"}],b=y("");let{listRouter:k,cargarRouter:G}=me();const{mostrarNotify:P,confirmDelete:H,isDeleted:O}=ue(),C=y(""),V=y([]),q=y(!1),j=[],J=o=>{const[a,e]=o.split("/"),t=parseInt(e,10);function p(Q){return Q.split(".").reduce((T,R)=>(T<<8)+parseInt(R,10),0)}function g(Q){return Array.from({length:4},(T,R)=>Q>>8*(3-R)&255).join(".")}const f=p(a),v=(1<<32-t)-1,h=g(f&~v),w=g(f|v);return{rangoInicio:h,rangoFin:w}},K=(o,a,e)=>{function t(v){return v.split(".").reduce((h,w)=>(h<<8)+parseInt(w,10),0)}const p=t(o),g=t(a),f=t(e);return p>=g&&p<=f},I=async()=>{q.value=!0;try{let o={headers:{router_id:b.value}};(await F.get(`/customers/get-ips/${b.value}`)).data.forEach(t=>{j.push(t.ipv4)});const{data:e}=await F.get("/red-ipv4",o);e.forEach(t=>{t.router_name=t.router_id.nombre,t.cidr=t.cidr.split(" ")[0];const p=L(`${t.red}/${t.cidr}`);t.totalIps=p.length-2;const{rangoInicio:g,rangoFin:f}=J(`${t.red}/${t.cidr}`),v=j.filter(w=>K(w,g,f));t.totalIpsUsadas=v.length;const h=Math.floor(t.totalIpsUsadas*100/t.totalIps*100)/100/100;t.porcentaje=h}),V.value=e}catch(o){P("warning",o.response.data.message)}q.value=!1},z=async(o,a)=>{try{const{data:{msg:e}}=await F.patch(`/red-ipv4/${o}/${a}`);P("positive",e),I()}catch(e){console.log(e)}};ae(O,(o,a)=>{o&&I()});const W=async o=>{try{H("Estas seguro de eliminar esta red IPv4?",`/red-ipv4/${o}`)}catch(a){console.log(a)}};se(async()=>{await G(),k.value.length>0&&(b.value=k.value[0].value),I()});const c=y("list"),X=y({rowsPerPage:10});return(o,a)=>(s(),m(_,null,[i("div",ge,[i("div",fe,[i("div",ve,[l(re,{flat:"",class:"shadow_custom"},{default:r(()=>[l(Y,{"title-class":"text-grey-7 text-h6",title:"Redes IPv4",rows:V.value,loading:q.value,"hide-header":c.value==="grid",columns:M,"row-key":"name",grid:c.value==="grid",filter:C.value,pagination:X.value},{header:r(e=>[l(te,{props:e,style:{height:"60px"}},{default:r(()=>[(s(!0),m(_,null,le(e.cols,t=>(s(),n(ee,{key:t.name,props:e,class:"text-grey-7 text-weight-bold text-uppercase",style:{"font-size":"13px"}},{default:r(()=>[N(A(t.label),1)]),_:2},1032,["props"]))),128))]),_:2},1032,["props"])]),"top-left":r(e=>[U(k).length>1?(s(),m("div",{key:0,style:{display:"flex"},class:ne([o.$q.screen.xs?"q-mb-md":""])},[ye,l(oe,{outlined:"",dense:"",modelValue:b.value,"onUpdate:modelValue":[a[0]||(a[0]=t=>b.value=t),I],"emit-value":"","map-options":"",options:U(k)},null,8,["modelValue","options"])],2)):(s(),m("div",be,we))]),"top-right":r(e=>[o.$q.screen.xs?d("",!0):(s(),n(u,{key:0,onClick:a[1]||(a[1]=t=>o.$router.push({name:"redesIpv4.add"})),outline:"",color:"primary",label:"Nuevo",class:"q-mr-xs"})),l(ie,{style:E(o.$q.screen.width>700||"width: 70%"),outlined:"",dense:"",debounce:"300",modelValue:C.value,"onUpdate:modelValue":a[2]||(a[2]=t=>C.value=t),placeholder:"Buscar..."},{append:r(()=>[l(ce,{name:"search"})]),_:1},8,["style","modelValue"]),c.value==="list"?(s(),n(u,{key:1,flat:"",round:"",dense:"",icon:e.inFullscreen?"fullscreen_exit":"fullscreen",onClick:e.toggleFullscreen},{default:r(()=>[D((s(),n(B,{disable:o.$q.platform.is.mobile},{default:r(()=>[N(A(e.inFullscreen?"Exit Fullscreen":"Toggle Fullscreen"),1)]),_:2},1032,["disable"])),[[S]])]),_:2},1032,["icon","onClick"])):d("",!0),e.inFullscreen?d("",!0):(s(),n(u,{key:2,flat:"",round:"",dense:"",icon:c.value==="grid"?"list":"grid_on",onClick:a[3]||(a[3]=t=>{c.value=c.value==="grid"?"list":"grid",o.separator=c.value==="grid"?"none":"horizontal"})},{default:r(()=>[D((s(),n(B,{disable:o.$q.platform.is.mobile},{default:r(()=>[N(A(c.value==="grid"?"List":"Grid"),1)]),_:1},8,["disable"])),[[S]])]),_:1},8,["icon"]))]),"body-cell-uso_ips":r(e=>[l(x,{props:e},{default:r(()=>[(s(),m("div",{key:0,style:E(o.$q.screen.xs?"min-width: 180px;":"min-width: 140px;")},[l(Z,{stripe:"",rounded:"",size:"25px",value:e.row.porcentaje,color:"cyan-9"},{default:r(()=>[i("div",ke,[l($,{color:"transparent",class:"text-weight-bold","text-color":o.$q.dark.isActive?"grey-3":"grey-9",label:(e.row.porcentaje*100).toFixed(2)+"%"},null,8,["text-color","label"]),l($,{color:"transparent",class:"text-weight-bolder","text-color":o.$q.dark.isActive?"grey-3":"grey-9",label:`(${e.row.totalIpsUsadas} de ${e.row.totalIps})`},null,8,["text-color","label"])])]),_:2},1032,["value"])],4))]),_:2},1032,["props"])]),"body-cell-estado":r(e=>[l(x,{props:e},{default:r(()=>[e.row.isActive?(s(),n($,{key:0,outline:"",color:"positive",label:"Activo",class:"q-pa-sm"})):(s(),n($,{key:1,outline:"",color:"red",label:"Inactivo",class:"q-pa-sm"}))]),_:2},1032,["props"])]),"body-cell-acciones":r(e=>[l(x,{props:e},{default:r(()=>[e.row.isActive?(s(),n(u,{key:0,round:"",color:"blue-grey",onClick:t=>o.$router.push({name:"redesIpv4.edit",params:{id:e.row.id}}),icon:"edit",class:"q-mr-sm",size:"10px"},null,8,["onClick"])):d("",!0),e.row.isActive?(s(),m(_,{key:1},[e.row.isActive?(s(),n(u,{key:0,round:"",color:"blue-grey",icon:"close",onClick:t=>z(e.row.id,!1),size:"10px"},null,8,["onClick"])):d("",!0)],64)):(s(),m(_,{key:2},[e.row.isActive?d("",!0):(s(),n(u,{key:0,round:"",color:"blue-grey",icon:"done",onClick:t=>z(e.row.id,!0),size:"10px"},null,8,["onClick"])),e.row.isActive?d("",!0):(s(),n(u,{key:1,round:"",color:"blue-grey",class:"q-ml-sm",icon:"delete",onClick:t=>W(e.row.id),size:"10px"},null,8,["onClick"]))],64))]),_:2},1032,["props"])]),"no-data":r(({icon:e})=>[Ie]),_:1},8,["rows","loading","hide-header","grid","filter","pagination"])]),_:1})])])]),o.$q.screen.xs?(s(),n(de,{key:0,position:"bottom-right",offset:[18,18]},{default:r(()=>[l(u,{round:"",color:"secondary",size:"lg",icon:"add",onClick:a[4]||(a[4]=e=>o.$router.push({name:"redesIpv4.add"}))})]),_:1})):d("",!0)],64))}};export{Ee as default};