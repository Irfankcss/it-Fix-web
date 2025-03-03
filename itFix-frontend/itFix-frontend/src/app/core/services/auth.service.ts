import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, of, tap, throwError} from 'rxjs';
import { environment } from '../../../environment/environment';
import {AdminUser} from '../../interfaces/adminUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  public authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatusSubject.asObservable();
  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/login`, credentials).pipe(
      tap(response => {
        if (response) {
          this.authStatusSubject.next(true);
        } else {
          console.error('Token nije pronađen u odgovoru!');
        }
      }),
      catchError(this.handleError)
    );
  }
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
  logout() {
    localStorage.removeItem('token');
    this.authStatusSubject.next(false);
  }

  getCurrentUser(): Observable<User | null> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}auth/me`, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.logout();
          return of(null);
        }
        return throwError(() => error);
      })
    );
  }


  isAdmin(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => user ? user.roles.some(role => role.toLowerCase() === 'admin') : false),
      catchError(error => {
        console.error('Greška pri dohvaćanju korisnika:', error);
        return of(false);
      })
    );
  }


  getProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}Korisnik/moj-profil`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<AdminUser[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<AdminUser[]>(`${this.apiUrl}auth/users`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}auth/delete-user/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private getAuthHeaders(): HttpHeaders {
    if (typeof window === 'undefined') {
      return new HttpHeaders();
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Došlo je do greške.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }

    return throwError(() => new Error(errorMessage));
  }
}

export interface User {
  id: string;
  ime: string;
  prezime: string;
  email: string;
  roles: string[];
}
