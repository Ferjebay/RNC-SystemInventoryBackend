import{r as g,o as u,a9 as d,g as a,f as o,aV as oe,e as i,aa as R,O as P,h as I,ah as Ae,i as $,af as v,ae as D,ab as A,c as M,ad as n,Q as J,aU as Re,v as se,C as xe,bb as q,ba as ne,aj as re,ai as Ne,bc as X}from"./index.1a4ab021.js";import{Q as ie}from"./QDate.ab5a261a.js";import{Q as ue}from"./QPopupProxy.beee96db.js";import{Q as de,d as ce,a as me}from"./format.4b4f4826.js";import{Q as Se}from"./QList.d2c11813.js";import{Q as Ve}from"./QBtnDropdown.4ccd074a.js";import{Q as De}from"./QInnerLoading.0dd97844.js";import{Q as Te,a as qe}from"./QTable.b4b9e09e.js";import{Q as $e,a as Q}from"./QTooltip.5d8a1cf0.js";import{Q as ee}from"./QSelect.763d6259.js";import{Q as Z}from"./QTd.763f1f54.js";import{Q as G}from"./QBadge.d7c44b08.js";import{Q as Ue}from"./QPageSticky.e66306da.js";import{C as L}from"./ClosePopup.33ec78de.js";import{M as Fe}from"./index.2065a85c.js";import{u as Qe}from"./useRolPermisos.2ac18795.js";import{u as le}from"./useHelpers.ffebda4d.js";import{a as Pe}from"./use-quasar.df6266f3.js";import{E as Le}from"./exceljs.min.cf219e35.js";import{d as Me}from"./date.cd821d43.js";import{_ as ze}from"./DetalleProducts.810ed87e.js";import{u as Be}from"./useImpresion.d8638766.js";import{e as je}from"./vue3-q-tel-input.esm.7e18d9b7.js";import"./QBtnGroup.795f1c45.js";import"./axios.5809c643.js";const pe=g(""),fe=g(""),ve=g([]),ge=g("FACTURAS"),be=g(""),_e=g([]),K=g(!1),ye=g({sortBy:"desc",descending:!1,page:1,rowsPerPage:10,rowsNumber:15}),Ze=()=>{const{api:W,claim:x,route:N}=le(),y=async(z=1,w=10,h=!1)=>{try{K.value=!0;let s={tipo:ge.value,"company-id":x.company.id,"sucursal-id":ve.value,desde:pe.value,hasta:fe.value};h&&(w=1e5);const{data:r}=await W.get("/invoices",{params:{page:z,limit:w,busqueda:be.value},headers:s});if(ye.value.rowsNumber=r.meta.totalItems,r.items.map(b=>{b.created_at=Me.formatDate(b.created_at,"DD/MM/YYYY HH:mm a"),b.loading=!1}),h)return r.items;_e.value=r.items}catch(s){console.log(s)}finally{K.value=!1}};return{generarExcel:async()=>{let w=(await y(1,1,!0)).map(r=>[r.created_at.split(" ")[0],r.numero_comprobante,r.clave_acceso,r.customer_id.nombres,r.customer_id.numero_documento,r.subtotal,r.iva,r.total,r.estadoSRI]);w=w.filter(r=>r[8]=="AUTORIZADO");const h=new Le.Workbook,s=h.addWorksheet("Hoja1");s.columns=[{header:"Fecha",key:"Fecha",width:15,style:{font:{bold:!0},alignment:{horizontal:"center"}}},{header:"# Documento",key:"Documento",width:22,style:{font:{bold:!0},alignment:{horizontal:"center"}}},{header:"CA/NA",key:"CA",width:53,style:{font:{bold:!0},alignment:{horizontal:"center"}}},{header:"Persona",key:"Persona",width:45,style:{font:{bold:!0},alignment:{horizontal:"center"}}},{header:"Identificaci\xF3n",key:"Identificaci\xF3n",width:18,style:{font:{bold:!0},alignment:{horizontal:"center"}}},{header:"Subtotal",key:"Subtotal",width:14,style:{font:{bold:!0},alignment:{horizontal:"center"}}},{header:"IVA",key:"IVA",width:10,style:{font:{bold:!0},alignment:{horizontal:"center"}}},{header:"Total",key:"Total",width:14,style:{font:{bold:!0},alignment:{horizontal:"center"}}}],w.forEach((r,b)=>{Object.assign(s.getCell(`A${b+2}`),{value:r[0],font:{bold:!1}}),Object.assign(s.getCell(`B${b+2}`),{value:r[1],font:{bold:!1}}),Object.assign(s.getCell(`C${b+2}`),{value:r[2],font:{bold:!1}}),Object.assign(s.getCell(`D${b+2}`),{value:r[3],font:{bold:!1}}),Object.assign(s.getCell(`E${b+2}`),{value:r[4],font:{bold:!1}}),Object.assign(s.getCell(`F${b+2}`),{value:r[5],font:{bold:!1}}),Object.assign(s.getCell(`G${b+2}`),{value:r[6],font:{bold:!1}}),Object.assign(s.getCell(`H${b+2}`),{value:r[7],font:{bold:!1}})}),h.xlsx.writeBuffer().then(r=>{const b=new Blob([r],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),c=URL.createObjectURL(b),C=document.createElement("a");C.href=c,C.download="archivo.xlsx",document.body.appendChild(C),C.click(),document.body.removeChild(C)})},sucursal_selected:ve,dateOne:pe,getVentas:y,tipoComprobantes:ge,loading:K,pagination:ye,rows:_e,filter:be,dateTwo:fe}};const He={class:"text-h6 text-center"},We={class:"row flex flex-center"},Ge={class:"col-xs-11 col-sm-9 text-center q-mt-md q-mb-lg"},Je=i("label",null,"Enviar por:",-1),Ye={key:0,class:"col-xs-11 col-sm-9 text-center q-mb-md"},Xe=i("label",null,"Celular del cliente:",-1),Ke={key:1,class:"col-xs-11 col-sm-9 text-center"},el=i("label",null,"Email del cliente:",-1),ll={class:"col-xs-9 col-md-12 flex justify-center q-ml-none"},al={__name:"ModalReenviarComproantes",props:["detalleFactura"],emits:["closeModal"],setup(W,{emit:x}){const N=W,{api:y,mostrarNotify:H,claim:z}=le(),w=g(!1),h=g(!1),s=g({tipo_envio:"",telefono:"",email:""});s.value.telefono=N.detalleFactura.customer_id.celular,s.value.email=N.detalleFactura.customer_id.email;const r=()=>{w.value=!1;const p=/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;let m=[];return s.value.tipo_envio=="whatsapp"&&m.push("telefono"),s.value.tipo_envio=="email"&&m.push("email"),s.value.tipo_envio=="ambas"&&(m=["telefono","email"]),s.value.tipo_envio==""&&(m=["tipo_envio"]),s.value.email.length>5&&!p.test(s.value.email)&&(c.value.email.message="Ingresa un email valido",c.value.email.isValid=!1,w.value=!0),m.forEach(O=>{s.value[O].length==0&&(c.value[O].message="Debes completar este campo",c.value[O].isValid=!1,w.value=!0)}),w.value};function b(p){return p.startsWith("593")?p:(p=p.replace(/\s/g,"").replace(/-/g,""),p.startsWith("0")?"593"+p.substring(1):"593"+p)}const c=g({telefono:{message:"",isValid:!0},tipo_envio:{message:"",isValid:!0},email:{message:"",isValid:!0}}),C=async()=>{const{data:p}=await y.get(`/companies/find/${z.company.id}`);if(!r()&&!((s.value.tipo_envio=="whatsapp"||s.value.tipo_envio=="ambas")&&!c.value.telefono.isValid))try{h.value=!0,await y.post("/CE/facturas/reenviar-comprobantes",{...s.value,factura:N.detalleFactura,number:s.value.telefono,telefono:b(p[0].telefono)}),H("positive","Comprobantes enviados"),x("closeModal"),h.value=!1}catch(m){h.value=!1,H("warning",m.response.data.message),x("closeModal")}},E=p=>{c.value.telefono.isValid=!p};return(p,m)=>(u(),d(Re,{style:{width:"400px","max-width":"80vw"}},{default:a(()=>[o(oe,null,{default:a(()=>[i("div",He,[R(" Enviar Comprobantes "),P(o(I,{round:"",flat:"",dense:"",icon:"close",class:"float-right",color:"grey-8"},null,512),[[L]])])]),_:1}),o(Ae,{inset:""}),o(oe,{class:"q-pt-none"},{default:a(()=>[i("div",We,[i("div",Ge,[Je,o(ee,{filled:"",dense:"",modelValue:s.value.tipo_envio,"onUpdate:modelValue":m[0]||(m[0]=O=>s.value.tipo_envio=O),error:!c.value.tipo_envio.isValid,"emit-value":"","map-options":"",options:[{label:"WhatsApp",value:"whatsapp"},{label:"Email",value:"email"},{label:"Ambas",value:"ambas"}]},{append:a(()=>[s.value.tipo_envio.length!=0&&s.value.tipo_envio=="whatsapp"?(u(),d($,{key:0,name:"fa-brands fa-whatsapp",color:"teal-7"})):v("",!0),s.value.tipo_envio.length!=0&&s.value.tipo_envio=="email"?(u(),d($,{key:1,name:"mail",color:"indigo-5"})):v("",!0),s.value.tipo_envio.length!=0&&s.value.tipo_envio=="ambas"?(u(),d($,{key:2,name:"fa-solid fa-list-check",color:"deep-orange-4"})):v("",!0)]),error:a(()=>[i("label",{class:D(p.$q.dark.isActive?"text-red-4":"text-negative")},A(c.value.tipo_envio.message),3)]),_:1},8,["modelValue","error"])]),s.value.tipo_envio=="whatsapp"||s.value.tipo_envio=="ambas"?(u(),M("div",Ye,[Xe,o(n(je),{"default-country":"EC","search-text":"Buscar pais...","onUpdate:modelValue":m[1]||(m[1]=O=>c.value.telefono.isValid=!0),onError:E,error:!c.value.telefono.isValid,filled:"",dense:"",tel:s.value.telefono,"onUpdate:tel":m[2]||(m[2]=O=>s.value.telefono=O)},{error:a(()=>[i("label",{class:D(p.$q.dark.isActive?"text-red-4":"text-negative")},A(c.value.telefono.message),3)]),_:1},8,["error","tel"])])):v("",!0),s.value.tipo_envio=="email"||s.value.tipo_envio=="ambas"?(u(),M("div",Ke,[el,o(J,{type:"email",modelValue:s.value.email,"onUpdate:modelValue":[m[3]||(m[3]=O=>s.value.email=O),m[4]||(m[4]=O=>c.value.email.isValid=!0)],"input-class":"resaltarTextoInput",error:!c.value.email.isValid,"lazy-rules":"",dense:"",filled:""},{error:a(()=>[i("label",{class:D(p.$q.dark.isActive?"text-red-4":"text-negative")},A(c.value.email.message),3)]),_:1},8,["modelValue","error"])])):v("",!0),i("div",ll,[o(I,{label:"Enviar",onClick:C,loading:h.value,class:"q-px-xl q-mt-md q-mb-md",outline:"",rounded:"",style:{color:"#696cff"}},null,8,["loading"])])])]),_:1})]),_:1}))}};const tl={class:"q-mx-lg q-pt-md"},ol={class:"row q-col-gutter-lg"},sl={style:{display:"flex"}},nl={class:"col-xs-12 col-sm-3"},rl={class:"q-mr-sm row q-pt-sm justify-center"},il={class:"col-xs-10 col-sm-4"},ul={class:"row items-center justify-end"},dl={class:"col-xs-12 col-sm-1 flex flex-center"},cl={class:"col-xs-10 col-sm-4"},ml={class:"row items-center justify-end"},pl={key:0,class:"flex flex-center"},fl={class:"col-12 q-pt-none"},vl={key:0,class:"text-center row justify-center",style:{width:"100%"}},gl=i("label",{class:"q-mb-sm text-grey-7 text-h6"}," Listado de Comprobantes ",-1),bl=[gl],_l=i("label",{class:"q-mr-sm row items-center"},[i("span",null,"Tipo: ")],-1),yl=i("label",{class:"q-mr-sm row items-center"},[i("span",null,"Por Sucursal: ")],-1),Rl=i("div",{class:"full-width row flex-center text-lime-10 q-gutter-sm"},[i("span",{class:"text-subtitle1"}," No se encontr\xF3 ningun resultado ")],-1),Zl={__name:"IndexPage",setup(W){let x;const{api:N,claim:y,route:H}=le(),z=()=>{const l=new Fe("https://facturacion.rednuevaconexion.net/socket.io/socket.io.js",{extraHeaders:{autentication:y.id}});x==null||x.removeAllListeners(),x=l.socket("/"),x.on("updateStateInvoice",async()=>{await V()})},w=[{name:"acciones",label:"acciones",align:"center"},{name:"sucursal",label:"Sucursal",align:"center"},{name:"num_comprobante",label:"Num. Comprobante",field:"numero_comprobante",align:"center"},{name:"usuario",label:"Usuario",align:"center"},{name:"cliente",label:"Cliente",align:"center"},{name:"f/h",label:"Fecha/Hora",align:"center",field:"created_at"},{name:"total",label:"Total",name:"total",align:"center"},{name:"estado",label:"Estado",field:"estado",align:"center"}],h=g(),s=g(!1),r=g(!1),{generarExcel:b,sucursal_selected:c,tipoComprobantes:C,dateOne:E,loading:p,filter:m,rows:O,pagination:U,getVentas:V,dateTwo:S}=Ze(),Ie=async(l,t)=>{l.company_name=l.sucursal_id.company_id.nombre_comercial,l.ruc=l.sucursal_id.company_id.ruc,l.direccion=l.sucursal_id.direccion;const e={cliente:l.customer_id.nombres,tipoDoc:l.customer_id.tipo_documento,num_doc:l.customer_id.numero_documento,email:l.customer_id.email};l.forma_pago=="01"&&(l.forma_pago="SIN UTILIZACION DEL SISTEMA FINANCIERO"),l.forma_pago=="15"&&(l.forma_pago="COMPENSACI\xD3N DE DEUDAS"),l.forma_pago=="16"&&(l.forma_pago="TARJETA DE D\xC9BITO"),l.forma_pago=="17"&&(l.forma_pago="DINERO ELECTR\xD3NICO"),l.forma_pago=="18"&&(l.forma_pago="TARJETA PREPAGO"),l.forma_pago=="19"&&(l.forma_pago="TARJETA DE CR\xC9DITO"),l.forma_pago=="20"&&(l.forma_pago="OTROS CON UTILIZACI\xD3N DEL SISTEMA FINANCIERO"),l.forma_pago=="21"&&(l.forma_pago="ENDOSO DE T\xCDTULOS");const{imprimirFactura:f}=Be();let k=f(l,e,y.fullName,t);var j=window.open("","_blank");j.document.write(k),j.print(),j.close()},ae=g({}),B=g([]),te=g({}),{validarPermisos:Y}=Qe(),_=Pe();se(C,(l,t)=>{V()});const we=()=>{const{tipo:l,fecha:t}=H.params;l!=""&&(C.value=l),t!=""&&(E.value=t.split(" - ")[0].replace(/-/g,"/"),S.value=t.split(" - ")[1].replace(/-/g,"/"))};async function he(l){const{page:t,rowsPerPage:e,sortBy:f,descending:k}=l.pagination;p.value=!0,await V(t,e),U.value.page=t,U.value.rowsPerPage=e,U.value.sortBy=f,U.value.descending=k,p.value=!1}const Ce=async()=>{const{data:l}=await N.post("/invoices/download-comprobantes",{sucursal_id:c.value,desde:E.value,hasta:S.value},{responseType:"arraybuffer"}),t=new Blob([l],{type:"application/zip"}),e=document.createElement("a");e.href=window.URL.createObjectURL(t),e.download="facturas.zip",document.body.appendChild(e),e.click(),document.body.removeChild(e)},Oe=l=>{_.dialog({title:"<center>\xBFEstas seguro de anular esta factura?</center>",message:`<span style="display: block;width: 100%;display: flex;align-items: center;">
                  <strong style="display: inline-block;width: 40%;text-align: end;">
                    Num Comprobante:
                  </strong>
                  <label style="display: inline-block;width: 57%;" class="q-ml-xs">
                    ${l.numero_comprobante}
                  </label>
                </span>
              <span class='q-my-xs' style="display: block;width: 100%;display: flex;align-items: center;">
                <strong style="display: inline-block;width: 40%;text-align: end;">
                  Cliente:
                </strong>
                <label style="display: inline-block;width: 57%;" class="q-ml-xs">
                  ${l.customer_id.nombres}
                </label>
              </span>
              <span class='q-my-xs' style="display: block;width: 100%;display: flex;align-items: center;">
                <strong style="display: inline-block;width: 40%;text-align: end;">
                  Fecha/Hora:
                </strong>
                <label style="display: inline-block;width: 57%;" class="q-ml-xs">
                  ${l.created_at}
                </label>
              </span>
              <span style="display: block;width: 100%;display: flex;align-items: center;">
                <strong style="display: inline-block;width: 40%;text-align: end;">
                  Total:
                </strong>
                <label style="display: inline-block;width: 57%;" class="q-ml-xs">
                  $${l.total}
                </label>
              </span>`,html:!0,ok:{push:!0,label:"Anular",color:"teal-7"},cancel:{push:!0,color:"blue-grey-8",label:"Cancelar"}}).onOk(async()=>{try{l.loading=!0,await N.post("/CE/facturas/anularFactura",{factura:{...l,entity:"Ventas",tipo_comprobante:"nota_credito"}}),l.loading=!1}catch(t){console.log(t)}})};se(c,(l,t)=>{V()});const Ee=async l=>{p.value=!0,B.value=[];const{data:t}=await N.get(`/sucursal/find/${l}/company`);(y.roles[0]=="SUPER-ADMINISTRADOR"||y.roles[0]=="ADMINISTRADOR")&&B.value.unshift({label:"TODOS",value:null}),t.forEach(e=>{B.value.push({label:e.nombre,value:e.id})}),B.value.length!=0&&(c.value=B.value[0].value)},ke=async l=>{l.loading=!0;let t="",e="";l.estadoSRI.trim()=="ERROR ENVIO RECEPCION"||l.estadoSRI.trim()=="ERROR ENVIO AUTORIZACION"||l.estadoSRI.trim()=="RECIBIDA"||l.estadoSRI.trim()=="ANULACION - RECIBIDA"?(t="factura",e=l.clave_acceso):(t="nota_credito",e=l.clave_acceso_nota_credito);const f=l.invoiceToProduct.map(F=>({aplicaIva:F.product_id.aplicaIva,cantidad:F.cantidad,pvp:parseFloat(F.v_total)/F.cantidad,descuento:F.product_id.descuento,nombre:F.product_id.nombre,codigoBarra:F.product_id.codigoBarra}));let k={headers:{"sucursal-id":l.sucursal_id.id}},j={ambiente:l.sucursal_id.ambiente,clave_acceso:e,company_name:y.company.nombre_comercial,sucursal_id:l.sucursal_id.id,customer_id:l.customer_id.id,descripcion:l.descripcion,num_comprobante:l.numero_comprobante,tipo:"EMISION",subtotal:parseFloat(l.subtotal),iva:parseFloat(l.iva),descuento:parseFloat(l.descuento),total:parseFloat(l.total),entity:"Ventas",tipo_comprobante:t,pago_id:l.id,user_id:l.user_id.id,porcentaje_iva:l.porcentaje_iva,forma_pago:l.forma_pago,products:f};(l.estadoSRI.trim()=="ERROR ENVIO RECEPCION"||l.estadoSRI.trim()=="ERROR ENVIO RECEPCION - ANULACION")&&await N.post("/CE/facturas/recepcionComprobantesOffline",j,k),(l.estadoSRI.trim()=="RECIBIDA"||l.estadoSRI.trim()=="ERROR ENVIO AUTORIZACION"||l.estadoSRI.trim()=="ERROR ENVIO AUTORIZACION - ANULACION")&&await N.post("/CE/facturas/autorizacionComprobantesOffline",j,k)};z(),we();const T=g("list");return xe(async()=>{(y.roles[0]=="SUPER-ADMINISTRADOR"||y.roles[0]=="ADMINISTRADOR")&&await Ee(y.company.id),h.value.requestServerInteraction()}),(l,t)=>(u(),M(re,null,[i("div",tl,[i("div",ol,[i("div",sl,[i("div",{style:{display:"flex"},class:D([n(_).screen.xs?"q-mb-md q-mt-none q-pt-xs":"q-ml-lg q-pl-none q-my-md"])},[i("div",{class:D(["row",[n(_).screen.xs?"flex-center":""]])},[i("div",nl,[i("label",rl,[i("span",{class:D([n(_).screen.xs?"text-weight-bold":""])}," Filtrar por fecha: ",2)])]),i("div",il,[o(J,{outlined:"",dense:"",modelValue:n(E),"onUpdate:modelValue":t[3]||(t[3]=e=>q(E)?E.value=e:null),mask:"date"},{append:a(()=>[n(E)!==""?(u(),d($,{key:0,name:"close",onClick:t[0]||(t[0]=e=>(E.value="",n(V)(l.page=1,l.limit=10))),class:"cursor-pointer"})):v("",!0),o($,{name:"event",class:"cursor-pointer"},{default:a(()=>[o(ue,{cover:"","transition-show":"scale","transition-hide":"scale"},{default:a(()=>[o(ie,{modelValue:n(E),"onUpdate:modelValue":[t[1]||(t[1]=e=>q(E)?E.value=e:null),t[2]||(t[2]=e=>n(V)(l.page=1,l.limit=10))]},{default:a(()=>[i("div",ul,[P(o(I,{label:"Close",color:"primary",flat:""},null,512),[[L]])])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),i("div",dl,[i("label",{class:D(["q-mx-md",[n(_).screen.xs?"text-weight-medium":""]])}," Hasta ",2)]),i("div",cl,[o(J,{outlined:"",dense:"",modelValue:n(S),"onUpdate:modelValue":t[8]||(t[8]=e=>q(S)?S.value=e:null),mask:"date"},{append:a(()=>[n(S)!==""?(u(),d($,{key:0,name:"close",onClick:t[4]||(t[4]=e=>(S.value="",n(V)(l.page=1,l.limit=10))),class:"cursor-pointer"})):v("",!0),o($,{name:"event",class:"cursor-pointer"},{default:a(()=>[o(ue,{cover:"","transition-show":"scale","transition-hide":"scale"},{default:a(()=>[o(ie,{modelValue:n(S),"onUpdate:modelValue":[t[6]||(t[6]=e=>q(S)?S.value=e:null),t[7]||(t[7]=e=>n(V)(l.page=1,l.limit=10))]},{default:a(()=>[i("div",ml,[P(o(I,{onClick:t[5]||(t[5]=e=>n(V)(l.page=1,l.limit=10)),label:"Close",color:"primary",flat:""},null,512),[[L]])])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"])])],2)],2),n(_).screen.width>=935?(u(),M("div",pl,[o(Ve,{class:"q-ml-md",label:"Descargar Documento",outline:"",color:"primary",icon:"download"},{default:a(()=>[o(Se,null,{default:a(()=>[P((u(),d(me,{clickable:"",onClick:Ce},{default:a(()=>[o(de,null,{default:a(()=>[o(ce,null,{default:a(()=>[R("Descargar Facturas")]),_:1})]),_:1})]),_:1})),[[L]]),P((u(),d(me,{onClick:n(b),clickable:""},{default:a(()=>[o(de,null,{default:a(()=>[o(ce,null,{default:a(()=>[R("Descargar EXCEL")]),_:1})]),_:1})]),_:1},8,["onClick"])),[[L]])]),_:1})]),_:1})])):v("",!0)]),i("div",fl,[o(Re,{flat:"",class:"shadow_custom"},{default:a(()=>[o(Te,{"title-class":"text-grey-7 text-h6","hide-header":T.value==="grid",loading:n(p),columns:w,"row-key":"name",grid:T.value==="grid",rows:n(O),filter:n(m),pagination:n(U),"onUpdate:pagination":t[14]||(t[14]=e=>q(U)?U.value=e:null),"rows-per-page-options":[10,15,20,0],ref_key:"tableRef",ref:h,"binary-state-sort":"",onRequest:he},{loading:a(()=>[o(De,{showing:"",color:"primary"})]),header:a(e=>[o($e,{props:e,style:{height:"60px"}},{default:a(()=>[(u(!0),M(re,null,Ne(e.cols,f=>(u(),d(qe,{key:f.name,props:e,class:"text-grey-7 text-weight-bold text-uppercase",style:{"font-size":"13px"}},{default:a(()=>[R(A(f.label),1)]),_:2},1032,["props"]))),128))]),_:2},1032,["props"])]),"top-left":a(e=>[n(_).screen.xs?(u(),M("div",vl,bl)):v("",!0),i("div",{style:X([{display:"flex"},!n(_).screen.xs||"width: 100%;justify-content: center;position: relative;right: 8px;"]),class:D([n(_).screen.xs?"q-mb-md":""])},[_l,o(ee,{outlined:"",dense:"",modelValue:n(C),"onUpdate:modelValue":t[9]||(t[9]=f=>q(C)?C.value=f:null),"emit-value":"","map-options":"",options:[{label:"Todos",value:"FACTURAS"},{label:"Facturas Anuladas",value:"ANULADO"},{label:"Facturas Autorizadas",value:"AUTORIZADO"}]},null,8,["modelValue"])],6),n(y).roles[0]=="SUPER-ADMINISTRADOR"||n(y).roles[0]=="ADMINISTRADOR"?(u(),M("div",{key:1,style:X([!n(_).screen.xs||"width: 100%;justify-content: center;",{display:"flex"}]),class:D([n(_).screen.xs?"q-mb-md":"q-ml-lg"])},[yl,o(ee,{outlined:"",dense:"",modelValue:n(c),"onUpdate:modelValue":t[10]||(t[10]=f=>q(c)?c.value=f:null),"emit-value":"","map-options":"",options:B.value},null,8,["modelValue","options"])],6)):v("",!0)]),"top-right":a(e=>[n(_).screen.width>=1023&&n(Y)("crear.venta")?(u(),d(I,{key:0,onClick:t[11]||(t[11]=f=>l.$router.push("/ventas/add")),outline:"",color:"primary",label:"Agregar Factura",class:"q-mr-xs"})):v("",!0),o(J,{style:X(n(_).screen.width>700||"width: 70%"),outlined:"",dense:"",debounce:"800",modelValue:n(m),"onUpdate:modelValue":t[12]||(t[12]=f=>q(m)?m.value=f:null),modelModifiers:{trim:!0},placeholder:"Buscar..."},{append:a(()=>[o($,{name:"search"})]),_:1},8,["style","modelValue"]),T.value==="list"?(u(),d(I,{key:1,flat:"",round:"",dense:"",icon:e.inFullscreen?"fullscreen_exit":"fullscreen",onClick:e.toggleFullscreen},{default:a(()=>[P((u(),d(Q,{disable:n(_).platform.is.mobile},{default:a(()=>[R(A(e.inFullscreen?"Exit Fullscreen":"Toggle Fullscreen"),1)]),_:2},1032,["disable"])),[[L]])]),_:2},1032,["icon","onClick"])):v("",!0),e.inFullscreen?v("",!0):(u(),d(I,{key:2,flat:"",round:"",dense:"",icon:T.value==="grid"?"list":"grid_on",onClick:t[13]||(t[13]=f=>{T.value=T.value==="grid"?"list":"grid",l.separator=T.value==="grid"?"none":"horizontal"})},{default:a(()=>[P((u(),d(Q,{disable:n(_).platform.is.mobile},{default:a(()=>[R(A(T.value==="grid"?"List":"Grid"),1)]),_:1},8,["disable"])),[[L]])]),_:1},8,["icon"]))]),"body-cell-total":a(e=>[o(Z,{props:e},{default:a(()=>[R(" $"+A(e.row.total),1)]),_:2},1032,["props"])]),"body-cell-cliente":a(e=>[o(Z,{props:e},{default:a(()=>[R(A(e.row.customer_id.nombres),1)]),_:2},1032,["props"])]),"body-cell-sucursal":a(e=>[o(Z,{props:e},{default:a(()=>[R(A(e.row.sucursal_id.nombre),1)]),_:2},1032,["props"])]),"body-cell-usuario":a(e=>[o(Z,{props:e},{default:a(()=>[R(A(e.row.user_id.fullName.toUpperCase()),1)]),_:2},1032,["props"])]),"body-cell-estado":a(e=>[o(Z,{props:e},{default:a(()=>[e.row.estadoSRI=="NO AUTORIZADO"||e.row.estadoSRI.trim()=="DEVUELTA"?(u(),d(G,{key:0,outline:"",class:"q-py-xs q-px-md",color:n(_).dark.isActive?"warning":"orange-10",label:e.row.estadoSRI},{default:a(()=>[o(Q,{anchor:"center left",self:"center right",offset:[10,10],class:"blue-grey-9 text-subtitle2"},{default:a(()=>[R(A(e.row.respuestaSRI),1)]),_:2},1024)]),_:2},1032,["color","label"])):e.row.estadoSRI=="AUTORIZADO"?(u(),d(G,{key:1,outline:"",class:"q-py-xs q-px-md",color:"secondary",label:e.row.estadoSRI},null,8,["label"])):e.row.estadoSRI=="ANULADO"?(u(),d(G,{key:2,class:"q-py-xs q-px-md",color:"red-4",label:e.row.estadoSRI},null,8,["label"])):(u(),d(G,{key:3,outline:"",class:"q-py-xs q-px-md",color:n(_).dark.isActive?"blue-grey-3":"blue-grey-7",label:e.row.estadoSRI},{default:a(()=>[o(Q,{anchor:"center left",self:"center right",offset:[10,10],class:"blue-grey-9 text-subtitle2"},{default:a(()=>[R(A(e.row.estadoSRI),1)]),_:2},1024)]),_:2},1032,["color","label"]))]),_:2},1032,["props"])]),"body-cell-acciones":a(e=>[o(Z,{props:e},{default:a(()=>{var f;return[e.row.estadoSRI.trim()==="ERROR ENVIO RECEPCION"||e.row.estadoSRI.trim()==="ERROR ENVIO RECEPCION - ANULACION"||e.row.estadoSRI.trim()==="ERROR ENVIO AUTORIZACION"||e.row.estadoSRI.trim()==="RECIBIDA"||e.row.estadoSRI.trim()==="ERROR ENVIO AUTORIZACION - ANULACION"?(u(),d(I,{key:0,round:"",color:"deep-orange-8",icon:"fa-solid fa-retweet",loading:e.row.loading,onClick:k=>ke(e.row),size:"10px",class:"q-mr-sm"},{default:a(()=>[o(Q,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:a(()=>[R(" Reenviar Factura Electr\xF3nica ")]),_:1})]),_:2},1032,["loading","onClick"])):v("",!0),e.row.estadoSRI.trim()!=="PROFORMA"?(u(),d(I,{key:1,round:"",color:"blue-grey",icon:"print",onClick:k=>Ie(e.row,"factura"),size:"10px",class:"q-mr-sm"},{default:a(()=>[o(Q,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:a(()=>[R(" Imprimir comprobante ")]),_:1})]),_:2},1032,["onClick"])):v("",!0),o(I,{round:"",color:"blue-grey",icon:"visibility",size:"10px",class:"q-mr-sm",onClick:k=>(r.value=!0,ae.value={...e.row})},null,8,["onClick"]),e.row.estadoSRI=="PROFORMA"||e.row.estadoSRI.trim()=="ERROR ENVIO RECEPCION"||e.row.estadoSRI.trim()=="ERROR ENVIO RECEPCION - ANULACION"||e.row.estadoSRI.trim()=="PENDIENTE"?(u(),d(I,{key:2,onClick:k=>l.$router.push(`ventas/add/${e.row.id}`),round:"",color:"blue-grey",icon:"description",size:"10px",class:"q-mr-sm"},null,8,["onClick"])):v("",!0),e.row.customer_id.nombres!=="CONSUMIDOR FINAL"&&(e.row.estadoSRI=="AUTORIZADO"||((f=e.row.respuestaSRI)==null?void 0:f.includes("ERROR SECUENCIAL REGISTRADO")))&&n(Y)("anular.venta")?(u(),d(I,{key:3,round:"",color:"blue-grey",class:"q-mr-sm",onClick:k=>Oe(e.row),loading:e.row.loading,icon:"close",size:"10px"},null,8,["onClick","loading"])):v("",!0),e.row.estadoSRI=="AUTORIZADO"||e.row.estadoSRI=="PROFORMA"?(u(),d(I,{key:4,round:"",color:"blue-grey",onClick:k=>(s.value=!0,te.value=e.row),icon:"forward_to_inbox",size:"11px"},{default:a(()=>[o(Q,{class:"bg-indigo",anchor:"top middle",self:"center middle"},{default:a(()=>[R(" Enviar comprobante por email ")]),_:1})]),_:2},1032,["onClick"])):v("",!0)]}),_:2},1032,["props"])]),"no-data":a(({icon:e})=>[Rl]),_:1},8,["hide-header","loading","grid","rows","filter","pagination"])]),_:1})])])]),n(_).screen.width<=1023&&n(Y)("crear.venta")?(u(),d(Ue,{key:0,position:"bottom-right",offset:[18,18]},{default:a(()=>[o(I,{round:"",color:"secondary",size:"lg",icon:"add",onClick:t[15]||(t[15]=e=>l.$router.push("/ventas/add"))})]),_:1})):v("",!0),o(ne,{modelValue:r.value,"onUpdate:modelValue":t[16]||(t[16]=e=>r.value=e)},{default:a(()=>[o(ze,{detalleData:ae.value},null,8,["detalleData"])]),_:1},8,["modelValue"]),o(ne,{modelValue:s.value,"onUpdate:modelValue":t[18]||(t[18]=e=>s.value=e)},{default:a(()=>[o(al,{onCloseModal:t[17]||(t[17]=e=>s.value=!1),detalleFactura:te.value},null,8,["detalleFactura"])]),_:1},8,["modelValue"])],64))}};export{Zl as default};