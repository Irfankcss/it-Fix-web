import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import { environment } from '../../../environment/environment';
import {AdminUser} from '../../interfaces/adminUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/login`, credentials);
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token'); // Briše token
  }

  getCurrentUser(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}auth/me`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  isAdmin(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => {
        return user.roles.some(role => role.toLowerCase() === 'admin');
      }),
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
