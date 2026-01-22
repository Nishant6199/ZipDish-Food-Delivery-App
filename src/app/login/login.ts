import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from '../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-login',
  imports: [RouterLink, MatIconModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email!: string;
  password!: string;
  
  hide = signal(false);

  authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router)

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
  }

  onSubmit(form:any){

    if (form.invalid) {
      return;
    }

    this.authService.isLoading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: ()=> {
        this.snackBar.open("Logged in Succssfully", "Close", {
          duration:3000
        });
        this.authService.isLoading.set(false);
        this.router.navigate(["/homepage"]);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || "Login faied", "Close", {
          duration: 1000
        });
        this.authService.isLoading.set(false);
      },
      complete: () => {
        this.authService.isLoading.set(false);
      }
    })
    
  }

  // googleLogin(){
  //   const
  //   this.authService.loginWithGoogle();
  // }
  
}
