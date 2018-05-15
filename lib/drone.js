'use strict';

const awsIot = require('aws-iot-device-sdk');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const MovimentSimulator = require('./moviment');

const FILE_NAME_TEMPLATE = path.join(__dirname, './../templates/telemetry.hbs');
   
/**
 * read file
 * 
 * @param {string} fileName - path file
 * @return {Promise} 
 */

function readTemplate(fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, 'utf-8', function(error, source){
           if(error) {
               return reject(error);
           }

           return resolve(source);
        });

    });

}

class Drone {

  constructor(queueName, startPosition, groundspeed) {
    this.queueName = queueName;
    this.lastPosition = startPosition;
    this.moviment = new MovimentSimulator(groundspeed);
    this.device = awsIot.device({
              keyPath: path.join(__dirname,'/../certs/e60ff46edb-private.pem.key'),
              certPath: path.join(__dirname, '/../certs/e60ff46edb-certificate.pem.crt'),
              caPath: path.join(__dirname, 
                '/../certs/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem.txt'),
              clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
              region: 'eu-west-1'
          });

    this.filePromise = readTemplate(FILE_NAME_TEMPLATE);
    this.filePromise.catch(function (error) {
      console.log('CATCH:', error.message);
      return error;
    });

    var self = this;
    this.device.on('connect', function() {
      console.log('connect');
      self.device.subscribe(self.queueName + '/commands');
    });

    this.device.on('message', function(topic, payload) {
      console.log('**** message', topic, payload.toString());

      var commandObj = JSON.parse(payload.toString());

      if(commandObj.method === 'goto') {

        console.log('***', topic, commandObj);

        // if not drone simulator ---> start the drono
        // get the coordinates--> send the coord in response on telemetry

        // else
        // get the drone and modify 

        // get last coordinates by queueName

        let gotoLat = commandObj.params.lat;
        let gotoLon = commandObj.params.lon;

        self.goto({X: gotoLat, Y: gotoLon });
      }
    });
  }

  /**
   * 
   * @param {number} X - latitudo 
   * @param {number} Y - longitudo
   * @param {number} angle - angle orientation vehicle 
   * @param {number} groundspeed - groundspeed vehicle
   * 
   * @return {Promise} 
   */
  createMessage(X, Y, angle, groundspeed){

    var data = {
      angle: angle,
      lat: X,
      lon: Y,
      groundspeed: groundspeed
    };

    return this.filePromise.then(function resolve(source) {
          console.log('SOURCE:', source);
          var template = handlebars.compile(source);
          var telemetry_data = template(data);
          return telemetry_data;
      }, function reject(error) {
          console.log('ERROR333:', error.message);
          return error.message;
      });

  }
  goto(endPosition) {

      this.moviment.stopMoviment();

      var self = this;

      function callback(angle, point, groundspeed) {

          console.log('--> NEW: ', point.X, point.Y, '- ANGLE:', angle, '- GROUNDSPEED:', groundspeed);
          this.lastPosition = point;
          var msgPromise = this.createMessage(point.X, point.Y, angle, groundspeed);

          msgPromise.then(function resolve(msg) {
            console.log('<---- ', msg);
            self.device.publish(self.queueName + '/telemetry', msg);
            console.log('AFTER PUBLISH: ' + new Date());
          }, function reject(error) {
            console.log('LAST REJECT:')
            self.device.publish(self.queueName + '/telemetry', { error: error.message });
          });
          
      }
       
      this.moviment.doMoviment(this.lastPosition, endPosition, callback.bind(this)); 
  }

}


module.exports = Drone;