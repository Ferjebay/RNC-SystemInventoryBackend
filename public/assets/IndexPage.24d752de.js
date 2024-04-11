import{d as X,r as d,v as U,o as i,c as Q,e as t,ae as y,ad as r,f as s,g as l,Q as P,aU as Z,a9 as m,af as p,ba as ee,aj as O,i as w,O as D,h as b,ai as ae,bc as z,aa as I,ab as N,bb as le}from"./index.56b4024e.js";import{Q as B}from"./QDate.7fff0f95.js";import{Q as E}from"./QPopupProxy.549ad582.js";import{Q as se}from"./QInnerLoading.e9494159.js";import{Q as oe,a as j,b as te}from"./QTable.411e547a.js";import{Q as re,a as M}from"./QTooltip.05c686f1.js";import{Q as L}from"./QSelect.232f159e.js";import{Q as ne}from"./QBadge.52262dfe.js";import{Q as ie}from"./QPageSticky.a97aaf7f.js";import{C as A}from"./ClosePopup.5f0aea51.js";import{u as ue}from"./useRolPermisos.87225e4b.js";import{u as de}from"./useHelpers.7f3330bb.js";import{a as ce}from"./use-quasar.37480dad.js";import{d as me}from"./date.8e9acdc4.js";import{_ as pe}from"./DetalleProducts.9b59df0d.js";import"./format.12fa23cd.js";import"./QList.dc10ae50.js";import"./axios.070f9dba.js";import"./QBtnDropdown.c564e26a.js";import"./QBtnGroup.b797ef3f.js";const ve={class:"q-ma-lg q-pt-md"},fe={class:"row q-col-gutter-lg"},ge={class:"col-xs-12 col-sm-3"},be={class:"q-mr-sm row q-pt-sm justify-center"},_e={class:"col-xs-10 col-sm-4"},ye={class:"row items-center justify-end"},xe={class:"col-xs-12 col-sm-1 flex flex-center"},he={class:"col-xs-10 col-sm-4"},we={class:"row items-center justify-end"},ke={class:"col-12 q-pt-xs"},Ce={key:0,class:"text-center row justify-center",style:{width:"100%"}},Ve=t("label",{class:"q-mb-sm text-grey-7 text-h6"}," Listado de Compras ",-1),qe=[Ve],Qe=t("label",{class:"q-mr-sm row items-center"},[t("span",null,"Tipo: ")],-1),De=t("label",{class:"q-mx-sm row items-center"},[t("span",null,"Sucursal: ")],-1),Ae=t("div",{class:"full-width row flex-center text-lime-10 q-gutter-sm"},[t("span",{class:"text-subtitle1"}," No se encontr\xF3 ningun resultado ")],-1),We=X({__name:"IndexPage",setup($e){const Y=[{name:"acciones",label:"acciones",align:"center"},{name:"sucursal",label:"Sucursal",align:"center",field:"sucursal_name"},{name:"num_comprobante",label:"Num Comprobante",field:"numero_comprobante",align:"center"},{name:"usuario",label:"Usuario",align:"center",field:"user_name"},{name:"proveedor",label:"Proveedor",align:"center",field:"proveedor_name"},{name:"fecha",label:"Fecha Compra",align:"center",field:"fecha_compra"},{name:"total",label:"Total",field:"total",align:"center"},{name:"estado",label:"Estado",field:"estado",align:"center"}],R=d([]),$=d(!1);let k=d({});const v=d(""),f=d(""),C=d("TODOS");d({desde:"",hasta:"",pv_id:""});const V=d(""),{validarPermisos:T}=ue(),{api:S,claim:x,mostrarNotify:F,route:H}=de(),n=ce(),_=d(!1),q=d(""),h=d([]);U(C,(o,a)=>{c()});const G=()=>{const{fecha:o}=H.params;o!=""&&(v.value=o.split(" - ")[0].replace(/-/g,"/"),f.value=o.split(" - ")[1].replace(/-/g,"/"))},c=async()=>{try{_.value=!0,h.value.length==0&&await K();let o={headers:{sucursal_id:q.value,desde:v.value,hasta:f.value,tipo:C.value}};const{data:a}=await S.get("/buys",o);a.map(e=>{e.fecha_compra=me.formatDate(e.created_at,"DD/MM/YYYY"),e.sucursal_name=e.sucursal_id.nombre,e.proveedor_name=e.proveedor_id.razon_social,e.user_name=e.user_id.fullName,e.total=`$${e.total}`}),R.value=a,_.value=!1}catch(o){console.log(o),_.value=!1}},J=o=>{n.dialog({title:"<center>\xBFEstas seguro de anular esta compra?</center>",message:`<span><strong>Num Comprobante</strong>: ${o.numero_comprobante}</span> <br>
              <span class='q-my-lg'><strong>Proveedor</strong>: ${o.proveedor_name}</span> <br>
              <span class='q-my-lg'><strong>Fecha/Hora</strong>: ${o.fecha_compra}</span> <br>
              <span><strong>Total</strong>: ${o.total}</span> <br>`,html:!0,ok:{push:!0,label:"Anular",color:"teal-7"},cancel:{push:!0,color:"blue-grey-8",label:"Cancelar"}}).onOk(async()=>{try{n.loading.show({message:"Cargando..."}),await S.delete(`/buys/${o.id}`),F("positive","Compra Anulada exitosamente"),c(),n.loading.hide()}catch(a){console.log(a)}})},K=async()=>{_.value=!0;try{const{data:o}=await S.get(`/sucursal/find/${x.company.id}/company`);o.forEach(a=>{h.value.push({label:a.nombre,value:a.id})}),h.value.length!==0&&(q.value=h.value[0].value)}catch(o){F("warning",o.response.data.message)}_.value=!1};G(),c(),U(V,(o,a)=>{c()});const g=d("list"),W=d({rowsPerPage:10});return(o,a)=>(i(),Q(O,null,[t("div",ve,[t("div",fe,[t("div",{class:y(["q-mb-md q-mt-none",[r(n).screen.xs?"q-mb-md q-pt-sm":"q-ml-lg q-pl-none"]]),style:{display:"flex"}},[t("div",{class:y(["row",[r(n).screen.xs?"flex-center":""]])},[t("div",ge,[t("label",be,[t("span",{class:y([r(n).screen.xs?"text-weight-bold":""])}," Filtrar por fecha: ",2)])]),t("div",_e,[s(P,{outlined:"",dense:"",modelValue:v.value,"onUpdate:modelValue":a[2]||(a[2]=e=>v.value=e),mask:"date"},{append:l(()=>[v.value!==""?(i(),m(w,{key:0,name:"close",onClick:a[0]||(a[0]=e=>(v.value="",c())),class:"cursor-pointer"})):p("",!0),s(w,{name:"event",class:"cursor-pointer"},{default:l(()=>[s(E,{cover:"","transition-show":"scale","transition-hide":"scale"},{default:l(()=>[s(B,{modelValue:v.value,"onUpdate:modelValue":[a[1]||(a[1]=e=>v.value=e),c]},{default:l(()=>[t("div",ye,[D(s(b,{label:"Close",color:"primary",flat:""},null,512),[[A]])])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),t("div",xe,[t("label",{class:y(["q-mx-md",[r(n).screen.xs?"text-weight-medium":""]])}," Hasta ",2)]),t("div",he,[s(P,{outlined:"",dense:"",modelValue:f.value,"onUpdate:modelValue":a[5]||(a[5]=e=>f.value=e),mask:"date"},{append:l(()=>[f.value!==""?(i(),m(w,{key:0,name:"close",onClick:a[3]||(a[3]=e=>(f.value="",c())),class:"cursor-pointer"})):p("",!0),s(w,{name:"event",class:"cursor-pointer"},{default:l(()=>[s(E,{cover:"","transition-show":"scale","transition-hide":"scale"},{default:l(()=>[s(B,{modelValue:f.value,"onUpdate:modelValue":[a[4]||(a[4]=e=>f.value=e),c]},{default:l(()=>[t("div",we,[D(s(b,{onClick:c,label:"Close",color:"primary",flat:""},null,512),[[A]])])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"])])],2)],2),t("div",ke,[s(Z,{flat:"",class:"shadow_custom"},{default:l(()=>[s(oe,{"title-class":"text-grey-7 text-h6",rows:R.value,loading:_.value,"hide-header":g.value==="grid",columns:Y,"row-key":"name",grid:g.value==="grid",filter:V.value,pagination:W.value},{loading:l(()=>[s(se,{showing:"",color:"primary"})]),header:l(e=>[s(re,{props:e,style:{height:"60px"}},{default:l(()=>[(i(!0),Q(O,null,ae(e.cols,u=>(i(),m(te,{key:u.name,props:e,class:"text-grey-7 text-weight-bold text-uppercase",style:{"font-size":"13px"}},{default:l(()=>[I(N(u.label),1)]),_:2},1032,["props"]))),128))]),_:2},1032,["props"])]),"top-left":l(e=>[r(x).roles[0]!=="SUPER-ADMINISTRADOR"&&r(x).roles[0]!=="ADMINISTRADOR"?(i(),Q("div",Ce,qe)):p("",!0),t("div",{style:z([{display:"flex"},!r(n).screen.xs||"width: 100%;justify-content: center;position: relative;right: 8px;"]),class:y([r(n).screen.xs?"q-mb-md":""])},[Qe,s(L,{outlined:"",dense:"",modelValue:C.value,"onUpdate:modelValue":a[6]||(a[6]=u=>C.value=u),"emit-value":"","map-options":"",options:[{label:"Todos",value:"TODOS"},{label:"Aceptados",value:"Aceptados"},{label:"Anulados",value:"Anulados"}]},null,8,["modelValue"])],6),r(x).roles[0]=="SUPER-ADMINISTRADOR"||r(x).roles[0]=="ADMINISTRADOR"?(i(),Q("div",{key:1,style:{display:"flex"},class:y([r(n).screen.xs?"q-mb-md":""])},[De,s(L,{outlined:"",dense:"",modelValue:q.value,"onUpdate:modelValue":[a[7]||(a[7]=u=>q.value=u),a[8]||(a[8]=u=>c())],"emit-value":"","map-options":"",options:h.value},null,8,["modelValue","options"])],2)):p("",!0)]),"top-right":l(e=>[!r(n).screen.xs&&r(T)("crear.compra")?(i(),m(b,{key:0,onClick:a[9]||(a[9]=u=>o.$router.push("/compras/add")),outline:"",color:"primary",label:"Agregar Compra",class:"q-mr-xs"})):p("",!0),s(P,{style:z(r(n).screen.width>700||"width: 70%"),outlined:"",dense:"",debounce:"300",modelValue:V.value,"onUpdate:modelValue":a[10]||(a[10]=u=>V.value=u),placeholder:"Buscar..."},{append:l(()=>[s(w,{name:"search"})]),_:1},8,["style","modelValue"]),g.value==="list"?(i(),m(b,{key:1,flat:"",round:"",dense:"",icon:e.inFullscreen?"fullscreen_exit":"fullscreen",onClick:e.toggleFullscreen},{default:l(()=>[D((i(),m(M,{disable:r(n).platform.is.mobile},{default:l(()=>[I(N(e.inFullscreen?"Exit Fullscreen":"Toggle Fullscreen"),1)]),_:2},1032,["disable"])),[[A]])]),_:2},1032,["icon","onClick"])):p("",!0),e.inFullscreen?p("",!0):(i(),m(b,{key:2,flat:"",round:"",dense:"",icon:g.value==="grid"?"list":"grid_on",onClick:a[11]||(a[11]=u=>{g.value=g.value==="grid"?"list":"grid",o.separator=g.value==="grid"?"none":"horizontal"})},{default:l(()=>[D((i(),m(M,{disable:r(n).platform.is.mobile},{default:l(()=>[I(N(g.value==="grid"?"List":"Grid"),1)]),_:1},8,["disable"])),[[A]])]),_:1},8,["icon"]))]),"body-cell-estado":l(e=>[s(j,{props:e},{default:l(()=>[s(ne,{outline:"",class:"q-py-xs q-px-md",color:e.row.isActive?"secondary":"negative",label:e.row.isActive?"Aceptado":"Anulado"},null,8,["color","label"])]),_:2},1032,["props"])]),"body-cell-acciones":l(e=>[s(j,{props:e},{default:l(()=>[s(b,{round:"",color:"blue-grey",icon:"visibility",class:"q-mr-sm",onClick:u=>($.value=!0,le(k)?k.value={...e.row}:k={...e.row}),size:"10px"},null,8,["onClick"]),e.row.isActive&&r(T)("anular.compra")?(i(),m(b,{key:0,round:"",color:"blue-grey",onClick:u=>J(e.row),icon:"close",size:"10px"},null,8,["onClick"])):p("",!0)]),_:2},1032,["props"])]),"no-data":l(({icon:e})=>[Ae]),_:1},8,["rows","loading","hide-header","grid","filter","pagination"])]),_:1})])])]),r(n).screen.xs&&r(T)("crear.compra")?(i(),m(ie,{key:0,position:"bottom-right",offset:[18,18]},{default:l(()=>[s(b,{round:"",color:"secondary",size:"lg",icon:"add",onClick:a[12]||(a[12]=e=>o.$router.push("/compras/add"))})]),_:1})):p("",!0),s(ee,{modelValue:$.value,"onUpdate:modelValue":a[13]||(a[13]=e=>$.value=e)},{default:l(()=>[s(pe,{detalleData:r(k)},null,8,["detalleData"])]),_:1},8,["modelValue"])],64))}});export{We as default};