// import {cell} from 'cell';

var eventCatcherDiv;
var gameCanvas;
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

// var mouse;

/* * * * * * * * * * * * * * * * * * * * * * * *\
|*                    SETUP                    *|
\* * * * * * * * * * * * * * * * * * * * * * * */
function startLoading(){
    eventCatcherDiv = document.getElementById("EventCatcher");

	// eventCatcherDiv events go here
	eventCatcherDiv.addEventListener("mousemove", canvasMove);//mousemove

    gameCanvas = document.getElementById("GraphicsBox");

	let canvas=gameCanvas.getContext("2d");
	canvas.imageSmoothingEnabled= false;


	// setupBasicVariables();
	mouse=new Mouse();

	//loop
	gameInterval = setInterval(hasLoaded, 250);	
}

function setupBasicVariables(){

	//grid setup
	let gridLeft=0;
	let gridRight=gameCanvas.width-RIGHT*32+gridLeft;
	let gridTop=TOP*32+gridLeft;
	let gridBot=gameCanvas.height-gridLeft;
	gridBox=new Box(gridLeft,gridRight,gridTop,gridBot);
	setupGrid((gridBox.width)/32,(gridBox.height)/32,gridBox.left,gridBox.top);

	//preview setup
	let preLeft=gridBox.right+WINDOW_BUFFER;
	let preRight=gameCanvas.width;
	let preTop=0;
	let preBot=gameCanvas.height/2-PRE_BOT_MOD*32;
	previewBox=new Box(preLeft,preRight,preTop,preBot);
	let preW=32*4;
	let preX=preLeft+(previewBox.width-preW)/2;
	let preY=preX-previewBox.left-4;
	previewImgBox=new Box(preX,preX+preW,preY,preY+preW);

	RIGHT_MIDDLE=preLeft+previewBox.width/2;

	//upgrade setup
	upgradeBox=new Box(preLeft,preRight, preBot+WINDOW_BUFFER ,gameCanvas.height);
	const upgradeWidth=4;
	const upgradeHeight=7;
	const upgradeBuffer2=Math.floor((previewBox.width-UPGRADE_BUFFER-upgradeWidth*(UPGRADE_BUFFER_32))/2);
	const upgradeBot=gameCanvas.height-upgradeBuffer2;
	const upgradeTop=upgradeBot-UPGRADE_BUFFER-upgradeHeight*(UPGRADE_BUFFER_32);
	upgradeInnerBox=new Box(preLeft+upgradeBuffer2,preRight-upgradeBuffer2,upgradeTop,upgradeBot);

	upgradeModifiers={globalWoodMultiplier:1, clickMultiplier:1,  axeMultiplier:1, fireMultiplier:0};
	addToUpgrades(new Upgrade("Extra Clicker",treeIMG[0],100,"Double the wood gained from clicking.",
		()=>upgradeModifiers.clickMultiplier*=2));
	addToUpgrades(new Upgrade("Double Axe",axeIMG,200,"Double the wood gained from axes.",
		()=>upgradeModifiers.axeMultiplier*=2));
	addToUpgrades(new Upgrade("Fire Power",fireIMG,500,"Collect wood from full grown trees when burnt.",
		()=>{
			upgradeModifiers.fireMultiplier+=1;
			addToUpgrades(new Upgrade("Fire Power",fireIMG,5000,"Double the wood gained from fire.",
				()=>upgradeModifiers.fireMultiplier*=2));
		}
			));
	addToUpgrades(new Upgrade("Global increase",sawIMG,500,"Double the wood gained from all sources.",
		()=>upgradeModifiers.globalWoodMultiplier*=2));
	
		addToUpgrades(new Upgrade("Extra Clicker",treeIMG[1],1000,"Double the wood gained from clicking.",
		()=>upgradeModifiers.clickMultiplier*=2));
	addToUpgrades(new Upgrade("Double Axe",axeIMG,2000,"Double the wood gained from axes.",
		()=>upgradeModifiers.axeMultiplier*=2));
	addToUpgrades(new Upgrade("Global increase",sawIMG,5000,"Double the wood gained from all sources.",
		()=>upgradeModifiers.globalWoodMultiplier*=2));
	
	//menu setup
	menuBox=new Box(0,gridRight,0,gridTop-WINDOW_BUFFER);

	const shopCount=10;
	const shopBuffer2=SHOP_BUFFER/2;
	SHOP_TOP=menuBox.height/2-16-shopBuffer2;
	let shopBot=menuBox.bottom-SHOP_TOP;
	let shopRight=menuBox.right-SHOP_TOP;
	let shopLeft=shopRight-shopCount*(32+SHOP_BUFFER);
	shopBox= new Box(shopLeft,shopRight,SHOP_TOP,shopBot);
	SHOP_TOP+=shopBuffer2;

	shopLeft+=shopBuffer2
	shopArray.push(new StoreItem("Tree",Tree,treeIMG[0],shopLeft,0,"Plant some baby trees and watch the grow."));
	shopLeft+=32+SHOP_BUFFER;
	shopArray.push(new StoreItem("Axe",Axe,axeIMG,shopLeft,15,"Why chop wood by hand."));
	shopLeft+=32+SHOP_BUFFER;
	shopArray.push(new StoreItem("Saw",Saw,sawIMG,shopLeft,100,"IDK what this does."));
	shopLeft+=32+SHOP_BUFFER;
	shopArray.push(new StoreItem("Fire",Fire,fireIMG,shopLeft,0,"Watch the world burn."));
	SHOP_ENUM={"Tree":0,"Axe":1,"Saw":2,"Fire":3};

	shopSelection=shopArray[0];
	
	//mouse
	mouse=new Mouse();//needs constants set first
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
	mouse.set(E.layerX,E.layerY);
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
	}
	else if(frameCount==1){
		//check for new upgrades
	}

	let canvas=gameCanvas.getContext("2d");
	// canvas.imageSmoothingEnabled= false;

	canvas.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	canvas.fillStyle = COLOR.grassGreen;
	canvas.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

	drawHexs(canvas, 48, 
		8,gameCanvas.width,//X
		80,gameCanvas.height,//Y
		true);
	
	
}

const hexIMG= new Image();
hexIMG.src="img/hex48.png";
const redHexIMG=new Image();
redHexIMG.src="img/hex50red.png"
function drawHexs(canvas, width,xStart,xEnd,yStart,yEnd, isFirstOffset){
	let chunkOffset=width/4
	var downOffset=chunkOffset*3;
	var sideOffset=chunkOffset*2;
	for(var y=yStart;y+width-1<yEnd;y+=downOffset){
		for(var x=((y-yStart)%sideOffset!=0)==isFirstOffset?xStart:xStart+sideOffset;x+width-1<xEnd;x+=width){ //var x=((y+48)%32)*2
			canvas.drawImage(hexIMG, x,y);
		}
	}
	xEnd=Math.floor((xEnd-xStart)/width)*width+xStart
	yEnd=y+chunkOffset;
	console.log(y);

	let mouseOffsetY=mouse.y-yStart
	let mouseOffsetX=mouse.x-xStart
	if(mouseOffsetY>=0&&mouseOffsetX>=0&&mouse.y<yEnd&&mouse.x<xEnd){

		canvas.beginPath();
		let row=Math.floor(mouseOffsetY/downOffset)
		let column="?"
		let chunk=Math.floor((mouseOffsetY/chunkOffset)%3)
		// let out=;
		drawText(canvas,chunk===0?"triangle":"square",false,100,5)
		canvas.strokeStyle="red";

		let evenOdd=isFirstOffset?0:1;
		let mouseRowOffset=row%2===evenOdd?sideOffset:0;

		//triangles
		if(chunk===0){
			// canvas.rect(0, yStart+row*downOffset, gameCanvas.width,chunkOffset);
			let chunkX=(mouseOffsetX+mouseRowOffset)%width
			let chunkY=mouseOffsetY%downOffset
			if(chunkX<sideOffset){
				if(chunkX<(chunkOffset-chunkY)*2){
					row--;
					mouseRowOffset=row%2===evenOdd?sideOffset:0;
				}
			}
			else{
				if(chunkY*2<chunkX-sideOffset){
					row--;
					mouseRowOffset=row%2===evenOdd?sideOffset:0;
				}
			}
		}
		//squares
		
		// canvas.rect(0, yStart+row*downOffset+chunkOffset, gameCanvas.width,sideOffset);
		column=Math.floor((mouseOffsetX-mouseRowOffset)/width)

		let myY=yStart+row*downOffset-1;
		let myX=xStart+column*width+mouseRowOffset-1;
		canvas.drawImage(redHexIMG, myX, myY);

		column+=Math.floor((row+evenOdd)/2)

		drawText(canvas,"("+column+","+row+")",false,5,5)
		canvas.stroke();
	}
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

class Mouse{
	constructor(){
		this.set(0,0);
	}
	set(x,y){
		this.x=x;
		this.y=y;
	}
}