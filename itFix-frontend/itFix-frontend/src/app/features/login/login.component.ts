import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {AlertService} from '../../core/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, NgIf],
  standalone: true
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.authService.authStatusSubject.next(true);
          this.authService.getCurrentUser().subscribe();
          this.alertService.showSuccess('Prijava uspješna. Dobrodošli!');
          this.router.navigate(['/']);
        } else {
          console.error('Token nije pronađen u odgovoru!');
        }
      },
      error: () => {
        this.alertService.showError('Pogrešna lozinka ili email, pokušajte ponovo!');
      }
    });
  }
}

