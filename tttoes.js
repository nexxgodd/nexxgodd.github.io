

var myName="";
var code="";
var xo="?";
var isMyTurn=false;
var board="   |   |   ";
var tttList=[0,1,2,4,5,6,8,9,10].map((t)=>"ttt"+t);
//var isWaiting=false;

// var ws=null;
function setPrivate(){
	let priv =document.getElementById("private").checked
	toggleDisplay("private-info",priv);
}
function setHost(){
	let host =document.getElementById("host").checked
	toggleDisplay("code-div",!host);
}

//toggle visible space
function setConnected(isConnected) {
	toggleDisplay("ttt-setup-container",!isConnected);
	toggleDisplay("ttt-container",isConnected);
}

function toggleDisplay(id,isDisplay){
	document.getElementById(id).style.display=isDisplay?"":"none";
}

//add to chat
function showGreeting(message,id) {
	let box =document.getElementById(id);
		box.children[0].innerHTML+=message.name+": "+message.content + "<br>";
		// console.log(message)
		// console.log(id)
	// let myDiv = document.getElementById("myTabContent");
	box.scrollTop = box.scrollHeight;
}





function markT(val,id){
	let toe=document.getElementById("ttt"+id);
	toe.innerText=val;
	toe.disabled=true;
	let temp =[...board];
	temp[id]=val;
	board=temp.join("");
	console.log(id);
	
	console.log(board);

	isWinner();
}

function clearBoard(){
	board="   _   _   ";
	tttList.forEach(t=>{
		document.getElementById(t).disabled=false;
	})
}

var regi=[/(X|O)\1\1/,/(X|O)...\1...\1/,/(X|O).._.\1._..\1/,/(X|O)_.\1._\1/];
function isWinner(){
	regi.forEach(r=>{
		let test=r.exec(board);
		if(test){
			console.log(test[1]+ " is win");
			return test[1];
		}
	})
	return false;
}

function setTurn(who){
	isMyTurn=(who===xo);
	if(isMyTurn){
		document.getElementById("turn-display").innerHTML="Your turn";
	}
	else{
		document.getElementById("turn-display").innerHTML=who+"'s turn";
	}
}

function xoNot(who){
	return who==="X"?"O":"X";
}



/***************************************************************\
|                          Stomp Stuff                          |
\***************************************************************/


function connect(e) {
	e.preventDefault();
	myName =document.getElementById("name").value;
	let isPrivate =document.getElementById("private").checked;
	let isHost=document.getElementById("host").checked;
	let codebox =document.getElementById("codebox").value;

	let rdy=myName.length!==0;
	toggleDisplay("name-bad",!rdy);
	
	if(isPrivate&&!isHost&&codebox.length!==4){
		rdy=false;
		toggleDisplay("code-bad",true);

		//alert on code
	}

	if(!rdy){
		return;
	}

	toggleDisplay("waiting",true);
	toggleDisplay("waited",false);

    // var socket = new SockJS('http://192.168.1.33:8080/gs-guide-websocket');
    var socket = new SockJS('https://simple-ttt-api.herokuapp.com/gs-guide-websocket');

    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame)=> {
        setConnected(true);
        toggleDisplay("waiting",false);
		toggleDisplay("waited",false);
		
		if(isPrivate&&!isHost){
			existingGame(codebox);
		}
		else{
			newGame(isPrivate);
		}

		//;
    },()=>{
		console.log("Server Disconnected");
		toggleDisplay("waiting",false);
		toggleDisplay("waited",true);
		disconnect();
	});
}


function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
	clearBoard();
	code='';
	document.getElementById("room-code").innerHTML="";
	document.getElementById("local").innerHTML="";
    //console.log("Disconnected");
}


//new game without code
function newGame(isPrivate){
	var newSub =stompClient.subscribe('/user/queue/response', (code)=> {
		joinGame(JSON.parse(code.body));
		newSub.unsubscribe();
	});
	stompClient.send("/app/newgame",{},JSON.stringify({
		'name': 'me','content':!isPrivate?'open':'closed'
	}));
}

//join game with code
function existingGame(c){
	var newSub =stompClient.subscribe('/user/queue/response', (code)=> {
		console.log(c);
		console.log(code);
		joinGame(JSON.parse(code.body));
		newSub.unsubscribe();
	});
	//stompClient.send(address, {}, JSON.stringify({'name': myName,'content':message.value}));

	stompClient.send("/app/joingame",{},JSON.stringify({
		'name': 'me','content':c
	}));
}

function joinGame(c){
	code=c.content;
	console.log("Room code is: "+code);
	document.getElementById("room-code").innerHTML="Code: "+code;
	document.getElementById("XorO").innerHTML=c.name;
	xo=c.name;
	setTurn("O")

	stompClient.subscribe('/queue/message/'+code, (greeting)=>{
		showGreeting(JSON.parse(greeting.body),"local");
	});

	stompClient.subscribe('/queue/message', (greeting)=> {
		showGreeting(JSON.parse(greeting.body),"global");
	});
	
	stompClient.subscribe('/queue/game/'+code, (play)=>{
		//console.log(play);
		doPlay(JSON.parse(play.body));
	});
}


function sendChat(e){
	e.preventDefault();
	let message = document.getElementById("chat-input");
	let address="/app/request";
	if(document.getElementById("local").classList.contains("active")){
		address+='/'+code;
	}
	// document.getElementById("local").innerHTML+=message.value+"<br>";
	stompClient.send(address, {}, JSON.stringify({'name': myName,'content':message.value}));
	message.value="";
}


function selectT(id){
	if(isMyTurn){
		stompClient.send("/app/play/"+code, {}, JSON.stringify({'name': xo,'content':id}));
	}
	else{
		alert("nope")
	}
}

function doPlay({name,content}){

	if(name==="C"){
		clearBoard();
	}
	else{
		markT(name,content);
	}	
}

function sendClear(){
	console.log("clearing");
	stompClient.send("/app/play/"+code, {}, JSON.stringify({'name': "C",'content':xo}));
}