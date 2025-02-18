import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import {convertBrowserOptions} from '@angular-devkit/build-angular/src/builders/browser-esbuild';

export interface FavoritiProizvodDto {
  proizvodId: number;
  naziv: string;
  cijena: number;
  slikaUrl: string;
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
  private apiUrl = `${environment.apiUrl}favoriti`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      }
      : {};
  }

  getFavoriti(): Observable<FavoritiDto> {
    return this.http.get<FavoritiDto>(this.apiUrl, this.getHeaders());
  }

  getFavoritiProizvodi(): Observable<number[]> {
    return this.http.get<FavoritiDto>(this.apiUrl, this.getHeaders()).pipe(
      map((response: FavoritiDto) =>  response.proizvodi.map(p => p.proizvodId) )

    );
  }

  addToFavoriti(proizvodId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { proizvodId }, this.getHeaders());
  }

  removeFromFavoriti(proizvodId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${proizvodId}`, this.getHeaders());
  }
}
