import{r as d,o as i,a9 as m,g as a,f as o,aV as W,e as s,aa as V,O as T,h as y,ah as ne,i as q,af as v,ae as $,ab as x,c as I,ad as u,Q as N,aU as ae,v as B,ba as Z,aj as J,ai as ue,bc as K,bB as de,P as j}from"./index.a62a3008.js";import{Q as X}from"./QDate.e675632e.js";import{Q as ee}from"./QPopupProxy.8be0fe5d.js";import{Q as ce}from"./QInnerLoading.3c0ff02f.js";import{Q as me,a as ve}from"./QTable.05c15f57.js";import{Q as pe,a as H}from"./QTooltip.fe7ea09a.js";import{Q as le}from"./QSelect.0ac283ab.js";import{Q as A}from"./QTd.b3062acc.js";import{Q as fe}from"./QBadge.0d89a839.js";import{Q as ge}from"./QPageSticky.6e09dc09.js";import{C as O}from"./ClosePopup.a66e8458.js";import{M as _e}from"./index.2065a85c.js";import{u as be}from"./useRolPermisos.5789c619.js";import{u as oe}from"./useHelpers.96580f8c.js";import{d as ye}from"./date.63b19438.js";import{a as we}from"./use-quasar.83346572.js";import"./exceljs.min.49a71a87.js";import{_ as xe}from"./DetalleProducts.e9277358.js";import{e as he}from"./vue3-q-tel-input.esm.16cd5611.js";import"./format.790b9b88.js";import"./QList.884235e9.js";import"./axios.478b8a0e.js";import"./QBtnDropdown.890453b5.js";import"./QBtnGroup.dff0eece.js";const Ve={class:"text-h6 text-center"},ke={class:"row flex flex-center"},Ce={class:"col-xs-11 col-sm-9 text-center q-mt-md q-mb-lg"},qe=s("label",null,"Enviar por:",-1),$e={key:0,class:"col-xs-11 col-sm-9 text-center q-mb-md"},Qe=s("label",null,"Celular del cliente:",-1),Re={key:1,class:"col-xs-11 col-sm-9 text-center"},Ee=s("label",null,"Email del cliente:",-1),De={class:"col-xs-9 col-md-12 flex justify-center q-ml-none"},Ae={__name:"ModalReenviarComproantes",props:["detalleFactura"],emits:["closeModal"],setup(L,{emit:k}){const Q=L,{api:h,claim:z,mostrarNotify:P}=oe(),R=d(!1),E=d(!1),t=d({tipo_envio:"",telefono:"",email:""});t.value.telefono=Q.detalleFactura.customer_id.celular,t.value.email=Q.detalleFactura.customer_id.email;const w=()=>{R.value=!1;const g=/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;let r=[];return t.value.tipo_envio=="whatsapp"&&r.push("telefono"),t.value.tipo_envio=="email"&&r.push("email"),t.value.tipo_envio=="ambas"&&(r=["telefono","email"]),t.value.tipo_envio==""&&(r=["tipo_envio"]),t.value.email.length>5&&!g.test(t.value.email)&&(c.value.email.message="Ingresa un email valido",c.value.email.isValid=!1,R.value=!0),r.forEach(p=>{t.value[p].length==0&&(c.value[p].message="Debes completar este campo",c.value[p].isValid=!1,R.value=!0)}),R.value},c=d({telefono:{message:"",isValid:!0},tipo_envio:{message:"",isValid:!0},email:{message:"",isValid:!0}}),D=async()=>{if(w())return;const{data:g}=await h.get(`/companies/find/${z.company.id}`);if(!((t.value.tipo_envio=="whatsapp"||t.value.tipo_envio=="ambas")&&!c.value.telefono.isValid))try{E.value=!0,await h.post("/CE/facturas/reenviar-comprobantes",{...t.value,telefono:g[0].telefono,number:t.value.telefono,factura:Q.detalleFactura}),P("positive","Comprobantes enviados"),k("closeModal"),E.value=!1}catch(r){E.value=!1,P("warning",r.response.data.message),k("closeModal")}},S=g=>{c.value.telefono.isValid=!g};return(g,r)=>(i(),m(ae,{style:{width:"400px","max-width":"80vw"}},{default:a(()=>[o(W,null,{default:a(()=>[s("div",Ve,[V(" Enviar Comprobantes "),T(o(y,{round:"",flat:"",dense:"",icon:"close",class:"float-right",color:"grey-8"},null,512),[[O]])])]),_:1}),o(ne,{inset:""}),o(W,{class:"q-pt-none"},{default:a(()=>[s("div",ke,[s("div",Ce,[qe,o(le,{filled:"",dense:"",modelValue:t.value.tipo_envio,"onUpdate:modelValue":r[0]||(r[0]=p=>t.value.tipo_envio=p),error:!c.value.tipo_envio.isValid,"emit-value":"","map-options":"",options:[{label:"WhatsApp",value:"whatsapp"},{label:"Email",value:"email"},{label:"Ambas",value:"ambas"}]},{append:a(()=>[t.value.tipo_envio.length!=0&&t.value.tipo_envio=="whatsapp"?(i(),m(q,{key:0,name:"fa-brands fa-whatsapp",color:"teal-7"})):v("",!0),t.value.tipo_envio.length!=0&&t.value.tipo_envio=="email"?(i(),m(q,{key:1,name:"mail",color:"indigo-5"})):v("",!0),t.value.tipo_envio.length!=0&&t.value.tipo_envio=="ambas"?(i(),m(q,{key:2,name:"fa-solid fa-list-check",color:"deep-orange-4"})):v("",!0)]),error:a(()=>[s("label",{class:$(g.$q.dark.isActive?"text-red-4":"text-negative")},x(c.value.tipo_envio.message),3)]),_:1},8,["modelValue","error"])]),t.value.tipo_envio=="whatsapp"||t.value.tipo_envio=="ambas"?(i(),I("div",$e,[Qe,o(u(he),{"default-country":"EC","search-text":"Buscar pais...","onUpdate:modelValue":r[1]||(r[1]=p=>c.value.telefono.isValid=!0),onError:S,error:!c.value.telefono.isValid,filled:"",dense:"",tel:t.value.telefono,"onUpdate:tel":r[2]||(r[2]=p=>t.value.telefono=p)},{error:a(()=>[s("label",{class:$(g.$q.dark.isActive?"text-red-4":"text-negative")},x(c.value.telefono.message),3)]),_:1},8,["error","tel"])])):v("",!0),t.value.tipo_envio=="email"||t.value.tipo_envio=="ambas"?(i(),I("div",Re,[Ee,o(N,{type:"email",modelValue:t.value.email,"onUpdate:modelValue":[r[3]||(r[3]=p=>t.value.email=p),r[4]||(r[4]=p=>c.value.email.isValid=!0)],"input-class":"resaltarTextoInput",error:!c.value.email.isValid,"lazy-rules":"",dense:"",filled:""},{error:a(()=>[s("label",{class:$(g.$q.dark.isActive?"text-red-4":"text-negative")},x(c.value.email.message),3)]),_:1},8,["modelValue","error"])])):v("",!0),s("div",De,[o(y,{label:"Enviar",onClick:D,loading:E.value,class:"q-px-xl q-mt-md q-mb-md",outline:"",rounded:"",style:{color:"#696cff"}},null,8,["loading"])])])]),_:1})]),_:1}))}};const Ie={class:"q-mx-lg q-pt-md"},Pe={class:"row q-col-gutter-lg"},Se={style:{display:"flex"}},Fe={class:"col-xs-12 col-sm-3"},Me={class:"q-mr-sm row q-pt-sm justify-center"},Ue={class:"col-xs-10 col-sm-4"},Te={class:"row items-center justify-end"},Oe={class:"col-xs-12 col-sm-1 flex flex-center"},Ne={class:"col-xs-10 col-sm-4"},ze={class:"row items-center justify-end"},Be={class:"col-12 q-pt-none"},je={key:0,class:"text-center row justify-center",style:{width:"100%"}},He=s("label",{class:"q-mb-sm text-grey-7 text-h6"}," Listado de Comprobantes ",-1),Le=[He],Ye=s("label",{class:"q-mr-sm row items-center"},[s("span",null,"Por Sucursal: ")],-1),Ge=s("div",{class:"full-width row flex-center text-lime-10 q-gutter-sm"},[s("span",{class:"text-subtitle1"}," No se encontr\xF3 ningun resultado ")],-1),ya={__name:"IndexPage",setup(L){let k;const{api:Q,claim:h,route:z,mostrarNotify:P}=oe(),R=n=>{const l=new _e("/socket.io/socket.io.js",{extraHeaders:{autentication:h.id}});k==null||k.removeAllListeners(),k=l.socket("/"),k.on("updateStateInvoice",async()=>{await _()})},E=[{name:"acciones",label:"acciones",align:"center"},{name:"sucursal",label:"Sucursal",align:"center"},{name:"num_comprobante",label:"Num. Comprobante",field:"numero_comprobante",align:"center"},{name:"usuario",label:"Usuario",align:"center"},{name:"cliente",label:"Cliente",align:"center"},{name:"f/h",label:"Fecha/Hora",align:"center",field:"created_at"},{name:"total",label:"Total",name:"total",align:"center"},{name:"estado",label:"Estado",field:"estado",align:"center"}],t=d(""),w=d(""),c=d([]),D=d(!1),S=d(!1),g=d("Todos"),r=d(""),p=d({}),F=d([]),M=d([]),Y=d({}),{validarPermisos:G}=be(),f=we(),U=d(!1);B(g,(n,l)=>{_()});const te=()=>{const{tipo:n,fecha:l}=z.params;n!=""&&(g.value=n),l!=""&&(t.value=l.split(" - ")[0].replace(/-/g,"/"),w.value=l.split(" - ")[1].replace(/-/g,"/"))},_=async()=>{try{U.value=!0;let n={headers:{tipo:"PROFORMA","sucursal-id":M.value,desde:t.value,hasta:w.value}};const{data:l}=await Q.get("/invoices",n);l.map(e=>{e.created_at=ye.formatDate(e.created_at,"DD/MM/YYYY HH:mm a"),e.loading=!1}),c.value=l,U.value=!1}catch(n){console.log(n),U.value=!1}},se=async n=>{de.create({title:"\xBFEstas seguro de querer eliminar esta proforma?",ok:{push:!0,color:"cyan-10",label:"Eliminar"},cancel:{push:!0,color:"blue-grey-6",label:"Cancelar"}}).onOk(async()=>{try{j.show({message:"Cargando..."}),await Q.delete(`/invoices/${n}`),await _(),P("positive","Proforma eliminada exitosamente"),j.hide()}catch(l){P("warning",l.response.data.message),j.hide()}})};B(M,(n,l)=>{_()});const re=async n=>{U.value=!0,F.value=[];const{data:l}=await Q.get(`/sucursal/find/${n}/company`);l.forEach(e=>{F.value.push({label:e.nombre,value:e.id})}),F.value.length!=0&&(M.value=F.value[0].value),_()};R(),B(r,(n,l)=>{_()}),h.roles[0]=="SUPER-ADMINISTRADOR"||h.roles[0]=="ADMINISTRADOR"?re(h.company.id):_(),te();const C=d("list"),ie=d({rowsPerPage:10});return(n,l)=>(i(),I(J,null,[s("div",Ie,[s("div",Pe,[s("div",Se,[s("div",{style:{display:"flex"},class:$([u(f).screen.xs?"q-mb-md q-mt-none q-pt-xs":"q-ml-lg q-pl-none q-my-md"])},[s("div",{class:$(["row",[u(f).screen.xs?"flex-center":""]])},[s("div",Fe,[s("label",Me,[s("span",{class:$([u(f).screen.xs?"text-weight-bold":""])}," Filtrar por fecha: ",2)])]),s("div",Ue,[o(N,{outlined:"",dense:"",modelValue:t.value,"onUpdate:modelValue":l[2]||(l[2]=e=>t.value=e),mask:"date"},{append:a(()=>[t.value!==""?(i(),m(q,{key:0,name:"close",onClick:l[0]||(l[0]=e=>(t.value="",_())),class:"cursor-pointer"})):v("",!0),o(q,{name:"event",class:"cursor-pointer"},{default:a(()=>[o(ee,{cover:"","transition-show":"scale","transition-hide":"scale"},{default:a(()=>[o(X,{modelValue:t.value,"onUpdate:modelValue":[l[1]||(l[1]=e=>t.value=e),_]},{default:a(()=>[s("div",Te,[T(o(y,{label:"Close",color:"primary",flat:""},null,512),[[O]])])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),s("div",Oe,[s("label",{class:$(["q-mx-md",[u(f).screen.xs?"text-weight-medium":""]])}," Hasta ",2)]),s("div",Ne,[o(N,{outlined:"",dense:"",modelValue:w.value,"onUpdate:modelValue":l[5]||(l[5]=e=>w.value=e),mask:"date"},{append:a(()=>[w.value!==""?(i(),m(q,{key:0,name:"close",onClick:l[3]||(l[3]=e=>(w.value="",_())),class:"cursor-pointer"})):v("",!0),o(q,{name:"event",class:"cursor-pointer"},{default:a(()=>[o(ee,{cover:"","transition-show":"scale","transition-hide":"scale"},{default:a(()=>[o(X,{modelValue:w.value,"onUpdate:modelValue":[l[4]||(l[4]=e=>w.value=e),_]},{default:a(()=>[s("div",ze,[T(o(y,{onClick:_,label:"Close",color:"primary",flat:""},null,512),[[O]])])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"])])],2)],2)]),s("div",Be,[o(ae,{flat:"",class:"shadow_custom"},{default:a(()=>[o(me,{"title-class":"text-grey-7 text-h6",rows:c.value,"hide-header":C.value==="grid",loading:U.value,columns:E,"row-key":"name",grid:C.value==="grid",filter:r.value,pagination:ie.value},{loading:a(()=>[o(ce,{showing:"",color:"primary"})]),header:a(e=>[o(pe,{props:e,style:{height:"60px"}},{default:a(()=>[(i(!0),I(J,null,ue(e.cols,b=>(i(),m(ve,{key:b.name,props:e,class:"text-grey-7 text-weight-bold text-uppercase",style:{"font-size":"13px"}},{default:a(()=>[V(x(b.label),1)]),_:2},1032,["props"]))),128))]),_:2},1032,["props"])]),"top-left":a(e=>[u(f).screen.xs?(i(),I("div",je,Le)):v("",!0),u(h).roles[0]=="SUPER-ADMINISTRADOR"||u(h).roles[0]=="ADMINISTRADOR"?(i(),I("div",{key:1,style:K([!u(f).screen.xs||"width: 100%;justify-content: center;",{display:"flex"}]),class:$([u(f).screen.xs?"q-mb-md":"q-ml-lg"])},[Ye,o(le,{outlined:"",dense:"",modelValue:M.value,"onUpdate:modelValue":l[6]||(l[6]=b=>M.value=b),"emit-value":"","map-options":"",options:F.value},null,8,["modelValue","options"])],6)):v("",!0)]),"top-right":a(e=>[u(f).screen.width>=1023&&u(G)("crear.venta")?(i(),m(y,{key:0,onClick:l[7]||(l[7]=b=>n.$router.push("/proforma/add")),outline:"",color:"primary",label:"Agregar Proforma",class:"q-mr-xs"})):v("",!0),o(N,{style:K(u(f).screen.width>700||"width: 70%"),outlined:"",dense:"",debounce:"300",modelValue:r.value,"onUpdate:modelValue":l[8]||(l[8]=b=>r.value=b),placeholder:"Buscar..."},{append:a(()=>[o(q,{name:"search"})]),_:1},8,["style","modelValue"]),C.value==="list"?(i(),m(y,{key:1,flat:"",round:"",dense:"",icon:e.inFullscreen?"fullscreen_exit":"fullscreen",onClick:e.toggleFullscreen},{default:a(()=>[T((i(),m(H,{disable:u(f).platform.is.mobile},{default:a(()=>[V(x(e.inFullscreen?"Exit Fullscreen":"Toggle Fullscreen"),1)]),_:2},1032,["disable"])),[[O]])]),_:2},1032,["icon","onClick"])):v("",!0),e.inFullscreen?v("",!0):(i(),m(y,{key:2,flat:"",round:"",dense:"",icon:C.value==="grid"?"list":"grid_on",onClick:l[9]||(l[9]=b=>{C.value=C.value==="grid"?"list":"grid",n.separator=C.value==="grid"?"none":"horizontal"})},{default:a(()=>[T((i(),m(H,{disable:u(f).platform.is.mobile},{default:a(()=>[V(x(C.value==="grid"?"List":"Grid"),1)]),_:1},8,["disable"])),[[O]])]),_:1},8,["icon"]))]),"body-cell-total":a(e=>[o(A,{props:e},{default:a(()=>[V(" $"+x(e.row.total),1)]),_:2},1032,["props"])]),"body-cell-cliente":a(e=>[o(A,{props:e},{default:a(()=>[V(x(e.row.customer_id.nombres),1)]),_:2},1032,["props"])]),"body-cell-sucursal":a(e=>[o(A,{props:e},{default:a(()=>[V(x(e.row.sucursal_id.nombre),1)]),_:2},1032,["props"])]),"body-cell-usuario":a(e=>[o(A,{props:e},{default:a(()=>[V(x(e.row.user_id.fullName.toUpperCase()),1)]),_:2},1032,["props"])]),"body-cell-estado":a(e=>[o(A,{props:e},{default:a(()=>[o(fe,{outline:"",class:"q-py-xs q-px-md",color:u(f).dark.isActive?"blue-grey-3":"blue-grey-7",label:e.row.estadoSRI},null,8,["color","label"])]),_:2},1032,["props"])]),"body-cell-acciones":a(e=>[o(A,{props:e},{default:a(()=>[o(y,{round:"",color:"blue-grey",icon:"visibility",size:"10px",class:"q-mr-sm",onClick:b=>(S.value=!0,p.value={...e.row})},null,8,["onClick"]),e.row.estadoSRI=="PROFORMA"?(i(),m(y,{key:0,onClick:b=>n.$router.push(`proforma/add/${e.row.id}`),round:"",color:"blue-grey",icon:"description",size:"10px",class:"q-mr-sm"},null,8,["onClick"])):v("",!0),e.row.estadoSRI=="AUTORIZADO"||e.row.estadoSRI=="PROFORMA"?(i(),m(y,{key:1,round:"",color:"blue-grey",onClick:b=>(D.value=!0,Y.value=e.row),icon:"forward_to_inbox",size:"11px"},{default:a(()=>[o(H,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:a(()=>[V(" Enviar comprobante por email ")]),_:1})]),_:2},1032,["onClick"])):v("",!0),o(y,{round:"",color:"blue-grey",class:"q-ml-sm",icon:"delete",size:"10px",onClick:b=>se(e.row.id)},null,8,["onClick"])]),_:2},1032,["props"])]),"no-data":a(({icon:e})=>[Ge]),_:1},8,["rows","hide-header","loading","grid","filter","pagination"])]),_:1})])])]),u(f).screen.width<=1023&&u(G)("crear.venta")?(i(),m(ge,{key:0,position:"bottom-right",offset:[18,18]},{default:a(()=>[o(y,{round:"",color:"secondary",size:"lg",icon:"add",onClick:l[10]||(l[10]=e=>n.$router.push("/ventas/add"))})]),_:1})):v("",!0),o(Z,{modelValue:S.value,"onUpdate:modelValue":l[11]||(l[11]=e=>S.value=e)},{default:a(()=>[o(xe,{detalleData:p.value},null,8,["detalleData"])]),_:1},8,["modelValue"]),o(Z,{modelValue:D.value,"onUpdate:modelValue":l[13]||(l[13]=e=>D.value=e)},{default:a(()=>[o(Ae,{onCloseModal:l[12]||(l[12]=e=>D.value=!1),detalleFactura:Y.value},null,8,["detalleFactura"])]),_:1},8,["modelValue"])],64))}};export{ya as default};