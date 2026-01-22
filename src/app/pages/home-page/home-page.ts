import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { UserDashboard } from "../../components/user-dashboard/user-dashboard";
import { OwnerDashboard } from "../../components/owner-dashboard/owner-dashboard";
import { DeliveryDashboard } from "../../components/delivery-dashboard/delivery-dashboard";

@Component({
  selector: 'app-home-page',
  imports: [UserDashboard, OwnerDashboard, DeliveryDashboard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {

  userService = inject(UserService);

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(){
    this.userService.isLoading.set(true);
    
    this.userService.getUserData().subscribe({
      next: (res) => {
        this.userService.isLoading.set(false);
      },
      error: (err) => {
        console.error(err)
        this.userService.isLoading.set(false);
      },
      complete: () => {
         this.userService.isLoading.set(false);
      } 
    })
  }

  
}
