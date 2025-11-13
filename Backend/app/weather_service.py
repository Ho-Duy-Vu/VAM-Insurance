"""
Weather Service for fetching and updating disaster location weather data
Integrates with OpenWeatherMap API
"""

import httpx
import json
from datetime import datetime
from typing import Dict, Optional
from decouple import config
from sqlalchemy.orm import Session
from app.models import DisasterLocation

# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY = config("OPENWEATHER_API_KEY", default="")
OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"

class WeatherService:
    """Service for weather data operations"""
    
    @staticmethod
    async def fetch_weather(lat: float, lon: float) -> Optional[Dict]:
        """
        Fetch current weather from OpenWeatherMap API
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Weather data dictionary or None if error
        """
        if not OPENWEATHER_API_KEY:
            print("⚠️  Warning: OPENWEATHER_API_KEY not configured")
            return None
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    OPENWEATHER_URL,
                    params={
                        'lat': lat,
                        'lon': lon,
                        'appid': OPENWEATHER_API_KEY,
                        'units': 'metric',  # Celsius
                        'lang': 'vi'  # Vietnamese
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Extract relevant weather information
                    weather_info = {
                        'temperature': data.get('main', {}).get('temp'),
                        'feels_like': data.get('main', {}).get('feels_like'),
                        'humidity': data.get('main', {}).get('humidity'),
                        'pressure': data.get('main', {}).get('pressure'),
                        'condition': data.get('weather', [{}])[0].get('main', ''),
                        'description': data.get('weather', [{}])[0].get('description', ''),
                        'wind_speed': data.get('wind', {}).get('speed'),
                        'clouds': data.get('clouds', {}).get('all'),
                        'rain_1h': data.get('rain', {}).get('1h', 0),
                        'rain_3h': data.get('rain', {}).get('3h', 0),
                        'visibility': data.get('visibility'),
                        'fetched_at': datetime.utcnow().isoformat()
                    }
                    
                    return weather_info
                else:
                    print(f"❌ Weather API error: {response.status_code}")
                    return None
                    
        except Exception as e:
            print(f"❌ Error fetching weather: {str(e)}")
            return None
    
    @staticmethod
    def determine_status(weather_info: Dict) -> str:
        """
        Determine disaster status based on weather data
        
        Args:
            weather_info: Weather data dictionary
            
        Returns:
            Status string: ngập_lụt, cảnh_báo_bão, mưa_lớn, ổn_định
        """
        if not weather_info:
            return "ổn_định"
        
        rain_1h = weather_info.get('rain_1h', 0)
        rain_3h = weather_info.get('rain_3h', 0)
        wind_speed = weather_info.get('wind_speed', 0)
        condition = weather_info.get('condition', '').lower()
        
        # Ngập lụt: Heavy rain (>50mm in 3h)
        if rain_3h > 50:
            return "ngập_lụt"
        
        # Cảnh báo bão: High wind speed (>20 m/s) or thunderstorm
        if wind_speed > 20 or condition in ['thunderstorm', 'tornado']:
            return "cảnh_báo_bão"
        
        # Mưa lớn: Moderate rain (>10mm in 1h or >30mm in 3h)
        if rain_1h > 10 or rain_3h > 30:
            return "mưa_lớn"
        
        # Ổn định: Normal conditions
        return "ổn_định"
    
    @staticmethod
    def determine_severity(status: str) -> str:
        """
        Determine severity level based on status
        
        Args:
            status: Disaster status
            
        Returns:
            Severity: Cao, Trung bình, Thấp
        """
        severity_map = {
            "ngập_lụt": "Cao",
            "cảnh_báo_bão": "Cao",
            "mưa_lớn": "Trung bình",
            "ổn_định": "Thấp"
        }
        return severity_map.get(status, "Thấp")
    
    @staticmethod
    def determine_marker_color(status: str) -> str:
        """
        Determine marker color based on status
        
        Args:
            status: Disaster status
            
        Returns:
            Color: red, orange, blue, green
        """
        color_map = {
            "ngập_lụt": "red",
            "cảnh_báo_bão": "red",
            "mưa_lớn": "blue",
            "ổn_định": "green"
        }
        return color_map.get(status, "green")
    
    @staticmethod
    async def update_location_weather(db: Session, location_id: str) -> bool:
        """
        Update weather data for a specific location
        
        Args:
            db: Database session
            location_id: Location ID to update
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Get location from database
            location = db.query(DisasterLocation).filter(
                DisasterLocation.id == location_id
            ).first()
            
            if not location:
                print(f"❌ Location {location_id} not found")
                return False
            
            # Fetch weather data
            weather_info = await WeatherService.fetch_weather(
                float(location.latitude),
                float(location.longitude)
            )
            
            if weather_info:
                # Update location with new weather data
                new_status = WeatherService.determine_status(weather_info)
                
                location.weather_info = json.dumps(weather_info, ensure_ascii=False)
                location.status = new_status
                location.severity = WeatherService.determine_severity(new_status)
                location.marker_color = WeatherService.determine_marker_color(new_status)
                location.last_updated = datetime.utcnow()
                
                db.commit()
                print(f"✅ Updated weather for {location.province} - Status: {new_status}")
                return True
            else:
                print(f"⚠️  Could not fetch weather for {location.province}")
                return False
                
        except Exception as e:
            db.rollback()
            print(f"❌ Error updating location {location_id}: {str(e)}")
            return False
    
    @staticmethod
    async def update_all_locations(db: Session) -> Dict[str, int]:
        """
        Update weather data for all locations
        
        Args:
            db: Database session
            
        Returns:
            Dictionary with success/failure counts
        """
        locations = db.query(DisasterLocation).all()
        
        results = {
            'total': len(locations),
            'success': 0,
            'failed': 0
        }
        
        print(f"🌦️  Updating weather for {len(locations)} locations...")
        
        for location in locations:
            success = await WeatherService.update_location_weather(db, location.id)
            if success:
                results['success'] += 1
            else:
                results['failed'] += 1
        
        print(f"✅ Weather update complete: {results['success']}/{results['total']} successful")
        return results
