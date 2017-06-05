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

    getPointOnEllipse: function(semiAxisX,semiAxisY,shift,tilt,centerX,centerY){
        tilt    = tilt || 0;
        tilt    *= -1;

        var x1  = semiAxisX*Math.cos(+shift),
            y1  = semiAxisY*Math.sin(+shift),
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

    getPointOnCurve: function(shift,points,debug){
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
        try {
            return this.getPointOnCurve(shift,pointsPP);
        } catch (error) {
            //console.log(arguments);
        }
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
        rgba[0]  = parseInt(color.substring(1,3),16);
        rgba[1]  = parseInt(color.substring(3,5),16);
        rgba[2]  = parseInt(color.substring(5),16);
        rgba[3]  = 1;
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
    }
};

formula.getLengthOfCurve = function (points, step) {
    var result = 0;
    var lastPoint = points[0];
    for(var sift = 0;sift <= 100;sift += step){
        var coord = formula.getPointOnCurve(sift,points,'getLengthOfCurve');
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
    var counter = services.map[0];
    var lastControlPoint = 0;
    var pointIndex = 0;
    var controlPointsCounter = 0;
    var checkedCurve = [];
    for(; services.map[lastControlPoint] && counter < shiftLength; lastControlPoint++){
        counter += services.map[lastControlPoint];
    }
    for(; points[pointIndex] && controlPointsCounter <= lastControlPoint; pointIndex++){
        if(points[pointIndex][3]){
            controlPointsCounter++;
        }
        if(controlPointsCounter >= lastControlPoint){
            checkedCurve.push(points[pointIndex]);
        }
    }
    var checkedCurveShift = (services.map[lastControlPoint] - (counter-shiftLength)) / (services.map[lastControlPoint] / 100);
    return formula.getPointOnCurve(
        checkedCurveShift,
        checkedCurve,'getPointOnSpline'
    );
};