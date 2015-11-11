/**
 * Created by takovoy on 05.12.2014.
*/

var dynamic = {

    move: function(canvasObject){
        var transform       = canvasObject.transform().list,
            fps         = canvasObject.drawing.fps,
            incidence   = 1000 / (+fps);

        for(var key in transform){
            var options = transform[key].options;
            if(!options.step){
                options.step = (options.endShift - options.shift) / (options.time / incidence);
            }

            //��������
            options.shift    += +options.step * options.rate;

            //���������� ��������
            if(this.data[key]){
                this.data[key].prepareData(canvasObject);
            } else {
                canvasObject.now[key] = options.start + (options.end - options.start) / 100 * options.shift;
            }

            //��������� ��������� ��������
            if(options.shift >= options.endShift){
                //var callback = false;
                //
                //if(after[key].callback) {
                //    callback = after[key].callback;
                //}

                canvasObject.transform().remove(key);

                //if(callback){
                //    drawingData.objects.getObject(callback.id).after.append(callback.data);
                //}
            }

        }

    },
    //drawingData.checkedObject.after.append('trajectory',{type:'circle',shift:0,endShift:100,radius:20,center:[100,100]});

    data: {

        trajectory: {

            type        : 'trajectory',
            prepareData : function(canvasObject){
                var key         = this.type,
                    transform   = canvasObject.transform().list[key],
                    coord       = this.functions[transform.options.type](transform.options);

                canvasObject.x      = coord[0];
                canvasObject.y      = coord[1];
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

        }
    }
};