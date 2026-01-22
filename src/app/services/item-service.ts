import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Response } from '../models/response-api';
import { Item } from '../models/shop.model';
import { Observable } from 'rxjs';
import { ShopService } from './shop-service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
   private baseUrl = "https://localhost:7181/api/Item";

  isLoading = signal(false);
  shopService = inject(ShopService);
  httpClient = inject(HttpClient)
  myItemResponse = signal<Response<Item> | null>(null);
  items = signal<Item[]>([]);

  

  getItemsByShopId(shopId: number): Observable<Response<Item[]>> {
  return this.httpClient.get<Response<Item[]>>(
    `${this.baseUrl}/shop/${shopId}`
  );
}

  createItem(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/create-item`,formData); 
  }

  updateItem(itemId: number, data: FormData): Observable<any> {
  return this.httpClient.put(
    `${this.baseUrl}/update-item/${itemId}`,
    data
  );
}

}
