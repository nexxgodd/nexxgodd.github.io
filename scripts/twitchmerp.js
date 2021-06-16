

javascript:(function(){
var merp=new Audio('https://bigsoundbank.com/UPLOAD/mp3/2059.mp3');
var lastMerp=Number.MAX_SAFE_INTEGER;
var isPause=false;
var spacer=30000;
var cBox=document.getElementsByClassName("simplebar-scroll-content")[2];
var cBoxColor=cBox.style.backgroundColor;
playMerp=()=>{
	if(isPause){return;}
	let nd=new Date();
	if(nd-lastMerp>spacer){
		lastMerp=nd;
		merp.play();
	}
	cBox.style.backgroundColor="orange";
	setTimeout(()=>{cBox.style.backgroundColor=cBoxColor;},250);
};
muteMerp=()=>{
	lastMerp=document.getElementById("merp-mute").checked?Number.MAX_SAFE_INTEGER:0;
};
pauseMerp=()=>{
	isPause=document.getElementById("merp-pause").checked;
};
cBox.addEventListener("scroll",playMerp);
let buttonHole=document.getElementsByClassName("follow-btn__follow-notify-container")[0].children[0];
buttonHole.innerHTML='<input type="checkbox" id="merp-mute" onclick="muteMerp()" checked>Mute</input><input type="checkbox" id="merp-pause" onclick="pauseMerp()">Pause</input>'+buttonHole.innerHTML;
})();

//Twitch Merp
//Flashes screen when someone speaks in chat and plays sound every 30 seconds.
//Not recommended for highly active chat.
//Creates mute and pause buttons to the left of Like and Notification buttons under the stream.
//Mute button stops sound while the pause button stops all activity.
//Activation is tied to the chat scrolling. This means it wont activate until chat 
	//reaches bottom of screen and will activate if you scroll chat.

//Doesn't work if hype train (rare event) is active on page.
//Switching pages on twitch can break things. Refreshing will fix this.

//Save the following code as a new bookmark and click on said bookmark while on the twitch page you want merps for.
//Refreshing the page will remove all functionality.
javascript:(function(){var merp=new Audio('https://bigsoundbank.com/UPLOAD/mp3/2059.mp3');var lastMerp=Number.MAX_SAFE_INTEGER;var isPause=false;var spacer=30000;var cBox=document.getElementsByClassName("simplebar-scroll-content")[2];var cBoxColor=cBox.style.backgroundColor;playMerp=()=>{if(isPause){return;}let nd=new Date();if(nd-lastMerp>spacer){lastMerp=nd;merp.play();}cBox.style.backgroundColor="orange";setTimeout(()=>{cBox.style.backgroundColor=cBoxColor;},250);};muteMerp=()=>{lastMerp=document.getElementById("merp-mute").checked?Number.MAX_SAFE_INTEGER:0;};pauseMerp=()=>{isPause=document.getElementById("merp-pause").checked;};cBox.addEventListener("scroll",playMerp);let buttonHole=document.getElementsByClassName("follow-btn__follow-notify-container")[0].children[0];buttonHole.innerHTML='<input type="checkbox" id="merp-mute" onclick="muteMerp()" checked>Mute</input><input type="checkbox" id="merp-pause" onclick="pauseMerp()">Pause</input>'+buttonHole.innerHTML;})();