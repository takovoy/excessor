
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

describe('Конвертация SVG', function () {
    describe('Служебные функции', function () {
        describe('Обработка данных пути. По умолчанию начальная точка [0,0]', function () {
            it('Переместить курсор "M100,50"', function () {
                var result = excessor.SVGParser.services.pathDataCorrelation.v('M100,50',[],[0,0]);
                console.log('Переместить курсор "M100,50"',result);
                assert.isNotNaN(result);
            });
            it('Линия "L100,50"', function () {
                var result = excessor.SVGParser.services.pathDataCorrelation.l('L100,50',[],[0,0]);
                console.log('Линия "L100,50"',result);
                assert.isNotNaN(result);
            });
            it('Горизонтальная линия "H100"', function () {
                var result = excessor.SVGParser.services.pathDataCorrelation.h('H100',[],[0,0]);
                console.log('Горизонтальная линия "H100"',result);
                assert.isNotNaN(result);
            });
            it('Вертикальная линия "V100"', function () {
                var result = excessor.SVGParser.services.pathDataCorrelation.v('V100',[],[0,0]);
                console.log('Вертикальная линия "V100"',result);
                assert.isNotNaN(result);
            });
            it('Квадратичные кривые "Q100,50,0,0"', function () {
                var result = excessor.SVGParser.services.pathDataCorrelation.q('Q100,50,0,0',[],[0,0]);
                console.log('Квадратичные кривые "Q100,50,0,0"',result);
                assert.isNotNaN(result);
            });
            it('Кубические кривые "C100,50,0,0,1,180"', function () {
                var result = excessor.SVGParser.services.pathDataCorrelation.c('C100,50,0,0,1,180',[],[0,0]);
                console.log('Кубические кривые "C100,50,0,0,1,180"',result);
                assert.isNotNaN(result);
            });
            it('Эллиптические дуги "A100,50,0,0,1,180,0"', function () {
                var arc = 'A100,50,0,0,1,180,0'.match(excessor.SVGParser.services.regexp.realNumbers);
                for(var i = 0;arc[i];i++){
                    arc[i] = +arc[i];
                }
                var arcFirstPoint = [0,0];
                var arcLastPoint = [arc[5],arc[6]];
                var tilt = Math.PI/180*arc[2];
                var derivative = [];
                assert.deepEqual(arc,[100,50,0,0,1,180,0]);
                derivative[0] = Math.cos(tilt)*((arcFirstPoint[0] - arcLastPoint[0])/2) + Math.sin(tilt)*((arcFirstPoint[1] - arcLastPoint[1])/2);
                derivative[1] = -Math.sin(tilt)*((arcFirstPoint[0] - arcLastPoint[0])/2) + Math.cos(tilt)*((arcFirstPoint[1] - arcLastPoint[1])/2);
                assert.isNotNaN(derivative[0]);
                assert.isNotNaN(derivative[1]);
                var derivativeOfCenter = [];
                var coefficient = Math.sqrt(
                    (
                        Math.pow(arc[0],2)*Math.pow(arc[1],2) -
                        Math.pow(arc[0],2)*Math.pow(derivative[1],2) -
                        Math.pow(arc[1],2)*Math.pow(derivative[0],2)
                    ) / (
                        Math.pow(arc[0],2)*Math.pow(derivative[1],2) +
                        Math.pow(arc[1],2)*Math.pow(derivative[0],2)
                    )
                );
                if(arc[3] === arc[4]){
                    coefficient = -coefficient;
                }
                assert.isNotNaN(coefficient);
                derivativeOfCenter[0] = coefficient * ((arc[0]*derivative[1])/arc[1]);
                derivativeOfCenter[1] = coefficient * -((arc[1]*derivative[0])/arc[0]);
                assert.isNotNaN(derivativeOfCenter[0]);
                assert.isNotNaN(derivativeOfCenter[1]);
                var center = [];
                center[0] = Math.cos(tilt)*derivativeOfCenter[0] - Math.sin(tilt)*derivativeOfCenter[1] + ((arcFirstPoint[0] + arcLastPoint[0])/2);
                center[1] = Math.sin(tilt)*derivativeOfCenter[0] + Math.cos(tilt)*derivativeOfCenter[1] + ((arcFirstPoint[1] + arcLastPoint[1])/2);
                assert.isNotNaN(center[0]);
                assert.isNotNaN(center[1]);

                var startRadian = formula.getAngleOfVector(arcFirstPoint,center) + tilt;
                var endRadian   = formula.getAngleOfVector(arcLastPoint,center) + tilt;
                if(!!arc[4]){
                    endRadian = 2*Math.PI + endRadian;
                }
                assert.isNotNaN(startRadian);
                assert.isNotNaN(endRadian);

                var result = excessor.SVGParser.services.pathDataCorrelation.a('A100,50,0,0,1,180,0',[],[0,0]);
                console.log('Эллиптические дуги "A100,50,0,0,1,180,0"',result);
                assert.deepEqual(result[0],[100,50,startRadian,endRadian,0]);
            });
            it('Полный путь "M100,100C100,50 0,0 1,180 100,50 0,0 100,0A100,50 0 0 1 180,0M100,100Q100,50 0,0"', function () {
                var result = excessor.SVGParser.services.attrCorrelation.d.init('M100,100C100,50 0,0 1,180 100,50 0,0 100,0A100,50 0 0 1 180,0M100,100Q100,50 0,0');
                console.log('Полный путь "M100,100C100,50 0,0 1,180 100,50 0,0 100,0A100,50 0 0 1 180,0M100,100Q100,50 0,0"',result);
                assert.isNotNaN(result);
            });
        });
        describe('Обработка атрибута points', function () {
            it('Ломаная линия "350,75  379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161"', function () {
                var result = excessor.SVGParser.services.attrCorrelation.points.init('350,75  379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161');
                console.log('Ломаная линия "350,75  379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161"',result);
                assert.isNotNaN(result);
            });
            it('Полигон (закрытая ломаная линия) "350,75  379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161"', function () {
                var result = excessor.SVGParser.services.attrCorrelation.points.init('350,75  379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161',true);
                console.log('Полигон (закрытая ломаная линия) "350,75  379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161"',result);
                assert.isNotNaN(result);
            });
        });
        describe('Обработка атрибута stroke-dasharray', function () {
            it('Массив (не поддерживает проценты) "350,75  379"', function () {
                var result = excessor.SVGParser.services.attrCorrelation['stroke-dasharray'].init('350,75  379');
                console.log('Массив (не поддерживает проценты) "350,75  379"',result);
                assert.isNotNaN(result);
            });
        });
    });
});

mocha.run();