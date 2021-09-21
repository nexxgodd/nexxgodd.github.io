function formatRecipe(){
	let inbox = document.getElementById("recInput");
	let lines = inbox.value.split('\n');
	if(lines.length<3){ 
		document.getElementById("recOutput").value="The input must contain at least 3 lines.";
		return;
	} //escape small list
	let title = lines.shift();
	let title2 = title.replace(/\s|’|\./g, "");
	let direction = lines.pop().replace(/\.\s+/g,".\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t");
	
	let ingout='';
	lines.forEach(i=>ingout+=`\n\t\t\t\t<li class="col-6 col-md-4">\n\t\t\t\t\t${i}\n\t\t\t\t</li>`);
	
	//long template string
	let out=`<!-- ${title} -->
<div class="accordion-item">\n\t<h2 class="accordion-header" id="heading${title2}">
\t\t<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${title2}" aria-expanded="false" aria-controls="collapse${title2}">
\t\t\t${title}
\t\t</button>
\t</h2>
\t<div id="collapse${title2}" class="accordion-collapse collapse" aria-labelledby="heading${title2}" data-bs-parent="#accordion__page_">
\t\t<div class="accordion-body">
\t\t\t<ul class="row ">${ingout}
\t\t\t</ul>
\t\t\t<hr>
\t\t\t<p>
\t\t\t\t${direction}
\t\t\t</p>
\t\t</div>
\t</div>
</div>`;
	
	document.getElementById("recOutput").value=out;
	copyOutput();
	inbox.value="";
}

function copyOutput(id) {
	document.getElementById(id).select();
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


function formatFish(){
	let regex = /"([^\t]+)\n([^\t]+)"/g;
	let type="";
	document.getElementsByName('accreature').forEach(r=>{if(r.checked)type= r.value});
	console.log(type);
	let lines=document.getElementById("acInput").value.replace(regex,"$1"+" & "+"$2").split("\n");
	lines=lines.map(row=>{
		row=row.split('\t');
		let time=row[type=="bug"?5:6];
		let obj= {
			_id:parseInt(row[0]),
			//1 was checkmark
			name:row[2].replace(/\s(\w)/g,(letter)=>letter.toUpperCase()),
			price:parseInt(row[3].replace(',','')),
			time:time,
			timeArray:[],
			months:[]
		}


		if(type=="sea"){
			obj.swimPattern=row[5];
			obj.size=row[4];
		}
		else{
			obj.location=row[4];
		}
		if(type=="fish"){
			obj.size=row[5];
		}
		



		
		if(time=="All day"){
			obj.timeArray.push({start:0,end:24})
		}
		else{
			for(let t of time.split(" & ")){
				t=t.split(" ");
				let start=parseInt(t[0])+(t[1]=="PM"?12:0);
				let end=parseInt(t[3])+(t[4]=="PM"?12:0);
				if(start<end){
					obj.timeArray.push({start:start,end:end});
				}
				else{
					obj.timeArray.push({start:0,end:end});
					obj.timeArray.push({start:start,end:24});
				}
			}
			obj.timeArray.sort((a,b)=>{return a.start-b.start})
		}
		let offset=row.length-12;
		for(i=offset;i<row.length;i++){
			obj.months.push(row[i]=="✓");
		}

		return obj;
		//return row;
		 
	})

	console.log(lines);
	document.getElementById("acOutput").value=JSON.stringify(lines);
	//copyOutput();
}







//		git commit -m ""		git push origin main

