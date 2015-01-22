/**
 * Created by takovoy on 30.11.2014.
 */

var Circle = function(radius,id,drawingObject,parameters){
    this.now = parameters || {};
    Object.defineProperties(this,{
        radius: {
            get: function(){
                return this.now.radius;
            },
            set: function(value){
                this.now.radius = value;
            }
        },
        x: {
            get: function(){
                if(this.parent){
                    return this.now.x + this.parent.x;
                }
                return this.now.x;
            },
            set: function(value){
                this.now.x = value;
            }
        },
        y: {
            get: function(){
                if(this.parent){
                    return this.now.y + this.parent.y;
                }
                return this.now.y;
            },
            set: function(value){
                this.now.y = value;
            }
        }
    });
    this.x = 0;
    this.y = 0;
    this.radius = radius;
    this.id = id || '' + Math.random();
    this.start = function(){
        drawingObject.stack.append(this);
    };
    this.stop = function(){
        drawingObject.stack.remove(this.id);
    };
    this.animate = function(context){
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2);
        if(this.now.fill){
            context.fillStyle = this.now.fill;
            context.fill();
        }
        if(this.now.stroke){
            context.strokeStyle = this.now.stroke;
            context.stroke();
        }
        context.closePath();
    }
};
Circle.prototype = Object.create(CanvasObject.prototype);