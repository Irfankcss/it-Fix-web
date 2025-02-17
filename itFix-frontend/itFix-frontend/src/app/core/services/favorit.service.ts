import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface FavoritiProizvodDto {
  proizvodId: number;
  naziv: string;
  cijena: number;
}

export interface FavoritiDto {
  favoritiID: number;
  korisnikId: string;
  proizvodi: FavoritiProizvodDto[];
}

@Injectable({
  providedIn: 'root',
})
export class FavoritService {
  private apiUrl = environment.apiUrl + 'favoriti';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Dodano kako bi osigurao ispravno slanje JSON podataka
        }),
      }
      : {};
  }

  getFavoriti(): Observable<FavoritiDto> {
    return this.http.get<FavoritiDto>(this.apiUrl, this.getHeaders());
  }

  addToFavoriti(proizvodId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { proizvodId }, this.getHeaders()); // Ispravljeno: šaljemo proizvodId u tijelu zahtjeva
  }

  removeFromFavoriti(proizvodId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${proizvodId}`, this.getHeaders());
  }
}
