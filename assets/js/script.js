// Connect Form input
const formInput = document.querySelector('form')
// Connect Connect current weather
const todaysWeather = document.querySelector('#currentWeatherDiv')
// Connect Future Weather
const futureWeather = document.querySelector('#futureForecast')
// Connect API Key
const myKey = '53b685361a5dbcb458e2d4f4d555cafc'
// Connect City Name
const input = document.querySelector('#city') 
//Connect Search List
const list = document.querySelector('ul')
// Clear History Button
const clearHistory = document.querySelector('#clear')
// Submit Button
const submit = document.querySelector('#submit')



// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
//Get Items from localStorage
let cityArray = localStorage.getItem('cities')
  ? JSON.parse(localStorage.getItem('cities'))
  : []
//Save Items to Local Storage
localStorage.setItem('cities', JSON.stringify(cityArray))
const pastCities = JSON.parse(localStorage.getItem('cities'))

//Create List
const listMaker = (text) => {
    const li = document.createElement('li')
    li.textContent = text
    list.appendChild(li)
}

// When the Search button is pressed
submit.addEventListener('click', function (e){
    e.preventDefault()
    getWeather(input.value);
    //Add to local storage
    cityArray.push(input.value)
    localStorage.setItem('cities', JSON.stringify(cityArray))
    listMaker(input.value)
    input.value = ''
 
})
//Fetch API + Convert to JSON
// Convert data from the API into data that can be put on the page
function getWeather (query){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${myKey}`)
    .then(weather => {
        return weather.json();
    })
    .then(function(weather){
        //Send data to display results
        displayResults(weather)
        // send data to display future results
        displayFutureResults(weather)

    })

}

// Insert Data from getWeather function to HTML
function displayResults (weather){
    console.log(weather)
    //city name
    let city = document.querySelector('.location')
    city.innerText = `${weather.name}`
    //city date
    //temperature
    let temp = document.querySelector('.temp')
    temp.innerText = `Tempurature: ${weather.main.temp}°C`
    //humidity
    let humidity = document.querySelector('.humidity')
    humidity.innerText = `Humidity: ${weather.main.humidity}%`
    //winds
    let wind = document.querySelector('.wind')
    wind.innerText = `Wind Speed: ${weather.wind.speed}km/h`
    //icon
    console.log(weather)
    const icon = weather.weather[0].icon
    let locationIcon = document.querySelector('.weather-icon');
    locationIcon.innerHTML =`<img src="https://openweathermap.org/img/w/${icon}.png">`
}
// Use data from getWeather
function displayFutureResults(weather){
    // Get longitude and latitude from getWeather API

    let latitude = weather.coord.lat;
    let longitude = weather.coord.lon;

    //Get next 5 days of weather
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${myKey}`)
    .then(weather => {
        return weather.json();
    })
    //supply next function with weather data
    .then(function(weather){
        loadFutureReasults(weather)
        let UVIndex = weather.current.uvi;
        uvData(UVIndex);
    })
}

function uvData (UVIndex){
    let severity = '';
    if (UVIndex < 2) {
      severity = 'low';
    }else if ((UVIndex >= 2) & (UVIndex < 5)) {
      severity = 'medium';
    }else {
      severity = 'high';
    }
    let UVDiv = document.getElementById('UVIndex');
    UVDiv.innerHTML = `Current UV: ${UVIndex}` 
    UVDiv.classList.add(`${severity}`);

}

//Insert Future Weather Data (next 5 days) into HTML
function loadFutureReasults(weather) {
    // Create divs if none
    if ( $('#forecast').children().length == 0 ){
      for (let i=0; i<5; i++){
        let icon = `https://openweathermap.org/img/w/${weather.daily[i].weather[0].icon}.png`;
        $('#forecast').append(`<div class='dailyForecast box column forecastData' id='forecast${i}'></div>`);
        $(`#forecast${i}`).append(`<image class='forecastIcon column 'id='icon${i}' src='${icon}'></image>`);
        $(`#forecast${i}`).append(`<p class='forecastText column ' id='temp${i}'>Temp: ${weather.daily[i].temp.day}°C</p>`);
        $(`#forecast${i}`).append(`<p class='forecastText column ' id='wind${i}'>Wind: ${weather.daily[i].wind_speed}km/h</p>`);
        $(`#forecast${i}`).append(`<p class='forecastText column ' id='humid${i}'>Humidity: ${weather.daily[i].humidity}%</p>`);
        $(`#forecast${i}`).append(`<p class='forecastText column ' id='uvIndex${i}'>UVI: ${weather.daily[i].uvi}</p>`);
        
        

        //UV Index - color that indicates whether the conditions are favorable, moderate, or severe

      };
    }
    //Rewrite if there are divs
    else {
        for (let i=0; i<5; i++){
          let day = moment().add(i, 'days').format('L');
          let icon = `https://openweathermap.org/img/w/${weather.daily[i].weather[0].icon}.png`;
          document.getElementById(`date${i}`).innerHTML = day;
          document.getElementById(`icon${i}`).src = icon;
          document.getElementById(`temp${i}`).innerHTML = `Temp: ${weather.daily[i].temp.day}`;
          document.getElementById(`wind${i}`).innerHTML = `Wind: ${weather.daily[i].wind_speed}`;
          document.getElementById(`humid${i}`).innerHTML = `Humidity: ${weather.daily[i].humidity}`;
          document.getElementById(`uvIndex${i}`).innerHTML = `UVI: ${weather.daily[i].current.uvi}`
          //UV Index - color that indicates whether the conditions are favorable, moderate, or severe
        }
      }
}

// Create a way for when clicked search that term it searches

// loop through past cities searched + add to list
pastCities.forEach((city)=>{
    listMaker(city)
})

// Clear the past searches
clearHistory.addEventListener('click', function (){
    localStorage.clear()
    while (list.firstChild){
        list.removeChild(list.firstChild)
    }
})


