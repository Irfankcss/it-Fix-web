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
        localStorage.setItem('token', response.token)
        this.authService.getCurrentUser().subscribe();
        this.alertService.showSuccess('Prijava uspješna. Dobrodošli!');
        this.router.navigate(['/']);
      },
      error: () => {
        this.alertService.showError('Pogrešna lozinka ili email, pokusajte ponovo!');
      }
    });
  }
}
