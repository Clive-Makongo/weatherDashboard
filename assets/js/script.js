function buildURL () {
    var city = $("#search-input").val();
    let APIKey = "9d0504afbf151af426c93ee392251718";

    // Build URL
    let queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      APIKey;

    console.log(queryURL);
    console.log($("#search-input").val());  

    return queryURL;

}

// Create object with data
function createData (weatherData) {
    console.log(weatherData);
    let results = {};
    date = [];
    let temp = [];
    let weather = [];
    let humidity = [];
    let windSpeed = [];
    for (let i = 0; i < weatherData.list.length - 1; i++) {

        results.cityName = weatherData.city.name;

        weather.push(weatherData.list[i].weather[0].main);
        results.weather = weather;

        temp.push((weatherData.list[i].main.temp) - 273.15);
        results.temperature = temp;

        humidity.push(weatherData.list[i].main.humidity)
        results.humidity = humidity;

        windSpeed.push(weatherData.list[i].wind.speed);
        results.windSpeed =  windSpeed;


        date.push(weatherData.list[i].dt_txt);
        results.date = date;
        
    }
    

    return results;
}

// display data on page
function displayToday(results) {
    let today = dayjs();

    let name = $("<h2>").text(results.cityName);
    let date = $("<h4>").text(today.$d)
    
    $("#today").append(name).append(date);
    let resDate = [];
    console.log(today.$D,name);
    
    for (let i = 0; i < results.date.length; i++) {
        resDate[i] = dayjs(results.date[i], "DD-MM-YYYY");

        if (resDate[i].$D == today.$D) {
            console.log(i,resDate[i],today)
        }
    }
    
};

function displayFiveDay(results) {

}

$("#search-button").on("click", function (event) {
    event.preventDefault();
    
    let queryURL = buildURL();
    console.log(queryURL)
    
    //fetch API object
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let results = createData(data);
            console.log(results);

            displayToday(results)
        });
});
