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
        var x   = (points[1][0] - points[0][0]) * (shift / 100) + points[0][0],
            y   = (points[1][1] - points[0][1]) * (shift / 100) + points[0][1];
        return [x,y];
    },

    getCenterToPointDistance : function(coordinates){
        return Math.sqrt(Math.pow(coordinates[0],2) + Math.pow(coordinates[1],2));
    },

    /**
     * @return {Array}
     */
    HEXtoRGB    : function(color){
        if(color[0] != "#"){return false}
        var rgb = [];
        rgb[0] = parseInt(color.substring(1,3),16);
        rgb[1] = parseInt(color.substring(3,5),16);
        rgb[2] = parseInt(color.substring(5),16);
        return rgb;
    },

    RGBtoRGBA    : function(color){
        if(color.substring(1,3) != 7){return false}
        var rgb = [];
        rgb[0] = parseInt(color.substring(1,3),16);
        rgb[1] = parseInt(color.substring(3,5),16);
        rgb[2] = parseInt(color.substring(5),16);
        return rgb;
    },

    changeColor : function(start,end,shift){
        var result      = [];

        if(start[0] === '#'){start = formula.HEXtoRGB(start)}
        else if ( start.substring(0,4) === "rgb(" ) {
            start = start.match(/\d+/g);
        }
        if(end[0] === '#'){end = formula.HEXtoRGB(end)}
        else if ( end.substring(0,4) === "rgb(" ) {
            end = end.match(/\d+/g);
        }

        for(var i = 0;i<3;i++){
            result[i] = Math.round(+start[i] + (+end[i] - +start[i]) / 100 * shift);
        }
        return 'rgb(' + result[0] + ',' + result[1] + ',' + result[2] + ')';
    }
};