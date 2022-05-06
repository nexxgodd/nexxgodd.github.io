// ==UserScript==
// @name Inventory++
// @namespace   dealersocket
// @include    http://inventory.dealersocket.com/admin/vehicle/*
// @include    https://inventory.dealersocket.com/admin/vehicle/*
// @description  extra functionality for molding vehicles
// ==/UserScript==

//eBay price $("section .pricing_tooltip :first-child")
var eb = document.createElement("div");
eb.innerHTML+='<button type="button" id="priceEBay" style="margin:5px;">Fill eBay</button>';
$("#vehicle_pricing_panel section")[0].insertBefore(eb,null);
document.getElementById("priceEBay").addEventListener("click", doPriceEBay);

//descriptive title length
eb = document.getElementById('vehicle_ebay_info_panel').getElementsByTagName('section')[3].children[0];
eb.innerHTML+='<br>[<span id="dlLength">0</span>/80]';
document.getElementById('bb_subtitle').addEventListener("change", updateDLT);
document.getElementById('bb_subtitle').addEventListener("input", updateDLT);
document.getElementById('bb_subtitle').addEventListener("keydown", updateDLT);
updateDLT();

//finish button
eb.innerHTML+='<br><button type="button" id="finishButton">Finish</button>';
document.getElementById("finishButton").addEventListener("click", doFinishListing);

//copy button
document.getElementById('bb_subtitle_length').parentNode.innerHTML+='<br><button type="button" id="copyLButton">Copy</button>';
document.getElementById("copyLButton").addEventListener("click", doCopyListing);

//disc button   select first 3
//var cont = document.getElementById('controls');
//cont.innerHTML='<button type="button" id="selectD">Select Discription</button>'+cont.innerHTML;
//document.getElementById("selectD").addEventListener("click", doCopyListing);

//check missing side bar
eb = document.createElement("div");
eb.id="missingSide";
eb.classList.add("section");
eb.innerHTML='<p id="sideHo" style="color: black;">loading...</p><button type="button" id="sideButton">Update</button>';
var sb =document.getElementById("sidebar");
sb.insertBefore(eb,sb.children[0]);
document.getElementById("sideButton").addEventListener("click", checkMissing);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//wait for discription to load
var checkExist = setInterval(function(){
  if ($('#tinymce-252').length){
    console.log("Exists!");
    $("iFrame#bb_description2_ifr").height(10);
    $('#tinymce-245-body')[0].innerHTML+='<div class="mce-flow-layout-item mce-btn-group mce-btn mce-btn-small"><button type="button" id="scriptButton" tabindex="-1">Script</button></div>';
    document.getElementById("scriptButton").addEventListener("click", doScript);
    clearInterval(checkExist);
    checkMissing();
    $(".save-vehicle-edit-button").on("click", checkMissing);
  }
}, 1000); // check every second

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//update ebay price
function doPriceEBay(){
  var sp=$("#bb_price_selling").val();
  var ebsp=10000;
  //$("#bb_price_reserve").val(sp-1).change();  
  $("#bb_price_reserve").val(0).change();  

  if(sp<6000){
    ebsp=1000;
  }
  else if(sp<11000){
    ebsp=2000;
  }
  else if(sp<16000){
    ebsp=3000;
  }
  else if(sp<21000){
    ebsp=4000;
  }
  else if(sp<26000){
    ebsp=5000;
  }
  else if(sp<31000){
    ebsp=6000;
  }
  else if(sp<39000){
    ebsp=7500;
  }
  $("#bb_price_starting").val(ebsp).change();
}

//update descriptive title length
function updateDLT(){
  var count=document.getElementById('bb_subtitle').value.length;
  document.getElementById('dlLength').innerHTML=count;
  if(count>80){
    $('#dlLength').css("color", "red");
  }
  else{
    $('#dlLength').css("color", "black");
  }
}

//finish discriptive title
function doFinishListing(){
  var copy=document.getElementById('bb_subtitle');
  if (!copy.value.includes(" Vernon Auto Group")){
    copy.value+=" Vernon Auto Group";
    if(document.getElementById('bb_cond').value=="KE5w65s6QhdINom+cB0nrg"){
      copy.value+=' '+Math.floor(document.getElementById('bb_mileage').value/1000)+'k Miles'
    }
    updateDLT();
    $("#bb_subtitle").trigger("change");
  }
}

//copy discriptive title down, plus or minus a few things
function doCopyListing(){
  var copy=document.getElementById('bb_subtitle').value.replace(/^\d{4}/,document.getElementById('bb_trim').value);
  copy=copy.replace(/ Vernon.*/,'').replace(' Cab ', ' ');
  if(document.getElementById('bb_ebay_subtitle').value==''||confirm('Replace existing text?')){
    document.getElementById('bb_ebay_subtitle').value=copy;
    $("#bb_ebay_subtitle").trigger("change");
  }
}


//start the discription
function doScript(){
  var bigassstring='<p><font style="color: #003333;" data-mce-style="color: #003333;" size="3">This <strong>';
  bigassstring+=$("#bb_year").val()+' ';//year
  bigassstring+=$('#bb_make_eid option:selected').text().trim()+' ';//make
  bigassstring+=$("#bb_model").val().trim()+' ';//model
  bigassstring+=$("#bb_trim").val().trim();//trim  
  bigassstring+='</strong> ';
  
  //if used
  if($('#bb_cond option:selected').text().indexOf('Used')!=-1){
    bigassstring+='with only <strong>';
    bigassstring+=$("#bb_mileage").val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    bigassstring+='</strong> miles ';
  }
    
  bigassstring+='is proudly offered by Vernon Auto Group. <br><br></font></p>';
  bigassstring+='<div><font style="color: #003333;" data-mce-style="color: #003333;" size="3"><strong>Vernon Auto Group</strong> - A new, unique way to buy a vehicle! In a small town in North Texas lives a unique company with BIG ideas. ';
  bigassstring+="We're redefining how our customers buy and own vehicles and it's working... Simply put, you will appreciate the easiest, most efficient and enjoyable buying and ownership experience ANYWHERE! In fact, our innovative approach has driven us to be awarded multiple Dealer Rater Awards and named an eBay Motors Top Strategic Seller!";
  bigassstring+='</font><br><br><br><br><font style="color: #003333;" data-mce-style="color: #003333;" size="3">Here are just a few reasons why customers have chosen Vernon Auto Group:</font><br><br></div><ul style="text-align: left; color: #000000;" data-mce-style="text-align: left; color: #000000;"><li><font size="3">Transparent Deals</font></li><li>';
  bigassstring+='<font size="3">Upfront Pricing, No Haggling, No Numbers Game</font></li><li><font size="3">Fast Friendly Service and Delivery <br></font></li><li><font size="3">';
  bigassstring+='Technology driven company with low overhead and a market driven systematic approach to pricing vehicles.<br></font></li></ul><p><br></p><div><font style="color: #003333;" data-mce-style="color: #003333;" size="3">So come by or give us a phone call and lets start your journey on the most fun and enjoyable purchase experience you will ever make. ';
  bigassstring+='Here at Vernon Auto Group our job is to serve you.</font></div><p><br></p><p style="text-align: center;" data-mce-style="text-align: center;"><font style="color: #000000;" data-mce-style="color: #000000;" size="3"><br><span style="font-style: italic; color: #333333;" data-mce-style="font-style: italic; color: #333333;">Call our team today at ';
  bigassstring+='<strong>1-(833)-275-3894</strong></span><br style="font-style: italic; color: #333333;" data-mce-style="font-style: italic; color: #333333;"><span style="font-style: italic; color: #333333;" data-mce-style="font-style: italic; color: #333333;">or email us at</span><br style="font-style: italic; color: #333333;" data-mce-style="font-style: italic;';
  bigassstring+=' color: #333333;"><a href="mailto:internetsales@vernonautogroup.com" data-mce-href="mailto:internetsales@vernonautogroup.com"><span style="font-weight: bold;" data-mce-style="font-weight: bold;">internetsales@vernonautogroup.com</span></a></font><br><br><br>';

  bigassstring+='<font style="color: #666666;" data-mce-style="color: #666666;" size="2"><span><strong><em>';
  bigassstring+='Manufacturer’s Rebate subject to residency restrictions.  Any customer not meeting the residency restrictions will receive a dealer discount in the same amount of the manufacturer’s rebate.';
  bigassstring+='</em></strong></span></font></p>';
  
  bigassstring+='<p style="text-align: center;" data-mce-style="text-align: center;"><span style="font-size: medium;" data-mce-style="font-size: medium;"><font size="3">';
  bigassstring+='All vehicles go through our vigorous multi-point inspection before advertised to the public. ';
  bigassstring+='We appreciate the opportunity to earn your business. For more information please call us at <strong>1-(833)-275-3894</strong> or email us at <a href="mailto:internetsales@vernonautogroup.com" data-mce-href="mailto:internetsales@vernonautogroup.com"><span style="font-weight: bold;" data-mce-style="font-weight: bold;">';
  bigassstring+='internetsales@vernonautogroup.com</span></a>.</font></span></p>';
  

  //This ($year) ($make) ($model) ($submodel) with only ($mileage) miles is proudly offered by Vernon Auto Group.
  var mce = $("iFrame#bb_description_ifr").contents().find("#tinymce");
  if(mce.html().length<25||confirm('Replace existing text?')){
    mce.html(bigassstring);
    //mce.parent().trigger("keyup");
  }
}


//check for missing info
function checkMissing(){
  /*
  $('#').val().trim()
  $('#').text().trim()

  if(!$('#').text().trim()){
    out+="<br>";
  }
  
  if(!$('#').val().trim()){
    out+="<br>";
  }
  
  $('#').text().trim()=="-select-"||
  
  temp=$('# option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="<br>";
  }
  */
  
  $("#sideHo").html('loading...');
  
  var out='';
  var temp='';
  var cond=$('#cond option:selected').text().trim();
  var bod=$('#body_type option:selected').text().trim();
  
  var temp=$('#style_eid option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="Decode String<br>";
  }
  if(!$('#year').val().trim()){
    out+="Year<br>";
  }
  temp=$('#make_eid option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="Make<br>";
  }
  if(!$('#model').val().trim()){
    out+="Model<br>";
  }
  if(!$('#trim').val().trim()){
    out+="Trim<br>";
  }
  temp=$('#mileage').val().trim();
  if(!temp||(cond!="New"&&temp==0)){
    out+="Mileage<br>";
  }
  temp=$('#engine_eid option:selected').text().trim();
  if(!temp||temp=="-select-"){
    if(!$('#engine_name').val().trim()){
      out+="Engine<br>";
    }
  }
  temp=$('#custom_warranty_eid option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="Warranty<br>";
  }
  temp=$('#vehicle_type option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="Vehicle Type<br>";
  }

  //vehicle attributes
  temp=$('#ecolor option:selected').text().trim();
  if(!temp||temp=="-"){
    out+="Generic Color<br>";
  }
  temp=$('#transmission option:selected').text().trim();
  if(!temp||temp=="-"){
    out+="Transmission<br>";
  }
  temp=$('#doors option:selected').text().trim();
  if(!temp||temp=="-"){
    out+="Doors<br>";
  }
  temp=$('#drivetrain option:selected').text().trim();
  if(!temp||temp=="-"){
    out+="Drivetrain<br>";
  }
  temp=$('#engine option:selected').text().trim();
  if(!temp||temp=="-"){
    out+="Cylinders<br>";
  }
  temp=$('#einterior option:selected').text().trim();
  if(!temp||temp=="-"){
    out+="Generic Interior<br>";
  }
  temp=bod;
  if(!temp||temp=="-"){
    out+="Body<br>";
  }
  temp=$('#fuel_type option:selected').text().trim();
  if(!temp||temp=="-"){
    out+="Fuel<br>";
  }

  if(cond=="New"&&!$('#bb_inspection')[0].checked){
    out+="Inspection<br>";
  }
  temp=$('#bb_cab_type option:selected').text().trim();
  if(bod=="Pickup Truck"&&(!temp||temp=="-")){
    out+="Cab<br>";
  }
  
  //pricing
  temp=$('#bb_price_selling').val().trim();
  if(!temp||temp==0){
    out+="Sale Price<br>";
  }
  else{
    temp=$('#bb_price_reserve').val().trim();
    if(temp>0){
      out+="eBay Reserve Price - Should be zero<br>";
    }
    temp=$('#bb_price_starting').val().trim();
    if(!temp||temp==0){
      out+="eBay Starting Price<br>";
    }
  }
  
  //color
  temp=$('#bb_style_exterior_color_eid option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="Factory Color<br>";
  }
  temp=$('#bb_style_interior_color_eid option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="Interior Color<br>";
  }
  
  //ebay
  temp=$('#bb_ebay_store_category option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="eBay Store Category<br>";
  }
  temp=$('#bb_category_eid option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="eBay Category<br>";
  }
  if(!$('#bb_subtitle').val().trim()){
    out+="Descriptive Listing Title<br>";
  }
  if(!$('#bb_ebay_subtitle').val().trim()){
    out+="Subtitle<br>";
  }
  
  temp=$('#bb_staff_eid option:selected').text().trim();
  if(!temp||temp=="-select-"){
    out+="Salesperson<br>";
  }
  
  //wait for discription to load
  var checkExist2 = setInterval(function(){
    if ($('.mce-wordcount').length){
      console.log("Exists!");
      clearInterval(checkExist2);
      if($('.mce-wordcount').html().trim()<2100){
        out+="Description<br>";
      }
      
      if(out){
        out='<font style="color: red;">'+out+'</font>';

      }
      else{
        out='Goochie!';
      }
      $("#sideHo").html(out);
    }
  }, 1000); // check every second
}