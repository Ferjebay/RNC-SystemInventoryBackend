import{u as c}from"./use-quasar.a4e78766.js";import{api as m}from"./axios.08aaed9e.js";import{r as f,P as l}from"./index.f22722bd.js";const v=()=>{const i=c(),t=f(!1),n=(e,r)=>{t.value=!1,i.dialog({title:"Confirmar",message:e,ok:{push:!0,label:"Eliminar",color:"teal-7"},cancel:{push:!0,color:"blue-grey-8",label:"Cancelar"}}).onOk(async()=>{try{await m.delete(r),o("positive","Registro eliminado exitosamente"),t.value=!0}catch(s){o("negative",s.response.data.message)}})},o=(e,r,s="top-right")=>{let a="";Array.isArray(r)?(a+="<ul>",r.forEach(u=>{a+=`<li> ${u}</li>`}),a+="</ul>"):a=r,i.notify({type:e,message:a,position:s,html:!0})};return{confirmDelete:n,mostrarNotify:o,isDeleted:t,showLoading:(e=!0)=>{e?l.show({message:"Cargando..."}):l.hide()}}};export{v as u};