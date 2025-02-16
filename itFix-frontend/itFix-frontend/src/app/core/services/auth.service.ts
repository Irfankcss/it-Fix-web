import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Metoda za registraciju
  register(user: any) {
    return this.http.post(this.apiUrl + 'auth/register', user);
  }
  // Metoda za prijavu
  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl + `auth/login`, credentials);
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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}auth/me`, { headers });
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');  // Preuzmi token iz localStorage

    // Provjeri postoji li token, inače ne šaljemo zahtjev
    if (!token) {
      return throwError('Token nije pronađen. Korisnik nije prijavljen.');
    }

    // Dodaj Authorization header sa tokenom
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}Korisnik/moj-profil`, { headers });
  }

}
export interface User {
  id: string;
  ime: string;
  prezime: string;
  email: string;
  roles: string[];
}
