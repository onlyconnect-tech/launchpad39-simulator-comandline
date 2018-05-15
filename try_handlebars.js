'use strict';

const handlebars = require('handlebars');
const fs = require('fs');
const Promise = require('bluebird');

var templateFile = './templates/telemetry.hbs';

var data = {
    angle: 123,
    lat: 456,
    lon: 789,
    groundspeed: 120
};

function readFile(fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, 'utf-8', function(error, source){
           if(error) {
               return reject(error);
           }

           resolve(source);
        });

    });

}

/*

fs.readFile('./templates/telemetry.hbs', 'utf-8', function(error, source){
  
  var template = handlebars.compile(source);
  var telemetry_data = template(data);
  console.log(telemetry_data);
});

*/

readFile(templateFile).then(function resolve(source) {
    var template = handlebars.compile(source);
    var telemetry_data = template(data);
    console.log(telemetry_data);
}, function reject(error) {
    console.error('ERR:', error);
});