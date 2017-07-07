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