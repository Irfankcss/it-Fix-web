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
    return this.http.post(this.apiUrl + 'Korisnik/registracija', user);
  }
  // Metoda za prijavu
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}prijava`, credentials);
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
