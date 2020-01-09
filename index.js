var currentDay = moment().format('YYYY-MM-DD');
var day1 = moment().add(1, 'day').format('YYYY-MM-DD');
var day2 = moment().add(2, 'day').format('YYYY-MM-DD');
var day3 = moment().add(3, 'day').format('YYYY-MM-DD');
var day4 = moment().add(4, 'day').format('YYYY-MM-DD');
var day5 = moment().add(5, 'day').format('YYYY-MM-DD');
var fiveDayArray = [day1, day2, day3, day4, day5];
var day1Temp, day2Temp, day3Temp, day4Temp, day5Temp;
var day1humid, day2humid, day3humid, day4humid, day5humid;
var day1condition, day2condition, day3condition, day4condition, day5condition;
var tempArray = [];
var humidityArray = [];
var conditionArray = [];
var historyObject = {
    historyArray: [],
};

function generateHistory(){
    for( var i = 0; i < historyObject.historyArray.length; i++){
        var searchHistory = $(`<button class="history" value="x" data-location="${historyObject.historyArray[i]}">${historyObject.historyArray[i]}</button><br>`);
        $("#historyList").append(searchHistory);
    }
};

(function initialize(){
    var cityString = localStorage.getItem("lastCity");
    if(localStorage.getItem("historyObject")){
        historyObject = (JSON.parse(localStorage.getItem("historyObject")));
        generateHistory();
    }
    generateCurrentCard(cityString);
    generate5DayCard(cityString);
})();

$("#submitBtn").on("click", function(event){
    event.preventDefault();
    clearDisplayAndArrays();
    var city = $("#location").val();
    var cityString = city.replace(/\ /g, '+');
    generateCurrentCard(cityString);
    generate5DayCard(cityString);
    for( var i = 0; i < historyObject.historyArray.length; i++){
        if(historyObject.historyArray[i] === city || city === ""){
            return;
        }
    }
    var history = $(`<button class="history" data-location="${city}">${city}</button><br>`);
    $("#historyList").append(history);
    historyObject.historyArray.push(city);
    localStorage.setItem("historyObject", JSON.stringify(historyObject));
    localStorage.setItem("lastCity", cityString);
  });

$("#historyList").on("click", "button", function(event){
    event.preventDefault();
    clearDisplayAndArrays();
    var city = this.dataset.location;
    var cityString = city.replace(/\ /g, '+');
    generateCurrentCard(cityString);
    generate5DayCard(cityString);
    localStorage.setItem("lastCity", cityString);
});

function generateCurrentCard(location){
    $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&mode=JSON&units=imperial&APPID=9c5c1b3cee6e10229e2b0a0786d075e1`,
    method: "GET"
  }).then(function(response) {
      //set API data to an object
      var image = getWeatherImage(response.weather[0].main);
      var currentWeather = {
        City: response.name,
        Temperature: response.main.temp +"°F",
        Description: image,
        High: response.main.temp_max +"°F",
        Low: response.main.temp_min +"°F",
        'Wind Speed': response.wind.speed +"MPH",
        Humidity: response.main.humidity +"%",
      }
      new CurrentWeatherDisplay(currentWeather);
  });
};

function generate5DayCard(location){
    $.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${location}&mode=JSON&units=imperial&appid=9c5c1b3cee6e10229e2b0a0786d075e1`,
    method: "GET"
  }).then(function(response) {
    //set API data to an object
    response.list.forEach( function(e, i){
        var weatherDay = response.list[i].dt_txt.substr(0,10)
        if(day1 === weatherDay){
            var temp = response.list[i].main.temp;
            if (temp > day1Temp || undefined === day1Temp){
                day1Temp = temp
                day1humid = response.list[i].main.humidity;
                day1condition = response.list[i].weather[0].main;                
            } 
        }
        else if(day2 === weatherDay){
            var temp = response.list[i].main.temp;
            if (temp > day2Temp || undefined === day2Temp){
                day2Temp = temp
                day2humid = response.list[i].main.humidity;
                day2condition = response.list[i].weather[0].main;
            }   
        }
        else if(day3 === weatherDay){
            var temp = response.list[i].main.temp;
            if (temp > day3Temp || undefined === day3Temp){
                day3Temp = temp
                day3humid = response.list[i].main.humidity;
                day3condition = response.list[i].weather[0].main;
            }   
        }
        else if(day4 === weatherDay){
            var temp = response.list[i].main.temp;
            if (temp > day4Temp || undefined === day4Temp){
                day4Temp = temp
                day4humid = response.list[i].main.humidity;
                day4condition = response.list[i].weather[0].main;
            }   
        }
        else if(day5 === weatherDay){
            var temp = response.list[i].main.temp;
            if (temp > day5Temp || undefined === day5Temp){
                day5Temp = temp
                day5humid = response.list[i].main.humidity;
                day5condition = response.list[i].weather[0].main;
            }   
        }
    })
    tempArray.push(day1Temp, day2Temp, day3Temp, day4Temp, day5Temp);
    humidityArray.push(day1humid, day2humid, day3humid, day4humid, day5humid);
    conditionArray.push(day1condition, day2condition, day3condition, day4condition, day5condition);
    for( i=0; i<tempArray.length; i++){
        var image = getWeatherImage(i);
        var forecast = $(`<div class="forecast">
            <div>${fiveDayArray[i]}</div>
            <div>${image}</div>
            <div>High: ${tempArray[i]}°F</div>
            <div>Humidity: ${humidityArray[i]}%</div>
        </div>`);
        $("#forecastDisplay").append(forecast);
    }
  });
};

//Constructor function
function CurrentWeatherDisplay(obj){
    //Removes any existing #current
    $("#current").remove();
    //Creates div#current
    var main = $(`<div id="current">`);
    main.append(`<p>${currentDay}</p>`);
    //Cycles through obj passed in as function
    for (const key in obj) {
        //Creates new <p> with obj key and value
        var k= $(`<p>${[key]}: ${obj[key]}</p>`);
        main.append(k)
    }
    $("#mainDisplay").append(main);
};

function clearDisplayAndArrays(){
    $("#forecastDisplay").empty();
    $("#mainDisplay").empty();
    tempArray = [];
    humidityArray = [];
    conditionArray = [];
}

function getWeatherImage(i){
    if((conditionArray[i] || i) === "Clouds"){
        return `<i class="fas fa-cloud-sun"></i>`;
    }
    else if((conditionArray[i] || i) === "Clear"){
        return `<i class="fas fa-sun"></i>`;
    }
    else if((conditionArray[i] || i) === "Rain"){
        return `<i class="fas fa-cloud-rain"></i>`;
    }
    else if((conditionArray[i] || i) === "Snow"){
        return `<i class="far fa-snowflake"></i>`;
    }
    else {
        return i;
    }
};