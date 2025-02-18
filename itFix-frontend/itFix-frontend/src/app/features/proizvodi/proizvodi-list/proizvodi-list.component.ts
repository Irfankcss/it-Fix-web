import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FavoritService } from '../../../core/services/favorit.service';
import { AuthService } from '../../../core/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-proizvod-list',
  templateUrl: './proizvodi-list.component.html',
  styleUrls: ['./proizvodi-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
})
export class ProizvodListComponent {
  @Input() proizvodi: any[] = [];
  favoriti: Set<number> = new Set(); // Čuvamo `proizvodId` unutar `Set`
  isLoggedIn: boolean = false; // Provjera da li je korisnik prijavljen

  faSolidHeart = faSolidHeart;
  faRegularHeart = faRegularHeart;

  constructor(
    private router: Router,
    private favoritService: FavoritService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.ucitajFavorite();
    }
  }

  ucitajFavorite() {
    this.favoritService.getFavoritiProizvodi().subscribe(
      (favoriti: number[]) => {
        this.favoriti = new Set(favoriti);
      },
      (error) => {
        console.error('Greška pri učitavanju favorita', error);
      }
    );
  }

  otvoriProizvod(id: number) {
    this.router.navigate(['/proizvod', id]);
  }

  dodajUFavorit(proizvodId: number, event: Event) {
    event.stopPropagation();

    if (!this.isLoggedIn) {
      alert('Morate biti prijavljeni da biste dodali u favorite!');
      return;
    }

    if (this.favoriti.has(proizvodId)) {
      this.favoritService.removeFromFavoriti(proizvodId).subscribe(() => {
        this.favoriti.delete(proizvodId);
      });
    } else {
      this.favoritService.addToFavoriti(proizvodId).subscribe(() => {
        this.favoriti.add(proizvodId);
      });
    }
  }

  getHeartIcon(proizvodId: number) {
    return this.favoriti.has(proizvodId) ? this.faSolidHeart : this.faRegularHeart;
  }
}
