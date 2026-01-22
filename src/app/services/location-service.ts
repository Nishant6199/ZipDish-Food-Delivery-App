import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserStoreService } from './user-store';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class LocationService {
  
  private httpClient = inject(HttpClient);
  private userStoreService = inject(UserStoreService);

  getCurrentCity(){
    if (!navigator.geolocation) {
      console.error("Geolocation not supproted")
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>{
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // console.log(lat,lon);

        // const url = 
        //   `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${environment.geoApiKey}`;

        const url = 
          `https://api.geoapify.com/v1/geocode/reverse?lat=28.829273&lon=77.675028&format=json&apiKey=${environment.geoApiKey}`;

        this.httpClient.get<any>(url).subscribe({
          next: (res) => {
            // console.log("Response", res);
            const city = res.results[0]?.county;
            // console.log('City:', city);
            this.userStoreService.setCity(city);
          },
          error: (err) => {
            console.error(err)
          }
        });
      },
      (error) => {
        console.error('Location error', error);
      }
    );
  }

}
