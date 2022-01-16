// Connect Form input
const formInput = document.querySelector('form')
// Connect Connect current weather
const todaysWeather = document.querySelector('#currentWeatherDiv')
// Connect Future Weather
const futureWeather = document.querySelector('#futureWeatherDiv')
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
    .then(displayResults);
}
// Insert Data to HTML
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
    humidity.innerText = `Humidity: ${weather.main.humidity}`
    //winds
    let wind = document.querySelector('.wind')
    wind.innerText = `Wind Speed: ${weather.wind.speed}km/h`
    //icon
    console.log(weather)
    const icon = weather.weather[0].icon
    let locationIcon = document.querySelector('.weather-icon');
    locationIcon.innerHTML =`<img src="https://openweathermap.org/img/w/${icon}.png">`
    //UV Index    
}

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

// Fetch API for future weather

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// To-Do:
// Create logic to = certain colors to = certain numbers


// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// To-Do:
// Convert Future weather condition data to be able to put on page 
// Icon - Temp - Humidity - Wind Speed - UV Index


// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// To-Do:
// Create a way for when clicked search that term

