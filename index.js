const time = document.getElementById('time');
const date = document.getElementById('date');
const containerWeatherItem = document.getElementById('extra-info');
const timezone = document.getElementById('time-zone');
const country = document.getElementById('country');
const weatherForecast = document.getElementById('weather-forecast');
const temp = document.getElementById("temp");

let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let apiKey = '0fe7a5775c0e15946515b48ef81f0490'

setInterval(() => {
    let currentTime = new Date();
    let currentMonth = currentTime.getMonth();
    let todayDate = currentTime.getDate();
    let todayDay = currentTime.getDay();
    let hours = currentTime.getHours();

    let hoursIn12hrs = "";

    if (hours >= 13) {
        hoursIn12hrs = hours % 12;
    }
    else {
        hoursIn12hrs = hours;
    }
    let min = currentTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'Am';


    time.innerHTML = (hoursIn12hrs <10?'0'+hoursIn12hrs:hoursIn12hrs) + ":" + (min<10? '0'+min:min) + " " + `<span id="t-zone">${ampm}</span>`

    date.innerHTML = days[todayDay] + ', ' + todayDate + ' ' + months[currentMonth];
}, 1000);



getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        // console.log(success)


        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${apiKey}`).then(res => res.json()).then(data => {

            // console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;


    containerWeatherItem.innerHTML =`<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    `
    let otherDay=""

    data.daily.forEach((day, ind)=>{
        if(ind==0){
            temp.innerHTML =
            `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="icon">
            <div class="f-other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night -${day.temp.night},&#176 C</div>
                <div class="temp">Day - ${day.temp.day},&#176 C</div>

            </div>
            `
        }
        else{
            otherDay +=`
            <div class="weather-details">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="icon">
                <div class="temp">Night - ${day.temp.night}&#176 C</div>
                <div class="temp">Day -${day.temp.day},&#176 C</div>
            </div>
            `
        }
    })


    weatherForecast.innerHTML = otherDay;

}