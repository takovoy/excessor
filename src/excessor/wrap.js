
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