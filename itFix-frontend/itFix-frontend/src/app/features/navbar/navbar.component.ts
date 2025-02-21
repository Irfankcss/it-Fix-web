import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser, NgIf} from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  isBrowser: boolean;

  constructor(
    public authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    if (this.isBrowser) {
      window.location.reload();
    }
    this.alertService.showSuccess('Uspješno ste se odjavili!');
  }

  ngOnInit() {
    if (this.isBrowser) {
      document.addEventListener('click', this.handleClickOutside);
    }
  }

  handleClickOutside = (event: Event) => {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');

    if (this.menuOpen && navLinks && !navLinks.contains(event.target as Node) &&
      menuToggle && !menuToggle.contains(event.target as Node)) {
      this.closeMenu();
    }
  };

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      document.removeEventListener('click', this.handleClickOutside);
    }
  }
}
