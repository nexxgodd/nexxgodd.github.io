





// var ws=null;
function setPrivate(){
	let priv =document.getElementById("private").checked
	toggleDisplay("private-info",priv);
}
function setHost(){
	let host =document.getElementById("host").checked
	toggleDisplay("code-div",!host);
}

//toggle visable space
function setConnected(isConnected) {
	toggleDisplay("ttt-setup-container",!isConnected);
	toggleDisplay("ttt-container",isConnected);
}

function toggleDisplay(id,isDisplay){
	document.getElementById(id).style.display=isDisplay?"":"none";
}


function connect(e) {
	e.preventDefault();
	let name =document.getElementById("name").value;
	let isPrivate =document.getElementById("private").checked;
	let isHost=document.getElementById("host").checked;
	let codebox =document.getElementById("codebox").value;

	let rdy=name.length!==0;
	toggleDisplay("name-bad",!rdy);
	
	if(isPrivate&&!isHost&&codebox.length!==4){
		rdy=false;
		toggleDisplay("code-bad",true);

		//alert on code
	}

	if(!rdy){
		return;
	}


    var socket = new SockJS('http://localhost:8080/gs-guide-websocket');
	
	// socket.onopen = function () {
	// 	console.log('Client connection opened');
	// 	alert();
	// };
	// socket.onmessage = function(data) {
	// 	console.log(data.data);
	// };



    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
		////////////////////
        console.log('Connected: ' + frame);
		
		newGame(isPrivate);


    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
	code='';
    console.log("Disconnected");
}

function sendMessage() {
    stompClient.send("/app/request/"+code, {}, JSON.stringify({'name': 'me','content':document.getElementById("name").value}));
}

function showGreeting(message) {
	document.getElementById("greetings").innerHTML+=
		"<tr><td>" + message + "</td></tr>";
		console.log(message)
}

//new game without code
function newGame(isOpen){
	var newSub =stompClient.subscribe('/user/queue/response', function (code) {
		// console.log();
		joinGame(JSON.parse(code.body).content);
		newSub.unsubscribe();
	});
	stompClient.send("/app/newgame",{},JSON.stringify({'name': 'me','content':isOpen?'open':'closed'}));
}
var code='';
function joinGame(c){
	code=c;
	document.getElementById("room-code").innerHTML=code;
	console.log(code);

	stompClient.subscribe('/queue/message/'+code, function (greeting) {
		showGreeting(JSON.parse(greeting.body).content);
	});
}

function sendChat(e){
	e.preventDefault();
	let message = document.getElementById("chat-input");
	document.getElementById("local").innerHTML+=message.value+"<br>";
	message.value="";
}








// function connect() {
//     // var socket = new SockJS('http://localhost:8080/user');
//     // ws = new WebSocket('ws://localhost:8080/user','subprotocol.demo.websocket');
//     ws = new SockJS('http://192.168.1.33:8080/user','subprotocol.demo.websocket', {debug: true, transports: []});

// 	ws.onopen = function () {
// 		console.log('Client connection opened');
// 	};
//     ws.onmessage = function(data) {
// 		showGreeting(data.data);
// 	};
// 	ws.onerror= function (event) {
// 		console.log('Client error: ' + event);
// 	};
// 	ws.onclose = function (event) {
// 		console.log('Client connection closed: ' + event.code);
// 	};
// 	setConnected(true);
// }

// function disconnect() {
// 	if (ws != null) {
// 		ws.close();
// 	}
// 	ws=null;
// 	setConnected(false);
// 	console.log("Websocket is in disconnected state");
// }

// function sendName() {
// 	var data = JSON.stringify({
// 		'user' : document.getElementById("name").value
// 	})
// 	ws.send(data);
// }