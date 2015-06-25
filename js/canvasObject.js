/**
 * Created by takovoy on 22.11.2014.
 */

var CanvasObject = function(id,drawingObject,parameters){
    this.now            = parameters || {};
    this.id             = id || '' + Math.random();
    this.drawingObject  = drawingObject;
    if(drawingObject){
        this.drawingObject = drawingObject;
    }
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
    childrens: {
        get: function(){
            if(!this._childrens){
                this._childrens = new PropertyListing(
                    function(self,object){
                        object.parent = self.now;
                    },
                    function(self){

                    },
                    this
                )
            }
            return this._childrens;
        }
    },
    after   : {
        get: function(){
            if(!this._after){
                this._after = new Listing();
            }
            return this._after;
        }
    },
    events   : {
        get: function(){
            if(!this._events){
                this._events = new EventsListing();
            }
            return this._events;
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
    this.childrens.list[canvasObject.id] = canvasObject;
};
CanvasObject.prototype.removeChild  = function(id){
    delete this.childrens.list[id];
};

CanvasObject.prototype.animate      = function(){};
CanvasObject.prototype.moveTo       = function(coord,time){
    if(!time){
        this.x = coord[0];
        this.y = coord[1];
        return;
    }
    this.after.append('trajectory',
        {
            type    : 'line',
            shift   : 0     ,
            endShift: 100   ,
            points  : [
                [
                    this.x,
                    this.y
                ],
                coord
            ],
            time    : time
        }
    )
};