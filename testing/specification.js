describe('Расчёт сплайна', function () {
    var points = [
        [0,0],
        [75,30],
        [40,68,true],
        [150,70,true]
    ];
    var step = 0.001;
    describe('Высокое сглаживание, шаг ' + step + '%', function () {
        var services = {};

        it('Создание карты сплайна', function () {
            services.map = formula.getMapOfSpline(points,step);
        });

        it('Прогон для проверки на ошибки', function () {
            services.map = formula.getMapOfSpline(points,step);
            services.length = 0;

            for(var key in services.map){
                services.length += services.map[key];
            }

            console.log('services: ',services);

            for(var i = 0;i <= 100;i += step){
                formula.getPointOnSpline(i,points,services);
            }
        });
    });
});

describe('Валидация цвета', function () {

    describe('HEX', function () {
        it('isHEXColor #000000', function () {
            assert(isHEXColor('#000000'));
        });

        it('isHEXColor #12345f', function () {
            assert(isHEXColor('#12345f'));
        });

        it('isHEXColor #fff', function () {
            assert(isHEXColor('#fff'));
        });

        it('isNotHEXColor fff000', function () {
            assert(!isHEXColor('fff000'));
        });
    });

    describe('RGB', function () {
        it('isRGB rgb( 0, 0, 0)', function () {
            assert(isRGB('rgb( 0, 0, 0)'));
            assert(isRGB('rgb(0, 0, 0)'));
            assert(isRGB('rgb( 0,0, 0)'));
            assert(isRGB('rgb( 0, 0,0)'));
            assert(isRGB('rgb(0, 0,0)'));
            assert(isRGB('rgb( 0,0,0)'));
        });

        it('isRGB rgb(120,30,2)', function () {
            assert(isRGB('rgb(120,30,2)'));
        });

        it('isNotRGB rgb(120.5,30.7,2.3)', function () {
            assert(!isRGB('rgb(120.5,30.7,2.3)'));
        });

        it('isNotRGB rgb(120,30,n?)', function () {
            assert(!isRGB('rgb(120,30,2,1)'));
            assert(!isRGB('rgb(120,30)'));
        });
    });


    describe('RGBA', function () {
        it('isRGBA rgba( 0, 0, 0, 1)', function () {
            assert(isRGBA('rgba( 0, 0, 0, 1)'));
            assert(isRGBA('rgba(0, 0, 0, 1)'));
            assert(isRGBA('rgba( 0,0, 0, 1)'));
            assert(isRGBA('rgba( 0, 0,0, 1)'));
            assert(isRGBA('rgba(0, 0,0, 1)'));
            assert(isRGBA('rgba( 0,0,0, 1)'));
        });

        it('isRGBA rgba(120,30,2,1)', function () {
            assert(isRGBA('rgba(120,30,2,1)'));
        });

        it('isNotRGBA rgba(120.5,30.7,2.3)', function () {
            assert(!isRGBA('rgb(120.5,30.7,2.3, 1)'));
        });

        it('isNotRGBA rgba(120,30,n?, 1)', function () {
            assert(!isRGBA('rgba(120,30,2,1,1)'));
            assert(!isRGBA('rgba(120,30,1)'));
        });

    });
});

mocha.run();