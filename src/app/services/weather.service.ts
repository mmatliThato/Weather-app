import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeather(city: string, isMetric: boolean): Observable<any> {
    const units = isMetric ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${environment.weatherApiKey}&units=${units}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  getWeatherByCoords(lat: number, lon: number, isMetric: boolean): Observable<any> {
    const units = isMetric ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${environment.weatherApiKey}&units=${units}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Weather API error:', error);
    return throwError(() => new Error('Failed to fetch weather data.'));
  }
}
