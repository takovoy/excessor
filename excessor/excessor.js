/**
 * Created by takovoy on 22.11.2014.
 */

function Drawing (width,height){
    this.DOMObject          = document.createElement('canvas');
    this.DOMObject.width    = width || 0;
    this.DOMObject.height   = height || 0;
    this.context            = this.DOMObject.getContext('2d');
    this.stack              = new PropertyListing();
    this._fps               = 0;
    this.core               = false;
}

Drawing.prototype.render = function(canvasObject,id){
    canvasObject.id = id;
    this.context.beginPath();
    this.context.fillStyle = '#000000';
    this.context.strokeStyle = '#000000';
    this.context.closePath();

    //динамика
    dynamic.move(canvasObject);
    canvasObject.animate(this.context);

    for(var child in canvasObject.childrens.list){
        this.render(canvasObject.childrens.list[child],child);
    }
};

Drawing.prototype.pause = function(){
    var fps     = this.fps;
    this.fps    = 0;
    this._fps   = fps;
};

Drawing.prototype.play = function(fps){
    this.fps    = +fps || this.fps;
};

Object.defineProperty(Drawing.prototype,'fps',{
    get: function(){
        return this._fps;
    },
    set: function(value){
        var self = this;
        if(this.core){clearInterval(this.core)}
        if(value != 0){
            this.core = setInterval(function(){
                self.context.clearRect(0,0,self.DOMObject.width,self.DOMObject.height);
                for (var key in self.stack.list) {
                    self.render(self.stack.list[key],key);
                }
            },1000 / +value);
        }
        this._fps = value
    }
});
/**
 * Created by takovoy on 22.11.2014.
 */

function CanvasObject ( options ) {
    options             = options || {};
    this.id             = options.id || '' + Math.random();
    this.now            = options.settings || {};
    this.now.x          = this.now.x || options.x || 0;
    this.now.y          = this.now.y || options.y || 0;
    this.now.radian     = this.now.radian || options.radian || 0;
    this.services       = {};
    this._transform     = new Listing();
    this.childrens      = new PropertyListing(
        function( self, object ){
            object.parent           = self;
            object.drawing          = self.drawing;
            self.operationContext   = object;
            return self;
        },
        function( self ){

        },
        this
    );
    this.drawing = options.drawing || undefined;
}

Object.defineProperties(CanvasObject.prototype,{
    x       : {
        get: function(){
            if( this.parent ){
                return (
                    this.now.x * Math.cos( this.parent.radian ) -
                    this.now.y * Math.sin( this.parent.radian ) +
                    this.parent.x
                );
            }
            return +this.now.x;
        },
        set: function( value ){
            this.now.x = +value;
        }
    },

    y       : {
        get: function(){
            if( this.parent ){
                return (
                    this.now.x * Math.sin( this.parent.radian ) +
                    this.now.y * Math.cos( this.parent.radian ) +
                    this.parent.y
                );
            }
            return +this.now.y;
        },
        set: function( value ){
            this.now.y = +value;
        }
    },

    radian  : {
        get: function(){
            if( this.parent ){
                return +this.parent.radian + +this.now.radian;
            }
            return +this.now.radian;
        },
        set: function( value ){
            this.now.radian = +value;
        }
    }
});

CanvasObject.prototype.start        = function(){
    this.drawing.stack.append( this );
    return this;
};
CanvasObject.prototype.stop         = function(){
    this.drawing.stack.remove( this.id );
    return this;
};
CanvasObject.prototype.animate      = function(){};
CanvasObject.prototype.transform    = function( transform ){
    if ( !this._transform ) {
        this._transform = new Listing();
    }
    if ( !transform ) {return this._transform;}
    this._transform.append( transform.id, transform );
    this.operationContext = transform;
    return this;
};
CanvasObject.prototype.move         = function( coord, time ){
    if( !time ){
        this.x = coord[0];
        this.y = coord[1];
        return;
    }
    return this.transform(new Transform({
        property: 'trajectory',
        type    : 'line',
        points  : [
            [
                this.x,
                this.y
            ],
            coord
        ],
        time    : time
    }));
};
CanvasObject.prototype.moveProperty   = function( property, value, time ){
    if( !time ){
        this.now[property] = value;
        return;
    }
    return this.transform(new Transform({
        property:property,
        start   : this.now[property],
        end     : value,
        time    : time
    }))
};
CanvasObject.prototype.append   = function( object ){
    return this.childrens.append( object );
};
/**
 * Created by takovoy on 30.11.2014.
 */

function Circle ( options ) {
    CanvasObject.apply( this, arguments );
    this.constructor    = Circle;
    this.now.radius     = this.now.radius || options.radius || 0;
    this.now.shift      = this.now.shift || options.shift || 100;
}

Circle.prototype = Object.create( CanvasObject.prototype );

Circle.prototype.animate = function( context ){
    context.beginPath();
    var radian = this.radian;
    context.arc( this.x, this.y, this.now.radius, radian, Math.PI*2/100*this.now.shift + radian );
    changeContext( context, this.now );
    context.closePath();
};
/**
 * Created by yeIAmCrasyProgrammer on 10.10.2016.
 */

function Cluster ( count, correlation ){
    this.parameters     = {
        list        : {},
        iteration   : false
    };
    CanvasObject.apply( this, [{}] );
    this.correlation    = correlation || {};
    this.count          = count || 0;
    this.iteration      = 1;
    this.constructor    = Cluster;
}

Cluster.prototype = Object.create( CanvasObject.prototype );

Cluster.prototype.transform = function(){
    if( !this._transform ){
        this._transform = new Listing();
    }
    return this._transform;
};

Cluster.prototype.animate = function(){
    if( this.iteration > this.count ){
        this.iteration = 1;
        return;
    }
    this._animate = this.parent.animate;
    this._animate( this.drawing.context );
    this.iteration++;
    this.animate();
};

Object.defineProperties( Cluster.prototype,{
    now     : {
        get : function(){
            if( this.parameters.iteration !== this.iteration && this.parent ) {
                for( var key in this.parent.now ){
                    if ( !this.correlation[key] ) {
                        this.parameters.list[key] = this.parent.now[key];
                        continue;
                    }
                    var correlation = +this.correlation[key];
                    if( typeof this.correlation[key] == "function" ){
                        correlation = +this.correlation[key]( this.iteration, this );
                    }
                    this.parameters.list[key] = this.parent.now[key] + (correlation * this.iteration);
                }
                this.parameters.iteration = +this.iteration;
            }
            return this.parameters.list;
        },

        set : function( value ){
            return this.parameters.list;
        }
    },


    x       : {
        get : function(){
            if( this.parent.parent ){
                return (
                    this.now.x * Math.cos( this.parent.parent.radian ) -
                    this.now.y * Math.sin( this.parent.parent.radian ) +
                    this.parent.parent.x
                );
            }
            return +this.now.x;
        },
        set : function( value ){
            return +this.now.x;
        }
    },

    y       : {
        get : function(){
            if( this.parent.parent ){
                return (
                    this.now.x * Math.sin( this.parent.parent.radian ) +
                    this.now.y * Math.cos( this.parent.parent.radian ) +
                    this.parent.parent.y
                );
            }
            return +this.now.y;
        },
        set : function( value ){
            return +this.now.y;
        }
    },

    radian  : {
        get: function(){
            if( this.parent.parent ){
                return +this.parent.parent.radian + +this.now.radian;
            }
            return +this.now.radian;
        },
        set: function( value ){
            return +this.now.radian;
        }
    },

    services: {
        get: function(){
            return this.parent.services;
        },
        set: function( value ){

        }
    }
});
/**
 * Created by takovoy on 22.01.2015.
 */

function Curve ( options ) {
    CanvasObject.apply(this,arguments);
    this.constructor    = Curve;
    this.now.step       = +this.now.step || +options.step || 1;
    this.points         = this.now.points || options.points || [];
    this.services.points= [];
}

Curve.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(CanvasObject.prototype,{
    points : {
        get: function(){

            if(!this.services.points){
                this.services.points = [];
            }

            var radian  = this.radian - ( Math.PI/4 ),
                sin     = Math.sin( radian ),
                cos     = Math.cos( radian );

            for( var key = 0;this.now.points[key];key++){
                var coordinate = this.now.points[key];
                this.services.points[key] = [
                    coordinate[0] * cos - coordinate[1] * sin,
                    coordinate[0] * sin + coordinate[1] * cos,
                    coordinate[2]
                ]
            }

            return this.services.points;

        },
        set: function(value){
            this.services.length = formula.getLengthOfCurve(value,this.now.step);
            this.now.points = value;
        }
    }
});
Curve.prototype.animate = function(context){
    var points = this.points;
    var center = [this.x,this.y];
    if(points.length < 2) {return}
    context.beginPath();
    context.moveTo(
        points[0][0] + center[0],
        points[0][1] + center[1]
    );
    if(this.now.shift > 100){
        this.now.shift = 100;
    }
    var lastPoint = points[0];
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        //var coord = formula.getPointOnSpline(i,points,this.services);
        var coord = formula.getPointOnCurve(i,this.points);
        if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
        lastPoint = coord;
        context.lineTo(coord[0] + center[0],coord[1] + center[1]);
    }
    changeContext(context,this.now);
    context.closePath();
};
/**
 * Created by takovoySuper on 25.06.2015.
 */

function Ellipse ( options ) {
    CanvasObject.apply(this,arguments);
    this.constructor= Ellipse;
    this.now.step   = this.now.step || 0.1;
}

Ellipse.prototype = Object.create(CanvasObject.prototype);

Ellipse.prototype.animate = function(context){
    context.beginPath();
    var shift = 0;
    var coord = formula.getPointOnEllipse(this.now.semiAxisX,this.now.semiAxisY,shift,this.now.radian,this.x,this.y);
    context.moveTo(coord[0],coord[1]);

    for(;shift <= Math.PI*2;shift += this.now.step){
        var coordinate = formula.getPointOnEllipse(this.now.semiAxisX,this.now.semiAxisY,shift,this.now.radian,this.x,this.y);
        context.lineTo(coordinate[0],coordinate[1]);
    }
    context.lineTo(coord[0],coord[1]);

    changeContext(context,this.now);

    context.closePath();
};
/**
 * Created by takovoy on 12.12.2014.
 */

function Line ( options ) {
    CanvasObject.apply(this,arguments);
    this.constructor    = Line;
    this.now.points     = this.now.points || options.points || [];
    this.services.points= [];
}

Line.prototype = Object.create(CanvasObject.prototype);

Line.prototype.animate = function(context){
    if(this.now.points.length < 2){return;}
    context.beginPath();
    context.moveTo(
        this.points[0][0] + this.x,
        this.points[0][1] + this.y
    );

    if(this.now.shift > 101){
        this.now.shift = 101;
    }
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnLine(i,this.points);
        context.lineTo(coord[0] + this.x,coord[1] + this.y);
    }
    changeContext(context,this.now);
    context.closePath();
};
/**
 * Created by takovoy on 22.01.2015.
 */

function Path ( options ) {
    CanvasObject.apply(this,arguments);
    this.constructor    = Path;
    this.now.step       = +this.now.step || +options.step || 1;
    this.points         = this.now.points || options.points || [];
    this.services.points= [];
}

Path.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(Path.prototype,{
    points : {
        get: function(){

            if(!this.services.points){
                this.services.points = [];
            }

            var radian  = this.radian - ( Math.PI/4 ),
                sin     = Math.sin( radian ),
                cos     = Math.cos( radian );

            for( var key = 0;this.now.points[key];key++){
                var coordinate = this.now.points[key];
                this.services.points[key] = [
                    coordinate[0] * cos - coordinate[1] * sin,
                    coordinate[0] * sin + coordinate[1] * cos,
                    coordinate[2]
                ]
            }

            return this.services.points;

        },
        set: function(value){
            this.services.map   = formula.getMapOfPath(value,this.now.step);
            this.services.length= 0;
            for(var key in this.services.map){
                this.services.length += this.services.map[key];
            }
            this.now.points = value;
        }
    }
});
Path.prototype.animate = function(context){
    var points = this.points;
    var center = [this.x,this.y];
    if(points.length < 2) {return}
    context.beginPath();
    context.moveTo(
        points[0][0] + center[0],
        points[0][1] + center[1]
    );
    if(this.now.shift > 100){
        this.now.shift = 100;
    }
    var lastPoint = points[0];
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        //var coord = formula.getPointOnSpline(i,points,this.services);
        var coord = formula.getPointOnPath(i,this.points);
        if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
        lastPoint = coord;
        context.lineTo(coord[0] + center[0],coord[1] + center[1]);
    }
    changeContext(context,this.now);
    context.closePath();
};
/**
 * Created by Пользователь on 21.01.2015.
 */

function Polygon ( options ) {
    CanvasObject.apply( this, arguments );
    this.constructor        = Polygon;
    this.now.sidesCount     = this.now.sidesCount || options.sidesCount || 3;
    this.now.radius         = this.now.radius || options.radius || 0;
}

Polygon.prototype           = Object.create( CanvasObject.prototype );

Polygon.prototype.animate   = function( context ){
    if( this.now.sidesCount < 3 ){ return false }

    var start = formula.getPointOnCircle(this.radian,this.now.radius,this.x,this.y);

    context.beginPath();
    context.moveTo( start[0], start[1] );

    for( var i = 0; i < this.now.sidesCount; i++ ){
        var coordinate = formula.getPointOnCircle( Math.PI*2/this.now.sidesCount*i+this.radian, this.now.radius, this.x, this.y );
        context.lineTo( coordinate[0], coordinate[1] );
    }

    context.lineTo( start[0], start[1] );

    changeContext(context,this.now);
    context.closePath();
};
/**
 * Created by takovoy on 31.07.2016.
 */

function Polyline (options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Polyline;
    this.now.points     = options.points;
}

Polyline.prototype = Object.create(CanvasObject.prototype);

Polyline.prototype.animate = function(context){

    //если массив не пустой то продолжить
    if(this.now.points.length < 2) {
        return
    }

    //отобразить контрольные точки на холсте
    if(this.now.showBreakpoints){
        context.beginPath();

        markControlPoints( this.now.points, context, this);

        context.fill();
        context.closePath();
    }

    context.beginPath();
    //переход к началу отрисовки объекта
    context.moveTo(
        this.now.points[0][0] + this.x,
        this.now.points[0][1] + this.y
    );

    if(this.now.shift > 101){
        this.now.shift = 101;
    }

    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnCurve(i,this.now.points);
        context.lineTo(coord[0] + this.parent.x,coord[1] + this.parent.y);
    }

    changeContext(context,this.now);

    context.closePath();
};
/**
 * Created by takovoy on 30.11.2014.
 */

function Rect ( options ) {
    CanvasObject.apply( this, arguments );
    this.constructor    = Rect;
    this.now.width      = this.now.width || options.width || 0;
    this.now.height     = this.now.height || options.height || this.now.width;
}

Rect.prototype = Object.create( CanvasObject.prototype );

Rect.prototype.animate = function( context ){
    context.beginPath();
    var radian = this.radian;
    var coord  = [this.x,this.y];
    context.moveTo(coord[0],coord[1]);
    coord = formula.getPointOnCircle(radian,this.width,coord[0],coord[1]);
    context.lineTo(coord[0],coord[1]);
    coord = formula.getPointOnCircle(radian + Math.PI / 2,this.height,coord[0],coord[1]);
    context.lineTo(coord[0],coord[1]);
    coord = formula.getPointOnCircle(radian + Math.PI / 2,this.height,this.x,this.y);
    context.lineTo(coord[0],coord[1]);
    context.lineTo(this.x,this.y);
    changeContext( context, this.now );
    context.closePath();
};
/**
 * Created by takovoy on 22.01.2015.
 */

function Spline ( options ) {
    CanvasObject.apply(this,arguments);
    this.constructor    = Spline;
    this.now.step       = +this.now.step || +options.step || 1;
    this.points         = this.now.points || options.points || [];
    this.services.points= [];
}

Spline.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(Spline.prototype,{
    points : {
        get: function(){

            if(!this.services.points){
                this.services.points = [];
            }

            var radian  = this.radian - ( Math.PI/4 ),
                sin     = Math.sin( radian ),
                cos     = Math.cos( radian );

            for( var key = 0;this.now.points[key];key++){
                var coordinate = this.now.points[key];
                this.services.points[key] = [
                    coordinate[0] * cos - coordinate[1] * sin,
                    coordinate[0] * sin + coordinate[1] * cos,
                    coordinate[2]
                ]
            }

            return this.services.points;

        },
        set: function(value){
            this.services.map   = formula.getMapOfSpline(value,this.now.step);
            this.services.length= 0;
            for(var key in this.services.map){
                this.services.length += this.services.map[key];
            }
            this.now.points = value;
        }
    }
});
Spline.prototype.animate = function(context){
    var points = this.points;
    var center = [this.x,this.y];
    if(points.length < 2) {return}
    context.beginPath();
    context.moveTo(
        points[0][0] + center[0],
        points[0][1] + center[1]
    );
    if(this.now.shift > 100){
        this.now.shift = 100;
    }
    var lastPoint = points[0];
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnSpline(i,points,this.services);
        if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
        lastPoint = coord;
        context.lineTo(coord[0] + center[0],coord[1] + center[1]);
    }
    changeContext(context,this.now);
    context.closePath();
};
/**
 * Created by takovoySuper on 12.05.2015.
 */

function EventsListing (){
    this.list   = {};
}

//проверить ?
EventsListing.prototype.append = function(property,theComparisonValue,operation){
    if(!this.list[property]){
        this.list[property] = {};
    }
    if(!this.list[property][theComparisonValue]){
        this.list[property][theComparisonValue] = [];
    }
    this.list[property][theComparisonValue].push(operation);
};
EventsListing.prototype.remove = function(property,theComparisonValue){
    if(!theComparisonValue){
        delete this.list[property];
        return
    }
    delete this.list[property][theComparisonValue];
    if(Object.keys(this.list[property]).length == 0){
        delete this.list[property];
    }
};
/**
 * Created by takovoySuper on 14.04.2015.
 */

function Listing (){
    this.list   = {};
    this.append = function(name,data){
        this.list[name] = data;
    };
    this.remove = function(name){
        delete this.list[name];
    };
}
/**
 * Created by takovoy on 17.02.2015.
 */

function PropertyListing (append,remove,parent){
    this.list   = {};
    this.up     = append || function(){};
    this.rem    = remove || function(){};
    this.parent = parent;
}

PropertyListing.prototype.append = function (object) {
    this.list[object.id] = object;
    return this.up(this.parent,object);
};
PropertyListing.prototype.remove = function (id) {
    delete this.list[id];
    this.rem(this.parent);
};
PropertyListing.prototype.getObject = function (id,recourse) {
    if(!recourse){
        return this.list[id];
    } else {
        for(var key in this.list){
            if(key == id)   {return this.list[key];}
            var object = this.list[key].childrens.getObject(id,true);
            if(object)      {return object;}
        }
        return false
    }
};
PropertyListing.prototype.getObjectsMap = function(){
    var map = {};
    for(var key in this.list){
        map[key] = this.list[key].childrens.getObjectsMap();
    }
    return map;
};
/**
 * Created by takovoy on 31.07.2016.
 */

// отмечает контрольные точки на холсте кружочками в 4 пикселя
function markControlPoints ( points, context, corrective){
    corrective = corrective || {};

    context.moveTo(
        +corrective.x,
        +corrective.y
    );
    context.arc(
        +corrective.x,
        +corrective.y,
        2,
        0,
        Math.PI*2
    );

    for(var point = 0;points[point];point++){
        if(typeof points[point][0] === 'object'){
            markControlPoints(
                points[point],
                context,
                corrective
            );
            continue;
        }

        context.moveTo(
            points[point][0] + +corrective.x,
            points[point][1] + +corrective.y
        );
        context.arc(
            points[point][0] + +corrective.x,
            points[point][1] + +corrective.y,
            2,
            0,
            Math.PI*2
        );
    }
}
/**
 * Created by Пользователь on 06.03.2015.
 */

function changeContext (context,value){
    for(var key in value){
        if(!dataContextChanges[key] || !value[key])continue;
        dataContextChanges[key](context,value[key]);
    }
}

var dataContextChanges = {

    fill        : function(context,value){
        context.fillStyle = value;
        context.fill();
    },

    stroke      : function(context,value){
        context.strokeStyle = value;
        context.stroke();
    },

    lineWidth   : function(context,value){
        context.lineWidth = +value;
    }
};
/**
 * Created by takovoy on 19.02.2017.
 */

function isNotNegativeNumber (value) {
    return typeof +value === "number" && +value >= 0
}

function isHEXColor (string) {
    return (string.length === 7 && string.search(/#[0-9a-f]{6}/i) === 0) || (string.length === 4 && string.search(/#[0-9a-f]{3}/i) === 0)
}

function isRGB (string) {
    return string.search(/rgb\(( ?\d{1,3},){2} ?\d{1,3}\)/i) === 0
}

function isRGBA (string) {
    return string.search(/rgba\(( ?\d{1,3},){3}( ?\d(\.\d+)?)\)/i) === 0
}

function isColor (string) {
    return isHEXColor(string) || isRGB(string) || isRGBA(string);
}
/**
 * Created by takovoy on 05.12.2014.
*/

var dynamic = {

    move: function(canvasObject){
        var transforms       = canvasObject.transform().list,
            fps         = canvasObject.drawing.fps,
            incidence   = 1000 / (+fps);

        for(var key in transforms){
            var transform   = transforms[key],
                options     = transform.options,
                startEvent  = transform.event('start');

            if(startEvent){
                startEvent(startEvent,transform,canvasObject);
                transform.events.remove('start');
            }
            if(!options.step){
                options.step = (options.endShift - options.startShift) / (options.time / incidence);
            }

            //the increase in displacement
            if(!transform.reverse){
                options.shift += +options.step * options.rate;
            } else {
                options.shift -= +options.step * options.rate;
            }

            //processing frame
            if(this.data[key]){
                this.data[key].prepareData(canvasObject);
            } else {
                canvasObject.now[key] = options.start + (options.end - options.start) / 100 * transform.shift;
            }

            //initiate events
            for(var event in transform.events.list){
                if(isNaN(+event)){continue}

                if(transform.reverse){
                    if(+event > options.shift || +event < options.shift - options.step){continue}
                } else {
                    if(+event < options.shift || +event > options.shift + options.step){continue}
                }

                transform.events.list[event](transform.event(event),transform,canvasObject);
            }

            //checked end of animation
            if(!transform.reverse){
                if(options.shift < options.endShift){
                    continue
                }
            } else {
                if(options.shift > options.startShift){
                    continue
                }
            }

            //recourse or callback
            canvasObject.transform().remove(key);
            if(transform.options.recourse){
                if(!transform.reverse){
                    transform.options.shift  = transform.options.startShift;
                } else {
                    transform.options.shift  = transform.options.endShift;
                }
                canvasObject.transform(transform);
            }
            if(transform.event('callback')){
                transform.event('callback')(transform.event('callback'),transform,canvasObject);
                transform.events.remove('callback');
            }
        }
    },

    data: {

        trajectory: {

            type        : 'trajectory',
            prepareData : function(canvasObject){
                var key         = this.type,
                    transform   = canvasObject.transform().list[key],
                    coord       = this.functions[transform.options.type](transform.options,transform.shift);

                canvasObject.x      = coord[0];
                canvasObject.y      = coord[1];
            },

            functions   : {

                circle  : function(data,transformShift){
                    var shift = Math.PI * 2 / 100 * transformShift;

                    if(data.reverse){
                        shift = Math.PI * 2 - Math.PI * 2 / 100 * transformShift
                    }

                    return formula.getPointOnCircle(shift, data.radius, data.center[0], data.center[1]);
                },

                polygon : function(data,shift){

                },

                line    : function(data,shift){
                    return formula.getPointOnLine(shift,data.points);
                },

                curve   : function(data,shift){
                    return formula.getPointOnCurve(shift,data.points);
                }

            }

        },

        fill   : {

            type        : 'fill',

            prepareData : function(canvasObject){
                var key         = this.type,
                    transform   = canvasObject.transform().list[key],
                    start       = transform.options.start,
                    end         = transform.options.end,
                    shift       = transform.shift;

                canvasObject.now.fill = formula.changeColor(start,end,shift);
            }

        },

        stroke   : {

            type        : 'stroke',

            prepareData : function(canvasObject){
                var key         = this.type,
                    transform   = canvasObject.transform().list[key],
                    start       = transform.options.start,
                    end         = transform.options.end,
                    shift       = transform.shift;

                canvasObject.now.stroke = formula.changeColor(start,end,shift);
            }

        },

        points  : {
            type        : 'points',
            prepareData : function(canvasObject){
                var key         = this.type,
                    transform   = canvasObject.transform().list[key],
                    start       = transform.options.start,
                    end         = transform.options.end,
                    shift       = transform.shift;

                canvasObject.points = this.functions.pointsRecourse(start,end,shift);
            },

            functions   : {
                pointsRecourse  : function(start,end,shift){
                    var result = [];
                    for(var i = 0;i < start.length || i < end.length;i++) {
                        if(typeof start[i] != typeof end[i] || !start[i]){
                            result[i] = start[i];
                            continue;
                        }

                        if(typeof start[i] === 'object'){
                            result[i] = this.pointsRecourse(start[i],end[i],shift);
                            continue;
                        }

                        result = formula.getPointOnLine(shift,[start,end]);
                        break;
                    }

                    return result;
                }
            }
        }
    }
};
/**
 * Created by takovoy on 14.09.2014.
 */

var formula = {
    getPointOnCircle: function(radian,radius,centerX,centerY){
        centerX = +centerX || 0;
        centerY = +centerY || 0;
        var y   = +radius * Math.sin(+radian);
        var x   = +radius * Math.cos(+radian);
        return  [centerX + x,centerY + y];
    },

    getPointOnEllipse: function(radiusX,radiusY,shift,tilt,centerX,centerY){
        tilt    = tilt || 0;
        tilt    *= -1;
        centerX = centerX || 0;
        centerY = centerY || 0;

        var x1  = radiusX*Math.cos(+shift),
            y1  = radiusY*Math.sin(+shift),
            x2  = x1 * Math.cos(tilt) + y1 * Math.sin(tilt),
            y2  = -x1 * Math.sin(tilt) + y1 * Math.cos(tilt);

        return [x2 + centerX,y2 + centerY];
    },

    getPointsFromPolygon: function(sidesCount,radian,radius,centerX,centerY){
        var coord = [];
        coord.push(this.getPointOnCircle(radian,radius,centerX,centerY));
        for(var i = 0;i < sidesCount;i++){
            coord.push(this.getPointOnCircle(Math.PI*2 / sidesCount * i + radian,radius,centerX,centerY));
        }
        return coord;
    },

    getPointOnCurve: function(shift,points){
        var result = [0,0];
        var powerOfCurve = points.length - 1;
        shift = shift/100;
        for(var i = 0;points[i];i++){
            var polynom = (this.factorial(powerOfCurve)/(this.factorial(i)*this.factorial(powerOfCurve - i))) *
                Math.pow(shift,i) *
                Math.pow(1-shift,powerOfCurve - i);
            result[0] += points[i][0] * polynom;
            result[1] += points[i][1] * polynom;
        }
        return result;
    },

    getPointOnLine: function(shift,points){
        var x   = (points[1][0] - points[0][0]) * (shift / 100) + points[0][0],
            y   = (points[1][1] - points[0][1]) * (shift / 100) + points[0][1];
        return [x,y];
    },

    getCenterToPointDistance : function(coordinates){
        return Math.sqrt(Math.pow(coordinates[0],2) + Math.pow(coordinates[1],2));
    },

    HEXtoRGBA    : function(color){
        var rgba = [];
        if(color.length === 4){
            rgba[0] = parseInt(color.substring(1,2) + color.substring(1,2),16);
            rgba[1] = parseInt(color.substring(2,3) + color.substring(2,3),16);
            rgba[2] = parseInt(color.substring(3) + color.substring(3),16);
        }
        if(color.length === 7){
            rgba[0] = parseInt(color.substring(1,3),16);
            rgba[1] = parseInt(color.substring(3,5),16);
            rgba[2] = parseInt(color.substring(5),16);
        }
        rgba[3] = 1;
        return rgba;
    },

    RGBtoRGBA    : function(color){
        var rgba = color.match(/\d{1,3}(\.\d+)?/g);
        if ( rgba[3] === "0" ) {
            rgba[3] = 0;
        } else {
            rgba[3] = +rgba[3] || 1;
        }
        return rgba;
    },

    changeColor : function(start,end,shift){
        var result      = [];

        //проверка начальной позиции
        if ( isRGBA(start) || isRGB(start) ) {
            start = formula.RGBtoRGBA(start);
        } else if ( isHEXColor(start) ) {
            start = formula.HEXtoRGBA(start)
        }

        //проверка конечной позиции
        if ( isRGBA(end) || isRGB(end) ) {
            end = formula.RGBtoRGBA(end);
        } else if ( isHEXColor(end) ) {
            end = formula.HEXtoRGBA(end)
        }

        for(var i = 0;i < 3;i++){
            result[i] = Math.round(+start[i] + (+end[i] - +start[i]) / 100 * shift);
        }
        var opacity = +(+start[3] + (+end[3] - +start[3]) / 100 * shift).toFixed(4);
        return 'rgba(' + result[0] + ',' + result[1] + ',' + result[2] + ',' + opacity + ')';
    },

    factorial : function (number) {
        var result = 1;
        while(number){
            result *= number--;
        }
        return result;
    }
};

formula.getLengthOfCurve = function (points, step) {
    var result = 0;
    var lastPoint = points[0];
    for(var sift = 0;sift <= 100;sift += step){
        var coord = formula.getPointOnCurve(sift,points);
        result += formula.getCenterToPointDistance([
            coord[0] - lastPoint[0],
            coord[1] - lastPoint[1]
        ]);
        lastPoint = coord;
    }
    return result;
};

formula.getMapOfSpline = function (points, step) {
    var map = [[]];
    var index = 0;
    for(var i = 0;points[i];i++){
        var curvePointsCount = map[index].length;
        map[index][+curvePointsCount] = points[i];
        if(points[i][2] && i != points.length - 1){
            map[index] = formula.getLengthOfCurve(map[index],step);
            index++;
            map[index] = [points[i]];
        }
    }
    map[index] = formula.getLengthOfCurve(map[index],step);
    return map;
};

formula.getPointOnSpline = function (shift, points, services) {
    var shiftLength = services.length / 100 * shift;
    if(shift >= 100){
        shiftLength = services.length;
    }
    var counter = 0;
    var lastControlPoint = 0;
    var controlPointsCounter = 0;
    var checkedCurve = [];
    for(; services.map[lastControlPoint] && counter + services.map[lastControlPoint] < shiftLength; lastControlPoint++){
        counter += services.map[lastControlPoint];
    }
    for(var pointIndex = 0; points[pointIndex] && controlPointsCounter <= lastControlPoint; pointIndex++){
        if(points[pointIndex][2] === true){
            controlPointsCounter++;
        }
        if(controlPointsCounter >= lastControlPoint){
            checkedCurve.push(points[pointIndex]);
        }
    }
    return formula.getPointOnCurve(
        (shiftLength - counter) / (services.map[lastControlPoint] / 100),
        checkedCurve
    );
};

formula.getLengthOfEllipticArc = function (radiusX, radiusY, startRadian, endRadian, step) {
    var length = 0;
    var something = this.getPointOnEllipse(radiusX,radiusY,startRadian);
    for(var i = startRadian;i<=endRadian;i+=step){
        var point = this.getPointOnEllipse(radiusX,radiusY,i);
        length += this.getCenterToPointDistance([point[0]-something[0],point[1]-something[1]]);
        something = point;
    }
    return length;
};

formula.getMapOfPath = function (points, step) {
    var map = [[]];
    var index = 0;
    for(var i = 0;points[i];i++){
        var point = points[i];
        if(points[i].length > 3){
            if(i>1 && !map[index][0]){index++}
            var lastPoint = map[index][0] || [];
            map[index] = this.getLengthOfEllipticArc(point[0], point[1], point[2], point[3], step || 0.01);
            index++;
            if(!points[i+1]){continue}
            var centerOfArc = this.getPointOnEllipse(
                point[0], point[1], point[2] + Math.PI, point[4],
                lastPoint[0] || points[i-1][0] || 0, lastPoint[1] || points[i-1][1] || 0
            );
            var endOfArc = this.getPointOnEllipse(point[0], point[1], point[3], point[4], centerOfArc[0], centerOfArc[1]);
            map[index] = [endOfArc];
            continue;
        }
        var curvePointsCount = map[index].length;
        map[index][+curvePointsCount] = point;
        if(point[2] && i != points.length - 1){
            map[index] = formula.getLengthOfCurve(map[index],step);
            index++;
            map[index] = [point];
        }
    }
    if(typeof map[index] !== 'number'){map[index] = formula.getLengthOfCurve(map[index],step);}
    return map;
};

formula.getPointOnPath = function (shift, points, services) {
    var shiftLength = services.length / 100 * shift;
    if(shift >= 100){
        shiftLength = services.length;
    }
    var counter = 0;
    var lastControlPoint = 0;
    var controlPointsCounter = 0;
    var checkedCurve = [];
    for(; services.map[lastControlPoint] && counter + services.map[lastControlPoint] < shiftLength; lastControlPoint++){
        counter += services.map[lastControlPoint];
    }
    var lastPoint = [];
    for(var pointIndex = 0; points[pointIndex] && controlPointsCounter <= lastControlPoint; pointIndex++){
        var point = points[pointIndex];
        if(point[2] === true || point.length > 3){
            controlPointsCounter++;
        }
        if(controlPointsCounter === lastControlPoint && point.length > 3){
            var centerOfArc = this.getPointOnEllipse(
                point[0], point[1], point[2] + Math.PI, point[4],
                lastPoint[0] || 0, lastPoint[1] || 0
            );
            var radian = point[3] - point[2];
            var len = shiftLength - counter;
            var percent = len / (services.map[lastControlPoint] / 100);
            var resultRadian = point[2] + (radian/100*percent);
            return this.getPointOnEllipse(point[0], point[1], resultRadian, point[4], centerOfArc[0], centerOfArc[1]);
        }
        if(controlPointsCounter >= lastControlPoint){
            checkedCurve.push(point);
        }
        if(point.length > 3){
            lastPoint = this.getPointOnEllipse(
                point[0],
                point[1],
                point[3]+Math.PI,
                point[4],
                lastPoint[0],
                lastPoint[1]
            );
            continue
        }
        lastPoint = point;
    }
    return this.getPointOnCurve(
        (shiftLength - counter) / (services.map[lastControlPoint] / 100),
        checkedCurve
    );
};
/**
 * Created by takovoySuper on 11.04.2015.
 */

function random (min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRGB (min,max){
    return 'rgb(' + random(min,max) + ',' + random(min,max) + ',' + random(min,max) + ')'
}
/**
 * Created by takovoy on 24.06.2017.
 */

function SVGParser ( string ) {
    var data = string.match(/d="( |,|\.|\d*|[A-Z])*"/g);
    var path = [];
    for(var i = 0;data[i];i++){
        path[i] = data[i].match(/[A-Z] ( ?\d*(.\d{1,3})+,\d*(.\d{1,3})+){1,3}/g);
        for(var j = 1;path[i][j];j++){
            var previous = [];
            if(j===1){
                previous = path[i][0].match(/\d+(\.\d+)?( |,)\d+(\.\d+)?/g);
            }
            path[i][j-1] = previous.concat(
                path[i][j]
                    .match(/\d+(\.\d+)?( |,)\d+(\.\d+)?/g)
            );
            for(var k = 0;path[i][j-1][k];k++){
                path[i][j-1][k] = path[i][j-1][k].split(',');
                path[i][j-1][k][0] = +path[i][j-1][k][0];
                path[i][j-1][k][1] = +path[i][j-1][k][1];
                if(k === path[i][j-1].length - 1){
                    path[i][j-1][k][path[i][j-1][k].length] = true;
                }
            }
            if(j===path[i].length - 1){
                delete path[i][j];
            }
        }
        var split = [];
        for(var j = 0;path[i][j];j++){
            split = split.concat(path[i][j]);
        }
        path[i] = split;
    }
    return path;
}
/**
 * Created by 1 on 11.11.2015.
 */

function Transform ( options ) {
    // yes, this row is right
    this.options = options = options || {};
    this.id                 = options.property || '' + Math.random();
    this.options.rate       = options.rate || 1;
    this.options.factor     = options.factor || 1;
    this.options.endShift   = options.endShift || 100;
    this.options.startShift = +options.startShift || 0;
    this.options.shift      = options.shift || this.options.startShift;
    this.options.start      = options.start || 0;
    this.options.end        = options.end;
    this.options.time       = +options.time;
    this.events             = new Listing();
    this.options.recourse   = !!options.recourse;
    this.reverse            = false;
}

Transform.prototype.play = function(rate){
    this.options.rate = rate || 1;
    return this;
};
Transform.prototype.pause = function(){
    this.options.rate = 0;
    return this
};
Transform.prototype.stop = function(){
    this.options.rate   = 0;
    if(!this.reverse){
        this.options.shift  = this.options.startShift;
    } else {
        this.options.shift  = this.options.endShift;
    }
    return this;
};
Transform.prototype.repeat= function(){
    if(!this.reverse){
        this.options.shift  = this.options.startShift;
    } else {
        this.options.shift  = this.options.endShift;
    }
};
Transform.prototype.event = function(shift,action){
    if(!action){
        return this.events.list[shift];
    }
    this.events.append(shift,action);
    return this;
};

Object.defineProperties(Transform.prototype,{
    shift : {
        get: function(){
            if(this.options.timingFunction){
                return this.options.shift * formula.getPointOnCurve(this.options.shift,this.timingFunction)[1];
            }

            return this.options.shift;
        },
        set: function(value){
            return this.shift;
        }
    },
    timingFunction : {
        get: function(){
            var array = [[0,0]];
            array = array.concat(this.options.timingFunction);
            array.push([1,1]);

            return array;
        },
        set: function(value){
            this.options.timingFunction = value;
        }
    }
});