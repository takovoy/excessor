/**
 * Created by takovoy on 14.09.2014.
 */

var formula = {

    coordPointFromCircle: function(radian,radius,centerX,centerY){
        centerX = centerX || 0;
        centerY = centerY || 0;
        var y = radius * Math.sin(radian);
        var x = radius * Math.cos(radian);
        return [centerX + x,centerY + y];
    },

    coordPointsFromPolygon: function(sidesCount,radian,radius,centerX,centerY){
        var coord = [];
        coord.push(this.coordPointFromCircle(radian,radius,centerX,centerY));
        for(var i = 0;i < sidesCount;i++){
            coord.push(this.coordPointFromCircle(Math.PI*2 / sidesCount * i + radian,radius,centerX,centerY));
        }
        return coord;
    }
};