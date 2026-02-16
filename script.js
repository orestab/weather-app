const API_KEY = '09cbd2760ad70348329d04f780532223';

const appContainerId = document.getElementById("app-container-id");
const mainInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const mainTemp = document.getElementById("main-temp");
const mainDesc = document.getElementById("main-desc");
const mainIcon = document.getElementById("main-icon");
const mainHumidity = document.getElementById("main-humidity");
const mainWind = document.getElementById("main-wind");
const feelsLike = document.getElementById("feels-like");
const currentDate = document.getElementById("current-date");


//input
let city = '';

searchBtn.addEventListener("click", () => {
    if (mainInput.value != "") {
      appContainerId.classList.remove("app-container-none")
      city = mainInput.value
      weatherNow();
      weatherForecast()
      mainInput.value = "";
  } else {
  }
});

mainInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});
//data
const now = new Date();
const options = { weekday: 'long', day: 'numeric', month: 'long' };
currentDate.innerHTML = now.toLocaleDateString('uk-UA', options);

// api основного елемента погоди
async function weatherNow() {
    try {
        const weather = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=uk`
        )
            .then(response => response.json())
            .then(json => {
                //картинка погоди
                let iconCode = json.weather[0].icon;
                if (iconCode === "01n") {
                    iconCode = "01d";
                }
                const iconLink = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

                //зміна HTML
                cityName.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);;
                mainTemp.innerHTML = Math.round(json.main.temp);
                mainDesc.innerHTML = json.weather[0].description;
                mainIcon.src = iconLink;
                mainHumidity.innerHTML = json.main.humidity;
                mainWind.innerHTML = json.wind.speed;
                feelsLike.innerHTML = Math.round(json.main.feels_like);
            });
    } catch (error) {
        appContainerId.classList.add("app-container-none")
        alert("city name entered incorrectly")
    }
}

// api погоди на наступні дні
async function weatherForecast() {
    try {
        const forecast = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=uk`
        )
            .then(response => response.json())
            .then(json => {
                const today = new Date().toISOString().split('T')[0];

                const nextFiveDays = json.list.filter(item => {
                const [date, time] = item.dt_txt.split(' ');
                return date !== today && time === "12:00:00";
                });
                
                const forecastCards = document.querySelectorAll('.f-card');

                nextFiveDays.forEach((day, index) => {
                if (forecastCards[index]) {
                    const temp = Math.round(day.main.temp);
                    const iconCode = day.weather[0].icon;
                    const date = new Date(day.dt * 1000);
                    const dayName = date.toLocaleDateString('uk-UA', { weekday: 'short' });
                    const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                    forecastCards[index].innerHTML = `
                        <span class="f-day">${formattedDay}</span>
                        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon" />
                        <span class="f-temp">${temp}°</span>
                    `;
                }
            });

            });
    } catch (error) {
    }
}
