/**
 * Created by takovoy on 24.06.2017.
 */

function SVGParser ( string ) {
    var data = string.match(/d="( |,|\.|\d*|[A-Z])*"/g);
    var path = [];
    for(var i = 0;data[i];i++){
        path[i] = data[i].match(/[A-Z] ( ?\d*(.\d{1,3})+,\d*(.\d{1,3})+){1,3}/g);
        for(var j = 1;path[i][j];j++){
            var previous = [];
            if(j===1){
                previous = path[i][0].match(/\d+(\.\d+)?( |,)\d+(\.\d+)?/g);
            }
            path[i][j-1] = previous.concat(
                path[i][j]
                    .match(/\d+(\.\d+)?( |,)\d+(\.\d+)?/g)
            );
            for(var k = 0;path[i][j-1][k];k++){
                path[i][j-1][k] = path[i][j-1][k].split(',');
                path[i][j-1][k][0] = +path[i][j-1][k][0];
                path[i][j-1][k][1] = +path[i][j-1][k][1];
                if(k === path[i][j-1].length - 1){
                    path[i][j-1][k][path[i][j-1][k].length] = true;
                }
            }
            if(j===path[i].length - 1){
                delete path[i][j];
            }
        }
        var split = [];
        for(var j = 0;path[i][j];j++){
            split = split.concat(path[i][j]);
        }
        path[i] = split;
    }
    return path;
}