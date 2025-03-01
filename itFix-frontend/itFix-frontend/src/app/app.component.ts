import { Component} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './features/search-bar/search-bar.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import {FooterComponent} from './features/footer/footer.component';
import {AlertComponent} from './features/alert/alert.component';
import {BackToTopComponent} from './features/back-to-top/back-to-top.component';
import {AuthService} from './core/services/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SearchBarComponent, NavbarComponent, FooterComponent, AlertComponent, BackToTopComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  isAdmin$: Observable<boolean>;
  constructor(private router: Router, private authService: AuthService) {
    this.isAdmin$ = this.authService.isAdmin();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }


  onGlobalSearch(searchTerm: string) {
    if (this.router.url.startsWith('/prodavnica')) {
      // Ponovo učitaj stranicu ručno
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/prodavnica'], { queryParams: { search: searchTerm } });
      });
    } else {
      this.router.navigate(['/prodavnica'], { queryParams: { search: searchTerm } });
    }
  }




}

