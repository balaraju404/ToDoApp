import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

export interface AuthResponseData {
  token: string;
  email: string;
  name?: string;
  _id: string;
  avatar?;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBaseUrl = 'https://task-manager-api-rho-seven.vercel.app';
  // private apiBaseUrl = 'https://localhost:3000';

  private userSubject = new BehaviorSubject<AuthResponseData>(null);
  user$ = this.userSubject.asObservable();

  tokenSubject = new BehaviorSubject<string>(this.getToken());

  private loggedInRecently = false;

  constructor(private http: HttpClient) { }

  // Public Methods
  sendOTP(email: string, otp: any) {
    return this.http.post<any>(`${this.apiBaseUrl}/users/otp`, { email: email, otp: otp })
  }

  signUp(name: string, email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `${this.apiBaseUrl}/users`,
      { name, email, password }
    ).pipe(
      tap(res => this.setToken(res.token)),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `${this.apiBaseUrl}/users/login`,
      { email, password }
    ).pipe(
      tap(res => {
        this.setUser(res);
        this.setToken(res.token)
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found in local storage');
      return;
    }

    return this.http.post(`${this.apiBaseUrl}/users/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.userSubject.next(null);
        this.tokenSubject.next(null);
      }),
      catchError(this.handleError)
    );
  }

  logoutAll() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found in local storage');
      return;
    }

    return this.http.post(`${this.apiBaseUrl}/users/logoutAll`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.userSubject.next(null);
        this.tokenSubject.next(null);
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        return throwError('Failed to logout from all devices');
      })
    );
  }

  updateUser(user) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in local storage');
      return;
    }
    return this.http.patch(`${this.apiBaseUrl}/users/me`, user, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  deleteUser() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found in local storage');
      return;
    }
    return this.http.delete(`${this.apiBaseUrl}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(catchError(this.handleError))
  }

  // User Management Methods
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in local storage');
      return;
    }
    return this.http.get(`${this.apiBaseUrl}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }


  uploadAvatar(avatar) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in local storage');
      return;
    }
    return this.http.post(`${this.apiBaseUrl}/users/me/avatar`, avatar, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  getAvatar(id) {
    return this.http.get(`${this.apiBaseUrl}/users/${id}/avatar`)
  }

  // Token Management Methods
  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // Login Status Methods
  setLoginStatus(status: boolean) {
    this.loggedInRecently = status;
  }

  isLoggedInRecently(): boolean {
    return this.loggedInRecently;
  }

  resetLoginStatus() {
    this.loggedInRecently = false;
  }

  // Private Methods
  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error) {
      return throwError(errorMessage);
    }
    return throwError(errorRes);
  }
}
