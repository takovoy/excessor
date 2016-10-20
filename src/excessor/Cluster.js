/**
 * Created by yeIAmCrasyProgrammer on 10.10.2016.
 */

function Cluster (count,correlation){
    CanvasObject.apply(this,[{}]);
    this.correlation    = correlation || {};
    this.count          = count;
    this.constructor    = Cluster;
}

Curve.prototype = Object.create(CanvasObject.prototype);

Cluster.prototype.transform = function(){
    if(!this._transform){
        this._transform = new Listing();
    }
    return this._transform;
};

Cluster.prototype.animate = function(){
    this.parent.animate(this.drawing);
};

Object.defineProperties(CanvasObject.prototype,{
    now     : {

        get : function(){
            var parameters = {};
            for(var key in this.parent.now){
                parameters[key] = this.parent.now[key] * this.correlation[key];
            }
            return parameters;
        },
        set : function(value){
            return;
        }
    },
    x       : {
        get : function(){
            if(this.parent.parent){
                return +this.now.x + this.parent.parent.x;
            }
            return +this.now.x;
        },
        set : function(value){
            this.now.x = +value;
        }
    },
    y       : {
        get : function(){
            if(this.parent.parent){
                return +this.now.y + this.parent.parent.y;
            }
            return +this.now.y;
        },
        set : function(value){
            this.now.y = +value;
        }
    }
});