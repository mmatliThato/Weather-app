import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  city = '';
  weatherData: any = null;
  loading = false;
  error = '';
  recentCities: string[] = [];
  isMetric = true;
  isDarkMode = true;

  constructor(private weatherService: WeatherService) {
    this.isDarkMode = localStorage.getItem('theme') !== 'light';
    this.setTheme();
  }

  fetchWeather(): void {
    if (!this.city.trim()) {
      this.error = 'Please enter a city name.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.weatherData = null;

    this.weatherService.getWeather(this.city.trim(), this.isMetric).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
        this.addToRecent(this.city.trim());
      },
      error: () => {
        this.error = 'Failed to fetch weather data.';
        this.loading = false;
      }
    });
  }

  toggleUnits(): void {
    this.isMetric = !this.isMetric;
    if (this.city) this.fetchWeather();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.setTheme();
  }

  private setTheme(): void {
    document.body.classList.toggle('light-mode', !this.isDarkMode);
  }

  getLocationWeather(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.loading = true;
          this.error = '';
          this.weatherData = null;

          this.weatherService.getWeatherByCoords(latitude, longitude, this.isMetric).subscribe({
            next: (data) => {
              this.weatherData = data;
              this.loading = false;
            },
            error: () => {
              this.error = 'Failed to fetch location-based weather.';
              this.loading = false;
            }
          });
        },
        () => (this.error = 'Unable to access location.')
      );
    } else {
      this.error = 'Geolocation not supported.';
    }
  }

  addToRecent(city: string): void {
    if (!this.recentCities.includes(city)) {
      this.recentCities.unshift(city);
      if (this.recentCities.length > 5) this.recentCities.pop();
    }
  }

  searchRecent(city: string): void {
    this.city = city;
    this.fetchWeather();
  }

  clearRecent(): void {
    this.recentCities = [];
  }
}
