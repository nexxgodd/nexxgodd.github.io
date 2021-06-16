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

///bingo

var arr=[];
var td=document.getElementsByClassName("bingo-cell");

function makeNew(){
	buildArr();
	mixArr();
	for(let i=0;i<24;i++){
		td[i].innerHTML=arr[i];
	}
}

function mixArr() {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function buildArr2(){
	arr= [
		"breath of the wild 2",
		"metroid prime 4",
		"metroid prime trilogy",
		"2d metroid",
		"new smash character",
		"animal crossing update",
		"new mario kart",
		"mario does a sport",
		"mario rpg",
		"3d mario game",
		"luigi's new mansion",
		"new pokemon announced",
		"pokemon arceus",
		"indie game montage",
		"donkey kong goes back to the country",
		"epic yarn",
		"kirby eats a thing",
		"yoshi eats a thing",
		"Shigeru Miyamoto wearing a funny hat",
		"switch pro",
		"mother 4",
		"star fox",
		"n64 games added to switch online",
		"xenoblade",
		"fire emblem",
		"splatoon 3",
		"pikmin",
		"kid icarus",
		"f-zero",
		"wario ware",
		"monster hunter",
		"harvest moon",
		"new warriors game",
		"ace attorney",
		"ring fit 2",
		"new peripheral",
		"golden sun",
		"bayonetta 3",
		"new mobile game",
		"new online support"
	];
}

function buildArr(){
	arr=document.getElementById("bingoInput").value.split("\n");
}







//		git commit -m ""		git push origin main

