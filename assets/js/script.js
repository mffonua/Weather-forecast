const timeEl = document.getElementById('time');
const dateEL = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById ('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEL = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//Api Key
const API_KEY = '9f04e9b0a261488afe4fcf44a5e77ce9';
//secondary function
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour%12: hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

timeEl.innerHTML = hoursIn12HrFormat + ':' + minutes + '' + `<span id="am-pm">${ampm}</span>`

dateEL.innerHTML =  days[day] + ', ' + date+ ' ' + months[month]


}, 1000);

//calling api

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let {latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })

    })
}
function showWeatherData (data){
    let{humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    currentWeatherItemsEl.innerHTML =
    `<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
  </div>

  <div class="weather-item">
    <div>Pressure</div>
    <div>${pressure}</div>
  </div>

  <div class="weather-item">
    <div>Wind Speed</div>
    <div>${wind_speed}</div>
  </div>

  <div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div> 
  </div>

  </div> <div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
  </div>
  
  
  `; //utilizing cdnjs

  let otherDayForcast = ''
  data.daily.forEach((day, idx) => {
      if(idx == 0){
          currentTempEl.innerHTML = `
          <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
          <div class="other">
              <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
              <div class="temp">Night - ${day.temp.night}&#176;F</div>
              <div class="temp">Day - ${day.temp.day}&#176;F</div>
          </div>
          
          `
      }else{
          otherDayForcast += `
          <div class="weather-forecast-item">
              <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
              <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
              <div class="temp">Night - ${day.temp.night}&#176;F</div>
              <div class="temp">Day - ${day.temp.day}&#176;F</div>
          </div>
          
          `
      }
  })


  weatherForecastEl.innerHTML = otherDayForcast;
}

