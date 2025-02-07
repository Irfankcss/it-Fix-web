import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';

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

}
