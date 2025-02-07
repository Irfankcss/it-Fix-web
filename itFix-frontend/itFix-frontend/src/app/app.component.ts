import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NgIf, CommonModule } from '@angular/common';
import {ObavijestiCarouselComponent} from './features/obavijesti-carousel/obavijesti-carousel.component';
import {SearchBarComponent} from './features/search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, ObavijestiCarouselComponent, SearchBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService) {}
  menuOpen = false;

  logout() {
    this.authService.logout();
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }


}
