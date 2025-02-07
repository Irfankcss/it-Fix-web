import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environment/environment';

interface Kategorija {
  kategorijaId: number;
  naziv: string;
}

@Injectable({
  providedIn: 'root'
})
export class KategorijaService {
  private apiUrl = environment.apiUrl + 'Kategorija';

  constructor(private http: HttpClient) {}

  getKategorije(): Observable<Kategorija[]> {
    return this.http.get<Kategorija[]>(this.apiUrl);
  }
}
