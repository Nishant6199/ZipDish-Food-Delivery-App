import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = "https://localhost:7181/api/User"
   data = "userData";
  isLoading = signal(false);

  httpClient = inject(HttpClient)  

  
  

  getUserData(): Observable<any>{

    const id = localStorage.getItem("userId");

    return this.httpClient.get<any>(`${this.baseUrl}/get-user/${id}`)
    .pipe(
      tap((res:any) => {
        if (res.flag) {
          localStorage.setItem(this.data, JSON.stringify(res.data))
        }
      })
    )
  }

  getUser(){
    return JSON.parse(localStorage.getItem(this.data)!)
  }
}
