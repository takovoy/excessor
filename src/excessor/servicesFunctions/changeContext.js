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

    stroke      : function(context,value){
        context.strokeStyle = value;
        context.stroke();
    },

    lineWidth   : function(context,value){
        context.lineWidth = +value;
    }
};