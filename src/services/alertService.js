import axios from 'axios';

const SACHET_RSS_URL = 'https://sachet.ndma.gov.in/cap_public/rss_en.xml';
const OPENWEATHER_API_KEY = process.env.VITE_OPENWEATHER_API_KEY || 'demo_key';

class AlertService {
  constructor() {
    this.alerts = [];
    this.lastFetch = null;
    this.isLoading = false;
  }

  async fetchAlerts() {
    if (this.isLoading) return this.alerts;
    
    this.isLoading = true;
    try {
      // In production, this would go through your backend
      // For now, we'll use mock data that simulates the SACHET feed structure
      const mockAlerts = [
        {
          id: 'alert_001',
          title: 'Severe Cyclonic Storm Warning - Odisha Coast',
          description: 'A severe cyclonic storm is approaching the Odisha coast. Wind speeds expected to reach 120-130 kmph.',
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
          description: 'Heavy to very heavy rainfall expected in Mumbai and surrounding areas. Waterlogging likely in low-lying areas.',
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
          description: 'Severe heat wave conditions prevailing over Rajasthan. Temperature may reach 47-48°C.',
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
          description: 'Minor earthquake tremors felt in Delhi NCR region. No immediate threat, but residents advised to stay alert.',
          severity: 'Minor',
          urgency: 'Past',
          certainty: 'Observed',
          area: 'Delhi, Gurgaon, Noida',
          coordinates: [[28.7041, 77.1025], [28.4595, 77.0266]],
          effective: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expires: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          category: 'Earthquake',
          color: '#10b981'
        }
      ];

      this.alerts = mockAlerts;
      this.lastFetch = new Date();
      return this.alerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return this.alerts;
    } finally {
      this.isLoading = false;
    }
  }

  async getWeatherData(lat, lon) {
    try {
      // Mock weather data for demo
      const mockWeather = {
        current: {
          temp: Math.round(25 + Math.random() * 15),
          feels_like: Math.round(28 + Math.random() * 15),
          humidity: Math.round(60 + Math.random() * 30),
          wind_speed: Math.round(5 + Math.random() * 10),
          weather: [
            {
              main: ['Clear', 'Clouds', 'Rain', 'Thunderstorm'][Math.floor(Math.random() * 4)],
              description: 'partly cloudy',
              icon: '02d'
            }
          ]
        },
        daily: Array.from({ length: 5 }, (_, i) => ({
          dt: Date.now() + i * 24 * 60 * 60 * 1000,
          temp: {
            min: Math.round(20 + Math.random() * 10),
            max: Math.round(30 + Math.random() * 15)
          },
          weather: [
            {
              main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
              description: 'sunny',
              icon: '01d'
            }
          ]
        }))
      };

      return mockWeather;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
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