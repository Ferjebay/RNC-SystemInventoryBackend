import{Q as T,a as k,b as _,c as V}from"./QTable.ec8d9dd8.js";import{Q as E,a as w}from"./QTooltip.6122898b.js";import{d as A,r as d,C as P,o as t,c as C,e as m,f as o,g as l,aN as D,ab as r,ah as c,ak as x,aj as I,h as u,Q as L,i as p,O as Q,ac as v,ad as b}from"./index.88cb05d7.js";import{Q as R}from"./QPageSticky.4a8d92d7.js";import{C as q}from"./ClosePopup.1fc8882d.js";import{api as S}from"./axios.db577692.js";import{u as j}from"./useHelpers.db8e640f.js";import"./QList.d95bd207.js";import"./QSelect.26491acf.js";import"./QChip.b161a9cf.js";import"./QItemLabel.232581a5.js";import"./format.2bc25e5f.js";import"./use-quasar.7ae79f7d.js";const G={class:"q-ma-lg q-pt-md"},H={class:"row q-col-gutter-lg"},O={class:"col-12"},J={class:"full-width row flex-center text-lime-10 q-gutter-sm"},K=m("span",{class:"text-subtitle1"}," No se encontr\xF3 ningun Resultado ",-1),ue=A({__name:"IndexPage",setup(M){const $=[{name:"acciones",label:"acciones",align:"center"},{name:"fullName",align:"center",label:"Nombre",field:"fullName",sortable:!0},{name:"usuario",label:"Usuario",field:"usuario",align:"center"},{name:"email",align:"center",label:"Email",field:"email"},{name:"celular",label:"Celular",field:"celular",align:"center"},{name:"roles",align:"center",label:"Rol",field:"roles"},{name:"estado",label:"Estado",align:"center",field:"estado"}],g=d(""),h=d([]),f=d(!1),{mostrarNotify:N,confirmDelete:F,isDeleted:U}=j(),y=async()=>{f.value=!0;try{const{data:a}=await S.get("/auth/users");h.value=a}catch(a){N("warning",a.response.data.message)}f.value=!1};P(U,(a,s)=>{a&&y()});const z=async a=>{try{F("Estas seguro de eliminar este usuario?",`/auth/${a}`)}catch(s){console.log(s)}};y();const i=d("list"),B=d({rowsPerPage:10});return(a,s)=>(t(),C(x,null,[m("div",G,[m("div",H,[m("div",O,[o(D,{flat:"",class:"shadow_custom"},{default:l(()=>[o(T,{"title-class":"text-grey-7 text-h6",title:"Listado de Usuarios",rows:h.value,loading:f.value,"hide-header":i.value==="grid",columns:$,"row-key":"name",grid:i.value==="grid",filter:g.value,pagination:B.value},{header:l(e=>[o(E,{props:e,style:{height:"60px"}},{default:l(()=>[(t(!0),C(x,null,I(e.cols,n=>(t(),r(V,{key:n.name,props:e,class:"text-grey-7 text-weight-bold text-uppercase",style:{"font-size":"13px"}},{default:l(()=>[v(b(n.label),1)]),_:2},1032,["props"]))),128))]),_:2},1032,["props"])]),"top-right":l(e=>[a.$q.screen.xs?c("",!0):(t(),r(u,{key:0,onClick:s[0]||(s[0]=n=>a.$router.push({name:"Agregar Usuario"})),outline:"",color:"primary",label:"Agregar Usuario",class:"q-mr-xs"})),o(L,{outlined:"",dense:"",debounce:"300",modelValue:g.value,"onUpdate:modelValue":s[1]||(s[1]=n=>g.value=n),placeholder:"Buscar..."},{append:l(()=>[o(p,{name:"search"})]),_:1},8,["modelValue"]),i.value==="list"?(t(),r(u,{key:1,flat:"",round:"",dense:"",icon:e.inFullscreen?"fullscreen_exit":"fullscreen",onClick:e.toggleFullscreen},{default:l(()=>[Q((t(),r(w,{disable:a.$q.platform.is.mobile},{default:l(()=>[v(b(e.inFullscreen?"Exit Fullscreen":"Toggle Fullscreen"),1)]),_:2},1032,["disable"])),[[q]])]),_:2},1032,["icon","onClick"])):c("",!0),e.inFullscreen?c("",!0):(t(),r(u,{key:2,flat:"",round:"",dense:"",icon:i.value==="grid"?"list":"grid_on",onClick:s[2]||(s[2]=n=>{i.value=i.value==="grid"?"list":"grid",a.separator=i.value==="grid"?"none":"horizontal"})},{default:l(()=>[Q((t(),r(w,{disable:a.$q.platform.is.mobile},{default:l(()=>[v(b(i.value==="grid"?"List":"Grid"),1)]),_:1},8,["disable"])),[[q]])]),_:1},8,["icon"]))]),"body-cell-estado":l(e=>[o(k,{props:e},{default:l(()=>[e.row.isActive?(t(),r(_,{key:0,outline:"",color:"positive",label:"Activo",class:"q-pa-sm"})):(t(),r(_,{key:1,outline:"",color:"red",label:"Inactivo",class:"q-pa-sm"}))]),_:2},1032,["props"])]),"body-cell-acciones":l(e=>[o(k,{props:e},{default:l(()=>[o(u,{round:"",color:"blue-grey",onClick:n=>a.$router.push({name:"Editar Usuario",params:{term:e.row.id}}),icon:"edit",class:"q-mr-sm",size:"11px"},null,8,["onClick"]),e.row.estado?c("",!0):(t(),r(u,{key:0,round:"",color:"blue-grey",class:"q-ml-sm",icon:"delete",onClick:n=>z(e.row.id),size:"11px"},null,8,["onClick"]))]),_:2},1032,["props"])]),"no-data":l(({icon:e})=>[m("div",J,[o(p,{size:"2em",name:"sentiment_dissatisfied"}),K,o(p,{size:"2em",name:g.value?"filter_b_and_w":e},null,8,["name"])])]),_:1},8,["rows","loading","hide-header","grid","filter","pagination"])]),_:1})])])]),a.$q.screen.xs?(t(),r(R,{key:0,position:"bottom-right",offset:[18,18]},{default:l(()=>[o(u,{round:"",color:"secondary",size:"lg",icon:"add",onClick:s[3]||(s[3]=e=>a.$router.push({name:"Agregar Usuario"}))})]),_:1})):c("",!0)],64))}});export{ue as default};