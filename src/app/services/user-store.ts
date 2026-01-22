import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {

  private citySubject = new BehaviorSubject<string | null>(null);

  city = this.citySubject.asObservable();

  setCity(city: string){
    this.citySubject.next(city)
  }

  getCity(){
    return this.citySubject.value;
  }
  
}
