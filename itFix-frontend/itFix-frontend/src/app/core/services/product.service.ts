import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class ProizvodService {
  private apiUrl = `${environment.apiUrl}Proizvod`; // API URL iz environment fajla

  constructor(private http: HttpClient) { }

  getProizvodi(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
