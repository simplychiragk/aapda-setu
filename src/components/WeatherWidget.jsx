import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import alertService from '../services/alertService';

const WeatherWidget = ({ location = { lat: 28.7041, lon: 77.1025, name: "Delhi" } }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const data = await alertService.getWeatherData(location.lat, location.lon);
        setWeather(data);
      } catch (error) {
        console.error('Weather fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, [location]);

  if (loading) {
    return (
      <div className="glass dark:glass-dark rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 skeleton dark:skeleton-dark"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded skeleton dark:skeleton-dark"></div>
      </div>
    );
  }

  if (!weather) return null;

  const getWeatherIcon = (main) => {
    switch (main?.toLowerCase()) {
      case 'clear': return '☀️';
      case 'clouds': return '☁️';
      case 'rain': return '🌧️';
      case 'thunderstorm': return '⛈️';
      case 'snow': return '❄️';
      case 'mist': case 'fog': return '🌫️';
      default: return '🌤️';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass dark:glass-dark rounded-2xl p-6 text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📍 {location.name}</h3>
        <span className="text-sm opacity-75">Live Weather</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-4xl">{getWeatherIcon(weather.current.weather[0].main)}</span>
          <div>
            <div className="text-3xl font-bold">{weather.current.temp}°C</div>
            <div className="text-sm opacity-75 capitalize">{weather.current.weather[0].description}</div>
          </div>
        </div>
        
        <div className="text-right text-sm space-y-1">
          <div>Feels like {weather.current.feels_like}°C</div>
          <div>💨 {weather.current.wind_speed} km/h</div>
          <div>💧 {weather.current.humidity}%</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex justify-between text-xs">
          {weather.daily.slice(0, 4).map((day, index) => (
            <div key={index} className="text-center">
              <div className="opacity-75">
                {index === 0 ? 'Today' : new Date(day.dt).toLocaleDateString('en', { weekday: 'short' })}
              </div>
              <div className="text-lg my-1">{getWeatherIcon(day.weather[0].main)}</div>
              <div className="font-semibold">{day.temp.max}°</div>
              <div className="opacity-75">{day.temp.min}°</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;