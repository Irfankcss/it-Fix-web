import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  {

  constructor(public authService: AuthService) {}

  menuOpen = false;



  logout() {
    this.authService.logout();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
