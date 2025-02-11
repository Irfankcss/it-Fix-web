import { Component} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './features/search-bar/search-bar.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import {FooterComponent} from './features/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SearchBarComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  constructor(private router: Router) {}

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

