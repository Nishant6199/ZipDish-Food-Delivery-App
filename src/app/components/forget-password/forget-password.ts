import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forget-password',
  imports: [MatIcon, RouterLink, FormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {

  email!: string;
  otp!: string;
  password!: string;
  confirmPassword!: string;

  authService = inject(AuthService);
  router = inject(Router);
  private snackBar = inject(MatSnackBar);

  step = signal(1);
  hide = signal(false);
  show = signal(false)

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
  }

  showPassword(event: MouseEvent) {
    this.show.set(!this.hide());
  }

  onSubmit(form: any){
    if (form.invalid) {
      return;
    }

    this.authService.isLoading.set(true);

    this.authService.forgotPassword(this.email).subscribe({
      next: ()=> {
        this.snackBar.open("OTP sent successfully on your registered email id.", "Close", {
          duration:2000
        });
        this.authService.isLoading.set(false);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || "OTP failed to send", "Close", {
          duration: 2000
        });
        this.authService.isLoading.set(false);
      },
      complete: () => {
        this.authService.isLoading.set(false);
      }
    })

    this.step.set(2);
  }

  changePass(form: any){
    if (form.invalid) {
      return;
    }

    this.authService.isLoading.set(true);

    if (this.password !== this.confirmPassword) {
    this.snackBar.open(
      "Password and Confirm Password do not match",
      "Close",
      { duration: 2000 }
    );
    return;
  }

    this.authService.resetPassword(this.email, this.password, this.confirmPassword).subscribe({
      next: ()=> {
        this.snackBar.open("Password reset successfully.", "Close", {
          duration:2000
        });
        this.authService.isLoading.set(false);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || "Password reset failed", "Close", {
          duration: 2000
        });
        this.authService.isLoading.set(false);
      },
      complete: () => {
        this.router.navigate(['/login']);
        this.authService.isLoading.set(false);
      }
    })
  }

  otpVerify(form:any){

    if (form.invalid) {
      return;
    }

    this.authService.isLoading.set(true);

    this.authService.verifyOTP(this.email, this.otp).subscribe({
      next: ()=> {
        this.snackBar.open("OTP verified successfully.", "Close", {
          duration:2000
        });
        this.authService.isLoading.set(false);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || "OTP verification failed", "Close", {
          duration: 2000
        });
        this.authService.isLoading.set(false);
      },
      complete: () => {
        this.authService.isLoading.set(false);
      }
    })

    this.step.set(3);
    
  }

}


