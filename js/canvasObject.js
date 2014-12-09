/**
 * Created by takovoy on 22.11.2014.
 */

var CanvasObject = function(id,drawingObject){
    Object.defineProperties(this,{
        x: {
            get: function(){
                return this.now.x;
            },
            set: function(value){
                this.now.x = value;
            }
        },
        y: {
            get: function(){
                return this.now.y;
            },
            set: function(value){
                this.now.y = value;
            }
        }
    });
    this.x = 0;
    this.y = 0;
    this.id = id || '' + Math.random();
    this.now = {};
    this.after = {};
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