const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const checkWeather = require('./../../middleware/check-weather');

const request = require('request');
const Weather = require('../../models/weather'); 


let apiKey = '628cc485d3afa160b51dcf472327d0a7';
let city = 'Hong Kong';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

router.get('/', (req, res, next) => {
    request(url, function(err, response, body){
        // if openweathermap api throws an error
        if(err) {
            Weather.checkWeather().findOne().sort('-created_at')
            .exec()
            .then(docs => {
                let weatherText = `It is ${docs.temp} degrees in ${docs.name}!`
                res.render('index', {weather: weatherText, error: null});
            })
            .catch(err => {
                let error = `err`
                res.render('index', {weather: null, error: error});
            });
        } else {
            let weatherData = JSON.parse(body);
            Weather.findOne()
            .exec()
            .then(docs => {
                if(docs == null) {
                    const weather = new Weather({
                        _id: new mongoose.Types.ObjectId(),
                        temp: weatherData.main.temp,
                        name: weatherData.name
                    });
                    weather.save()
                    .then(result => {
                        if(result) {
                            const token = jwt.sign({
                                _id: weather._id,
                                temp: weather.temp,
                                name: weather.name
                            }, 'secret', { expiresIn: "1h"});
                            let weatherText = `It is ${docs.temp} degrees in ${docs.name}!`
                            res.render('index', {weather: weatherText, error: null});
                        }
                    })
                    .catch(err => {
                        let error = `err`
                        res.render('index', {weather: null, error: error});
                    });
                } else {
                    const id = docs._id;
                    Weather.updateOne({ _id: id }, { $set: { temp: weatherData.main.temp, name: weatherData.name }})
                    .exec()
                    .then(result => {
                        let weatherText = `It is ${weatherData.main.temp} degrees in ${weatherData.name}!`
                        res.render('index', {weather: weatherText, error: null});
                    })
                    .catch(err => {
                        let error = `err`
                        res.render('index', {weather: null, error: error});
                    });
                }
            });
        }
    });
});

module.exports = router;



