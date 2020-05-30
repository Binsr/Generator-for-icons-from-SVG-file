window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('img');  // $('img')[0]
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            
            document.getElementById("forHide").style.visibility="hidden";
            setTimeout(function(){
                let slika= document.getElementById("myImg");
                console.log(slika.clientHeight);
                document.getElementById("svg_height").value= slika.clientHeight;
                document.getElementById("svg_width").value= slika.clientWidth;

            }, 3000);
        }
    });
  });




  var Shape = class Shape{

    constructor(id){
    	this.shape= "Rect";
        this.id= id;
        this.colorInColision= "red";
        this.defaultColor= "black";
        this.colision= null;
        this.color= this.defaultColor;
        this.lineWidth= 3;
        
    }

    inColision(){
        return this.colision;
    }

    setColor(status){
        if(status == "colision"){
            this.color= this.colorInColision;
            this.colision= true;
        }
        else{
            this.color= this.defaultColor;
            this.colision= false;
        }
    }

    draw(ctx){}
}


var Rect = class Rect extends Shape{

    constructor(positions,id){

        super(id);
        this.startPos={
            x: positions.startX,
            y: positions.startY
        }

        this.endPos={
            x: positions.endX,
            y: positions.endY
        }
    }

    updateCord(coordinates){
        this.endPos.x= coordinates.endX;
        this.endPos.y= coordinates.endY;

        this.startPos.x= coordinates.startX;
        this.startPos.y= coordinates.startY;
    }

    setStartPos(start){
        this.startPos.x= start.x;
        this.startPos.y= start.y;
    }

    getStartPos(){
        return this.startPos;
    }

    getEndPos(){
        return this.endPos;
    }

    getCoordOfAllAngles(){
        let startPos= this.startPos;
        let endPos= this.endPos;

        let pointsOfAngles={
            leftUp: null,
            leftDown: null,
            rightUp: null,
            rightDown: null
        };

        if(startPos.x < endPos.x){
            if(startPos.y < endPos.y){
                pointsOfAngles.leftDown= startPos;
                pointsOfAngles.rightUp= endPos;

                pointsOfAngles.rightDown= {
                    x: pointsOfAngles.rightUp.x,
                    y: pointsOfAngles.leftDown.y
                };

                pointsOfAngles.leftUp= {
                    x: pointsOfAngles.leftDown.x,
                    y: pointsOfAngles.rightUp.y
                };

            }else{
                pointsOfAngles.leftUp= startPos;
                pointsOfAngles.rightDown= endPos; 

                pointsOfAngles.leftDown= {
                    x: pointsOfAngles.leftUp.x,
                    y: pointsOfAngles.rightDown.y
                };

                pointsOfAngles.rightUp= {
                    x: pointsOfAngles.rightDown.x,
                    y: pointsOfAngles.leftUp.y
                };

            }
        }else{
            if(startPos.y < endPos.y){
                pointsOfAngles.rightDown= startPos;
                pointsOfAngles.leftUp= endPos;

                pointsOfAngles.rightUp= {
                    x: pointsOfAngles.rightDown.x,
                    y: pointsOfAngles.leftUp.y
                };

                pointsOfAngles.leftDown= {
                    x: pointsOfAngles.leftUp.x,
                    y: pointsOfAngles.rightDown.y
                };

            }else{
                pointsOfAngles.rightUp= startPos;
                pointsOfAngles.leftDown= endPos;

                pointsOfAngles.rightDown= {
                    x: pointsOfAngles.rightUp.x,
                    y: pointsOfAngles.leftDown.y
                };

                pointsOfAngles.leftUp= {
                    x: pointsOfAngles.leftDown.x,
                    y: pointsOfAngles.rightUp.y
                };
            }
        }

        // DEO ZA PREPRAVITI POMESAO KORDINATU Y, GLEDAO JE KAO DA JOJ JE 0 DOLE
		// A NE U VRHU STRANICE***
        let tmp = pointsOfAngles.leftUp;
        pointsOfAngles.leftUp= pointsOfAngles.leftDown;
        pointsOfAngles.leftDown= tmp;

        tmp= pointsOfAngles.rightUp;
        pointsOfAngles.rightUp= pointsOfAngles.rightDown;
        pointsOfAngles.rightDown= tmp;
        // ----------------------------------------------------------------------------------------------
        return pointsOfAngles;
    }

    draw(ctx){
        ctx.strokeStyle= this.color;
        ctx.lineWidth= this.lineWidth;
        ctx.strokeRect(this.startPos.x,this.startPos.y,this.endPos.x-this.startPos.x,this.endPos.y-this.startPos.y);
    }

}

var canvas= document.getElementById("canvas-element");
var ctx= canvas.getContext("2d");

var newShape={
    startX: null,
    startY: null,
    endX: null,
    endY: null
};

var dragObj= null;
var showDragObj= false;
var dragRect= new Rect(newShape);
dragObj= dragRect;
var hotSpotObjects= [];
var selectedShape= "Rect";

canvas.addEventListener('mousedown',mouseClick,false);
canvas.addEventListener('mousemove',drag,false);
canvas.addEventListener('mouseup',dragStop,false);

function getCanvasCoordinates(event){
    var x= event.clientX - canvas.getBoundingClientRect().left;
    var y= event.clientY - canvas.getBoundingClientRect().top;
    return {x: x, y: y};
}


function mouseClick(event){
    var coordinates= getCanvasCoordinates(event);
    dragStart(coordinates);
    console.log(coordinates);

}

function drag(event){

    var coordinates= getCanvasCoordinates(event);
    newShape.endX= coordinates.x;
    newShape.endY= coordinates.y;

    if(dragObj)
        dragObj.updateCord(newShape);
    
}

function dragStart(coordinates){
    hotSpotObjects= [];
    newShape.startX= coordinates.x;
    newShape.startY= coordinates.y;
    showDragObj= true;
    if(dragObj)
        dragObj.updateCord(newShape);
}

function addElementInOutArr(element){
	var outShape;


			outShape= {
				shape: element['shape'],
				startPos: element['startPos'],
				endPos: element['endPos']
            }

		outArr.push(outShape);
		outShape= null;
	console.log(outArr);
}


function dragStop(event){
    showDragObj= false;
    hotSpotObjects= [];
    hotSpotObjects.push(new Rect(newShape,hotSpotObjects.length));
    console.log(hotSpotObjects);
    setWidtHeight(hotSpotObjects[0]);
    
}


function setWidtHeight(obj){

    document.getElementById("icon_width").value= Math.abs(obj.startPos.x-obj.endPos.x);
    document.getElementById("icon_height").value= Math.abs(obj.startPos.y - obj.endPos.y);
}




function draw(ctx){
    ctx.clearRect(0,0, 1000, 10000);    	
    for(let i= 0; i < hotSpotObjects.length; i++){
        hotSpotObjects[i].draw(ctx);
    }
    if(showDragObj && dragObj)
        dragObj.draw(ctx);
    
}

function appLoop(timeStamp){
	lastTime= timeStamp;
    draw(ctx);
    requestAnimationFrame(appLoop);
}
requestAnimationFrame(appLoop);