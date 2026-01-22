import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { LoginResponse } from '../models/login-response';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = "https://localhost:7181/api/Auth";

  private token = "access_token";
  private userId = "userId";

  isLoading = signal(false);

  auth = inject(Auth)
  userService = inject(UserService)
  httpClient = inject(HttpClient);

  register(data: any): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>(`${this.baseUrl}/register`, data);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, {
      email,
      password
    }).pipe(
      tap((res: any) => {
        if (res.flag) {
          localStorage.setItem(this.token, res.accessToken);
          localStorage.setItem(this.userId, res.id);
        }
      })
    )
  }


  loginWithGoogle(mobileNo: string, role: string): Observable<LoginResponse> {

    const provider = new GoogleAuthProvider();

    return new Observable(observer => {

      signInWithPopup(this.auth, provider)
        .then(result => {

          const fullName = result.user.displayName;
          const email = result.user.email;

          this.httpClient
            .post<LoginResponse>(`${this.baseUrl}/google-auth`, {
              fullName,
              email,
              mobileNo,
              role
            })
            .pipe(
              tap((res: any) => {
                if (res.flag) {
                  localStorage.setItem(this.token, res.accessToken);
                  localStorage.setItem(this.userId, res.id);
                }
              })
            )
            .subscribe({
              next: res => {
                observer.next(res);
                observer.complete();
              },
              error: err => observer.error(err)
            });

        })
        .catch(err => observer.error(err));

    });
  }


  forgotPassword(email: string): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>(`${this.baseUrl}/forgot-password`, {
      email
    });
  }

  verifyOTP(email: string, otp: string): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>(`${this.baseUrl}/verify-otp`, {
      email,
      otp
    });
  }

  resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>(`${this.baseUrl}/reset-password`, {
      email,
      newPassword,
      confirmPassword
    });
  }

  get getAccessToken():string | null {
    return localStorage.getItem(this.token) || '';
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem(this.token);
  }

  logout() {
    localStorage.removeItem(this.token);
    localStorage.removeItem(this.userId);
    localStorage.removeItem(this.userService.data);
  }
}
