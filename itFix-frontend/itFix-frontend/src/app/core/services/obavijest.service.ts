import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, retry, throwError} from 'rxjs';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class ObavijestService {
  private apiUrl = `${environment.apiUrl}Obavijesti`; // API URL iz environment fajla

  constructor(private http: HttpClient) { }

  getObavijesti() {
    return this.http.get<any>(this.apiUrl).pipe(
      retry(3), // ✅ Pokušaj ponovo do 3 puta
      catchError(error => {
        console.error('Došlo je do greške:', error);
        return throwError(() => new Error('Neuspjelo učitavanje Obavijesti'));
      })
    );
  }
}
