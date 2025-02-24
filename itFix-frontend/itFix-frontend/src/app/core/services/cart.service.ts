import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}Korpa`;
  private cartSubject = new BehaviorSubject<any>({ proizvodi: [], ukupnaCijena: 0 });

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Dohvatanje korpe korisnika
  getCart(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      tap(korpa => this.cartSubject.next(korpa))
    );
  }
  getCartUpdates(): Observable<any> {
    return this.cartSubject.asObservable();
  }

  // Dodavanje proizvoda u korpu
  addToCart(proizvod: any, kolicina: number): Observable<any> {
    const body = { proizvod, kolicina };
    return this.http.post(`${this.apiUrl}/dodaj-proizvod`, body, { headers: this.getAuthHeaders() });
  }

  removeFromCart(proizvodId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${proizvodId}`, { headers: this.getAuthHeaders() });
  }

  resetKorpa(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reset`, { headers: this.getAuthHeaders() });
  }
}
