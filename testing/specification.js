describe('Расчёт сплайна', function () {
    var points = [
        [0,0],
        [75,30],
        [40,68,true],
        [150,70,true]
    ];
    describe('Высокое сглаживание, шаг 0.001%', function () {
        var step = 0.001;
        var services = {};

        it('Создание карты сплайна', function () {
            services.map   = formula.getMapOfSpline(points,step);
        });

        services.length = 0;
        for(var key in services.map){
            services.length += services.map[key];
        }

        it('Прогон для проверки на ошибки', function () {
            for(var i = 0;i <= 100;i += step){
                formula.getPointOnSpline(i,points,services);
            }
        });
    });
});

mocha.run();