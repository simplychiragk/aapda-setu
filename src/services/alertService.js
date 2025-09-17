// Mock Alert Service - Self-contained demo data
class AlertService {
  constructor() {
    this.alerts = [];
    this.lastFetch = null;
    this.isLoading = false;
  }

  async fetchAlerts() {
    if (this.isLoading) return this.alerts;
    
    this.isLoading = true;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    try {
      // Generate dynamic mock alerts with some randomization
      const baseAlerts = [
        {
          id: 'alert_001',
          title: 'Severe Cyclonic Storm Warning - Odisha Coast',
          description: 'A severe cyclonic storm is approaching the Odisha coast. Wind speeds expected to reach 120-130 kmph. Residents advised to move to safer locations.',
          severity: 'Severe',
          urgency: 'Immediate',
          certainty: 'Observed',
          area: 'Odisha, West Bengal',
          coordinates: [[20.9517, 85.0985], [22.9868, 87.8550]],
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          category: 'Cyclone',
          color: '#dc2626'
        },
        {
          id: 'alert_002',
          title: 'Heavy Rainfall Warning - Mumbai Metropolitan Region',
          description: 'Heavy to very heavy rainfall expected in Mumbai and surrounding areas. Waterlogging likely in low-lying areas. Avoid unnecessary travel.',
          severity: 'Moderate',
          urgency: 'Expected',
          certainty: 'Likely',
          area: 'Mumbai, Thane, Navi Mumbai',
          coordinates: [[19.0760, 72.8777], [19.2183, 72.9781]],
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          category: 'Flood',
          color: '#f59e0b'
        },
        {
          id: 'alert_003',
          title: 'Heat Wave Warning - Rajasthan',
          description: 'Severe heat wave conditions prevailing over Rajasthan. Temperature may reach 47-48°C. Stay hydrated and avoid outdoor activities.',
          severity: 'Severe',
          urgency: 'Expected',
          certainty: 'Likely',
          area: 'Jaipur, Jodhpur, Bikaner',
          coordinates: [[26.9124, 75.7873], [26.2389, 73.0243]],
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          category: 'Heatwave',
          color: '#dc2626'
        },
        {
          id: 'alert_004',
          title: 'Earthquake Advisory - Delhi NCR',
          description: 'Minor earthquake tremors felt in Delhi NCR region. Magnitude 4.2. No immediate threat, but residents advised to stay alert.',
          severity: 'Minor',
          urgency: 'Past',
          certainty: 'Observed',
          area: 'Delhi, Gurgaon, Noida',
          coordinates: [[28.7041, 77.1025], [28.4595, 77.0266]],
          effective: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expires: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          category: 'Earthquake',
          color: '#10b981'
        },
        {
          id: 'alert_005',
          title: 'Thunderstorm Alert - Bangalore',
          description: 'Thunderstorm with lightning and gusty winds expected. Wind speeds up to 60 kmph. Secure loose objects.',
          severity: 'Moderate',
          urgency: 'Expected',
          certainty: 'Likely',
          area: 'Bangalore, Mysore',
          coordinates: [[12.9716, 77.5946], [12.2958, 76.6394]],
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
          category: 'Thunderstorm',
          color: '#f59e0b'
        }
      ];

      // Add some randomization to make it feel more dynamic
      const activeAlerts = baseAlerts.filter(() => Math.random() > 0.2); // Sometimes hide some alerts
      
      this.alerts = activeAlerts;
      this.lastFetch = new Date();
      return this.alerts;
    } catch (error) {
      console.error('Error generating mock alerts:', error);
      return this.alerts;
    } finally {
      this.isLoading = false;
    }
  }

  async getWeatherData(lat, lon) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    try {
      // Generate realistic mock weather data
      const weatherTypes = ['Clear', 'Clouds', 'Rain', 'Thunderstorm'];
      const currentWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      
      const mockWeather = {
        current: {
          temp: Math.round(20 + Math.random() * 20), // 20-40°C
          feels_like: Math.round(22 + Math.random() * 22),
          humidity: Math.round(40 + Math.random() * 50), // 40-90%
          wind_speed: Math.round(2 + Math.random() * 15), // 2-17 km/h
          weather: [
            {
              main: currentWeather,
              description: this.getWeatherDescription(currentWeather),
              icon: this.getWeatherIcon(currentWeather)
            }
          ]
        },
        daily: Array.from({ length: 5 }, (_, i) => ({
          dt: Date.now() + i * 24 * 60 * 60 * 1000,
          temp: {
            min: Math.round(18 + Math.random() * 12), // 18-30°C
            max: Math.round(25 + Math.random() * 18)  // 25-43°C
          },
          weather: [
            {
              main: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
              description: 'partly cloudy',
              icon: '02d'
            }
          ]
        }))
      };

      return mockWeather;
    } catch (error) {
      console.error('Error generating mock weather:', error);
      return null;
    }
  }

  getWeatherDescription(main) {
    const descriptions = {
      'Clear': 'clear sky',
      'Clouds': 'partly cloudy',
      'Rain': 'light rain',
      'Thunderstorm': 'thunderstorm with rain'
    };
    return descriptions[main] || 'partly cloudy';
  }

  getWeatherIcon(main) {
    const icons = {
      'Clear': '01d',
      'Clouds': '02d',
      'Rain': '10d',
      'Thunderstorm': '11d'
    };
    return icons[main] || '02d';
  }

  getSeverityColor(severity) {
    switch (severity?.toLowerCase()) {
      case 'severe': return '#dc2626';
      case 'moderate': return '#f59e0b';
      case 'minor': return '#10b981';
      default: return '#6b7280';
    }
  }

  getSeverityClass(severity) {
    switch (severity?.toLowerCase()) {
      case 'severe': return 'alert-severe';
      case 'moderate': return 'alert-moderate';
      case 'minor': return 'alert-minor';
      default: return 'border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  }
}

export default new AlertService();