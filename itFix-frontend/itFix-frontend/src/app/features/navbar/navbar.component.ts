import { Component, HostListener } from '@angular/core';
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
export class NavbarComponent {

  constructor(public authService: AuthService,private router: Router) {}

  menuOpen = false;

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    window.location.reload();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const navbar = document.querySelector('.navbar'); // Selektujemo navbar
    const menuToggle = document.querySelector('.menu-toggle'); // Selektujemo hamburger dugme

    // Ako klik nije unutar navbar-a i nije na dugmetu za otvaranje, zatvaramo meni
    if (navbar && menuToggle && !navbar.contains(event.target as Node) && !menuToggle.contains(event.target as Node)) {
      this.closeMenu();
    }
  }
}
