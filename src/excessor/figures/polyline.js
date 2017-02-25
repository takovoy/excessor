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