/**
 * Created by yeIAmCrasyProgrammer on 10.10.2016.
 */

function Cluster (count,correlation){
    CanvasObject.apply(this,[{}]);
    this.correlation    = correlation || {};
    this.count          = count;
    this.iteration      = 1;
    this.constructor    = Cluster;
    this.parameters     = {
        list        : {},
        iteration   : false
    }
}

Cluster.prototype = Object.create(CanvasObject.prototype);

Cluster.prototype.transform = function(){
    if(!this._transform){
        this._transform = new Listing();
    }
    return this._transform;
};

Cluster.prototype.animate = function(){
    if(this.iteration > this.count){
        this.iteration = 1;
        return;
    }
    this.parent.animate(this.drawing.context);
    this.iteration++;
    this.animate();
};

Object.defineProperties(Cluster.prototype,{
    now     : {
        get : function(){
            if(this.parameters.iteration !== this.iteration) {
                for(var key in this.parent.now){
                    var correlation = +this.correlation[key];
                    if(typeof this.correlation[key] == "function"){
                        correlation = +this.correlation[key](this.iteration);
                    }
                    this.parameters.list[key] = this.parent.now[key] +
                        (correlation * this.iteration);
                }
                this.parameters.iteration = +this.iteration;
            }
            return this.parameters.list;
        },

        set : function(value){
            return this.parameters.list;
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