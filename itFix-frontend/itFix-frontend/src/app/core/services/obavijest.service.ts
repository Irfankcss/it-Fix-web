import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, retry, throwError} from 'rxjs';
import { environment } from '../../../environment/environment';
import {Obavijest} from '../../interfaces/Obavijest';
@Injectable({
  providedIn: 'root'
})
export class ObavijestService {
  private apiUrl = `${environment.apiUrl}Obavijesti`;
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getObavijesti(): Observable<Obavijest[]> {
    return this.http.get<Obavijest[]>(this.apiUrl).pipe(
      retry(3),
      catchError(error => {
        console.error('Došlo je do greške:', error);
        return throwError(() => new Error('Neuspjelo učitavanje obavijesti'));
      })
    );
  }

  deleteObavijest(obavijestId: number): Observable<any> {
    const url = `${this.apiUrl}/${obavijestId}`;
    return this.http.delete(url, {headers: this.getAuthHeaders()}).pipe(
      retry(3),
      catchError(error => {
        console.error('Došlo je do greške:', error);
        return throwError(() => new Error('Neuspjelo brisanje obavijesti'));
      })
    );
  }
  editObavijest(obavijestId: number, naslov: string,
                tekst: string, slikaUrl: string, datumObjave: string,
                datumIsteka: string, searchTerm: string,
                prioritet: number): Observable<any> {
    const url = `${this.apiUrl}/${obavijestId}`;
    return this.http.put(url, {
      id: obavijestId,
      naslov,
      tekst,
      slikaUrl,
      datumObjave,
      datumIsteka,
      searchTerm,
      prioritet
    }, {headers: this.getAuthHeaders()}).pipe(
      retry(3),
      catchError(error => {
        console.error('Došlo je do greške:', error);
        return throwError(() => new Error('Neuspjelo uređivanje obavijesti'));
      })
    );
  }


  addObavijest(naslov: string, tekst: string,
               slikaUrl: string, datumObjave: string,
               datumIsteka: string, searchTerm: string,
               prioritet: number): Observable<any> {
    return this.http.post(this.apiUrl, {naslov, tekst, slikaUrl,
      datumObjave, datumIsteka, searchTerm, prioritet}, {headers: this.getAuthHeaders()}).pipe(
      retry(3),
      catchError(error => {
        console.error('Došlo je do greške:', error);
        return throwError(() => new Error('Neuspjelo dodavanje obavijesti'));
      })
    );
  }

}
