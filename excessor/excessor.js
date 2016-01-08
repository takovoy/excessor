/**
 * Created by takovoy on 22.11.2014.
 */

var CanvasObject = function(options){
    this.id             = options.id || '' + Math.random();
    this.now            = options.settings || {};
    this.childrens      = new PropertyListing(
        function(self,object){          //append callback
            object.parent = self.now;
        },
        function(self){                 //remove callback

        },
        this
    );
    this.events         = new EventsListing();
    this._transform     = new Listing();
    this.childrens = new PropertyListing(
        function(self,object){
            object.parent = self.now;
            return object;
        },
        function(self){

        },
        this
    );
    this.events = new EventsListing();
    if(options.drawing){
        this.drawing = options.drawing;
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
    }
});

CanvasObject.prototype.start        = function(){
    this.drawing.stack.append(this);
    return this;
};
CanvasObject.prototype.stop         = function(){
    this.drawing.stack.remove(this.id);
    return this;
};
CanvasObject.prototype.animate      = function(){};
CanvasObject.prototype.transform = function(transform){
    if(!this._transform){
        this._transform = new Listing();
    }
    if (!transform) {return this._transform;}
    this._transform.append(transform.id,transform);
    return transform;
};
CanvasObject.prototype.move       = function(coord,time){
    if(!time){
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
CanvasObject.prototype.moveProperty   = function(property,value,time){
    if(!time){
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
/**
 * Created by Пользователь on 06.03.2015.
 */

var changeContext = function(context,value){
    for(var key in value){
        if(!dataContextChanges[key] || !value[key])continue;
        dataContextChanges[key](context,value[key]);
    }
};

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
 * Created by takovoy on 14.09.2014.
 */

var formula = {

    getPointOnCircle: function(radian,radius,centerX,centerY){
        radius  = +radius;
        radian  = +radian;
        centerX = +centerX || 0;
        centerY = +centerY || 0;
        var y   = radius * Math.sin(+radian);
        var x   = radius * Math.cos(+radian);
        return [centerX + x,centerY + y];
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
        if(points.length == 2){
            return this.getPointOnLine(shift,points);
        }
        var pointsPP = [];
        for(var i = 1;i < points.length;i++){
            pointsPP.push(this.getPointOnLine(shift,[
                points[i - 1],
                points[i]
            ]));
        }
        return this.getPointOnCurve(shift,pointsPP);
    },

    getPointOnLine: function(shift,points){
        return [
            (points[1][0] - points[0][0]) * (shift / 100) + points[0][0],
            (points[1][1] - points[0][1]) * (shift / 100) + points[0][1]
        ];
    },

    /**
     * @return {Array}
     */
    HEXtoRGB    : function(color){
        if(color.length != 7){return false}
        var rgb = [];
        rgb[0] = parseInt(color.substring(1,3),16);
        rgb[1] = parseInt(color.substring(3,5),16);
        rgb[2] = parseInt(color.substring(5),16);
        return rgb;
    },

    changeColor : function(start,end,shift){
        var result      = [];

        if(start[0] == '#'){start = formula.HEXtoRGB(start)}
        if(end[0] == '#'){end = formula.HEXtoRGB(end)}

        for(var i = 0;i<3;i++){
            result[i] = Math.round(start[i] + (end[i] - start[i]) / 100 * shift);
        }
        return 'rgb(' + result[0] + ',' + result[1] + ',' + result[2] + ')';
    }
};
/**
 * Created by takovoy on 05.12.2014.
*/

var dynamic = {

    move: function(canvasObject){
        var transforms       = canvasObject.transform().list,
            fps         = canvasObject.drawing.fps,
            incidence   = 1000 / (+fps);

        for(var key in transforms){
            var transform   = transforms[key];
                options     = transform.options;

            if(transform.event('start')){
                transform.events.list['start'](transform.event('start'),transform,canvasObject);
            }
            if(!options.step){
                options.step = (options.endShift - options.startShift) / (options.time / incidence);
            }

            //the increase in displacement
            if(!transform.reverse){
                options.shift    += +options.step * options.rate;
            } else {
                options.shift    -= +options.step * options.rate;
            }

            //processing frame
            if(this.data[key]){
                this.data[key].prepareData(canvasObject);
            } else {
                canvasObject.now[key] = options.start + (options.end - options.start) / 100 * options.shift;
            }

            //initiate events
            for(var event in transform.events.list){
                if(isNaN(+event)){continue}

                if(!transform.reverse){
                    if(+event > options.shift){break}
                } else {
                    if(+event < options.shift){break}
                }

                transform.events.list[event](transform.event(event),transform,canvasObject);
                transform.events.remove(event);
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
                    coord       = this.functions[transform.options.type](transform.options);

                canvasObject.x      = coord[0];
                canvasObject.y      = coord[1];
            },

            functions   : {

                circle  : function(data){
                    var shift = Math.PI * 2 / 100 * data.shift;

                    if(data.reverse){
                        shift = Math.PI * 2 - Math.PI * 2 / 100 * data.shift
                    }

                    return formula.getPointOnCircle(shift, data.radius, data.center[0], data.center[1]);
                },

                polygon : function(data){

                },

                line    : function(data){
                    return formula.getPointOnLine(data.shift,data.points);
                },

                curve   : function(data){
                    return formula.getPointOnCurve(data.shift,data.points);
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
                    shift         = transform.options.shift;

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
                    shift         = transform.options.shift;

                canvasObject.now.stroke = formula.changeColor(start,end,shift);
            }

        }
    }
};
/**
 * Created by takovoy on 22.11.2014.
 */


function Drawing (width,height){
    var self = this;
    this.DOMObject          = document.createElement('canvas');
    this.DOMObject.width    = width || 0;
    this.DOMObject.height   = height || 0;
    this.context            = this.DOMObject.getContext('2d');
    this.stack              = new PropertyListing();
    this._fps               = 0;
    this.core               = false;
    this.render             = function(canvasObject,id){
        canvasObject.id = id;
        self.context.beginPath();
        self.context.fillStyle = '#000000';
        self.context.strokeStyle = '#000000';
        self.context.closePath();

        //динамика
        dynamic.move(canvasObject);

        for(var child in canvasObject.childrens.list){
            this.render(canvasObject.childrens.list[child],child);
        }
        canvasObject.animate(this.context);
    };
    Object.defineProperty(this,'fps',{
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
}
/**
 * Created by 1 on 11.11.2015.
 */

function Transform (options){
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
/**
 * Created by Пользователь on 25.02.2015.
 */

var drawingData = {
    drawing         : new Drawing(200,400),
    _createdObject  : undefined,
    checkedObject   : undefined,
    checkedPoint    : undefined,
    objects         : new PropertyListing(function(self){
        var data = [];
        for(var key in self.list){
            var dataLen = data.length;
            data[dataLen] = {};
            data[dataLen].description = key;
            data[dataLen].action = function(value){
                drawingData.objects.list[value].appendChild(drawingData.checkedObject);
            };
        }
        toolbarModel.elements.create.inheritance.data = data;
    }),
    onStart         : new PropertyListing()
};

Object.defineProperties(drawingData,{
    createdObject: {
        get: function(){return this._createdObject},
        set: function(value){
            this._createdObject = value;
            this.checkedObject  = this._createdObject;
        }
    }
});
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
 * Created by takovoy on 30.11.2014.
 */

var Circle = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Circle;
    this.now.radius     = options.radius;
};

Circle.prototype = Object.create(CanvasObject.prototype);

Circle.prototype.animate = function(context){
    context.beginPath();
    context.arc(this.x,this.y,this.now.radius,0,Math.PI*2);
    changeContext(context,this.now);
    context.closePath();
};
/**
 * Created by takovoy on 22.01.2015.
 */

var Curve = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Curve;
    this.now.points     = options.points;
};

Curve.prototype = Object.create(CanvasObject.prototype);

Curve.prototype.animate = function(context){
    context.beginPath();

    if(this.now.points.length < 2) {
        return
    }

    if(this.now.showBreakpoints){
        for(var j = 0;this.now.points[j];j++){
            context.moveTo(this.now.points[j][0] + this.parent.x,this.now.points[j][1] + this.parent.y);
            context.arc(this.now.points[j][0] + this.parent.x,this.now.points[j][1] + this.parent.y,2,0,Math.PI*2);
        }
        context.fill();
        context.closePath();
        context.beginPath();
    }

    context.moveTo(this.now.points[0][0] + this.parent.x,this.now.points[0][1] + this.parent.y);

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
 * Created by takovoy on 12.12.2014.
 */

var Line = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Line;
    this.now.points      = options.points || [];
};

Line.prototype = Object.create(CanvasObject.prototype);

Line.prototype.animate = function(context){
    if(this.now.points.length < 2){return;}
    context.beginPath();
    context.moveTo(this.now.points[0][0],this.now.points[0][1]);
    for(var i = 1;this.now.points[i];i++){
        context.lineTo(this.now.points[i][0],this.now.points[i][1]);
    }
    context.stroke();
    context.closePath();
};
/**
 * Created by Пользователь on 21.01.2015.
 */

var Polygon = function(options){
    CanvasObject.apply(this,arguments);
    this.constructor    = Polygon;
    this.now.sidesCount = options.sidesCount;
    if(!this.now.radian){this.now.radian = Math.PI/180*270}
};

Polygon.prototype = Object.create(CanvasObject.prototype);

Polygon.prototype.animate = function(context){
    if(this.now.sidesCount < 3){
        return false
    }

    context.beginPath();

    context.moveTo(
        formula.getPointOnCircle(this.now.radian,this.now.radius,this.x,this.y)[0],
        formula.getPointOnCircle(this.now.radian,this.now.radius,this.x,this.y)[1]
    );

    for(var i = 0;i < this.now.sidesCount;i++){
        context.lineTo(
            formula.getPointOnCircle(Math.PI*2 / this.now.sidesCount * i + this.now.radian,this.now.radius,this.x,this.y)[0],
            formula.getPointOnCircle(Math.PI*2 / this.now.sidesCount * i + this.now.radian,this.now.radius,this.x,this.y)[1]
        );
    }

    context.lineTo(
        formula.getPointOnCircle(this.now.radian,this.now.radius,this.x,this.y)[0],
        formula.getPointOnCircle(this.now.radian,this.now.radius,this.x,this.y)[1]
    );

    changeContext(context,this.now);

    context.closePath();
};
/**
 * Created by takovoySuper on 12.05.2015.
 */

function EventsListing (){
    this.list   = {};
}

//��������� ?
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