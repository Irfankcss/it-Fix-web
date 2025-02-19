import { Component} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './features/search-bar/search-bar.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import {FooterComponent} from './features/footer/footer.component';
import {AlertComponent} from './features/alert/alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SearchBarComponent, NavbarComponent, FooterComponent, AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Resetuje scroll na vrh stranice
      }
    });
  }

  //menuOpen = false;



  //logout() {
 //   this.authService.logout();
 // }

 // toggleMenu() {
 //   this.menuOpen = !this.menuOpen;
 // }

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

