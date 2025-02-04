import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule,NgIf,NgFor} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    CommonModule
  ],
  standalone: true
})
export class RegisterComponent {
  user = { ime: '', prezime: '', email: '', lozinka: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe({
      next: () => {
        alert('Registracija uspješna! Molimo prijavite se.');
        this.router.navigate(['/login']); // Preusmjeri korisnika na login stranicu
      },
      error: (err) => {
        console.error('Greška pri registraciji:', err);
        this.errorMessage = 'Greška pri registraciji!';
      }
    });
  }

}
