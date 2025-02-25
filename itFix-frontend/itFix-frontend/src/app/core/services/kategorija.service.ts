import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environment/environment';
import {Kategorija} from '../../interfaces/Kategorija';

@Injectable({
  providedIn: 'root'
})
export class KategorijaService {
  private apiUrl = environment.apiUrl + 'Kategorija';

  constructor(private http: HttpClient) {}

  getKategorije(): Observable<Kategorija[]> {
    return this.http.get<Kategorija[]>(this.apiUrl);
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  deleteKategorija(kategorijaId: number): Observable<any> {
    const url = `${this.apiUrl}/${kategorijaId}`;
    return this.http.delete(url, {headers: this.getAuthHeaders()});
  }

  editKategorija(kategorijaId: number, naziv: string): Observable<any> {
    const url = `${this.apiUrl}/${kategorijaId}`;
    return this.http.put(url, {naziv}, {headers: this.getAuthHeaders()});
  }
  addKategorija(naziv: string): Observable<any> {
    return this.http.post(this.apiUrl, {naziv}, {headers: this.getAuthHeaders()});
  }
}
