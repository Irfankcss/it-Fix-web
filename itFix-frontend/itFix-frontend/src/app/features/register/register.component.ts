import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule,NgIf} from '@angular/common';
import {AlertService} from '../../core/services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    FormsModule,
    NgIf,
    CommonModule
  ],
  standalone: true
})
export class RegisterComponent {
  user = { ime: '', prezime: '', email: '', password: '', confirmPassword: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {}

  register() {
    if (!this.validateInput()) return;

    this.authService.register(this.user).subscribe({
      next: () => {
        this.alertService.showSuccess(
          'Registracija je uspješna. Na vašu email adresu poslan je verifikacijski link. Molimo provjerite svoj inbox.'
        );
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
  validateInput(): boolean {
    const nameRegex = /^[A-ZČĆŽŠĐ][a-zčćžšđ]{1,}$/; // Ime i prezime počinju velikim slovom, minimum 2 slova
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Standardni email regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Min 8 karaktera, jedno veliko slovo, broj i spec. znak

    if (!nameRegex.test(this.user.ime)) {
      this.errorMessage = 'Ime mora početi velikim slovom i imati bar 2 slova!';
      return false;
    }
    if (!nameRegex.test(this.user.prezime)) {
      this.errorMessage = 'Prezime mora početi velikim slovom i imati bar 2 slova!';
      return false;
    }
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage = 'Email nije validan!';
      return false;
    }
    if (!passwordRegex.test(this.user.password)) {
      this.errorMessage = 'Lozinka mora imati najmanje 8 karaktera, jedno veliko slovo, broj i specijalni znak!';
      return false;
    }
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Lozinke se ne podudaraju!';
      return false;
    }
    return true;
  }

}
