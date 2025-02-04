import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, retry, throwError} from 'rxjs';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class ProizvodService {
  private apiUrl = `${environment.apiUrl}Proizvod`; // API URL iz environment fajla

  constructor(private http: HttpClient) { }

  getProizvodi() {
    return this.http.get<any>('https://localhost:7178/api/Proizvod').pipe(
      retry(3), // ✅ Pokušaj ponovo do 3 puta
      catchError(error => {
        console.error('Došlo je do greške:', error);
        return throwError(() => new Error('Neuspjelo učitavanje podataka'));
      })
    );
  }
}
