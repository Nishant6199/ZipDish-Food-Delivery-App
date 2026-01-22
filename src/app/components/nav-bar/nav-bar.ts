import { Component, inject, OnInit, signal } from '@angular/core';
import { LocationService } from '../../services/location-service';
import { UserStoreService } from '../../services/user-store';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { ShopService } from '../../services/shop-service';

@Component({
  selector: 'app-nav-bar',
  imports: [MatIcon],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar implements OnInit {

  city: string | null = null;

  
  locationService = inject(LocationService);
  userStoreService = inject(UserStoreService)
  userService = inject(UserService);
  authService = inject(AuthService);
  shopService = inject(ShopService);


  router = inject(Router)

  showInfo = signal(false);
  showSearch = signal(false);

  ngOnInit(): void {
    this.locationService.getCurrentCity();

    this.userStoreService.city.subscribe(city => {
      this.city = city
    });

    this.shopService.getMyShop().subscribe({
    next: (res) => {
      this.shopService.myShopResponse.set(res);
    },
    error: (err) => {
      console.error(err);
      this.shopService.myShopResponse.set(null);
    }
  });
  }

  showAbout(event: MouseEvent) {
    this.showInfo.set(!this.showInfo());
  }

  isShowSearch(event: MouseEvent){
    this.showSearch.set(!this.showSearch());
  }
  

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
