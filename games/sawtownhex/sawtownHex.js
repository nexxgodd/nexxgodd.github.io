// import {cell} from 'cell';

var eventCatcherDiv;
var gameCanvas;
var gameContent;
var gameInterval;
const COLOR={menuPurple:"#6d045f",menuDarkGray:"#575757",menuLightGray:"#747474",grassGreen:"#199607"}
// var sampleColor;

// const TOP=3;
// const RIGHT=6;
// const WINDOW_BUFFER=16;
// const PRE_BOT_MOD=1.5;

// var gridBox;
// var previewBox;
// var previewImgBox;
// var menuBox;

// var shopBox;
// var shopArray=[];
// var SHOP_ENUM={};
// const SHOP_BUFFER=16;
// var SHOP_TOP;
// var shopSelection;

// var RIGHT_MIDDLE;

// var upgradeBox;
// var upgradeInnerBox;
// var upgradeModifiers;
// const UPGRADE_BUFFER=5;
// const UPGRADE_BUFFER_32=UPGRADE_BUFFER+32;
// var upgradeArray=[];



/* * * * * * * * * * * * * * * * * * * * * * * *\
|*                    SETUP                    *|
\* * * * * * * * * * * * * * * * * * * * * * * */
function startLoading(){
    eventCatcherDiv = document.getElementById("EventCatcher");

	// eventCatcherDiv events go here
	eventCatcherDiv.addEventListener("mousemove", canvasMove);//mousemove
	eventCatcherDiv.addEventListener("click", canvasClick);//mouseclick

    gameCanvas = document.getElementById("GraphicsBox");

	let canvas=gameCanvas.getContext("2d");
	canvas.imageSmoothingEnabled= false;


	// setupBasicVariables();
	hexGrid=new HexGrid(48, 
		8,gameCanvas.width,//X
		80,gameCanvas.height-8,//Y
		false,true);
	mouse=new Mouse();

	//loop
	gameInterval = setInterval(hasLoaded, 250);	
}

function setupBasicVariables(){

	
	//mouse=new Mouse();//needs constants set first
}


function hasLoaded(){
    if (true){ // Check to see if all info is loaded
        clearInterval(gameInterval);
        // startGame();
			gameInterval = setInterval(runGame, 30);
    }
}

function canvasMove(E){
    // E = E || window.event;
	mouse.update(E.layerX,E.layerY);
}

function canvasClick(E){
	mouse.click();
}


/* * * * * * * * * * * * * * * * * * * * * * * *\
|*                  GAME LOOP                  *|
\* * * * * * * * * * * * * * * * * * * * * * * */
var previousTime=(new Date).getTime();
var frameCount=0;
var fps='';


function runGame(){
	
	var time=(new Date).getTime();
	frameCount++;
	if(time>previousTime+1000){
		fps=frameCount;
		previousTime=time;
		frameCount=0;
		// updateGrid();
		// mouse.updateSelection();
		hexGrid.update();
	}
	else if(frameCount==1){
		//check for new upgrades
	}

	gameContent=gameCanvas.getContext("2d");

	gameContent.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	gameContent.fillStyle = COLOR.grassGreen;
	gameContent.fillRect(0, 0, gameCanvas.width, gameCanvas.height);


	
	hexGrid.draw();
	mouse.draw();
}






function drawText(g, stringValue, isCentered, x, y){
    g.font = "30px Arial";
    g.fillStyle = "#FFF";
    if (isCentered){
		g.textAlign="center";
	}
	else{
		g.textAlign="start"
	}
	g.fillText(stringValue, x, y+30);
}




const redHexIMG=new Image();
redHexIMG.src="img/hex50red.png";
class Mouse{
	constructor(){
		this.x=0;
		this.y=0;
		this.hexTile=null;
	}
	update(x,y){
		this.x=x;
		this.y=y;
		this.hexTile=hexGrid.getByCoordinate(this.x,this.y);
		// console.log(this.hexTile);
	}
	draw(){
		if(this.hexTile){
			gameContent.drawImage(redHexIMG, this.hexTile.x-1, this.hexTile.y-1);
			drawText(gameContent,this.hexTile.row+","+this.hexTile.column,false,5,5)
		}
	}
	click(){
		console.log(this.hexTile);
		this.hexTile.click()
	}
}