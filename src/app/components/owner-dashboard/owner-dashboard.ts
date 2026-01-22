import { Component, inject, OnInit } from '@angular/core';
import { NavBar } from "../nav-bar/nav-bar";
import { ShopService } from '../../services/shop-service';
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { OwnerItemCard } from "../owner-item-card/owner-item-card";
import { ItemService } from '../../services/item-service';

@Component({
  selector: 'app-owner-dashboard',
  imports: [NavBar, MatIcon, RouterLink, OwnerItemCard],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.css',
})
export class OwnerDashboard implements OnInit {
  

  shopService = inject(ShopService);
  itemService = inject(ItemService)

  ngOnInit(): void {
    this.getMyShop()
  }

  getMyShop() {
  this.shopService.isLoading.set(true);

  this.shopService.getMyShop().subscribe({
    next: (res) => {
      if (res?.data) {
        console.log("shop", res);
        this.shopService.shop.set(res.data);
        this.getShopItem(res.data.id);
      } else {
        this.shopService.shop.set(null);
      }
      this.shopService.isLoading.set(false);
    },
    error: () => {
      this.shopService.shop.set(null);
      this.shopService.isLoading.set(false);
    }
  });
}

  getShopItem(shopId: number) {
  this.itemService.isLoading.set(true);

  this.itemService.getItemsByShopId(shopId).subscribe({
    next: (res) => {
      console.log("item", res)
      this.itemService.items.set(res.data ?? []);
      this.itemService.isLoading.set(false);
    },
    error: () => {
      this.itemService.items.set([]);
      this.itemService.isLoading.set(false);
    }
  });
}

}
