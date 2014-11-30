/**
 * Created by takovoy on 22.11.2014.
 */

var CanvasObject = function(x,y,id,drawingObject,parameters){
    this.id = id || '' + Math.random();
    this.x = x || 0;
    this.y = y || 0;
    this.parameters = parameters || {};
    this.start = function(){
        drawingObject.stack.append(this);
    };
    this.stop = function(){
        drawingObject.stack.remove(this.id);
    };
};

CanvasObject.prototype.childrens = {};
CanvasObject.prototype.appendChild = function(canvasObject){
    this.childrens[canvasObject.id] = canvasObject;
};
CanvasObject.prototype.removeChild = function(id){
    delete this.childrens[id];
};

CanvasObject.prototype.animate = function(){};
CanvasObject.prototype.moveTo = function(x,y){

};