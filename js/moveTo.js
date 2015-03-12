/**
 * Created by takovoy on 05.12.2014.
*/

var dynamic = {

    move: function(canvasObject){
        var after       = canvasObject.after.list,
            fps         = canvasObject.drawingObject.fps,
            incidence   = 1000 / (+fps);

        for(var key in after){
            if(!after[key].step){
                after[key].step = (after[key].endShift - after[key].shift) / (after[key].time / incidence);
            }
            after[key].shift    += +after[key].step;

            if(this.data[key]){
                this.data[key].prepareData(canvasObject);
            } else {
                canvasObject.now[key] = after[key].start + (after[key].end - after[key].start) / 100 * after[key].shift;
            }


            if(after[key].endShift == 'cycle'){
                if(after[key].shift >= 100){
                    after[key].shift = 0;
                }
            } else if(after[key].shift >= after[key].endShift){
                var callback = false;

                if(after[key].callback) {
                    callback = after[key].callback;
                }

                canvasObject.after.remove(key);

                if(callback){
                    drawingData.objects.getObject(callback.id).after.append(callback.data);
                }
            }

        }

    },
    //drawingData.checkedObject.after.append('trajectory',{type:'circle',shift:0,endShift:100,radius:20,center:[100,100]});

    data: {

        trajectory: {

            type        : 'trajectory',
            prepareData : function(canvasObject){
                var key         = this.type,
                    after       = canvasObject.after.list;

                canvasObject.x      = +this.functions[after[key].type](after[key])[0];
                canvasObject.y      = +this.functions[after[key].type](after[key])[1];
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
                    return formula.getPointOnLine(data.shift,data.points);
                },

                curve   : function(data){
                    return formula.getPointOnCurve(data.shift,data.points);
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

        }
    }
};