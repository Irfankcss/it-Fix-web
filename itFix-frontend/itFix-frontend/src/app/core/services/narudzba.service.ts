import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class NarudzbaService {
  private apiUrl = `${environment.apiUrl}narudzbe`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  kreirajNarudzbu(narudzba: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, narudzba, { headers: this.getAuthHeaders() });
  }
  getNarudzbe(status?: string): Observable<any> {
    const url = status ? `${this.apiUrl}?status=${status}` : this.apiUrl;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }
  getNarudzbaById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  getMojeNarudzbe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/moje`, { headers: this.getAuthHeaders() });
  }
  getNarudzbaByIdAndEmail(narudzbaId: number, email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/detalji?narudzbaId=${narudzbaId}&email=${email}`);
  }
  updateNarudzba(id: number, narudzba: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, narudzba, { headers: this.getAuthHeaders() });
  }
  deleteNarudzba(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
