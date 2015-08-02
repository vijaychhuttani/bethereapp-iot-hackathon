/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
Node.js application for connecting the Intel Edison Arduino to IBM Bluemix.
Sends data from an analog sensor on analog pin zero.
Requires registration on Bluemix. Edit the following to your Bluemix registration values:
ORG
TYPE
ID
AUTHTOKEN
*/
var ORG = 'pezfza';
var TYPE = 'edison-air';
var ID = '784b87a2fa38'; // deviceid - macId of wifi module of edison, get it from ifconfig.
var AUTHTOKEN = '5DP1F3QfX85kQXK1S+';

var groveSensor = require('jsupm_grove');
var sensorModule = require('jsupm_ldt0028');
var mqtt = require('mqtt');

// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(0);
// Create the vibration sensor object using AIO pin 1
var vibration = new sensorModule.LDT0028(1);

//Variables to calculate Heart Rate
//var heartRate = 0;
//var threshold = 1015;
//var oldvalue = 0;
//var newvalue = 0;
//var oldmillis = 0;
//var newmillis = 0;
//var cnt = 0;
//var timings = [];

var PROTOCOL = 'mqtt';
var BROKER = ORG + '.messaging.internetofthings.ibmcloud.com';
var PORT = 1883;

//Create the url string
var URL = PROTOCOL + '://' + BROKER;
URL += ':' + PORT;
//URL is e.g. 'mqtt://xrxlila.messaging.internetofthings.ibmcloud.com:1883'

var CLIENTID = 'd:' + ORG;
CLIENTID += ':' + TYPE;
CLIENTID += ':' + ID;
//CLIENTID -s e.g. d:xrxila:edison-air:784b87a801e9

var AUTHMETHOD = 'use-token-auth';

var client = mqtt.connect(URL, { clientId: CLIENTID, username: AUTHMETHOD, password: AUTHTOKEN });

var TOPIC = 'iot-2/evt/status/fmt/json';
console.log(TOPIC);


client.on('connect', function () {
    setInterval(function () {
        //var hr = getHeartRate();
        //var vi = getVibration();
        //console.log("Temperature" + getTemperature() + "Vibration" + vi);
        client.publish(TOPIC, '{"d":{"Temperature":' + getTemperature() + ',"Vibration":' + getVibration() + '}}');//Payload is JSON
    }, 500);
});

//function to get value form temperature sensor
var getTemperature = function () {
    var celsius = temp.value();
    //    var fahrenheit = celsius * 9.0/5.0 + 32.0;
    //    console.log(celsius + " degrees Celsius, or " +
    //    Math.round(fahrenheit) + " degrees Fahrenheit");
    return celsius;
};

//function to get value form temperature sensor
var getVibration = function () {
    var vib = vibration.getSample();
    console.log(vib);
    return vib;
};

//function delay(milliseconds) {
//    var startTime = Date.now();
//    while (Date.now() - startTime < milliseconds);
//}

//Here is the code with which we tried to get heart rate using piezoelectric vibration sensor
/*var getHeartRate = function () {

    oldvalue = newvalue;
    newvalue = 0;
    for (var j = 0; j < 64; j++) { // Average over 16 measurements
        newvalue += vibration.getSample();
    }
    newvalue = newvalue / 64;
    // find triggering edge
    console.log("Old Value: " + oldvalue + ", New Value: " + newvalue);
    if (oldvalue < threshold && newvalue >= threshold) {
        console.log("inside if");
        oldmillis = newmillis;
        newmillis = millis();
        // fill in the current time difference in ringbuffer
        timings[cnt % 16] = newmillis - oldmillis;
        var totalmillis = 0;
        // calculate average of the last 16 time differences
        for (var i = 0; i < 16; i++) {
            totalmillis += timings[i];
        }
        // calculate heart rate
        heartRate = 60000 / (totalmillis / 16);

        cnt++;
    }
    return heartRate;
};*/

//var millis = function () {
//    var date = new Date();
//    return date.getMilliseconds;
//};
