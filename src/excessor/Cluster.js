/**
 * Created by yeIAmCrasyProgrammer on 10.10.2016.
 */

function Cluster ( count, correlation ){
    this.parameters     = {
        list        : {},
        iteration   : false
    };
    CanvasObject.apply( this, [{}] );
    this.correlation    = correlation || {};
    this.count          = count || 0;
    this.iteration      = 1;
    this.constructor    = Cluster;
}

Cluster.prototype = Object.create( CanvasObject.prototype );


// отчистка метода трансформации
Cluster.prototype.transform = function(){
    if( !this._transform ){
        this._transform = new Listing();
    }
    return this._transform;
};


// для кластеров анимация зацикленна в рекурсию
// каждая итерация выводит новый элемент кластера
Cluster.prototype.animate = function(){
    if( this.iteration > this.count ){
        this.iteration = 1;
        return;
    }
    this._animate = this.parent.animate;
    this._animate( this.drawing.context );
    this.iteration++;
    this.animate();
};

// параметры описаные дескриптором неизменяемы и возвращают данные уже изменённые согласно объекту correlation
Object.defineProperties( Cluster.prototype,{
    now     : {
        get : function(){
            if( this.parameters.iteration !== this.iteration && this.parent ) {
                for( var key in this.parent.now ){
                    if ( !this.correlation[key] ) {
                        this.parameters.list[key] = this.parent.now[key];
                        continue;
                    }
                    var correlation = +this.correlation[key];
                    if( typeof this.correlation[key] == "function" ){
                        correlation = +this.correlation[key]( this.iteration, this );
                    }
                    this.parameters.list[key] = this.parent.now[key] + (correlation * this.iteration);
                }
                this.parameters.iteration = +this.iteration;
            }
            return this.parameters.list;
        },

        set : function( value ){
            return this.parameters.list;
        }
    },


    x       : {
        get : function(){
            if( this.parent.parent ){
                return (
                    this.now.x * Math.cos( this.parent.parent.radian ) -
                    this.now.y * Math.sin( this.parent.parent.radian ) +
                    this.parent.parent.x
                );
            }
            return +this.now.x;
        },
        set : function( value ){
            return +this.now.x;
        }
    },

    y       : {
        get : function(){
            if( this.parent.parent ){
                return (
                    this.now.x * Math.sin( this.parent.parent.radian ) +
                    this.now.y * Math.cos( this.parent.parent.radian ) +
                    this.parent.parent.y
                );
            }
            return +this.now.y;
        },
        set : function( value ){
            return +this.now.y;
        }
    },

    radian  : {
        get: function(){
            if( this.parent ){
                return +this.parent.parent.radian + +this.now.radian;
            }
            return +this.now.radian;
        },
        set: function( value ){
            return +this.now.radian;
        }
    }
});