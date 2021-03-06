
function CanvasObject ( options ) {
    options             = options || {};
    this.id             = options.id || '' + Math.random();
    this.now            = options.settings || {};
    this.now.x          = this.now.x || options.x || 0;
    this.now.y          = this.now.y || options.y || 0;
    this.now.radian     = this.now.radian || options.radian || 0;
    this.services       = {};
    this._transform     = new Listing();
    this.childrens      = new PropertyListing(
        function( self, object ){
            object.parent           = self;
            object.drawing          = self.drawing;
            self.operationContext   = object;
            return self;
        },
        function( self ){

        },
        this
    );
    this.drawing = options.drawing || undefined;
}

Object.defineProperties(CanvasObject.prototype,{
    x       : {
        get: function(){
            if( this.parent ){
                return (
                    this.now.x * Math.cos( this.parent.radian ) -
                    this.now.y * Math.sin( this.parent.radian ) +
                    this.parent.x
                );
            }
            return +this.now.x;
        },
        set: function( value ){
            this.now.x = +value;
        }
    },

    y       : {
        get: function(){
            if( this.parent ){
                return (
                    this.now.x * Math.sin( this.parent.radian ) +
                    this.now.y * Math.cos( this.parent.radian ) +
                    this.parent.y
                );
            }
            return +this.now.y;
        },
        set: function( value ){
            this.now.y = +value;
        }
    },

    radian  : {
        get: function(){
            if( this.parent ){
                return +this.parent.radian + +this.now.radian;
            }
            return +this.now.radian;
        },
        set: function( value ){
            this.now.radian = +value;
        }
    },
    points : {
        get: function(){
            if(!this.now.points){return}

            if(!this.services.points){this.services.points = [];}

            var radian = this.radian, sin = Math.sin( radian ), cos = Math.cos( radian );

            for( var key = 0;this.now.points[key];key++){
                var coordinate = this.now.points[key];
                this.services.points[key] = [
                    coordinate[0] * cos - coordinate[1] * sin,
                    coordinate[0] * sin + coordinate[1] * cos,
                    coordinate[2]
                ]
            }

            return this.services.points;

        },
        set: function(value){}
    }
});

CanvasObject.prototype.start        = function(){
    this.drawing.stack.append( this );
    return this;
};
CanvasObject.prototype.stop         = function(){
    this.drawing.stack.remove( this.id );
    return this;
};
CanvasObject.prototype.animate      = function(){};
CanvasObject.prototype.transform    = function( transform ){
    if ( !this._transform ) {
        this._transform = new Listing();
    }
    if ( !transform ) {return this._transform;}
    this._transform.append( transform.id, transform );
    this.operationContext = transform;
    return this;
};
CanvasObject.prototype.move         = function( coord, time ){
    if( !time ){
        this.x = coord[0];
        this.y = coord[1];
        return;
    }
    return this.transform(new Transform({
        property: 'trajectory',
        type    : 'line',
        points  : [
            [
                this.x,
                this.y
            ],
            coord
        ],
        time    : time
    }));
};
CanvasObject.prototype.moveProperty   = function( property, value, time ){
    if( !time ){
        this.now[property] = value;
        return;
    }
    return this.transform(new Transform({
        property:property,
        start   : this.now[property],
        end     : value,
        time    : time
    }))
};
CanvasObject.prototype.append   = function( object ){
    return this.childrens.append( object );
};