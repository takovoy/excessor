/**
 * Created by takovoy on 11.01.2015.
 */

var hat = new CanvasObject('paperHat',canvas);
(function(){
    var hatContour = new QuadraticCurve(
        [
            [120,90],
            [170,95],
            [170,100],
            [165,105],
            [120,94],
            [70,85],
            [70,83],
            [72,80,true]
        ],
        'hatContour',
        canvas,
        {moveTo: [70,80]}
    );
    hat.appendChild(hatContour);
})();