/**
 * Created by takovoy on 31.07.2016.
 */

function toIdentifyTheLine ( points, context, corrective, moveTo){
    corrective = corrective || {};

    if(moveTo){
        context.moveTo(
            points[0][0] + +corrective.x,
            points[0][1] + +corrective.y
        );
    }

    for(var point = 0;points[point];point++){
        if(typeof points[point][0] === 'object'){
            toIdentifyTheLine(
                points[point],
                context,
                corrective
            );
            continue;
        }

        context.lineTo(
            points[point][0] + +corrective.x,
            points[point][1] + +corrective.y
        );
    }
}

function toIdentifyTheCurve ( points, context, corrective, moveTo){
    corrective = corrective || {};

    if(moveTo){
        context.moveTo(
            points[0][0] + +corrective.x,
            points[0][1] + +corrective.y
        );
    }

    for(var point = 0;points[point];point++){
        var coord = formula.getPointOnCurve(i,this.now.points);
        context.lineTo(
            coord[0] + this.parent.x,
            coord[1] + this.parent.y
        );
    }
}
