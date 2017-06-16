/**
 * Created by takovoy on 05.12.2014.
*/

var dynamic = {

    move: function(canvasObject){
        var transforms       = canvasObject.transform().list,
            fps         = canvasObject.drawing.fps,
            incidence   = 1000 / (+fps);

        for(var key in transforms){
            var transform   = transforms[key],
                options     = transform.options,
                startEvent  = transform.event('start');

            if(startEvent){
                startEvent(startEvent,transform,canvasObject);
                transform.events.remove('start');
            }
            if(!options.step){
                options.step = (options.endShift - options.startShift) / (options.time / incidence);
            }

            //the increase in displacement
            if(!transform.reverse){
                options.shift += +options.step * options.rate;
            } else {
                options.shift -= +options.step * options.rate;
            }

            //processing frame
            if(this.data[key]){
                this.data[key].prepareData(canvasObject);
            } else {
                canvasObject.now[key] = options.start + (options.end - options.start) / 100 * transform.shift;
            }

            //initiate events
            for(var event in transform.events.list){
                if(isNaN(+event)){continue}

                if(transform.reverse){
                    if(+event > options.shift || +event < options.shift - options.step){continue}
                } else {
                    if(+event < options.shift || +event > options.shift + options.step){continue}
                }

                transform.events.list[event](transform.event(event),transform,canvasObject);
            }

            //checked end of animation
            if(!transform.reverse){
                if(options.shift < options.endShift){
                    continue
                }
            } else {
                if(options.shift > options.startShift){
                    continue
                }
            }

            //recourse or callback
            canvasObject.transform().remove(key);
            if(transform.options.recourse){
                if(!transform.reverse){
                    transform.options.shift  = transform.options.startShift;
                } else {
                    transform.options.shift  = transform.options.endShift;
                }
                canvasObject.transform(transform);
            }
            if(transform.event('callback')){
                transform.event('callback')(transform.event('callback'),transform,canvasObject);
                transform.events.remove('callback');
            }
        }
    },

    data: {

        trajectory: {

            type        : 'trajectory',
            prepareData : function(canvasObject){
                var key         = this.type,
                    transform   = canvasObject.transform().list[key],
                    coord       = this.functions[transform.options.type](transform.options,transform.shift);

                canvasObject.x      = coord[0];
                canvasObject.y      = coord[1];
            },

            functions   : {

                circle  : function(data,transformShift){
                    var shift = Math.PI * 2 / 100 * transformShift;

                    if(data.reverse){
                        shift = Math.PI * 2 - Math.PI * 2 / 100 * transformShift
                    }

                    return formula.getPointOnCircle(shift, data.radius, data.center[0], data.center[1]);
                },

                polygon : function(data,shift){

                },

                line    : function(data,shift){
                    return formula.getPointOnLine(shift,data.points);
                },

                curve   : function(data,shift){
                    return formula.getPointOnCurve(shift,data.points);
                }

            }

        },

        fill   : {

            type        : 'fill',

            prepareData : function(canvasObject){
                var key         = this.type,
                    transform   = canvasObject.transform().list[key],
                    start       = transform.options.start,
                    end         = transform.options.end,
                    shift       = transform.shift;

                canvasObject.now.fill = formula.changeColor(start,end,shift);
            }

        },

        stroke   : {

            type        : 'stroke',

            prepareData : function(canvasObject){
                var key         = this.type,
                    transform   = canvasObject.transform().list[key],
                    start       = transform.options.start,
                    end         = transform.options.end,
                    shift       = transform.shift;

                canvasObject.now.stroke = formula.changeColor(start,end,shift);
            }

        },

        points  : {
            type        : 'points',
            prepareData : function(canvasObject){
                var key         = this.type,
                    transform   = canvasObject.transform().list[key],
                    start       = transform.options.start,
                    end         = transform.options.end,
                    shift       = transform.shift;

                canvasObject.points = this.functions.pointsRecourse(start,end,shift);
            },

            functions   : {
                pointsRecourse  : function(start,end,shift){
                    var result = [];
                    for(var i = 0;i < start.length || i < end.length;i++) {
                        if(typeof start[i] != typeof end[i] || !start[i]){
                            result[i] = start[i];
                            continue;
                        }

                        if(typeof start[i] === 'object'){
                            result[i] = this.pointsRecourse(start[i],end[i],shift);
                            continue;
                        }

                        result = formula.getPointOnLine(shift,[start,end]);
                        break;
                    }

                    return result;
                }
            }
        }
    }
};