
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
		this.setupNeighbors();
	}
	setupArray(){
		this.hexGridArray=[];
		for(let r=this.rows-1;r>=0;r--){
			let ry=r*this.threeQuarterHex+this.yStart
			let offsetX=(r+1)%2*this.halfHex;
			this.hexGridArray[r]=[];
			for(let c=this.columns-(2-r%2);c>=0;c--){
				let rx=c*this.tileWidth+offsetX+this.xStart
				this.hexGridArray[r][c]=new HexTile(rx,ry,r,c);
			}
		}
		// console.log(this.hexGridArray);
	}
	setupNeighbors(){
		
		for(let r=this.rows-1;r>=0;r--){
			let isEven=1-r%2;
			for(let c=this.columns-1-isEven;c>=0;c--){
				//nw,ne,e,se,sw,w

				this.hexGridArray[r][c].setNeighbors(
					this.getByIndex(r-1,c-1+isEven),this.getByIndex(r-1,c+isEven),
					this.getByIndex(r,c+1),
					this.getByIndex(r+1,c+isEven),this.getByIndex(r+1,c-1+isEven),
					this.getByIndex(r,c-1));
			}
		}
	}
	getByIndex(row,col){
		if(row<0||row>=this.rows||col<0||col>=this.columns-(1-row%2)){
			return null;
		}
		return this.hexGridArray[row][col];
	}
	getByCoordinate(x,y){

		if(y>=this.yEnd||x>=this.xEnd){
			return null;
		}
		x-=this.xStart;
		y-=this.yStart;
		if(x<0||y<0){
			return null;
		}

		let row=Math.floor(y/this.threeQuarterHex);
		let chunk=Math.floor((y/this.quarterHex)%3);

		let rowOffset=(row%2)?0:this.halfHex;

		//triangles
		if(chunk===0){
			let chunkX=(x+rowOffset)%this.tileWidth
			let chunkY=y%this.threeQuarterHex
			if((chunkX<this.halfHex&&chunkX<(this.quarterHex-chunkY)*2)
					||(chunkX>=this.halfHex&&chunkY*2<chunkX-this.halfHex)){
				row--;
				rowOffset=(row%2)?0:this.halfHex;
			}
		}
		let column=Math.floor((x-rowOffset)/this.tileWidth)
		return hexGrid.getByIndex(row,column);
	}


	draw(){
		for(let row of this.hexGridArray){
			for(let hex of row){
				hex.draw();
			}
		}
	}
	update(){
		for(let row of this.hexGridArray){
			for(let hex of row){
				hex.begin();
			}
		}for(let row of this.hexGridArray){
			for(let hex of row){
				hex.update();
			}
		}
		for(let row of this.hexGridArray){
			for(let hex of row){
				hex.end();
			}
		}
	}
}

const hexIMG= new Image();
hexIMG.src="img/hex48.png";
class HexTile{
	constructor(x,y,row,column){
		this.x=x;
		this.y=y;
		this.row=row;
		this.column=column;
		this.item=null;
	}
	setNeighbors(nw,ne,e,se,sw,w){
		this.neighbors=[nw,ne,e,se,sw,w];
	}
	toString(){
		return "("+this.x+","+this.y+")";
	}
	draw(){
		gameContent.drawImage(hexIMG, this.x,this.y);
		if(this.item){
			this.item.draw();
		}
	}
	click(){
		if(!this.item){
			this.item=new Tree(this);
		}
		// console.log("hi");
	}
	begin(){
		this.item&&this.item.begin();
	}
	update(){
		this.item&&this.item.update();
	}
	end(){
		this.item&&this.item.end();
	}
	// asArray(){
	// 	return[this.x,this.y,this.row,this.column];
	// }
}

class Item{
	constructor(parent){
		this.parent=parent;
	}
	begin(){}
	update(){}
	end(){}
}

const MAX_TREE=6;
const treeIMG=[];
for(let i=MAX_TREE;i>=0;i--){
	treeIMG[i]=new Image();
	treeIMG[i].src="img/tree-"+i+".png";
}
class Tree extends Item{
	constructor(parent){
		super(parent);
		this.age=0;
	}
	draw(){
		gameContent.drawImage(treeIMG[this.age], this.parent.x,this.parent.y);
	}
	update(){
		if(this.age===MAX_TREE){
			// for(let neighbor of this.parent.neighbors){
			// 	neighbor&&neighbor.click()
			// }
			// let tempNeighbors =[]
			// for(let neighbor of this.parent.neighbors){
			// 	neighbor&&neighbor.item==null&&tempNeighbors.push(neighbor)
			// }
			// tempNeighbors.length&&tempNeighbors[Math.floor(Math.random()*tempNeighbors.length)].click()

			let neighbor = this.parent.neighbors[Math.floor(Math.random() * 6)];
			if(neighbor&&neighbor.item==null){
				neighbor.click()
			}
		}
	}
	end(){
		if(this.age<MAX_TREE){
			this.age++;
		}
	}

}


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
		// if(mod){
		// 	// let price=mod.getPrice(count[mod.name.toLowerCase()])
		// 	let price=mod.getPrice();
		// 	if(woodCount>=price){
		// 		woodCount-=price;
		// 		grid[this.x][this.y]=new mod.type(this);
		// 	}
		// 	else{
		// 		//flash red or something
		// 	}
		// }
	}

	begin(){}
	update(){}
	end(){}

	delete(timer){
		// shopArray[SHOP_ENUM[this.name]].count--;
		// grid[this.x][this.y]=new BadGrass(this,timer);
	}
}