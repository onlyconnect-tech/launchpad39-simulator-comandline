'use strict';

const Drone = require('./lib/drone');

var argv = require('yargs')
    .usage('Usage: $0 --queue [string] --start [num, num] --end [num, num] --groundspeed [num]')
    .option('queue', {
        alias: 'q',
        type: 'string',
        desc: 'publishing queue'
    }).option('start', {
        alias: 's',
        type: 'array',
        desc: 'start coords'
    }).option('end', {
        alias: 'e',
        type: 'array',
        desc: 'ends coords'
    }).option('groundspeed', {
        alias: 'g',
        type: 'number',
        desc: 'groundspeed Km/h'
    }).demandOption(['queue', 
     'start', 'groundspeed']).help().argv;

console.log('Starting drone on queue:', argv.queue);
console.log('from:', argv.start);
console.log('groundspeed:', argv.groundspeed);

var Point = {X: argv.start[0], Y: argv.start[1] };
const drone = new Drone(argv.queue, Point, argv.groundspeed );

if(argv.end) {
    console.log('to:', argv.end);
    var Target = {X:  argv.end[0], Y: argv.end[1] };
    drone.goto(Target);
}


