var grid=[];
var gridHeight,gridWidth;
var woodCount=0;//1500;
var counts={tree:0,axe:0,saw:0,fire:0}

function setupGrid(width,height,leftBuffer,topBuffer){
	gridHeight=height;
	gridWidth=width;
	grid=Array(gridWidth).fill("0").map((row,x)=> new Array(gridHeight).fill(0).map((col,y)=>new Cell(x,y,x*32+leftBuffer,y*32+topBuffer)));
}

function drawGrid(g){
	//console.log(grid);
	//console.log(grid[0][0].x32);
	//grid[0][0].draw(g);
	grid.forEach(row=>row.forEach(cell=>cell.draw(g)));
}

function updateGrid(){
	//console.log(grid);
	//console.log(grid[0][0].x32);
	//grid[0][0].draw(g);
	grid.forEach(row=>row.forEach(cell=>cell.begin()));
	grid.forEach(row=>row.forEach(cell=>cell.update()));
	grid.forEach(row=>row.forEach(cell=>cell.end()));
}
function gridClick(x,y,mod){
	grid[x][y].click(mod);
}


function makeTree(x,y){
	// alert(x+" "+y)
	let temp=grid[x][y];
	if(temp.name==="Grass"){
		grid[x][y]=new Tree(temp);
	}
}

// var topBuffer=0;
// var leftBuffer=0;
// function setBuffers(x,y){
// 	topBuffer=y;
// 	leftBuffer=x;
// }


/* * * * * * * * * * * * * * * * * * * * * * * *\
|*                    Cells                    *|
\* * * * * * * * * * * * * * * * * * * * * * * */

class Cell{
	constructor(x,y,x32,y32){
		this.x=x;
		this.y=y;

		this.x32=x32;
		this.y32=y32;
		this.name="Grass";
		this.text="broke"
	}
	draw(g){}
	drawAt(g,x,y,w){}

	click(mod){
		if(mod){
			// let price=mod.getPrice(count[mod.name.toLowerCase()])
			let price=mod.getPrice();
			if(woodCount>=price){
				woodCount-=price;
				grid[this.x][this.y]=new mod.type(this);
			}
			else{
				//flash red or something
			}
		}
	}

	begin(){}
	update(){}
	end(){}

	delete(timer){
		shopArray[SHOP_ENUM[this.name]].count--;
		grid[this.x][this.y]=new BadGrass(this,timer);
	}
}


const treeIMG= Array(4).fill("0").map(()=> new Image() )
treeIMG.forEach((row,i)=>row.src=`./sawtown/img/tree${i+1}.png`);
treeIMG[4]=treeIMG[3];
class Tree extends Cell{
	constructor(c){
		super(c.x,c.y,c.x32,c.y32);
		// counts.tree++;
		this.name="Tree";
		this.text="Baby"
		this.stage=0;
		shopArray[SHOP_ENUM[this.name]].count++;
	}

	draw(g){
		g.drawImage(treeIMG[this.stage], this.x32, this.y32);
	}

	drawAt(g,x,y,w){
		g.drawImage(treeIMG[this.stage], x, y, w, w);
	}

	click(mod){
		//cut tree
		if(this.stage>=3){
			woodCount+=upgradeModifiers.clickMultiplier*upgradeModifiers.globalWoodMultiplier;
		}
		this.delete(1);
	}

	
	begin(){
		if(this.stage<4){
			this.stage++;
			let t=["Baby","Child","Teen","Adult","Adult"]
			this.text=t[this.stage];
		}
	}

	//update(){}

	end(){
		if(this.stage==4){
			//grow more trees
			// console.log("plant");
			if(this.x>0){//left
				makeTree(this.x-1,this.y);
			}
			if(this.x < gridWidth-1){//right
				makeTree(this.x+1,this.y);
			}
			if(this.y>0){//up
				makeTree(this.x,this.y-1);
			}
			if(this.y < gridHeight-1){//down
				makeTree(this.x,this.y+1);
			}
		}
	}
}



class BadGrass extends Cell{
	constructor(c,timer){
		super(c.x,c.y,c.x32,c.y32);
		this.timer=timer;
		this.name="BadGrass";
		// this.text="Self Cutting";
		// shopArray[SHOP_ENUM[this.name]].count++;
		// shopArray[1].count++;
	}
	// click() get planted
	begin(){
		if(this.timer>0){
			this.timer--;
		}
		else{
			grid[this.x][this.y]=new Cell(this.x,this.y,this.x32,this.y32);
		}
	}
	// update(){}
	// end(){}
}




const axeIMG= new Image();
axeIMG.src="./sawtown/img/axe.png";
class Axe extends Cell{
	constructor(c){
		super(c.x,c.y,c.x32,c.y32);
		this.name="Axe";
		this.text="Self Cutting";
		this.angle=0;
		shopArray[SHOP_ENUM[this.name]].count++;
		// shopArray[1].count++;
	}

	draw(g){
		g.save();
		g.translate(this.x32+16, this.y32+16);
		g.rotate(this.angle*Math.PI);
		g.drawImage(axeIMG, -16, -16);
		g.restore();
	}

	drawAt(g,x,y,w){
		let half=w/2
		g.save();
		g.translate(x+half, y+half);
		g.rotate(this.angle*Math.PI);
		g.drawImage(axeIMG, -half, -half, w, w);
		g.restore();
	}

	click(mod){
		//idk, open option window or something
		// woodCount+=sho
		this.delete(1);
		woodCount+=shopArray[SHOP_ENUM[this.name]].getPrice();
	}

	//begin(){}
	update(){
		this.angle+=.25;
		// if(this.angle>=2){
		// 	this.angle=0;
		// }
		this.angle%=2;

		switch(this.angle){
			case 0://above
				if(this.y>0){
					this.cut(this.x,this.y-1);
				}
				break;
			case .5://left
				if(this.x < gridWidth-1){//right
					this.cut(this.x+1,this.y);
				}
				break;
			case 1://down
				if(this.y < gridHeight-1){//down
					this.cut(this.x,this.y+1);
				}
				break;
			case 1.5://right
				if(this.x>0){
					this.cut(this.x-1,this.y);
				}
				break;
		}
		
		
		
	}
	cut(x,y){//in grid
		let temp=grid[x][y];
		if(temp.name==="Tree"&&temp.stage>3){
			woodCount+=upgradeModifiers.axeMultiplier*upgradeModifiers.globalWoodMultiplier;
			grid[x][y].delete(0);
		}
	}
	// end(){}
}


const sawIMG= new Image();
sawIMG.src="./sawtown/img/saw.png";
class Saw extends Cell{
	constructor(c){
		super(c.x,c.y,c.x32,c.y32);
		this.name="Saw";
		this.text="See Me?";
		// this.angle=0;
		shopArray[SHOP_ENUM[this.name]].count++;
		// shopArray[2].count++;
	}

	draw(g){
		g.drawImage(sawIMG, this.x32, this.y32);
	}

	drawAt(g,x,y,w){
		g.drawImage(sawIMG, x, y, w, w);
	}

	click(mod){
		//idk, open option window or something
		this.delete(1);
		woodCount+=shopArray[SHOP_ENUM[this.name]].getPrice();
	}

	//begin(){}
	// update(){}
	// end(){}
}


const fireIMG= new Image();
fireIMG.src="./sawtown/img/fire.png";
class Fire extends Cell{
	constructor(c){
		super(c.x,c.y,c.x32,c.y32);
		this.name="Fire";
		this.text="Hot";
		this.age=0;
		shopArray[SHOP_ENUM[this.name]].count++;
		// shopArray[3].count++;
	}

	draw(g){
		g.drawImage(fireIMG, this.x32, this.y32);
	}

	drawAt(g,x,y,w){
		g.drawImage(fireIMG, x, y, w, w);
	}

	click(mod){
		//idk, open option window or something
		this.delete(1);
	}

	begin(){
		if(this.age>0){
			if(this.x>0){//left
				this.burn(this.x-1,this.y,true);
			}
			if(this.x < gridWidth-1){//right
				this.burn(this.x+1,this.y,false);
			}
			if(this.y>0){//up
				this.burn(this.x,this.y-1,true);
			}
			if(this.y < gridHeight-1){//down
				this.burn(this.x,this.y+1,false);
			}
		}
	}
	// update(){}
	end(){
		if(this.age>4){
			this.delete(0);
		}
		else{
			this.age++;
		}
	}

	burn(x,y,isBefore){
		let temp=grid[x][y];

		if(temp.name=="Tree"){
			let stage=isBefore?3:4;
			if(temp.stage>=stage){
				woodCount+=upgradeModifiers.fireMultiplier*upgradeModifiers.globalWoodMultiplier;
			}
			grid[x][y]=new Fire(temp)
		}

	}
}