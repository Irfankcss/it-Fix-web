import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import {CommonModule, DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    DatePipe,
    NgIf
  ],
  standalone: true
})
export class ProfileComponent implements OnInit {
  user: any = null;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Greška pri dohvaćanju profila:', err);
        this.errorMessage = 'Nije moguće učitati profil.';
      }
    });
  }
}
