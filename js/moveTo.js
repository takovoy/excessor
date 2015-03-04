/**
 * Created by takovoy on 05.12.2014.
 */

var dynamic = {

    move: function(canvasObject){
        var fps         = canvasObject.drawingObject.fps,
            incidence   = 1000 / fps,
            after       = canvasObject.after.list;

        for(var key in after){

            if(this.data[key]){
                this.data[key].prepareData(canvasObject);

                if(after.shift >= after.endShift){
                    var callback;

                    if(after.callback) {
                        callback = after.callback;
                    }

                    canvasObject.after.remove(key);
                    drawingData.objects.getObject(callback.id).after.append(callback.data);
                }

                continue;
            }

        }

    },

    data: {
        trajectory: {

            type        : 'trajectory',

            prepareData : function(canvasObject){
                var key         = this.type,
                    fps         = canvasObject.drawingObject.fps,
                    incidence   = 1000 / fps,
                    after       = canvasObject.after.list;

                if(!after[key].step){
                    after[key].step =       after[key].time / 100 * (after[key].time / incidence);
                }

                after[key].shift    +=      after[key].step;
                canvasObject.x      =       this.functions[after[key].type](after[key])[0];
                canvasObject.y      =       this.functions[after[key].type](after[key])[1];
            },

            functions   : {

                circle  : function(data){
                    var shift = Math.PI * 2 / 100 * data.shift;

                    if(data.reverse){
                        shift = Math.PI * 2 - Math.PI * 2 / 100 * data.shift
                    }

                    return formula.getPointOnCircle(shift, data.radius, data.center[0], data.center[1]);
                },

                polygon : function(data){

                },

                line    : function(data){

                },

                curve   : function(data){

                }

            }

        },
        color   : {

            type        : 'color',

            prepareData : function(canvasObject){

            },

            functions   : {

            }

        },
        radian  : {

            type        : 'radian',

            prepareData : function(canvasObject){

            },

            functions   : {

            }

        },
        radius  : {

            type        : 'radian',

            prepareData : function(canvasObject){

            },

            functions   : {

            }

        }
    }
};