// storing the api key
const apiKey = "&appid=e07139e518a6bb618b7831a40e2be519";

// setting the value of the user input to city
var city = $("#searchTerm").val();

// taking in current day
var date = new Date(),
  d = date.getDate(),
  m = date.getMonth(),
  y = date.getFullYear();

for (i = 0; i < 5; i++) {
  var curdate = new Date(y, m, d + i);
}

// setting a keypress function to the searchTerm input
$("#searchTerm").keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $("#searchBtn").click();
  }
});

// setting an onClick function to the searchBtn and running the getCurrentWeather, getForecast,
// and the createList functions when the button is clicked
$("#searchBtn").on("click", function () {
  $("#five-day-forecast").addClass("show");

  city = $("#searchTerm").val();

  // clears the input field
  $("#searchTerm").val("");

  const queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    var tempFaren = (response.main.temp - 273.15) * 1.8 + 32;

    getCurrentWeather(response);
    getForecast(response);
    createList();
  });
});

// Creating a function to designate a list with the name of the city that has been searched for
function createList() {
  var listItem = $("<li>").addClass("list-group-item").text(city);

  // appends list content
  $(".list").append(listItem);
}

// getCurrentWeather function takes in response and appends the current days weather to the
// currentCity div
function getCurrentWeather(response) {
  var tempFaren = (response.main.temp - 273.15) * 1.8 + 32;
  tempFaren = Math.floor(tempFaren);

  // empties currentCity div
  $("#currentCity").empty();

  // creates card div
  const card = $("<div>").addClass("card");

  // creates cardBody div
  const cardBody = $("<div>").addClass("card-body");

  // creates card title
  const city = $("<h4>").addClass("card-title").text(response.name);

  // creates card title containing the date
  const cityDate = $("<h4>")
    .addClass("card-title")
    .text(date.toLocaleDateString("en-US"));

  // creates card text containing the temperature
  const temperature = $("<p>")
    .addClass("card-text")
    .text("Temperature: " + tempFaren + " °F");

  // creates card text containing the humidity
  const humidity = $("<p>")
    .addClass("card-text")
    .text("Humidity: " + response.main.humidity + "%");

  // creates card text containing wind speed
  const wind = $("<p>")
    .addClass("card-text")
    .text("Wind Speed: " + response.wind.speed + " MPH");

  // retrieves weather outlook image
  const logoImg = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
  );

  // append content to the page
  city.append(cityDate, logoImg);
  cardBody.append(city, temperature, humidity, wind);
  card.append(cardBody);
  $("#currentCity").append(card);
}

// getForecast function gets the 5 day forecast data and appends it as cards to the
// forecast div
function getForecast() {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET",
  }).then(function (response) {
    // empties forecast div
    $("#forecast").empty();

    var results = response.list;

    for (var i = 0; i < results.length; i++) {
      var day = Number(results[i].dt_txt.split("-")[2].split(" ")[0]);
      var hour = results[i].dt_txt.split("-")[2].split(" ")[1];
      if (results[i].dt_txt.indexOf("12:00:00") !== -1) {
        // sets temp equal to the degrees in farenheit
        var temp = (results[i].main.temp - 273.15) * 1.8 + 32;

        // sets tempFaren to the degrees in farenheit, rounded down
        var tempFaren = Math.floor(temp);

        // creates card div
        const card = $("<div>").addClass(
          "card col-md-2 ml-4 bg-dark text-white"
        );

        // creates cardBody div
        const cardBody = $("<div>").addClass("card-body p-3");

        // creates card title with current day of each five day card
        const cityDate = $("<h4>")
          .addClass("card-title")
          .text(curdate.toLocaleDateString("en-US"));

        // creates card text containing the temperature
        const temperature = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + tempFaren + " °F");

        // creates card text of humidity
        const humidity = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + results[i].main.humidity + "%");

        // retrieves weather outlook image for each day
        const logoImg = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/w/" +
            results[i].weather[0].icon +
            ".png"
        );

        // appends all variables to the cardbody
        cardBody.append(cityDate, logoImg, temperature, humidity);
        // appends the cardBody to the card
        card.append(cardBody);
        // appends card content to forecast div
        $("#forecast").append(card);
      }
    }
  });
}
