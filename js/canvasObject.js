/**
 * Created by takovoy on 22.11.2014.
 */

var CanvasObject = function(id,drawingObject,parameters){
    this.now            = parameters || {};
    this.id             = id || '' + Math.random();
    this.drawingObject  = drawingObject;
    this.childrens      = {};
};

Object.defineProperties(CanvasObject.prototype,{
    x       : {
        get: function(){
            if(this.parent){
                return +this.now.x + this.parent.x;
            }
            return +this.now.x;
        },
        set: function(value){
            this.now.x = +value;
        }
    },
    y       : {
        get: function(){
            if(this.parent){
                return +this.now.y + this.parent.y;
            }
            return +this.now.y;
        },
        set: function(value){
            this.now.y = +value;
        }
    },
    after   : {
        get: function(){
            if(!this._after){
                this._after = {
                    list    : {},
                    append  : function(name,data){
                        this.list[name] = data;
                    },
                    remove  : function(name){
                        delete this.list[name];
                    }
                }
            }
            return this._after;
        }
    }
});

CanvasObject.prototype.start        = function(){
    this.drawingObject.stack.append(this);
};
CanvasObject.prototype.stop         = function(){
    this.drawingObject.stack.remove(this.id);
};

CanvasObject.prototype.appendChild  = function(canvasObject){
    canvasObject.parent = this.now;
    this.childrens[canvasObject.id] = canvasObject;
};
CanvasObject.prototype.removeChild  = function(id){
    delete this.childrens[id];
};

CanvasObject.prototype.animate      = function(){};