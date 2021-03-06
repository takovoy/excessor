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
    this.context.beginPath();
    canvasObject.animate(this.context);

    for(var child in canvasObject.childrens.list){
        this.render(canvasObject.childrens.list[child],child);
    }
    this.context.closePath();
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

var excessor = {
    SVGParser: {services:{}}
};

(function () {
    var parser = excessor.SVGParser;
    var services = parser.services;

    parser.url = function(url){
        var xhr = new XMLHttpRequest();
        xhr.open('GET',url,true);

        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                parser.string(xhr.responseText);
            }
        }
    };

    parser.string = function (string,parent) {
        parent = parent || new CanvasObject();
        if(!string){return false;}
        var Parser = new DOMParser();
        var document;
        if(typeof string === "string"){
            document = Parser.parseFromString(string, "image/svg+xml");
        } else {
            document = string;
        }

        var styles;

        var levelNodes = document.childNodes;

        for(var index = 0;levelNodes[index];index++){
            parent.append(parser.initNode(levelNodes[index]));
        }

        return document;
    };

    parser.initNode = function (node) {
        var canvasObject = new parser.services.nodeCorrelation[node.nodeName]();
        for(var attr in parser.services.attrCorrelation){
            var nodeAttr = node.getAttribute(attr);
            if(!nodeAttr){continue;}
            var correlation = parser.services.attrCorrelation[attr];
            var elseChecker = null;
            if(node.nodeName === 'polygon'){elseChecker = true}

            canvasObject.now[correlation.property] = correlation.init(nodeAttr,elseChecker);
        }
        return canvasObject;
    };

    services.nodeCorrelation = {
        g: CanvasObject,
        path: Path,
        circle: Circle,
        rect: Rect,
        ellipse: Ellipse,
        polygon: Spline,
        polyline: Spline
    };

    services.attrCorrelation = {
        fill: {
            property: 'fill',
            init: function (value) {
                return value;
            }
        },
        stroke: {
            property: 'stroke',
            init: function (value) {
                return value;
            }
        },
        'stroke-linecap': {
            property: 'lineCap',
            init: function (value) {
                return value;
            }
        },
        'stroke-linejoin': {
            property: 'lineJoin',
            init: function (value) {
                return value;
            }
        },
        'stroke-dasharray': {
            property: 'lineDash',
            init: function (value) {
                var dashArray = value.match(services.regexp.realNumbers);
                for(var i = 0;dashArray[i];i++){dashArray[i] = +dashArray[i];}
                return dashArray;
            }
        },
        'stroke-dashoffset': {
            property: 'dashOffset',
            init: function (value) {
                return +value.match(services.regexp.intNumbers)[0];
            }
        },
        r: {
            property: 'radius',
            init: function (value) {
                return +value.match(services.regexp.intNumbers)[0];
            }
        },
        rx: {
            property: 'semiAxisX',
            init: function (value) {
                return +value.match(services.regexp.intNumbers)[0];
            }
        },
        ry: {
            property: 'semiAxisY',
            init: function (value) {
                return +value.match(services.regexp.intNumbers)[0];
            }
        },
        x: {
            property: 'x',
            init: function (value) {
                return +value.match(services.regexp.intNumbers)[0];
            }
        },
        y: {
            property: 'y',
            init: function (value) {
                return +value.match(services.regexp.intNumbers)[0];
            }
        },
        cx: {
            property: 'x',
            init: function (value) {
                return +value.match(services.regexp.intNumbers)[0];
            }
        },
        cy: {
            property: 'y',
            init: function (value) {
                return +value.match(services.regexp.intNumbers)[0];
            }
        },
        points: {
            property: 'points',
            init: function (value,closed) {
                var points = value.match(services.regexp.points);
                for(var i = 0;points[i];i++){
                    var coord = points[i].match(services.regexp.realNumbers);
                    points[i] = [+coord[0],+coord[1],true];
                }
                if(!!closed){
                    points.push([points[0][0],points[0][1]]);
                }
                return points;
            }
        },
        d: {
            property: 'points',
            init: function (value) {
                value = value.match(services.regexp.segment);
                var points = [];
                var lastPoint = [0,0];
                for(var i = 0;value[i];i++){
                    var operationType = value[i][0].toLowerCase();
                    var segment = services.pathDataCorrelation[operationType](value[i],points,lastPoint);
                    for(var pointIndex = 0;pointIndex < segment.length;pointIndex++){
                        var point = segment[pointIndex];
                        points.push(point);
                        if(point.length > 3){
                            var centerOfArc = formula.getPointOnEllipse(point[0], point[1], point[2] + Math.PI, point[4], lastPoint[0], lastPoint[1]);
                            lastPoint = formula.getPointOnEllipse(point[0], point[1], point[3], point[4], centerOfArc[0], centerOfArc[1]);
                            continue;
                        }
                        lastPoint = point;
                    }
                }
                return points;
            }
        }
    };

    services.regexp = {
        intNumbers  : /\-?\d+/g,
        realNumbers : /\-?\d+(\.\d+)?/g,
        points      : /\-?\d+(\.\d+)?( |,|, )\-?\d+(\.\d+)?/g,
        segment     : /[A-Za-z]( |,|, |\-?\d+(\.\d+)?)+/g
    };

    services.pathDataCorrelation = {
        m: function (value, path) {
            var point = value.match(services.regexp.realNumbers);
            point = [+point[0],+point[1]];
            if(!path.length){
                return [point];
            }
            return [false,point];
        },
        l: function (value) {
            var points = value.match(services.regexp.points);
            for(var i = 0;points[i];i++){
                var coord = points[i].match(services.regexp.realNumbers);
                points[i] = [+coord[0],+coord[1],true];
            }
            return points;
        },
        h: function (value,path,lastPoint) {
            var points = value.match(services.regexp.realNumbers);
            var segment = lastPoint[0];
            for(var i = 0;points[i];i++){
                segment += +points[i];
            }
            return [[segment,lastPoint[1],true]];
        },
        v: function (value,path,lastPoint) {
            var points = value.match(services.regexp.realNumbers);
            var segment = lastPoint[1];
            for(var i = 0;points[i];i++){
                segment += +points[i];
            }
            return [[lastPoint[0],segment,true]];
        },
        c: function (value) {
            var points = value.match(services.regexp.points);
            for(var i = 0;points[i];i++){
                var coord = points[i].match(services.regexp.realNumbers);
                points[i] = [+coord[0],+coord[1],!((i+1)%3)];
            }
            return points;
        },
        q: function (value) {
            var points = value.match(services.regexp.points);
            for(var i = 0;points[i];i++){
                var coord = points[i].match(services.regexp.realNumbers);
                points[i] = [+coord[0],+coord[1],!((i+1)%2)];
            }
            return points;
        },
        a: function (value,path,lastPoint) {
            value = value.match(services.regexp.realNumbers);
            var arcs = [[]];
            var index = 0;
            for(var i = 0;value[i];i++){
                if(i%7 === 0 && i !== 0){
                    index++;
                    arcs[index] = [];
                }
                arcs[index].push(+value[i]);
            }
            var arcLastPoint = false;
            for(var arcIndex = 0;arcs[arcIndex];arcIndex++){
                var arc = arcs[arcIndex];
                var arcFirstPoint = arcLastPoint || lastPoint || [0,0];
                arcLastPoint = [arc[5],arc[6]];
                var derivative = [];
                var tilt = Math.PI/180*arc[2];
                derivative[0] = Math.cos(tilt)*((arcFirstPoint[0] - arcLastPoint[0])/2) + Math.sin(tilt)*((arcFirstPoint[1] - arcLastPoint[1])/2);
                derivative[1] = -Math.sin(tilt)*((arcFirstPoint[0] - arcLastPoint[0])/2) + Math.cos(tilt)*((arcFirstPoint[1] - arcLastPoint[1])/2);
                var derivativeOfCenter = [];
                var coefficient = Math.sqrt(
                    (
                        Math.pow(arc[0],2)*Math.pow(arc[1],2) -
                        Math.pow(arc[0],2)*Math.pow(derivative[1],2) -
                        Math.pow(arc[1],2)*Math.pow(derivative[0],2)
                    ) / (
                        Math.pow(arc[0],2)*Math.pow(derivative[1],2) +
                        Math.pow(arc[1],2)*Math.pow(derivative[0],2)
                    )
                );
                if(arc[3] === arc[4]){
                    coefficient = -coefficient;
                }
                derivativeOfCenter[0] = coefficient * ((arc[0]*derivative[1])/arc[1]);
                derivativeOfCenter[1] = coefficient * -((arc[1]*derivative[0])/arc[0]);
                var center = [];
                center[0] = Math.cos(tilt)*derivativeOfCenter[0] - Math.sin(tilt)*derivativeOfCenter[1] + ((arcFirstPoint[0] + arcLastPoint[0])/2);
                center[1] = Math.sin(tilt)*derivativeOfCenter[0] + Math.cos(tilt)*derivativeOfCenter[1] + ((arcFirstPoint[1] + arcLastPoint[1])/2);

                var startRadian = formula.getAngleOfVector(arcFirstPoint,center) + tilt;
                var endRadian   = formula.getAngleOfVector(arcLastPoint,center) + tilt;
                if(!!arc[4]){
                    endRadian = 2*Math.PI + endRadian;
                }
                arcs[arcIndex] = [arc[0],arc[1],startRadian,endRadian,tilt];
            }
            return arcs;
        }
    }
})();

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
    },
    points : {
        get: function(){
            if(!this.now.points){return}

            if(!this.services.points){this.services.points = [];}

            var radian = this.radian, sin = Math.sin( radian ), cos = Math.cos( radian );

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
        set: function(value){}
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
    if(this.now.shift === 0 || options.shift === 0){
        this.now.shift  = 0;
    } else {
        this.now.shift  = this.now.shift || options.shift || 100;
    }
}

Circle.prototype = Object.create( CanvasObject.prototype );

Circle.prototype.animate = function( context ){
    var radian = this.radian;
    context.arc( this.x, this.y, this.now.radius, radian, Math.PI*2/100*this.now.shift + radian );
    changeContext( context, this.now );
};

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

function Curve ( options ) {
    Line.apply(this,arguments);
    this.constructor = Curve;
}

Curve.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(Curve.prototype,{
    points : {
        get: function(){
            if(!this.services.points){
                this.services.points = [];
            }

            var radian  = this.radian,
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
    context.moveTo(
        points[0][0] + center[0],
        points[0][1] + center[1]
    );
    if(this.now.shift > 100){
        this.now.shift = 100;
    }
    var lastPoint = points[0];
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnCurve(i,points);
        if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
        lastPoint = coord;
        context.lineTo(coord[0] + center[0],coord[1] + center[1]);
    }
    changeContext(context,this.now);
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
    var shift = 0;
    var coord = formula.getPointOnEllipse(this.now.semiAxisX,this.now.semiAxisY,shift,this.now.radian,this.x,this.y);
    context.moveTo(coord[0],coord[1]);

    for(;shift <= Math.PI*2;shift += this.now.step){
        var coordinate = formula.getPointOnEllipse(this.now.semiAxisX,this.now.semiAxisY,shift,this.now.radian,this.x,this.y);
        context.lineTo(coordinate[0],coordinate[1]);
    }
    context.lineTo(coord[0],coord[1]);

    changeContext(context,this.now);
};

function Line ( options ) {
    CanvasObject.apply(this,arguments);
    this.constructor    = Line;
    this.now.step       = +this.now.step || +options.step || 1;
    this.points         = this.now.points || options.points || [];
    this.services.points= [];
    if(this.now.shift === 0 || options.shift === 0){
        this.now.shift  = 0;
    } else {
        this.now.shift  = this.now.shift || options.shift || 100;
    }
}

Line.prototype = Object.create(CanvasObject.prototype);

Object.defineProperties(Line.prototype,{
    points : {
        get: function(){
            if(!this.services.points){
                this.services.points = [];
            }

            var radian  = this.radian,
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
            this.now.points = value;
        }
    }
});

Line.prototype.animate = function(context){
    var points = this.points;
    var center = [this.x,this.y];
    if(points.length < 2) {return}
    context.moveTo(
        points[0][0] + center[0],
        points[0][1] + center[1]
    );
    if(this.now.shift > 100){
        this.now.shift = 100;
    }
    var lastPoint = points[0];
    for(var i = 0;i <= this.now.shift;i += this.now.step){
        var coord = formula.getPointOnLine(i,this.points);
        if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
        lastPoint = coord;
        context.lineTo(coord[0] + this.x,coord[1] + this.y);
    }
    changeContext(context,this.now);
};

function Path ( options ) {
    Line.apply(this,arguments);
    this.constructor = Path;
}

Path.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(Path.prototype,{
    points : {
        get: function(){
            if(!this.services.points){
                this.services.points = [];
            }

            var radian  = this.radian,
                sin     = Math.sin( radian ),
                cos     = Math.cos( radian );

            for( var key = 0;this.now.points[key];key++){
                var coordinate = this.now.points[key];
                if(this.now.points[key].length > 3){
                    this.services.points[key] = this.now.points[key];
                    this.services.points[key][4] = (this.services.points[key][4] || 0) + radian;
                    continue;
                }
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
    if(this.now.shift > 100){
        this.now.shift = 100;
    }

    var paths = [[]];
    var pathIndex = 0;
    for(var index = 0;points[index];index++){
        if(points[index] === false){
            if(points[index + 1] && points[index + 1].length <= 3){
                pathIndex++;
            }
            continue;
        }
        paths[pathIndex].push(points[index]);
    }
    for(pathIndex = 0;paths[pathIndex];pathIndex++) {
        var path = paths[pathIndex];

        var toMovePoint = points[0];
        if (toMovePoint.length > 3) {
            toMovePoint = [0, 0];
        }
        context.moveTo(
            toMovePoint[0] + center[0],
            toMovePoint[1] + center[1]
        );
        var lastPoint = points[0];
        for (var i = 0; i <= this.now.shift; i += this.now.step) {
            var coord = formula.getPointOnPath(i, points, this.services);
            if (Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1) {
                continue
            }
            lastPoint = coord;
            context.lineTo(coord[0] + center[0], coord[1] + center[1]);
        }
    }
    changeContext(context,this.now);
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

    context.moveTo( start[0], start[1] );

    for( var i = 0; i < this.now.sidesCount; i++ ){
        var coordinate = formula.getPointOnCircle( Math.PI*2/this.now.sidesCount*i+this.radian, this.now.radius, this.x, this.y );
        context.lineTo( coordinate[0], coordinate[1] );
    }

    context.lineTo( start[0], start[1] );

    changeContext(context,this.now);
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
};

function Spline ( options ) {
    Line.apply(this,arguments);
    this.constructor    = Spline;
}

Spline.prototype = Object.create( CanvasObject.prototype );

Object.defineProperties(Spline.prototype,{
    points : {
        get: function(){
            if(!this.services.points){
                this.services.points = [];
            }

            var radian  = this.radian,
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
    if(this.now.shift > 100){
        this.now.shift = 100;
    }

    var splines = [[]];
    var splineIndex = 0;
    for(var index = 0;points[index];index++){
        if(points[index] === false){
            splineIndex++;
            continue;
        }
        splines[splineIndex].push(points[index]);
    }

    for(splineIndex = 0;splines[splineIndex];splineIndex++){
        var spline = splines[splineIndex];
        context.moveTo(
            spline[0][0] + center[0],
            spline[0][1] + center[1]
        );
        var lastPoint = spline[0];
        for(var shift = 0;shift <= this.now.shift;shift += this.now.step){
            var coord = formula.getPointOnSpline(shift,spline,this.services);
            if(Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1){continue}
            lastPoint = coord;
            context.lineTo(coord[0] + center[0],coord[1] + center[1]);
        }
    }
    changeContext(context,this.now);
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

    lineWidth   : function(context,value){
        context.lineWidth = +value;
    },

    lineCap     : function(context,value){
        context.lineCap = value;
    },

    lineJoin    : function(context,value){
        context.lineJoin = value;
    },

    lineDash    : function(context,value){
        context.setLineDash(value);
    },

    dashOffset  : function(context,value){
        context.lineDashOffset = value;
    },

    stroke      : function(context,value){
        context.strokeStyle = value;
        context.stroke();
    }
};
/**
 * CSS-JSON Converter for JavaScript
 * Converts CSS to JSON and back.
 * Version 2.1
 *
 * Released under the MIT license.
 *
 * Copyright (c) 2013 Aram Kocharyan, http://aramk.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions
 of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

var CSSJSON = new function () {

    var base = this;

    base.init = function () {
        // String functions
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };

        String.prototype.repeat = function (n) {
            return new Array(1 + n).join(this);
        };
    };
    base.init();

    var selX = /([^\s\;\{\}][^\;\{\}]*)\{/g;
    var endX = /\}/g;
    var lineX = /([^\;\{\}]*)\;/g;
    var commentX = /\/\*[\s\S]*?\*\//g;
    var lineAttrX = /([^\:]+):([^\;]*);/;

    // This is used, a concatenation of all above. We use alternation to
    // capture.
    var altX = /(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gmi;

    // Capture groups
    var capComment = 1;
    var capSelector = 2;
    var capEnd = 3;
    var capAttr = 4;

    var isEmpty = function (x) {
        return typeof x == 'undefined' || x.length == 0 || x == null;
    };

    var isCssJson = function (node) {
        return !isEmpty(node) ? (node.attributes && node.children) : false;
    }

    /**
     * Input is css string and current pos, returns JSON object
     *
     * @param cssString
     *            The CSS string.
     * @param args
     *            An optional argument object. ordered: Whether order of
     *            comments and other nodes should be kept in the output. This
     *            will return an object where all the keys are numbers and the
     *            values are objects containing "name" and "value" keys for each
     *            node. comments: Whether to capture comments. split: Whether to
     *            split each comma separated list of selectors.
     */
    base.toJSON = function (cssString, args) {
        var node = {
            children: {},
            attributes: {}
        };
        var match = null;
        var count = 0;

        if (typeof args == 'undefined') {
            var args = {
                ordered: false,
                comments: false,
                stripComments: false,
                split: false
            };
        }
        if (args.stripComments) {
            args.comments = false;
            cssString = cssString.replace(commentX, '');
        }

        while ((match = altX.exec(cssString)) != null) {
            if (!isEmpty(match[capComment]) && args.comments) {
                // Comment
                var add = match[capComment].trim();
                node[count++] = add;
            } else if (!isEmpty(match[capSelector])) {
                // New node, we recurse
                var name = match[capSelector].trim();
                // This will return when we encounter a closing brace
                var newNode = base.toJSON(cssString, args);
                if (args.ordered) {
                    var obj = {};
                    obj['name'] = name;
                    obj['value'] = newNode;
                    // Since we must use key as index to keep order and not
                    // name, this will differentiate between a Rule Node and an
                    // Attribute, since both contain a name and value pair.
                    obj['type'] = 'rule';
                    node[count++] = obj;
                } else {
                    if (args.split) {
                        var bits = name.split(',');
                    } else {
                        var bits = [name];
                    }
                    for (i in bits) {
                        var sel = bits[i].trim();
                        if (sel in node.children) {
                            for (var att in newNode.attributes) {
                                node.children[sel].attributes[att] = newNode.attributes[att];
                            }
                        } else {
                            node.children[sel] = newNode;
                        }
                    }
                }
            } else if (!isEmpty(match[capEnd])) {
                // Node has finished
                return node;
            } else if (!isEmpty(match[capAttr])) {
                var line = match[capAttr].trim();
                var attr = lineAttrX.exec(line);
                if (attr) {
                    // Attribute
                    var name = attr[1].trim();
                    var value = attr[2].trim();
                    if (args.ordered) {
                        var obj = {};
                        obj['name'] = name;
                        obj['value'] = value;
                        obj['type'] = 'attr';
                        node[count++] = obj;
                    } else {
                        if (name in node.attributes) {
                            var currVal = node.attributes[name];
                            if (!(currVal instanceof Array)) {
                                node.attributes[name] = [currVal];
                            }
                            node.attributes[name].push(value);
                        } else {
                            node.attributes[name] = value;
                        }
                    }
                } else {
                    // Semicolon terminated line
                    node[count++] = line;
                }
            }
        }

        return node;
    };

    /**
     * @param node
     *            A JSON node.
     * @param depth
     *            The depth of the current node; used for indentation and
     *            optional.
     * @param breaks
     *            Whether to add line breaks in the output.
     */
    base.toCSS = function (node, depth, breaks) {
        var cssString = '';
        if (typeof depth == 'undefined') {
            depth = 0;
        }
        if (typeof breaks == 'undefined') {
            breaks = false;
        }
        if (node.attributes) {
            for (i in node.attributes) {
                var att = node.attributes[i];
                if (att instanceof Array) {
                    for (var j = 0; j < att.length; j++) {
                        cssString += strAttr(i, att[j], depth);
                    }
                } else {
                    cssString += strAttr(i, att, depth);
                }
            }
        }
        if (node.children) {
            var first = true;
            for (i in node.children) {
                if (breaks && !first) {
                    cssString += '\n';
                } else {
                    first = false;
                }
                cssString += strNode(i, node.children[i], depth);
            }
        }
        return cssString;
    };

    /**
     * @param data
     *            You can pass css string or the CSSJS.toJSON return value.
     * @param id (Optional)
     *            To identify and easy removable of the style element
     * @param replace (Optional. defaults to TRUE)
     *            Whether to remove or simply do nothing
     * @return HTMLLinkElement
     */
    base.toHEAD = function (data, id, replace) {
        var head = document.getElementsByTagName('head')[0];
        var xnode = document.getElementById(id);
        var _xnodeTest = (xnode !== null && xnode instanceof HTMLStyleElement);

        if (isEmpty(data) || !(head instanceof HTMLHeadElement)) return;
        if (_xnodeTest) {
            if (replace === true || isEmpty(replace)) {
                xnode.removeAttribute('id');
            } else return;
        }
        if (isCssJson(data)) {
            data = base.toCSS(data);
        }

        var node = document.createElement('style');
        node.type = 'text/css';

        if (!isEmpty(id)) {
            node.id = id;
        } else {
            node.id = 'cssjson_' + timestamp();
        }
        if (node.styleSheet) {
            node.styleSheet.cssText = data;
        } else {
            node.appendChild(document.createTextNode(data));
        }

        head.appendChild(node);

        if (isValidStyleNode(node)) {
            if (_xnodeTest) {
                xnode.parentNode.removeChild(xnode);
            }
        } else {
            node.parentNode.removeChild(node);
            if (_xnodeTest) {
                xnode.setAttribute('id', id);
                node = xnode;
            } else return;
        }

        return node;
    };

    // Alias

    if (typeof window != 'undefined') {
        window.createCSS = base.toHEAD;
    }

    // Helpers

    var isValidStyleNode = function (node) {
        return (node instanceof HTMLStyleElement) && node.sheet.cssRules.length > 0;
    }

    var timestamp = function () {
        return Date.now() || +new Date();
    };

    var strAttr = function (name, value, depth) {
        return '\t'.repeat(depth) + name + ': ' + value + ';\n';
    };

    var strNode = function (name, value, depth) {
        var cssString = '\t'.repeat(depth) + name + ' {\n';
        cssString += base.toCSS(value, depth + 1);
        cssString += '\t'.repeat(depth) + '}\n';
        return cssString;
    };

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
    },

    getAngleOfVector: function (point, center) {
        center = center || [0,0];
        point = point || [0,0];
        point = [point[0] - center[0],point[1] - center[1]];
        var distance = formula.getCenterToPointDistance(point);
        var angle = Math.asin(point[1]/distance);
        var acos  = Math.acos(point[0]/distance);
        if(acos > Math.PI/2){
            return Math.PI - angle;
        }
        return angle;
    }
};

formula.getLengthOfCurve = function (points, step) {
    step = step || 1;
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
    step = step || 1;
    var length = 0;
    var lastPoint = this.getPointOnEllipse(radiusX,radiusY,startRadian);
    var radianPercent = (endRadian - startRadian) / 100;
    for(var i = 0;i<=100;i+=step){
        var radian = startRadian + radianPercent * i;
        var point = this.getPointOnEllipse(radiusX,radiusY,radian);
        length += this.getCenterToPointDistance([point[0]-lastPoint[0],point[1]-lastPoint[1]]);
        lastPoint = point;
    }
    return length;
};

formula.getMapOfPath = function (points, step) {
    var map = [[]];
    var index = 0;
    var lastPoint = [];
    for(var i = 0;points[i];i++){
        var point = points[i];
        if(point.length > 3){
            map[index] = this.getLengthOfEllipticArc(point[0], point[1], point[2], point[3], step);
            if(!points[i+1]){continue}
            var centerOfArc = this.getPointOnEllipse(point[0], point[1], point[2] + Math.PI, point[4], lastPoint[0], lastPoint[1]);
            var endOfArc = this.getPointOnEllipse(point[0], point[1], point[3], point[4], centerOfArc[0], centerOfArc[1]);
            index++;
            map[index] = [endOfArc];
            lastPoint = endOfArc;
            continue;
        }
        map[index].push(point);
        if(point[2] === true || (points[i+1] && points[i+1].length > 3)){
            map[index] = formula.getLengthOfCurve(map[index],step);
            index++;
            map[index] = [point];
        }
        lastPoint = point;
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
        if(point.length > 3){
            var centerOfArc = this.getPointOnEllipse(point[0], point[1], point[2] + Math.PI, point[4], lastPoint[0], lastPoint[1]);
            if(controlPointsCounter === lastControlPoint){
                var percent = (shiftLength - counter) / (services.map[lastControlPoint] / 100);
                var resultRadian = point[2] + ((point[3] - point[2])/100*percent);
                return this.getPointOnEllipse(point[0], point[1], resultRadian, point[4], centerOfArc[0], centerOfArc[1]);
            }
            lastPoint = this.getPointOnEllipse(point[0], point[1], point[3], point[4], centerOfArc[0], centerOfArc[1]);
            controlPointsCounter++;
            if(controlPointsCounter === lastControlPoint){
                checkedCurve.push(lastPoint);
            }
            continue
        }
        if(point[2] === true || (points[pointIndex+1] && points[pointIndex+1].length > 3)){
            controlPointsCounter++;
        }
        if(controlPointsCounter >= lastControlPoint){
            checkedCurve.push(point);
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