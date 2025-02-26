import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, retry, throwError} from 'rxjs';
import { environment } from '../../../environment/environment';
import {Proizvod} from '../../interfaces/Proizvod';

@Injectable({
  providedIn: 'root'
})
export class ProizvodService {
  private apiUrl = `${environment.apiUrl}Proizvod`;

  private handleError(error: any) {
    console.error('Došlo je do greške:', error);
    return throwError(() => new Error('Došlo je do greške pri dohvaćanju podataka.'));
  }

  constructor(private http: HttpClient) {}

  getProizvodById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(retry(2), catchError(this.handleError));
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProizvodi(
    kategorijaId?: number,
    podkategorijaId?: number,
    minCijena?: number,
    maxCijena?: number,
    polovan?: boolean,
    searchTerm?: string,
    sortBy: string = 'naziv',
    sortOrder: string = 'asc',
    page: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    let params = new HttpParams();

    if (kategorijaId) params = params.append('kategorijaId', kategorijaId);
    if (podkategorijaId) params = params.append('podkategorijaId', podkategorijaId);
    if (minCijena) params = params.append('minCijena', minCijena);
    if (maxCijena) params = params.append('maxCijena', maxCijena);
    //if (polovan !== null) params = params.append('polovan', polovan.toString());
    if (searchTerm && searchTerm.trim() !== '') params = params.append('searchTerm', searchTerm);

    params = params
      .append('sortBy', sortBy)
      .append('sortOrder', sortOrder)
      .append('page', page)
      .append('pageSize', pageSize);

    return this.http.get<any>(this.apiUrl, { params }).pipe(retry(2), catchError(this.handleError));
  }
  getNajnovijiProizvodi(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/najnoviji`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
  getProizvodiAdmin(): Observable<Proizvod[]> {
    return this.http.get<{ ukupno: number; proizvodi: Proizvod[] }>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(map(response => response.proizvodi));
  }
  createProizvod(proizvod: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, proizvod, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateProizvod(id: number, proizvod: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proizvod ,{ headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteProizvod(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}` , { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

}
