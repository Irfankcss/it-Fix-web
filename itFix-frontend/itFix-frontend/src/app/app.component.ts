import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NgIf, CommonModule } from '@angular/common';
import {ObavijestiCarouselComponent} from './features/obavijesti-carousel/obavijesti-carousel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, ObavijestiCarouselComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
