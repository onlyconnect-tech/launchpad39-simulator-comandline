'use strict';

const geolib = require('geolib');

class MovimentSimulator {

    /**
     * 
     * @param {number} groundspeed - Groundspeed, expressed in KM/H 
     */

    constructor(groundspeed) {
        this.groundspeed = groundspeed;
        this.timer = null;
    }

    timeToArrive( distance, groundspedMetersAtSecomd){
        return distance/groundspedMetersAtSecomd;
    }

    pythagorean(sideA, sideB){
        return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
    }

    /**
     * 
     * @param {*} Point 
     * @param {*} Target 
     * @param {function} callback 
     */
    doMoviment(Point, Target, callback) {

        var distance = geolib.getDistance(
            {latitude: Point.X, longitude: Point.Y },
            {latitude: Target.X, longitude: Target.Y }
        );

        var varX = Target.X - Point.X;
        var varY = Target.Y - Point.Y;
        var distance2 = this.pythagorean(varX, varY);

        console.log('DISTANCE:', distance / 1000, 'KM', '---> DISTANCE2:' + distance2);

        var groundspedMetersAtSecomd = (1000 * this.groundspeed) /(60*60);

        console.log('', this.groundspeed, 'KM/H -->', groundspedMetersAtSecomd, 'Metri/sec');

        var secondsToArrive = this.timeToArrive(distance, groundspedMetersAtSecomd);

        console.log('secondsToArrive:', secondsToArrive, '- hours:', secondsToArrive/60/60);

        var Angle = Math.atan2(Target.Y - Point.Y, Target.X - Point.X);

        console.log('Angle:', Angle);

        console.log('OLD_VALUE:', groundspedMetersAtSecomd * 5 /1000);
        console.log('NEW VALUE:', 1/(secondsToArrive * 5));

        // var Per_Frame_Distance = 2;
        var Per_Frame_Distance = (distance2 / secondsToArrive ) * 5;
        
        console.log('Per_Frame_Distance:', Per_Frame_Distance);

        var Sin = Math.sin(Angle) * Per_Frame_Distance;
        var Cos = Math.cos(Angle) * Per_Frame_Distance;

        function mov() {

           Point = { X: Point.X + Cos, Y: Point.Y + Sin };

           callback(Angle, Point, this.groundspeed);
        }

        this.timer = setInterval(mov.bind(this), 5000);

    }

    stopMoviment() {
        if(this.timer) {
            clearInterval(this.timer);
        }
    }

}

module.exports = MovimentSimulator;
