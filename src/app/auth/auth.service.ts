import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

export interface AuthResponseData {
    token: string;
    email: string;
    name?: string;
    _id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private userSubject = new BehaviorSubject<AuthResponseData>(null);
    user$ = this.userSubject.asObservable();

    tokenSubject = new BehaviorSubject<string>(this.getToken());

    constructor(private http: HttpClient) { }

    sendOTP(email: string, otp: any) {
        return this.http.post<any>('http://localhost:3000/users/otp', { email: email, otp: otp })
    }

    signUp(name: string, email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'http://localhost:3000/users',
            { name, email, password }
        ).pipe(
            tap(res => this.setToken(res.token)),
            catchError(this.handleError)
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'http://localhost:3000/users/login',
            { email, password }
        ).pipe(
            tap(res => {
                this.setUser(res);
                this.setToken(res.token)
            }),
            catchError(this.handleError)
        );
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
        this.tokenSubject.next(token);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    logout() {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        return this.http.post('http://localhost:3000/users/logout', {}, {
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

        return this.http.post('http://localhost:3000/users/logoutAll', {}, {
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

    deleteUser() {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }
        return this.http.delete('http://localhost:3000/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).pipe(catchError(this.handleError))
    }

    private handleError(errorRes: HttpErrorResponse) {
        console.log(errorRes);
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error) {
            return throwError(errorMessage);
        }
        return throwError(errorRes);
    }
}
