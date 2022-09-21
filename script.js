"use strict";

const apiKey = "b21d6f8a5c1de655793f2864c38dadbf";

const errorLabel = document.querySelector(".error-search");
const btnSearch = document.querySelector(".search-btn");
const inputSearch = document.querySelector(".search-input");
const cityDisplay = document.querySelector(".city");
const countryDisplay = document.querySelector(".country");
const timeDisplay = document.querySelector(".actual-time");
const dateGeneral = document.querySelector(".month-year");
const dateDetailed = document.querySelector(".full-date");
const actualTemp = document.querySelector(".temp");
const weatherDescription = document.querySelector(".weather-description");
const weatherIcon = document.querySelector(".weather-icon");
const sunriseTime = document.querySelector(".sunrise-time");
const sunsetTime = document.querySelector(".sunset-time");
const windSpeed = document.querySelector(".wind-speed");
const pressure = document.querySelector(".pressure");
const humidity = document.querySelector(".humidity");
const rainProbability = document.querySelector(".rain-chance");

const title1day = document.querySelector(".title1day");
const icon1day = document.querySelector(".icon1day");
const temp1day = document.querySelector(".temp1day");
const title2day = document.querySelector(".title2day");
const icon2day = document.querySelector(".icon2day");
const temp2day = document.querySelector(".temp2day");
const title3day = document.querySelector(".title3day");
const icon3day = document.querySelector(".icon3day");
const temp3day = document.querySelector(".temp3day");
const sunriseWhen = document.querySelector(".sunrise-time-when");
const sunsetWhen = document.querySelector(".sunset-time-when");

const btnLocate = document.querySelector(".btn-locate");
const appContainer = document.querySelector(".container");
const startContainer = document.querySelector(".start");
const iconNavigation = document.querySelector(".icon-navigation");
const iconNavigationMap = document.querySelector(".icon-navigation-map");

const navLinks = document.querySelectorAll(".nav-link");
const navDashboard = document.querySelector(".nav-dashboard");
const navMap = document.querySelector(".nav-map");

const countryDisplayMap = document.querySelector(".country-map");
const timeDisplayMap = document.querySelector(".actual-time-map");
const cityDisplayMap = document.querySelector(".city-map");
const dateGeneralMap = document.querySelector(".month-year-map");
const dateDetailedMap = document.querySelector(".full-date-map");

const bars = document.querySelector(".fa-bars");
const barsMap = document.querySelector(".icon-bars-map");
const iconClose = document.querySelector(".close-icon");
const appContainerLeft = document.querySelector(".container-left");

let myChart = null;
let timer;

bars.addEventListener("click", (e) => {
    e.preventDefault();
    appContainerLeft.classList.add("bars-clicked");
});

barsMap.addEventListener("click", (e) => {
    e.preventDefault();
    appContainerLeft.classList.add("bars-clicked");
});

iconClose.addEventListener("click", (e) => {
    e.preventDefault();
    appContainerLeft.classList.remove("bars-clicked");
});

// prettier-ignore
const days = ["Sunday", "Monday", "Tuesday", 'Wednesday','Thursday','Friday','Saturday'];
// prettier-ignore
const months = ["January",'February','March','April','May','June','July','August','September','October','November','December'];

const getLocationByCoords = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            if (!pos) return;
            appContainer.style.display = "grid";
            startContainer.style.display = "none";
            inputSearch.value = "";
            getDataBycoords(pos);
        },
        () => alert(`Can't get location`)
    );
};

const getData = (e) => {
    e.preventDefault();
    if (e.type === "click") {
        getLocation(inputSearch.value);
    }
    inputSearch.value = "";
};

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const actualDisplay = (response) => {
    errorLabel.classList.remove("active");
    cityDisplay.textContent = `${response.city.name}`;
    cityDisplayMap.textContent = `${response.city.name}`;
    countryDisplay.innerHTML = regionNames.of(`${response.city.country}`);
    countryDisplayMap.innerHTML = regionNames.of(`${response.city.country}`);
    timeDisplay.innerHTML = `${calcTime(response.city.timezone)}`;
    timeDisplayMap.innerHTML = `${calcTime(response.city.timezone)}`;
    dateGeneral.innerHTML = `${calcGeneralDate(response.city.timezone)}`;
    dateGeneralMap.innerHTML = `${calcGeneralDate(response.city.timezone)}`;
    dateDetailed.innerHTML = `${calcDetailedDate(response.city.timezone)}`;
    dateDetailedMap.innerHTML = `${calcDetailedDate(response.city.timezone)}`;
    actualTemp.innerHTML = `${calcTemp(response.list[0].main.temp)}° C`;
    weatherDescription.innerHTML = `${response.list[0].weather[0].main}`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`;
    sunriseTime.innerHTML = `${calcSunTime(
        response.city.sunrise,
        response.city.timezone
    )}`;
    sunsetTime.innerHTML = `${calcSunTime(
        response.city.sunset,
        response.city.timezone
    )}`;
    windSpeed.innerHTML = `${response.list[0].wind.speed} km/h`;
    pressure.innerHTML = `${response.list[0].main.pressure}hpa`;
    humidity.innerHTML = `${Math.round(response.list[0].main.humidity)}%`;
    rainProbability.innerHTML = `${Math.round(response.list[0].pop * 100)}%`;
    title1day.innerHTML = `${calcNext1Day(response.city.timezone)}`;
    title2day.innerHTML = `${calcNext2Day(response.city.timezone)}`;
    title3day.innerHTML = `${calcNext3Day(response.city.timezone)}`;
    temp1day.innerHTML = `${selectTemp1Day(
        response,
        response.city.timezone
    )}° C`;
    temp2day.innerHTML = `${selectTemp2Day(
        response,
        response.city.timezone
    )}° C`;
    temp3day.innerHTML = `${selectTemp3Day(
        response,
        response.city.timezone
    )}° C`;
    icon1day.src = `http://openweathermap.org/img/wn/${selectIcon1Day(
        response,
        response.city.timezone
    )}@2x.png`;
    icon2day.src = `http://openweathermap.org/img/wn/${selectIcon2Day(
        response,
        response.city.timezone
    )}@2x.png`;
    icon3day.src = `http://openweathermap.org/img/wn/${selectIcon3Day(
        response,
        response.city.timezone
    )}@2x.png`;
    sunriseWhen.innerHTML = `${calcSunriseTime(
        response,
        response.city.sunrise
    )} `;
    sunsetWhen.innerHTML = `${calcSunriseTime(
        response,
        response.city.sunset
    )} `;
    chartCreate(response);
    getMap(response);
};

let map;

const newFeature = () => {
    console.log("Welcome to application");
};

newFeature();

const getMap = (response) => {
    const { lat, lon } = response.city.coord;
    if (map != null) {
        map.remove();
    }

    map = L.map("map").setView([lat, lon], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
};

const chartCreate = (response) => {
    const dataArray = response.list.filter(
        (day) =>
            new Date(day.dt_txt).getHours() === 9 ||
            new Date(day.dt_txt).getHours() === 21
    );
    const tempArray = dataArray.map((data) => calcTemp(data.main.temp));
    const timeArray = dataArray.map((data) => {
        const timestamp = new Date(data.dt_txt);
        const labelText = `${String(timestamp.getDate()).padStart(
            2,
            0
        )}.${String(timestamp.getMonth() + 1).padStart(2, 0)}, ${String(
            timestamp.getHours()
        ).padStart(2, 0)}:${String(timestamp.getMinutes()).padStart(2, 0)}`;
        return labelText;
    });

    const dataChart = {
        labels: timeArray,
        datasets: [
            {
                label: "Weather in next days",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: tempArray,
            },
        ],
    };
    const config = {
        type: "line",
        data: dataChart,
        options: {},
    };
    const ctx = document.getElementById("temp-graph").getContext("2d");
    if (myChart != null) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, config);
};

const displayData = (response) => {
    if (response.cod === "400" || response.cod === "404")
        errorLabel.classList.add("active");
    if (response.cod === "200") {
        actualDisplay(response);
        clearInterval(timer);
        timer = setInterval(() => {
            actualDisplay(response);
        }, 1000 * 60);
    }
};

const calcDate = (timezone) => {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const cityTimezone = timezone * 1000;
    const actualCityTime = new Date(
        date.getTime() + timezoneOffset + cityTimezone
    );
    return actualCityTime;
};

const calcTime = (timezone) => {
    const actualCityTime = calcDate(timezone);
    const hour = actualCityTime.getHours();
    const minutes = actualCityTime.getMinutes();
    const dateFormat = `${String(hour > 12 ? hour % 12 : hour).padStart(
        2,
        0
    )}:${String(minutes).padStart(2, 0)} ${hour > 12 ? "PM" : "AM"}`;
    return dateFormat;
};

const calcGeneralDate = (timezone) => {
    const actualCityTime = calcDate(timezone);
    const monthIndex = actualCityTime.getMonth();
    const actualYear = actualCityTime.getFullYear();
    const dateFormat = `${months[monthIndex]} ${actualYear}`;
    return dateFormat;
};

const calcDetailedDate = (timezone) => {
    const actualCityTime = calcDate(timezone);
    const dayIndex = actualCityTime.getDay();
    const monthIndex = actualCityTime.getMonth();
    const day = actualCityTime.getDate();
    const actualYear = actualCityTime.getFullYear();
    const dateFormat = `${days[dayIndex]}, ${months[monthIndex].slice(
        0,
        3
    )} ${day}, ${actualYear}`;
    return dateFormat;
};

const calcSunTime = (sunRiseSet, timezone) => {
    const date = new Date(sunRiseSet * 1000);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const cityTimezone = timezone * 1000;
    const sunTime = new Date(date.getTime() + timezoneOffset + cityTimezone);
    const hour = sunTime.getHours();
    const minutes = sunTime.getMinutes();
    return `${String(hour > 12 ? hour % 12 : hour).padStart(2, 0)}:${String(
        minutes
    ).padStart(2, 0)} ${hour > 12 ? "PM" : "AM"}`;
};

const calcTemp = (temp) => {
    return Math.round(temp - 273);
};

const calcNext1Day = (timezone) => {
    const actualCityTime = calcDate(timezone);
    const actualDateInxed = actualCityTime.getDay();
    const nextDayIndex = actualDateInxed === 6 ? 0 : actualDateInxed + 1;
    const nextDayFormat = days[nextDayIndex].slice(0, 3);
    return nextDayFormat;
};

const calcNext2Day = (timezone) => {
    const actualCityTime = calcDate(timezone);
    const actualDateInxed = actualCityTime.getDay();
    const nextDayIndex = actualDateInxed === 6 ? 1 : actualDateInxed + 2;
    const nextDayFormat = days[nextDayIndex].slice(0, 3);
    return nextDayFormat;
};

const calcNext3Day = (timezone) => {
    const actualCityTime = calcDate(timezone);
    const actualDateInxed = actualCityTime.getDay();
    const nextDayIndex = actualDateInxed === 6 ? 2 : actualDateInxed + 3;
    const nextDayFormat = days[nextDayIndex].slice(0, 3);
    return nextDayFormat;
};

const selectTemp1Day = (response, timezone) => {
    const actualCityTime = calcDate(timezone);
    const currentDay = actualCityTime.getDate();
    const nextDay = response.list
        .filter((day) => new Date(day.dt_txt).getHours() === 15)
        .filter((day) => new Date(day.dt_txt).getDate() === currentDay + 1);
    return calcTemp(nextDay[0].main.temp);
};

const selectTemp2Day = (response, timezone) => {
    const actualCityTime = calcDate(timezone);
    const currentDay = actualCityTime.getDate();
    const nextDay = response.list
        .filter((day) => new Date(day.dt_txt).getHours() === 15)
        .filter((day) => new Date(day.dt_txt).getDate() === currentDay + 2);
    return calcTemp(nextDay[0].main.temp);
};

const selectTemp3Day = (response, timezone) => {
    const actualCityTime = calcDate(timezone);
    const currentDay = actualCityTime.getDate();
    const nextDay = response.list
        .filter((day) => new Date(day.dt_txt).getHours() === 15)
        .filter((day) => new Date(day.dt_txt).getDate() === currentDay + 3);
    return calcTemp(nextDay[0].main.temp);
};

const selectIcon1Day = (response, timezone) => {
    const actualCityTime = calcDate(timezone);
    const currentDay = actualCityTime.getDate();
    const nextDay = response.list
        .filter((day) => new Date(day.dt_txt).getHours() === 15)
        .filter((day) => new Date(day.dt_txt).getDate() === currentDay + 1);
    return `${nextDay[0].weather[0].icon.slice(0, 2)}d`;
};

const selectIcon2Day = (response, timezone) => {
    const actualCityTime = calcDate(timezone);
    const currentDay = actualCityTime.getDate();
    const nextDay = response.list
        .filter((day) => new Date(day.dt_txt).getHours() === 15)
        .filter((day) => new Date(day.dt_txt).getDate() === currentDay + 2);

    return `${nextDay[0].weather[0].icon.slice(0, 2)}d`;
};

const selectIcon3Day = (response, timezone) => {
    const actualCityTime = calcDate(timezone);
    const currentDay = actualCityTime.getDate();
    const nextDay = response.list
        .filter((day) => new Date(day.dt_txt).getHours() === 15)
        .filter((day) => new Date(day.dt_txt).getDate() === currentDay + 3);

    return `${nextDay[0].weather[0].icon.slice(0, 2)}d`;
};

const calcSunriseTime = (response, sunriseTime) => {
    const actualCityTime = calcDate(response.city.timezone);
    const date = new Date(sunriseTime * 1000);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const cityTimezone = response.city.timezone * 1000;
    const sunTime = new Date(date.getTime() + timezoneOffset + cityTimezone);
    const dataText =
        actualCityTime > sunTime
            ? `${actualCityTime.getHours() - sunTime.getHours()} hours ago`
            : `in ${sunTime.getHours() - actualCityTime.getHours()} hours`;
    return dataText;
};

const getLocation = () => {
    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${inputSearch.value}&appid=${apiKey}`
    )
        .then((res) => {
            return res.json();
        })
        .then(displayData);
};

const getDataBycoords = (pos) => {
    const { latitude, longitude } = pos.coords;
    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude.toFixed(
            2
        )}&lon=${longitude.toFixed(2)}&appid=${apiKey}`
    )
        .then((res) => {
            return res.json();
        })
        .then(displayData);
};

btnSearch.addEventListener("click", getData);
btnLocate.addEventListener("click", getLocationByCoords);
iconNavigation.addEventListener("click", getLocationByCoords);
iconNavigationMap.addEventListener("click", getLocationByCoords);

const removeActiveClass = () => {
    navLinks.forEach((navLink) => navLink.classList.remove("active"));
};
navLinks.forEach((navLink) => {
    navLink.addEventListener("click", () => {
        removeActiveClass();
        navLink.classList.add("active");
        if (navDashboard.classList.contains("active")) {
            appContainer.classList.remove("active");
        } else {
            appContainer.classList.add("active");
        }
        appContainerLeft.classList.remove("bars-clicked");
    });
});
