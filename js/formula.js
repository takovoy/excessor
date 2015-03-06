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
    }
};