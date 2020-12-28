function formatRecipe(){
	let inbox = document.getElementById("recInput");
	let lines = inbox.value.split('\n');
	if(lines.length<3){ 
		document.getElementById("recOutput").value="The input must contain at least 3 lines.";
		return;
	} //escape small list
	let title = lines.shift();
	let title2 = title.replace(/\s|’|\./g, "");
	let direction = lines.pop();
	
	let ingout='';
	lines.forEach(i=>ingout+=`\n\t\t\t\t<li class="col-6 col-md-4">\n\t\t\t\t\t${i}\n\t\t\t\t</li>`);
	
	//long template string
	let out=`<div class="accordion-item">\n\t<h2 class="accordion-header" id="heading${title2}">\n\t\t<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${title2}" aria-expanded="false" aria-controls="collapse${title2}">\n\t\t\t${title}\n\t\t</button>\n\t</h2>\n\t<div id="collapse${title2}" class="accordion-collapse collapse" aria-labelledby="heading${title2}" data-bs-parent="#accordion__page_">\n\t\t<div class="accordion-body">\n\t\t\t<ul class="row ">${ingout}\n\t\t\t</ul>\n\t\t\t<hr>\n\t\t\t<p>\n\t\t\t\t${direction}\n\t\t\t</p>\n\t\t</div>\n\t</div>\n</div>`;
	
	document.getElementById("recOutput").value=out;
	copyOutput();
	inbox.value="";
}

function copyOutput() {
	document.getElementById("recOutput").select();
	document.execCommand("copy");
  } 

