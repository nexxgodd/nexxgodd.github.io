// ==UserScript==
// @name Inventory++search
// @namespace dealersocket
// @match https://inventory.dealersocket.com/admin/inventory/*
// @description  adds color to notes
// ==/UserScript==


//green if molded
var a=$(".ds-icon-sticky-note[title*='Molded'i]").css('color','green');
if(a.length==0){
  a=$(".ds-icon-sticky-note[data-original-title*='Molded'i]").css('color','Lime');
  if(a.length!=0){
    $(".cxs7 h3").append(' '+a.length+" molded");
  }
}
else{
  $(".cxs7 h3").append(' '+a.length+" molded");
}


//pink if need a discription
a=$(".ds-icon-sticky-note[title*='Data'i]").css('color','Fuchsia');
if(a.length==0){
  a=$(".ds-icon-sticky-note[data-original-title*='Data'i]").css('color','purple');
    if(a.length!=0){
    $(".cxs7 h3").append(" and "+a.length+" need descriptions");
  }
}
else{
  $(".cxs7 h3").append(" and "+a.length+" need descriptions");
}