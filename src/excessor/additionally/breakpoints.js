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