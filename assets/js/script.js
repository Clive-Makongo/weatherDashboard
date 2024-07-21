// Count for five day
let count = 0;

function buildURL() {
    let city = $("#search-input").val();
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

// Clear data every search
function clear() {
    $("#city").empty();
    $("#today").empty();
    $("#day-one").empty();
    $("#day-two").empty();
    $("#day-three").empty();
    $("#day-four").empty();
    $("#day-five").empty();
}

// Create object with data
function createData(weatherData) {
    console.log(weatherData);
    let results = {};
    let date = [];
    let temp = [];
    let weather = [];
    let humidity = [];
    let windSpeed = [];
    for (let i = 0; i < weatherData.list.length; i++) {
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
    // Set count for 5 day back to 0
    count = 0;

    let today = dayjs();

    let name = $("<h2>").text(results.cityName)
        .css({
        "text-decoration": "underline",
        "font-weight":"900"
});
    let date = $("<h4>").text(today.format('dddd, MMMM D, YYYY'));

    $("#city").append(name).append(date);

    let resDate = [];

    for (let i = 0; i < results.date.length; i++) {
        resDate[i] = dayjs(results.date[i], "YYYY-MM-DD HH:mm:ss");
    }
    for (let i = 0; i < results.date.length; i++) {
        if (resDate[i].$D == today.$D) {
            console.log(resDate[i].$D, today.$D, " How Many");

            console.log("I: ", i)
            if (i % 2 != 0) {
            displayToday(results, i)}
        } else {
            displayFiveDay(
                results.date[i],
                results.weather[i],
                results.humidity[i],
                results.temperature[i],
                resDate[i], i
            );
        }
    }
}

function displayToday(results, i) {
    //Make hourly div
    let hour = $("<div>").addClass("hour" + i).addClass("col-lg-3").addClass("today-box");

    // Format the date
    let formattedDate = dayjs(results.date[i]).format('HH:mm:ss');

    // Weather icon
    let date = $("<h4>").text(formattedDate);
    hour.append(date);

    // Weather icon
    let weather = $("<h4>").text("Weather: " + results.weather[i]);
    hour.append(weather);

    //Temperature
    let temp = $("<h4>").text(
        "Temperature: " + results.temperature[i].toFixed(2)
    );
    hour.append(temp);

    //Humidity
    let hum = $("<h4>").text("Humidity: " + results.humidity[i]);
    hour.append(hum);

    //Wind Speed
    let wind = $("<h4>").text("Wind Speed: " + results.windSpeed[i]);
    hour.append(wind);

    //Append to Today div
    $("#today").append(hour);

    // Apply CSS changes with jQuery
    hour.css({
        "background-color": "#f0f8ff",
        "border-radius": "8px",
        "padding": "15px",
        "margin-bottom": "10px",
        "height": "15%"
    });
}

function displayFiveDay(res, weather, humid, temp, resDate, i) {
    // Increment Count for Five Day
    count++;
    //Make hourly div
    let hour = $("<div>")
        .addClass("hour" + i)
        .addClass("col day-box")
        .attr("data-day", resDate.format('D'))
        .css("border", "black solid 0.2px");

    // Format the date
    let formattedDate = resDate.format('dddd, MMMM D, YYYY HH:mm:ss');

    // display date
    let date = $("<h3>").text(formattedDate).css({
        "font-size": "24px",
        "font-weight": "bold",
        "color": "#333",
        "margin-bottom": "5%px",
        "text-decoration": "underline"
    });;
    hour.append(date);

    // Display weather with different fonts
    let weath = $("<h5>").html('Weather: <span class="weather-data">' + weather + '</span>');
    hour.append(weath);

    // Display temperature with different fonts
    let temperature = $("<h5>").html('Temp: <span class="temperature-data">' + temp.toFixed(2) + '°C</span>');
    hour.append(temperature);

    // Display humidity with different fonts
    let hum = $("<h5>").html('Humidity: <span class="humidity-data">' + humid + '%</span>');
    hour.append(hum);


    if (count <= 8) {
        $("#day-one").append(hour);
    } else if (count > 8 && count <= 16) {
        $("#day-two").append(hour);
    } else if (count > 16 && count <= 24) {
        $("#day-three").append(hour);
    } else if (count > 24 && count <= 32) {
        $("#day-four").append(hour);
    } else {
        $("#day-five").append(hour);
    }

    // Apply CSS changes with jQuery
    hour.css({
        "background-color": "#f0f8ff",
        "border-radius": "8px",
        "padding": "15px",
        "margin-bottom": "10px",
        "height": "15%"
    });
}

// display button per search
function makeButton(results) {

    let city = results.cityName;
    let aside = $("#aside");

    // Make Button
    let btn = $("<button>")
        .text(city)
        .addClass("prev-city-button")
        .addClass("col-lg-12 col-sm-12")
        .attr("data-city", city)
        .css("display", "flex");

    // Append Button
    aside.append(btn);

    btn.css({
        "color": "black"
    });

    // Check for old buttons on new searches and remove
    let oldButtons = $(".prev-city-button");
    console.log(oldButtons, oldButtons.length);
    for (let i = 0; i < oldButtons.length - 1; i++) {
        if (oldButtons[i].innerText === city) {
            oldButtons[i].remove();
        }
    }
}

$("#search-button").on("click", function (event) {
    event.preventDefault();

    clear();

    let queryURL = buildURL();
    console.log(queryURL);

    //fetch API object
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let results = createData(data);
            console.log(results);
            makeButton(results);
            display(results);
        });
});

// Search with city buttons
$(document).on("click", ".prev-city-button", function (event) {
    // Set count back to 0
    count = 0;

    clear();

    let city = $(this).text();

    let stored = localStorage.getItem(city);
    let data = JSON.parse(stored)
    console.log(city);

    display(data);
});
