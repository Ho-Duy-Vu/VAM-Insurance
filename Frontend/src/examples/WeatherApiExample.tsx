/**
 * Weather API Example
 * Demonstrates how to call weather API from Frontend
 */

import { useState } from 'react'
import { weatherApi } from '../api/client'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'

interface WeatherData {
  temperature: number
  feels_like: number
  humidity: number
  pressure: number
  condition: string
  description: string
  wind_speed: number
  clouds: number
  rain_1h: number
  rain_3h: number
  visibility: number
  status: string
  severity: string
  marker_color: string
  fetched_at: string
}

export default function WeatherApiExample() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Coordinates for major Vietnamese cities
  const cities = [
    { name: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
    { name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
    { name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
    { name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 },
    { name: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
  ]

  const fetchWeather = async (lat: number, lon: number, cityName: string) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log(`🌤️ Fetching weather for ${cityName}...`)
      const data = await weatherApi.getWeather(lat, lon)
      console.log('✅ Weather data received:', data)
      setWeatherData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ Weather fetch failed:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ngập_lụt':
        return 'text-yellow-600 bg-yellow-100'
      case 'cảnh_báo_bão':
        return 'text-red-600 bg-red-100'
      case 'mưa_lớn':
        return 'text-blue-600 bg-blue-100'
      case 'ổn_định':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'ngập_lụt': 'Ngập Lụt',
      'cảnh_báo_bão': 'Cảnh Báo Bão',
      'mưa_lớn': 'Mưa Lớn',
      'ổn_định': 'Ổn Định'
    }
    return labels[status] || status
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Weather API Example</h1>
      
      {/* City Selection */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Select a City</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cities.map((city) => (
            <Button
              key={city.name}
              onClick={() => fetchWeather(city.lat, city.lon, city.name)}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {city.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading weather data...</span>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6 mb-6 border-red-300 bg-red-50">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {/* Weather Data Display */}
      {weatherData && !loading && (
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Weather Information</h2>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(weatherData.fetched_at).toLocaleString('vi-VN')}
            </p>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(weatherData.status)}`}>
              {getStatusLabel(weatherData.status)} - {weatherData.severity}
            </span>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Temperature */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">🌡️ Temperature</div>
              <div className="text-2xl font-bold text-orange-600">
                {weatherData.temperature}°C
              </div>
              <div className="text-xs text-gray-500">
                Feels like: {weatherData.feels_like}°C
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">💧 Humidity</div>
              <div className="text-2xl font-bold text-blue-600">
                {weatherData.humidity}%
              </div>
              <div className="text-xs text-gray-500">
                Pressure: {weatherData.pressure} hPa
              </div>
            </div>

            {/* Condition */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">🌤️ Condition</div>
              <div className="text-lg font-bold text-purple-600">
                {weatherData.condition}
              </div>
              <div className="text-xs text-gray-500">
                {weatherData.description}
              </div>
            </div>

            {/* Wind */}
            <div className="bg-cyan-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">💨 Wind Speed</div>
              <div className="text-2xl font-bold text-cyan-600">
                {weatherData.wind_speed} m/s
              </div>
            </div>

            {/* Clouds */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">☁️ Clouds</div>
              <div className="text-2xl font-bold text-gray-600">
                {weatherData.clouds}%
              </div>
            </div>

            {/* Rain */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">🌧️ Rainfall</div>
              <div className="text-lg font-bold text-blue-600">
                {weatherData.rain_1h || 0} mm
              </div>
              <div className="text-xs text-gray-500">
                (1 hour)
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">👁️ Visibility</div>
              <div className="text-2xl font-bold text-indigo-600">
                {(weatherData.visibility / 1000).toFixed(1)} km
              </div>
            </div>
          </div>

          {/* JSON Data */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-gray-800">
              📋 View Raw JSON Data
            </summary>
            <pre className="mt-3 p-4 bg-gray-50 rounded-lg overflow-auto text-xs">
              {JSON.stringify(weatherData, null, 2)}
            </pre>
          </details>
        </Card>
      )}

      {/* Code Example */}
      <Card className="p-6 mt-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">💻 Code Example</h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
{`import { weatherApi } from '../api/client'

// Fetch weather for specific coordinates
const data = await weatherApi.getWeather(10.8231, 106.6297)

console.log('Temperature:', data.temperature)
console.log('Status:', data.status)
console.log('Severity:', data.severity)
console.log('Marker Color:', data.marker_color)`}
        </pre>
      </Card>
    </div>
  )
}
