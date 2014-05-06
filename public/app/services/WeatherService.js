'use strict';

angular.module('KinoaApp')
    .factory('WeatherService', function ($http) {
        return {
            getWeather: function (city, callback) {
                var weather = { temp: {}, clouds: null };
                $http.jsonp('http://api.openweathermap.org/data/2.5/weather?q=' + city + ',fr&units=metric&callback=JSON_CALLBACK').success(function (data) {
                    if (data) {
                        if (data.main) {
                            weather.temp.current = data.main.temp;
                            weather.temp.min = data.main.temp_min;
                            weather.temp.max = data.main.temp_max;
                        }
                        weather.clouds = data.clouds ? data.clouds.all : undefined;
                        callback(weather);
                    }
                });

            }
        };
    });