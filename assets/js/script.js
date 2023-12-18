function buildURL() {
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
function createData(weatherData) {
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
        results.windSpeed = windSpeed;

        date.push(weatherData.list[i].dt_txt);
        results.date = date;

    }

    // store in Local Storage
    localStorage.setItem(results.cityName, JSON.stringify(results));
    return results;
}

// display data on page
function display(results) {
    let today = dayjs();

    let name = $("<h2>").text(results.cityName);
    let date = $("<h4>").text(today.$d)

    $("#today").append(name).append(date);
    let resDate = [];
    //console.log(name);

    for (let i = 0; i < results.date.length - 1; i++) {
        resDate[i] = dayjs(results.date[i], "DD-MM-YYYY");
    }
    for (let i = 0; i < results.date.length - 1; i++) {
        if (resDate[i].$D == today.$D) {
            console.log(resDate[i].$D, today.$D);
            displayToday(results, i)
        } else {
            //console.log(resDate[i].$D, today.$D);
            displayFiveDay(results.date[i], resDate[i], results.weather[i], results.humidity[i], results.temperature[i]);
        }
    }


};

function displayToday(results, i) {
  // Weather icon
  let weather = $("<h4>").text(results.weather[i]);
  $("#today").append(weather);

  //Temperature
  let temp = $("<h4>").text(results.temperature[i]);
  $("#today").append(temp);

  //Humidity
  let hum = $("<h4>").text(results.humidity[i]);
  $("#today").append(hum);

  //Humidity
  let wind = $("<h4>").text(results.WindSpeed[i]);
  $("#today").append(wind);
};

function displayFiveDay(res, resDate, weather, humid, temp) {
  // display date
  let date = $("<h5>").text(res);
  //console.log(date, resDate);
  $("#forecast").append(date);
  //add class, id and data-attr

  // display icon
  let weath = $("<h5>").text("Weather: " + weather);
  $("#forecast").append(weath);
  //add class, id and data-attr

  // display temperature
  let temperature = $("<h5>").text("Temp: " + temp.toFixed(2));
  $("#forecast").append(temperature);
  //add class, id and data-attr

  // display humidity
  let hum = $("<h5>").text("Humidity: " + humid);
  $("#forecast").append(hum);
  //add class, id and data-attr
};

// Button

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

            display(results);
        });
});
