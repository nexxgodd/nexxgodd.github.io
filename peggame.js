

//setup pegboard
var pegboard =document.getElementById("peg-container");
var holes=[];
var selected='';
var checkArray=[[-1,-1],[-1,0],[0,-1],[0,1],[1,0],[1,1]];
var MAX=4;
var possibles=[];
var score=0;

if(pegboard){
	setupPegBoard();
}

function setupPegBoard(){
	let out ='';
	for(let i=0;i<=MAX;i++){
		for(let j=0;j<=i;j++){
			let name='peg-'+i+'-'+j;
			holes.push(name);
			out+='<button id="'+name+'" type="button" class="peg-hole" onclick="selectPeg(\''+name+'\')">⬤</button>'
		}
	out+='<br>';
	}

	out+='<br>Score: <span id="pegScore">0</span><button type="button" class="btn btn-secondary" onclick="setupPegBoard()">Reset</button>'
	pegboard.innerHTML=out;

	//document.getElementById(holes[0]).disabled="false";
	togglePeg(document.getElementById(holes[0]));
}

function togglePeg(p){
	//p.toggleAttribute("disabled");
	if(!p.classList.contains("empty")){
		p.innerHTML="■";
		p.classList.add("empty");
	}
	else{
		p.innerHTML="⬤";
		p.classList.remove("empty");
	}
}

// function toggleClass(p,classy){
// 	if(p.classList.contains(classy)){
// 		p.classList.remove(classy);
// 	}
// 	else{		
// 		p.classList.add(classy);
// 	}
// }

function deselect(){
	document.getElementById(selected).classList.remove("selected");
	selected='';
	for(p of possibles){
		document.getElementById(p).classList.remove("possible");
	}
	possibles=[];
}

function selectPeg(name){
	let peg =document.getElementById(name);
	if(selected===''){
		if(peg.classList.contains("empty")){return;}
		selected=name;
		peg.classList.add("selected");
		let cords = name.split("-");
		cords[1]=parseInt(cords[1]);
		cords[2]=parseInt(cords[2]);
		
		//look in each direction
		for(a of checkArray){
			let x=cords[1]+2*a[0];
			let y=cords[2]+2*a[1];
			//valid name
			if(x<0||y<0||x>MAX||y>MAX||y>x){continue;}
			let nextName='peg-'+x+'-'+y;
			let next = document.getElementById(nextName);

			//find space empty space after not empty
			if(next.classList.contains("empty")&&!document.getElementById('peg-'+(x-a[0])+'-'+(y-a[1])).classList.contains("empty")){
				next.classList.add("possible");
				possibles.push(nextName);
			}

		}
		//unselect if no moves available
		if(possibles.length===0){
			selected='';
			peg.classList.remove("selected");
		}
	}
	//unselect
	else if(selected===name){
		deselect();
	}
	else if(peg.classList.contains("empty")&&possibles.includes(name)){
		let cords1=name.split("-");
		let cords2=selected.split("-");
		let x=cords1[1]-(cords1[1]-cords2[1])/2;
		let y=cords1[2]-(cords1[2]-cords2[2])/2;
		let mid=document.getElementById("peg-"+x+"-"+y);
		
		togglePeg(mid);
		togglePeg(document.getElementById(name));
		togglePeg(document.getElementById(selected));

		//alert(possibles+" "+selected)
		deselect();

		score+=1;
		document.getElementById("pegScore").innerHTML=score;

	}

}