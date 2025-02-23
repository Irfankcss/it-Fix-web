import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfirmEmailService {
  private apiUrl = environment.apiUrl + 'auth/confirm-email';

  constructor(private http: HttpClient) {}

  confirmEmail(userId: string, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?userId=${userId}&token=${token}`);
  }


}
