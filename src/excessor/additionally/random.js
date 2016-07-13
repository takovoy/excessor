/**
 * Created by takovoySuper on 11.04.2015.
 */

function random (min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRGB (min,max){
    return 'rgb(' + random(min,max) + ',' + random(min,max) + ',' + random(min,max) + ')'
}