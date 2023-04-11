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
	hexGrid=new HexGrid(48, 
		8,gameCanvas.width,//X
		80,gameCanvas.height-8,//Y
		false,true);

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
		88,gameCanvas.height,//Y
		true);
	
	
}

const hexIMG= new Image();
hexIMG.src="img/hex48.png";
const redHexIMG=new Image();
redHexIMG.src="img/hex50red.png"
function drawHexs(canvas, width,xStart,xEnd,yStart,yEnd, isFirstOffset){
	let quarterHex=width/4
	var halfHex=quarterHex*2;
	var threeQuarterHex=quarterHex*3;
	for(var y=yStart;y+width<=yEnd;y+=threeQuarterHex){
		for(var x=((y-yStart)%halfHex!=0)==isFirstOffset?xStart:xStart+halfHex;x+width-1<xEnd;x+=width){ //var x=((y+48)%32)*2
			canvas.drawImage(hexIMG, x,y);
		}
	}
	xEnd=Math.floor((xEnd-xStart)/width)*width+xStart
	yEnd=y+quarterHex;
	console.log(y);

	let mouseOffsetY=mouse.y-yStart
	let mouseOffsetX=mouse.x-xStart
	if(mouseOffsetY>=0&&mouseOffsetX>=0&&mouse.y<yEnd&&mouse.x<xEnd){

		canvas.beginPath();
		let row=Math.floor(mouseOffsetY/threeQuarterHex)
		let column="?"
		let chunk=Math.floor((mouseOffsetY/quarterHex)%3)
		// let out=;
		drawText(canvas,chunk===0?"triangle":"square",false,150,5)
		canvas.strokeStyle="red";

		let evenOdd=isFirstOffset?0:1;
		let mouseRowOffset=row%2===evenOdd?halfHex:0;

		//triangles
		if(chunk===0){
			// canvas.rect(0, yStart+row*threeQuarterHex, gameCanvas.width,quarterHex);
			let chunkX=(mouseOffsetX+mouseRowOffset)%width
			let chunkY=mouseOffsetY%threeQuarterHex
			if(chunkX<halfHex){
				if(chunkX<(quarterHex-chunkY)*2){
					row--;
					mouseRowOffset=row%2===evenOdd?halfHex:0;
				}
			}
			else{
				if(chunkY*2<chunkX-halfHex){
					row--;
					mouseRowOffset=row%2===evenOdd?halfHex:0;
				}
			}
		}
		//squares
		
		// canvas.rect(0, yStart+row*threeQuarterHex+quarterHex, gameCanvas.width,halfHex);
		column=Math.floor((mouseOffsetX-mouseRowOffset)/width)

		let a=hexGrid.get(row,column);
		if(a){
			canvas.drawImage(redHexIMG, a.x-1, a.y-1);
		drawText(canvas,a,false,5,5)

		}
		// let myY=yStart+row*threeQuarterHex-1;
		// let myX=xStart+column*width+mouseRowOffset-1;
		// canvas.drawImage(redHexIMG, myX, myY);

		// column+=Math.floor((row+evenOdd)/2)
		// drawText(canvas,hexGrid.hexGridArray[row][column],false,5,5)
		// drawText(canvas,"("+column+","+row+")",false,5,5)
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

//corners are rounded and always has odd number of rows
class HexGrid{
	constructor(tileWidth, xStart,xEnd, yStart,yEnd, isLeftJustified,isBottomJustified){
		this.tileWidth=tileWidth;
		this.xStart=xStart;
		this.xEnd=xEnd;
		this.yStart=yStart;
		this.yEnd=yEnd;

		this.quarterHex=tileWidth/4;
		this.halfHex=this.quarterHex*2;
		this.threeQuarterHex=this.quarterHex*3;

		let width=(xEnd-xStart);
		this.columns=Math.floor(width/tileWidth);
		let xTrim=width-this.columns*tileWidth;
		if(isLeftJustified){this.xStart+=xTrim}
		else{this.xEnd-=xTrim}

		let height=yEnd-yStart;
		this.rows=Math.floor((height-this.quarterHex)/this.threeQuarterHex)
		let yTrim=height-(this.rows*this.threeQuarterHex+this.quarterHex);
		if(isBottomJustified){this.yStart+=yTrim}
		else{this.yEnd-=yTrim}
		this.setupArray();
	}
	setupArray(){
		this.hexGridArray=[];
		for(let r=this.rows-1;r>=0;r--){
			let ry=r*this.threeQuarterHex+this.yStart
			let offsetX=(r+1)%2*this.halfHex;
			this.hexGridArray[r]=[];
			for(let c=this.columns-(2-r%2);c>=0;c--){
				let rx=c*this.tileWidth+offsetX+this.xStart
				this.hexGridArray[r][c]=new HexTile(rx,ry);
			}
		}
		console.log(this.hexGridArray);
	}
	get(row,col){
		if(row<0||row>=this.rows||col<0||col>=this.columns-(1-row%2)){
			return null;
		}
		return this.hexGridArray[row][col];
	}

	draw(canvas){
		// for(var y=yStart;y+width<=yEnd;y+=this.threeQuarterHex){
		// 	for(var x=((y-yStart)%halfHex!=0)==isFirstOffset?xStart:xStart+halfHex;x+width-1<xEnd;x+=width){ //var x=((y+48)%32)*2
		// 		canvas.drawImage(hexIMG, x,y);
		// 	}
		// }
		// xEnd=Math.floor((xEnd-xStart)/width)*width+xStart
		// yEnd=y+quarterHex;
		// console.log(y);

		// let mouseOffsetY=mouse.y-yStart
		// let mouseOffsetX=mouse.x-xStart
		if(mouseOffsetY>=0&&mouseOffsetX>=0&&mouse.y<yEnd&&mouse.x<xEnd){

			// canvas.beginPath();
			// let row=Math.floor(mouseOffsetY/threeQuarterHex)
			// let column="?"
			// let chunk=Math.floor((mouseOffsetY/quarterHex)%3)
			// // let out=;
			// drawText(canvas,chunk===0?"triangle":"square",false,100,5)
			// canvas.strokeStyle="red";

			// let evenOdd=isFirstOffset?0:1;
			// let mouseRowOffset=row%2===evenOdd?halfHex:0;

			//triangles
			// if(chunk===0){
			// 	// canvas.rect(0, yStart+row*threeQuarterHex, gameCanvas.width,quarterHex);
			// 	let chunkX=(mouseOffsetX+mouseRowOffset)%width
			// 	let chunkY=mouseOffsetY%threeQuarterHex
			// 	if(chunkX<halfHex){
			// 		if(chunkX<(quarterHex-chunkY)*2){
			// 			row--;
			// 			mouseRowOffset=row%2===evenOdd?halfHex:0;
			// 		}
			// 	}
			// 	else{
			// 		if(chunkY*2<chunkX-halfHex){
			// 			row--;
			// 			mouseRowOffset=row%2===evenOdd?halfHex:0;
			// 		}
			// 	}
			// }
			//squares
			
			// canvas.rect(0, yStart+row*threeQuarterHex+quarterHex, gameCanvas.width,halfHex);
			// column=Math.floor((mouseOffsetX-mouseRowOffset)/width)

			// let myY=yStart+row*threeQuarterHex-1;
			// let myX=xStart+column*width+mouseRowOffset-1;
			// canvas.drawImage(redHexIMG, myX, myY);

			// column+=Math.floor((row+evenOdd)/2)

			// drawText(canvas,"("+column+","+row+")",false,5,5)
			// canvas.stroke();
		}
	}
}

class HexTile{
	constructor(x,y){
		this.x=x;
		this.y=y;
	}
	setNeighbors(){

	}
	toString(){
		return "("+this.x+","+this.y+")";
	}
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