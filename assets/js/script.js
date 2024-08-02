$(document).ready(function () {
    let count = 0;

    function buildURL() {
        let city = $("#search-input").val();
        let APIKey = "9d0504afbf151af426c93ee392251718";

        // Build URL
        let queryURL =
            "https://api.openweathermap.org/data/2.5/forecast?q=" +
            city +
            "&appid=" + APIKey;

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
        let icon = [];

        for (let i = 0; i < weatherData.list.length; i++) {
            let time = weatherData.list[i].dt_txt.split(" ")[1];
            if (time === "12:00:00") {
                results.cityName = weatherData.city.name;

                weather.push(weatherData.list[i].weather[0].main);
                results.weather = weather;

                temp.push((weatherData.list[i].main.temp) - 273.15);
                results.temperature = temp;

                humidity.push(weatherData.list[i].main.humidity);
                results.humidity = humidity;

                windSpeed.push(weatherData.list[i].wind.speed);
                results.windSpeed = windSpeed;

                date.push(weatherData.list[i].dt_txt);
                results.date = date;

                icon.push(weatherData.list[i].weather[0].icon);
                results.icon = icon;
            }
        }

        // Store in Local Storage
        localStorage.setItem(results.cityName, JSON.stringify(results));

        console.log("Results: ", results);

        return results;
    }

    // Display data on page
    function display(results) {
        // Set count for 5 day back to 0
        count = 0;

        let today = dayjs();

        let name = $("<h2>").text(results.cityName)
            .css({
                "text-decoration": "underline",
                "font-weight": "900"
            });
        let date = $("<h4>").text(today.format('dddd, MMMM D, YYYY'));

        $("#city").append(name).append(date);

        displayToday(
            results.date[0],
            results.weather[0],
            results.humidity[0],
            results.temperature[0],
            results.windSpeed[0],
            results.icon[0]
        );

        for (let i = 0; i < results.date.length; i++) {
            displayFiveDay(
                results.date[i],
                results.weather[i],
                results.humidity[i],
                results.temperature[i],
                results.icon[i],
                i
            );
        }
    }

    function displayToday(date, weather, humid, temp, windSpeed, icon) {
        let today = dayjs(date);

        // Create today section
        let todaySection = $("<div>").addClass("today-section col-12");

        // Format the date
        let formattedDate = today.format('dddd, MMMM D, YYYY HH:mm:ss');

        // Display date
        let dateElem = $("<h3>").text(formattedDate).css({
            "font-size": "24px",
            "font-weight": "bold",
            "color": "#333",
            "margin-bottom": "5%px",
            "text-decoration": "underline"
        });
        todaySection.append(dateElem);

        // Icon
        let img = $("<img>");
        let iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        $(img).attr('src', iconurl);
        todaySection.append(img);

        // Display weather with different fonts
        let weath = $("<h5>").html('Weather: <span class="weather-data">' + weather + '</span>');
        todaySection.append(weath);

        // Display temperature with different fonts
        let temperature = $("<h5>").html('Temp: <span class="temperature-data">' + temp.toFixed(2) + '°C</span>');
        todaySection.append(temperature);

        // Display humidity with different fonts
        let hum = $("<h5>").html('Humidity: <span class="humidity-data">' + humid + '%</span>');
        todaySection.append(hum);

        // Display wind speed with different fonts
        let wind = $("<h5>").html('Wind Speed: <span class="wind-speed-data">' + windSpeed + ' m/s</span>');
        todaySection.append(wind);

        // Append the today section to the #today div
        $("#today").append(todaySection);

        // Apply CSS changes with jQuery
        todaySection.css({
            "background-color": "#f0f8ff",
            "border-radius": "8px",
            "padding": "15px",
            "margin-bottom": "10px",
            "height": "15%"
        });
    }

    function displayFiveDay(date, weather, humid, temp, icon, i) {
        // Increment count for Five Day
        count++;

        let resDate = dayjs(date);
        let daySectionId = `day-${count}`;
        let daySection = $(`#${daySectionId}`);

        // Create hourly div
        let hour = $("<div>")
            .addClass("hour" + i)
            .addClass("col day-box");

        // Format the date
        let formattedDate = resDate.format('dddd, MMMM D, YYYY HH:mm:ss');

        // Display date
        let dateElem = $("<h3>").text(formattedDate).css({
            "font-size": "24px",
            "font-weight": "bold",
            "color": "#333",
            "margin-bottom": "5%px",
            "text-decoration": "underline"
        });
        hour.append(dateElem);

        // Icon
        let img = $("<img>");
        let iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        $(img).attr('src', iconurl);
        hour.append(img);

        // Display weather with different fonts
        let weath = $("<h5>").html('Weather: <span class="weather-data">' + weather + '</span>');
        hour.append(weath);

        // Display temperature with different fonts
        let temperature = $("<h5>").html('Temp: <span class="temperature-data">' + temp.toFixed(2) + '°C</span>');
        hour.append(temperature);

        // Display humidity with different fonts
        let hum = $("<h5>").html('Humidity: <span class="humidity-data">' + humid + '%</span>');
        hour.append(hum);

        // Append the hour to the correct day section
        daySection.append(hour);

        // Apply CSS changes with jQuery
        hour.css({
            "background-color": "#f0f8ff",
            "border-radius": "8px",
            "padding": "15px",
            "margin-bottom": "10px",
            "height": "15%"
        });
    }

    // Display button per search
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

        // Fetch API object
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
        let data = JSON.parse(stored);
        console.log(city);

        display(data);
    });
});
