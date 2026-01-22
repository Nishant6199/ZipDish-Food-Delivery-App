import { Component, inject, signal } from '@angular/core';

import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/ApiResponse';

@Component({
  selector: 'app-register', 
  imports: [MatIconModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  fullName!: string;
  email!: string;
  mobileNo!: string;
  password!: string;

  roles = ["User", "Owner", "DeliveryBoy"];
  selectedRole = 'User';
  hide = signal(false);
  
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
  }

  selectRole(role: string) {
    this.selectedRole = role;
  }

  onSubmit(form: any){

    this.authService.isLoading.set(true);

    if (form.invalid) {
      return;
    }

    const payload = {
      fullName: this.fullName,
      email: this.email,
      mobileNo: this.mobileNo,
      password: this.password,
      role: this.selectedRole
    };

    console.log(payload)

    this.authService.register(payload).subscribe({
      next:(res) => {
        this.snackBar.open("User register successfully", "Close", {
          duration:2000
        });
        console.log(res)
        this.authService.isLoading.set(false);
      },
      error:(error:HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error, "Close");
        this.authService.isLoading.set(false);
      },
      complete:() => {
        this.router.navigate(['/login']);
        this.authService.isLoading.set(false);
      }
    })
  }

  googleLogin(){
    if (!this.mobileNo) {
      this.snackBar.open("Please enter mobile no first.", "Close", {
          duration:2000
        });
        return;
    }

    
    this.authService.loginWithGoogle(this.mobileNo, this.selectedRole).subscribe({
      next:() => {
        this.snackBar.open("User Login successfully", "Close", {
          duration:2000
        });
        this.authService.isLoading.set(false);
      },
      error:(error:HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error, "Close");
        this.authService.isLoading.set(false);
      },
      complete:() => {
        this.router.navigate(['/login']);
        this.authService.isLoading.set(false);
      }
    });
  }



}
