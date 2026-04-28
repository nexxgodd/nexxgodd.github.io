// import data from "./campaign.json" assert { type: "json" };
let mapList = null;
fetch('./stuff/campaign.json')
	.then(data=>data.json())
	// .then(data=>console.log(data))
	.then(data=>buildMapList(data.maps));


// const socket = io('http://localhost:3461');
const socket = io({autoConnect: false,reconnection: false});
const canvas = document.getElementById('vttCanvas');
const ctx = canvas.getContext('2d');

// --- SETTINGS ---
// const GRID_SIZE = 50;

// let role = 'Player';
let isDM=false;
// let myId = Math.random().toString(36).substr(2, 9); // Fake unique ID
let gameState = { currentMap: '', tokens: [] };
let mapImage = new Image();
let currentMap=null;
let selectedToken=null;
let playerName=null;
let playerEmoji=null;
let serverUrl=null;
// mapImage.src = '/resources/dnd/test.png'; // Placeholder map, DM can change it





//////////////////////////////////////////////////////////////////////////////
//                              Login and Setup                             //
//////////////////////////////////////////////////////////////////////////////

welcomeBack();
function welcomeBack(){
	let cookie=decodeURIComponent(document.cookie).split('=');
	if(cookie.length==2){
		let val=JSON.parse(cookie[1]);
		console.log("welcomeBack",val);
		if(val.name&&val.server){
			document.getElementById('charName').value=val.name;
			document.getElementById('charEmoji').value=val.emoji;
			document.getElementById('serverUrl').value=val.server;
			login();
		}
	}
}

function buildMapList(maps) {
	mapList=maps;
	const list = document.getElementById('mapList');
	list.innerHTML = '';
	Object.keys(maps).forEach(m => {
		const b = document.createElement('button');
		b.textContent = `${m}`;//${m.icon} if we add icons later
		// b.className = i===G.mapIdx?'active':'';
		b.onclick = () => changeMap(m);
		list.appendChild(b);
	});
}


function login() {
	let name=document.getElementById('charName').value;
	let emoji=document.getElementById('charEmoji').value.trim();
	let server=document.getElementById('serverUrl').value;
	
	// console.log(name,emoji,server);

	if(name && server && emoji){
		
		if (!/^\p{RGI_Emoji}$/v.test(emoji)){
			console.error("Connection error: Bad Emoji");
			document.getElementById("errorEmoji").hidden=false;
			return;
		}
		try{
			socket.io.uri=server;
			socket.connect();
			toggleConnectButton(false);
			playerName=name;
			playerEmoji=emoji;
			serverUrl=server;
		}
		catch(error){
			console.error("Connection error:", error);
			document.getElementById("errorLogin").hidden=false;
		}
	}
}

function toggleConnectButton(isactive=true){
	let button=document.getElementById('loginButton');
	button.disabled=!isactive;
	button.innerHTML=isactive?"Connect":"Loading";
}
socket.on("connect_error", (err) => {
  toggleConnectButton();
  console.log(err.context); 
});

function logout() {
	document.cookie = "data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	location.reload();
}


socket.on('init-state', (state) => {
	socket.io.reconnection=true;
	document.body.classList.toggle('validating',false);
	toggleConnectButton();
	if(playerName==="Todd"){
		isDM=true;
		document.body.classList.toggle('dm', true);
	}
    document.getElementById('sbRole').innerText = isDM? "DM":playerEmoji+playerName;

	const d = new Date();
	d.setTime(d.getTime() + (14*24*60*60*1000));
	let cookie={
		name:playerName,
		emoji:playerEmoji,
		server:serverUrl
	}
	document.cookie = `data=${encodeURIComponent(JSON.stringify(cookie))}; expires=${d.toUTCString()}; path=/`;


	console.log(state);
    gameState = state;
    mapImage.onload = render;
	resizeCanvas(state.currentMap);
});

function setRole(newRole) {//implement this
    role = newRole;
    document.getElementById('sbRole').innerText = isDM? "DM":playerEmoji+playerName;
}

//////////////////////////////////////////////////////////////////////////////
//                                  render                                  //
//////////////////////////////////////////////////////////////////////////////
i=0
function render() {
	ctx.lineWidth=3;
	w=mapImage.width;
	h=mapImage.height;
	// canvas.width=w;
	// canvas.height=h;
	console.log(i++,w,h);
    // 1. Clear Canvas
    ctx.clearRect(0, 0, w, h);

    // 2. Draw Map
	// console.log(mapImage.src);
    if (mapImage.src) {
        ctx.drawImage(mapImage, 0, 0,w, h);
    }

	if(currentMap.grid){
		let GRID_SIZE=currentMap.grid.size
    	// 3. Draw Grid
		ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
		// for (let x = 0; x <= w; x += GRID_SIZE) {
		// 	ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
		// }
		// for (let y = 0; y <= h; y += GRID_SIZE) {
		// 	ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
		// }
		for (let x = currentMap.grid.x1; x <= currentMap.grid.x2; x += GRID_SIZE) {
			ctx.beginPath(); 
			ctx.moveTo(x, currentMap.grid.y1); 
			ctx.lineTo(x, currentMap.grid.y2); 
			ctx.stroke();
		}
		for (let y = currentMap.grid.y1; y <= currentMap.grid.y2; y += GRID_SIZE) {
			ctx.beginPath(); 
			ctx.moveTo(currentMap.grid.x1, y); 
			ctx.lineTo(currentMap.grid.x2, y); 
			ctx.stroke();
		}

		let offsetX=currentMap.grid.x1 + (GRID_SIZE/2)
		let offsetY=currentMap.grid.y1 + (GRID_SIZE/2)

		// 4. Draw Tokens
		gameState.tokens.forEach(token => {
			ctx.fillStyle = token.type === 'monster' ? 'red' : 'blue';
			ctx.beginPath();
			// Draw circles in the middle of the grid square
			ctx.arc(token.x * GRID_SIZE + offsetX, 
					token.y * GRID_SIZE + offsetY, 
					GRID_SIZE/2-5, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "white";
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font=GRID_SIZE*.5+"px Arial";
			ctx.fillText(token.emoji, 
				token.x * GRID_SIZE + offsetX, 
				token.y * GRID_SIZE + offsetY );
				ctx.font="10px sans serif";
			ctx.fillText(token.name, 
				token.x * GRID_SIZE + offsetX, 
				token.y * GRID_SIZE + currentMap.grid.y1 + 5);
		});
		if(selectedToken){
			ctx.strokeStyle="yellow";
			ctx.lineWidth=3;
			ctx.beginPath();
			ctx.arc(selectedToken.x * GRID_SIZE + offsetX, 
					selectedToken.y * GRID_SIZE + offsetY, 
					GRID_SIZE/2, 0, Math.PI * 2);
			ctx.stroke();
		}

	}
	updateCreatureList();
}

function updateCreatureList() {
	const list = document.getElementById('tlist');
	list.innerHTML = '';
	if (gameState.tokens.length==0) { list.innerHTML = '<div class="info">No creatures on map</div>'; return; }
	gameState.tokens.forEach(tok => {
		const el = document.createElement('div');
		el.className = `tli${tok.ownerId===playerName?' sel':''}`;
		el.innerHTML = `
		<div class="tli-icon">${tok.emoji}</div>
		<div class="tli-name">${tok.name}</div>
		<div class="tli-pos">${tok.x},${tok.y}</div>
		${isDM?`<button class="delbtn" title="Remove" onclick="event.stopPropagation();delToken(${tok.id})">✕</button>`:''}
		`;
		el.addEventListener('click', e => { if(!e.target.classList.contains('delbtn')) selectToken(tok.id); });
		list.appendChild(el);
	});
}
function selectToken(id){
	console.log(id,selectedToken);

	if(selectedToken&&selectedToken.id==id){
		selectedToken=null;
	}
	else{
		let token = gameState.tokens.find(t => t.id == id);
		if(isDM||token.ownerId===playerName){
			selectedToken=token;
		}
		else{return;}
	}
	render();
}





// --- SOCKET EVENTS ---
// var selectedSpawnMon=null;
const MONS = [
  {name:'Goblin',   emoji:'👺', hp:7},   {name:'Orc',     emoji:'👊', hp:15},
  {name:'Zombie',   emoji:'🧟', hp:22},  {name:'Skeleton',emoji:'💀', hp:13},
  {name:'Troll',    emoji:'👹', hp:84},  {name:'Dragon',  emoji:'🐉', hp:256},
  {name:'Bandit',   emoji:'🗡', hp:11},  {name:'Wolf',    emoji:'🐺', hp:11},
  {name:'Vampire',  emoji:'🧛', hp:144},
];
function clearSpawnMons() {
	document.querySelectorAll('.mpick.active').forEach(e=>e.classList.remove('active'));
}
function selectMon(mon) {
	let cur=document.getElementsByName(mon)[0]
	let isactive=cur.classList.contains('active');
	clearSpawnMons();
	// console.log(cur.children[0].innerHTML);
	if(!isactive){
		cur.classList.add('active');
		if(selectedToken){
			selectedToken=null;
			render();
		}
	}
}
socket.on('token-added', (data) => {
	gameState.tokens.push(data);
    render();
});

socket.on('token-moved', (data) => {
	const token = gameState.tokens.find(t => t.id === data.tokenId);
	if (token) {
		token.x = data.newX;
		token.y = data.newY;
		render();
	}
});

// --- INTERACTIONS ---
canvas.addEventListener('mousedown', (e) => {
	if(e.offsetX<currentMap.grid.x1||e.offsetX>=currentMap.grid.x2||
		e.offsetY<currentMap.grid.y1||e.offsetY>=currentMap.grid.y2){
		return;
	}

    const gridX = Math.floor((e.offsetX-currentMap.grid.x1) / currentMap.grid.size);
    const gridY = Math.floor((e.offsetY-currentMap.grid.y1) / currentMap.grid.size);
	console.log(gridX,gridY);

	let tokensHere = gameState.tokens.filter(t => t.x === gridX && t.y === gridY);
	if(tokensHere.length>0){//token was clicked
		console.log(tokensHere);

		//select
		if(!isDM){
			tokensHere=tokensHere.filter(t => t.ownerId === playerName);
			if(tokensHere.length==0) return;//not mine, maybe clear selectedToken
		}
		
		if(selectedToken&&tokensHere.find(t => t.id === selectedToken.id)){
			selectedToken=null;
		}
		else{
			selectedToken=tokensHere[0];
			clearSpawnMons();
		}
	}
	else{//empty space was clicked
		//move selected token
		if(selectedToken){
			socket.emit('move-token', { 
				tokenId: selectedToken.id, 
				newX: gridX, 
				newY: gridY, 
				userId: playerName//role === 'DM' ? 'DM_ID' : 'DM_ID'//myId 
			});
			selectedToken.x = gridX;
			selectedToken.y = gridY;
			selectedToken=null;
		}
		else{
			if(isDM){
				let selectedSpawnMon = document.querySelectorAll('.mpick.active');
				if(selectedSpawnMon.length>0){
					let monName=selectedSpawnMon[0].getAttribute('name');
					let emoji=selectedSpawnMon[0].children[0].innerHTML;
					addToken(monName,gridX,gridY,emoji,"monster",playerName);
				}
			}
			else{
				let me = gameState.tokens.find(t => t.ownerId === playerName);
				if(!me){
					//player has no token, create one for them
					addToken(playerName,gridX,gridY,playerEmoji,"Player",playerName);
				}

			}
		}
	}
	render();
	updateCreatureList();
});

// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function changeMap(url) {
    socket.emit('change-map', url);
}
socket.on('map-updated', (url) => {
	resizeCanvas(url);

});
function resizeCanvas(newMap) {
	
			// console.log(mapList[newMap]);
	
    // mapImage.src = url ? "./stuff/"+url : '';
    mapImage.src ="./stuff/"+mapList[newMap].imageUrl;
		mapImage.onload = () => {
			currentMap=mapList[newMap];
			canvas.width=mapImage.width;
			canvas.height=mapImage.height;
			// console.log(mapImage.width,mapImage.height);
			    
			document.getElementById('sbMap').innerText = newMap;
			document.getElementById('mapTitle').innerText = newMap;

			render();
		};
}



function addToken(name,x,y,emoji,type='monster',ownerId='DM') {
	newId=Math.random().toString();
    socket.emit('add-token', {
        id: newId,
        name: name,
        x: x, y: y,
        emoji: emoji,
        type: type,
        ownerId: ownerId
    });
	return newId;
}

function delToken(id) {
	// G.tokens = G.tokens.filter(t=>t.id!==id);
	// if (selId===id) selId=null;
	// save(); renderAll();
console.log("ggg");
	selectedToken=null;
	socket.emit('delete-token', id);
	// render();
}