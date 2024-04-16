import React, { useState } from 'react';
import './index.css';

function App() {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [, setError] = useState('');


  const apiKey = 'b760fd0ab7ff647159c9893f2a5791c7';
  const getWeather = async () => {
    if (!city) {
      alert('Please enter a city');
      return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    try {
      const currentWeatherResponse = await fetch(currentWeatherUrl);

      if (!currentWeatherResponse.ok) {
        const errorMessage = await currentWeatherResponse.json();
        setError(errorMessage.message);
        console.error('Error fetching current weather data:', errorMessage.message);
        alert('Error fetching current weather data for unrecognized city name. Please try again.');
        return;
      }

      const currentWeatherData = await currentWeatherResponse.json();

      setCurrentWeather(currentWeatherData);
    } catch (error) {
      console.error('Error fetching current weather data:', error);
      alert('Error fetching current weather data. Please try again.');
    }

    try {
      const forecastResponse = await fetch(forecastUrl);

      if (!forecastResponse.ok) {
        const errorMessage = await forecastResponse.json();
        setError(errorMessage.message);
        console.error('Error fetching current weather forecast data:', errorMessage.message);
        alert('Error fetching current weather forecast data. Please try again.');
        return;
      }

      const forecastData = await forecastResponse.json();
      setHourlyForecast(forecastData.list.slice(0, 8));
    } catch (error) {
      console.error('Error fetching hourly forecast data:', error);
      alert('Error fetching hourly forecast data. Please try again.');
    }
  };

  return (
    <div id="weather-container">
      <h2>Weather App</h2>
      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
      <button onClick={getWeather}>Search</button>
      {currentWeather && (
        <>
          <img id="weather-icon" src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`} alt="Weather Icon" />
          <div id="temp-div">
            <p>{Math.round(currentWeather.main.temp - 273.15)}°C</p>
          </div>
          <div id="weather-info">
            <p>{currentWeather.name}</p>
            <p>{currentWeather.weather[0].description}</p>
          </div>
        </>
      )}
      <div id="hourly-forecast">
        {hourlyForecast.map((item, index) => (
          <div className="hourly-item" key={index}>
            <span>{new Date(item.dt * 1000).getHours()}:00</span>
            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Hourly Weather Icon" />
            <span>{Math.round(item.main.temp - 273.15)}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;