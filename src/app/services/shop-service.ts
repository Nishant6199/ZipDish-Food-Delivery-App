import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response-api';
import { Shop } from '../models/shop.model';

@Injectable({
  providedIn: 'root',
}) 
export class ShopService {

  private baseUrl = "https://localhost:7181/api/Shop";

  isLoading = signal(false);
  httpClient = inject(HttpClient)
  myShopResponse = signal<Response<Shop> | null>(null);
  shop = signal<any | null>(null);


  getMyShop() : Observable<Response<Shop>>{

    const id = localStorage.getItem("userId");

    return this.httpClient.get<Response<Shop>>(`${this.baseUrl}/get-shop/${id}`);

  }

  createShop(formData: FormData) : Observable<any> { 
    return this.httpClient.post(`${this.baseUrl}/create-shop`, formData);
  }

  updateShop(shopId: number, data: FormData) {
  return this.httpClient.put(`${this.baseUrl}/update-shop/${shopId}`, data);
}
}
