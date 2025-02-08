import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    NgIf
  ],
  standalone: true
})
export class LoginComponent {
  credentials = { email: '', lozinka: '' };
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<{ token: string }>('https://localhost:7178/api/Korisnik/prijava', this.credentials)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token); // ✅ Čuvamo token
          this.router.navigate(['/']); // ✅ Preusmjeri korisnika na početnu stranicu
        },
        error: () => {
          this.errorMessage = 'Neispravan email ili lozinka.';
        }
      });
  }

}
