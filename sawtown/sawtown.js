// import {cell} from 'cell';

var gameInterval;
var gameCanvas;
var eventCatcherDiv;
const COLOR={menuPurple:"#6d045f",menuDarkGray:"#575757",menuLightGray:"#747474",
				grassGreen:"#199607"}
var sampleColor;

// const badPreview=new BadCell();
// var preview=badPreview;

const TOP=3;
const RIGHT=6;
const WINDOW_BUFFER=16;
const PRE_BOT_MOD=1.5;

var gridBox;
var previewBox;
var previewImgBox;
var menuBox;

var shopBox;
var shopArray=[];
var SHOP_ENUM={};
const SHOP_BUFFER=16;
var SHOP_TOP;
var shopSelection;

var RIGHT_MIDDLE;

var upgradeBox;
var upgradeInnerBox;
var upgradeModifiers;
const UPGRADE_BUFFER=5;
const UPGRADE_BUFFER_32=UPGRADE_BUFFER+32;
var upgradeArray=[];

var mouse;

/* * * * * * * * * * * * * * * * * * * * * * * *\
|*                    SETUP                    *|
\* * * * * * * * * * * * * * * * * * * * * * * */
function startLoading(){
    eventCatcherDiv = document.getElementById("EventCatcher");

	// eventCatcherDiv events go here
	eventCatcherDiv.addEventListener("mousemove", canvasMove);//mousemove
	eventCatcherDiv.addEventListener("click", canvasClick);//mousemove

    gameCanvas = document.getElementById("GraphicsBox");

	let canvas=gameCanvas.getContext("2d");
	canvas.imageSmoothingEnabled= false;


	let sc=document.getElementById("sampleColor");
	if(sc){
		sampleColor=sc.style.backgroundColor;
	}
	setupBasicVariables();

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

function canvasClick(E){
	if(mouse.inGrid){
		gridClick(mouse.gridX,mouse.gridY,shopSelection);
	}
	else if(mouse.inShop){
		if(shopSelection!=mouse.shopItem){
			shopSelection=mouse.shopItem;
		}
		else{
			shopSelection=null;
		}
	}
	else if(mouse.inUpgrades){
		let item=upgradeArray[mouse.upgradeNumber];
		if(woodCount>=item.price){
			woodCount-=item.price;
			item.action();
			upgradeArray.splice(mouse.upgradeNumber, 1);
		}

	//	arr.splice(start[, deleteCount[

	}
	mouse.updateSelection();
}

function setFree(val){
	return val==0?"FREE":val;
}

function addToUpgrades(upp){
	for(let i=0;i<upgradeArray.length;i++){
		if(upp.price<upgradeArray[i].price){
			upgradeArray.splice(i,0,upp);
			return;
		}
	}
	upgradeArray.push(upp);
}


/* * * * * * * * * * * * * * * * * * * * * * * *\
|*                 Draw  Stuff                 *|
\* * * * * * * * * * * * * * * * * * * * * * * */
function drawGridLines(g,isActive){
    
	if(isActive){
		// top to bot
		for(let i = gridBox.right; i>0; i-=32){
			g.moveTo(i,gridBox.top);
			g.lineTo(i,gridBox.bottom);
		}
		//left to right
		for(let i = gridBox.bottom; i>=gridBox.top; i-=32){
			g.moveTo(gridBox.left,i);
			g.lineTo(gridBox.right,i);
		}
	}
	else{
		g.rect(...gridBox.drawArray());
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

function drawLines(g, text, maxWidth,x,y) {
    g.font = "20px Arial";
    let words = text.split(" ");
    let currentLine = words[0];
	y+=20;

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = g.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
			g.fillText(currentLine, x, y);
			y+=24;
            currentLine = word;
        }
    }
	g.fillText(currentLine, x, y);
}
// function getLines(ctx, text, maxWidth) {
//     let words = text.split(" ");
//     let lines = [];
//     let currentLine = words[0];

//     for (let i = 1; i < words.length; i++) {
//         let word = words[i];
//         let width = ctx.measureText(currentLine + " " + word).width;
//         if (width < maxWidth) {
//             currentLine += " " + word;
//         } else {
//             lines.push(currentLine);
//             currentLine = word;
//         }
//     }
//     lines.push(currentLine);
//     return lines;
// }



function drawCursor(g){
	g.beginPath();
	if(mouse.inGrid){
		g.rect(mouse.x32, mouse.y32, 32, 32);
	}
	else if(mouse.inShop){
		g.strokeStyle="red";
		g.rect(mouse.shopItem.x,SHOP_TOP,32,32);
	}
	else if(mouse.inUpgrades){
		g.strokeStyle="red";
		g.rect(upgradeInnerBox.left+UPGRADE_BUFFER+UPGRADE_BUFFER_32*(mouse.upgradeNumber%4),
			upgradeInnerBox.top+UPGRADE_BUFFER+UPGRADE_BUFFER_32*Math.floor(mouse.upgradeNumber/4),
			32,32);
	}
	g.stroke();
}

function drawPreview(g){
	g.fillStyle = COLOR.menuPurple;
    g.fillRect(...previewBox.drawArray());
	
	if(mouse.inGrid&&mouse.gridItem.name!="Grass"&&mouse.gridItem.name!="BadGrass"){
		g.fillStyle = COLOR.grassGreen;
		mouse.gridItem
		drawPreviewImg(g,null,mouse.gridItem.name,mouse.gridItem.text);
		mouse.gridItem.drawAt(g,...previewImgBox.drawArray());
	}
	else if(mouse.inUpgrades){
		let view=upgradeArray[mouse.upgradeNumber];
		drawPreviewText(g,view.name,view.description, "Cost: "+view.price)
	}
	else if(mouse.inShop){
		let view=mouse.shopItem;
		//let price=;
		drawPreviewText(g,view.name,view.description,"Cost: "+setFree(view.getPrice()))
	}
	else if(shopSelection){
		// let view=mouse.shopItem;
		g.fillStyle = COLOR.menuLightGray;
		let price=setFree(shopSelection.getPrice());
		drawPreviewImg(g,shopSelection.image, shopSelection.name,"Cost: "+price);
	}
	g.rect(...previewBox.drawArray());	
}


function drawPreviewImg(g,img,text1,text2){
	g.fillRect(...previewImgBox.drawArray());
	if(img){
		g.drawImage(img, ...previewImgBox.drawArray());
	}
	g.rect(...previewImgBox.drawArray());	
	let yy=previewImgBox.top+previewImgBox.width+8;
		
	drawText(g, text1, true, RIGHT_MIDDLE, yy);
	drawText(g, text2, true, RIGHT_MIDDLE, yy+32);
}
function drawPreviewText(g,title,desc,text2){	
	let yy=previewImgBox.top;
	for(ns of title.split(" ")){
		drawText(g, ns, true, RIGHT_MIDDLE, yy);
		yy+=30
	}

	drawLines(g,desc,upgradeInnerBox.width,RIGHT_MIDDLE,yy+10);
	drawText(g, text2, true, RIGHT_MIDDLE, previewImgBox.top+previewImgBox.width+8+32);
}

function drawMenu(g,fps){
	g.fillStyle = COLOR.menuPurple;
    g.fillRect(...menuBox.drawArray());

	drawText(g, fps, false, 3, 3);
	//drawText(g, mouse.gridX+","+mouse.gridY, false, 45, 3);
	drawText(g, " Logs: "+woodCount, false, 0, 40);
	//drawText(g, shopArray[0].count, false, 120, 3);

	g.fillStyle = COLOR.menuDarkGray;
	g.fillRect(...shopBox.drawArray());	

	g.fillStyle=COLOR.menuLightGray;
	for(item of shopArray){
		if(item==shopSelection){
			g.fillStyle=COLOR.grassGreen;//selected item
			g.fillRect(item.x,SHOP_TOP, 32, 32);
			g.fillStyle=COLOR.menuLightGray;
		}
		else{
			g.fillRect(item.x,SHOP_TOP, 32, 32);
		}
		g.drawImage(item.image, item.x,SHOP_TOP);
		g.rect(item.x,SHOP_TOP, 32, 32);
	}
	g.rect(...shopBox.drawArray());	

	g.rect(...menuBox.drawArray());
}


function drawUpgrades(g){
	g.fillStyle = COLOR.menuPurple;
    g.fillRect(...upgradeBox.drawArray());
	drawText(g, " Upgrades", false, upgradeBox.left, upgradeBox.top);
	g.fillStyle = COLOR.menuDarkGray;
	g.fillRect(...upgradeInnerBox.drawArray());

	const ogxx=upgradeInnerBox.left+UPGRADE_BUFFER;
	let xx=ogxx;
	let yy=upgradeInnerBox.top+UPGRADE_BUFFER;
	
	g.fillStyle = COLOR.menuLightGray;	
	for(let i=0;i<upgradeArray.length;i++){
		g.fillRect(xx,yy,32,32);
		g.drawImage(upgradeArray[i].image,xx,yy);
		g.rect(xx,yy,32,32);

		if(i%4==3){
			xx=ogxx;
			yy+=UPGRADE_BUFFER_32;
		}
		else{
			xx+=UPGRADE_BUFFER_32;
		}
	}

	g.rect(...upgradeInnerBox.drawArray());
	g.rect(...upgradeBox.drawArray());
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
		updateGrid();
		mouse.updateSelection();
	}
	else if(frameCount==1){
		//check for new upgrades
	}

	let canvas=gameCanvas.getContext("2d");
	// canvas.imageSmoothingEnabled= false;

	canvas.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	canvas.fillStyle = COLOR.grassGreen;
	canvas.fillRect(...gridBox.drawArray());

	canvas.strokeStyle="black";
	canvas.lineWidth = 2;
	canvas.beginPath();
	drawGrid(canvas);
	drawGridLines(canvas,false);
	drawMenu(canvas,fps);
	drawUpgrades(canvas);
	drawPreview(canvas);
	canvas.stroke();
	drawCursor(canvas);
}

class Box{
	constructor(left,right,top,bottom){
		this.left=left;
		this.right=right;
		this.top=top;
		this.bottom=bottom;

		this.width=right-left;
		this.height=bottom-top;
	}
	drawArray(){
		return [this.left,this.top,this.width,this.height]
	}
}

class Mouse{
	constructor(){
		this.set(0,0);
	}
	set(x,y){
		this.x=x;
		this.gridX=parseInt(x/32);
		this.x32=this.gridX*32;
		this.y=y;
		this.gridY=parseInt(y/32);
		this.y32=this.gridY*32;
		this.gridY=this.gridY-TOP;

		this.inGrid=y>=gridBox.top&&x<gridBox.right;


		this.updateSelection();

	}

	updateSelection(){
		this.inShop=false;
		this.inUpgrades=false;
		if(this.inGrid){
			this.gridItem=grid[this.gridX][this.gridY];
		}	
		else if(this.y<SHOP_TOP+32&&this.y>=SHOP_TOP){
			for(item of shopArray){
				if(this.x<item.x){
					break;
				}
				if(this.x<item.x+32){
					this.inShop=true;
					this.shopItem=item;
					break;
				}
			}
		}
		else{
			let xx=this.x-upgradeInnerBox.left-UPGRADE_BUFFER;
			let yy=this.y-upgradeInnerBox.top-UPGRADE_BUFFER;
			
			if(xx>=0&&yy>=0&&this.x<upgradeInnerBox.right&&this.y<upgradeInnerBox.bottom&&
					xx%UPGRADE_BUFFER_32<32&&yy%UPGRADE_BUFFER_32<32){
				this.upgradeNumber=Math.floor(yy/UPGRADE_BUFFER_32)*4+Math.floor(xx/UPGRADE_BUFFER_32);
				this.inUpgrades=upgradeArray.length>this.upgradeNumber;
			}
		}
	}
}


class StoreItem{
	constructor(name,type,image,x,basePrice,description){
		this.name=name;
		this.type=type;
		this.image=image;
		this.x=x;
		this.basePrice=basePrice;
		this.count=0;
		this.description=description;
	}

	getPrice(){
		return Math.round(this.basePrice*Math.pow(1.82,this.count));
	}
}

class Upgrade{
	constructor(name,image,price,description,action){
		this.name=name;
		this.image=image;
		this.price=price;
		this.description=description;
		this.action=action;
	}
}