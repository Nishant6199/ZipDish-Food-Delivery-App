import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location-service';
import { UserStoreService } from '../../services/user-store';

@Component({
  selector: 'app-user-dashboard',
  imports: [MatIcon],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {

  city: string | null = null;

  
  locationService = inject(LocationService);
  userStoreService = inject(UserStoreService)
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router)

  showInfo = signal(false);
  showSearch = signal(false);

  ngOnInit(): void {
    this.locationService.getCurrentCity();

    this.userStoreService.city.subscribe(city => {
      this.city = city
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
