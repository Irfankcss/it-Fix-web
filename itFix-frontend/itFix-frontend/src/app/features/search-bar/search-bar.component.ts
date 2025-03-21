import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { DecimalPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faHeart as faHeartRegular } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FavoritService } from '../../core/services/favorit.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  standalone: true,
  imports: [NgIf, FormsModule, FaIconComponent, DecimalPipe],
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchTerm: string = '';
  brojFavorita: number = 0;
  brojProizvodaUKorpi: number = 0;
  ukupnaCijena: number = 0;
  private searchSubject = new Subject<string>();
  faHeart = faHeartRegular;
  faShoppingCart = faShoppingCart;
  isLoggedIn: boolean = false;

  @Output() searchEvent = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritService: FavoritService,
    private korpaService: CartService,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.searchEvent.emit(searchTerm);
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  otvoriFavorite() {
    if (!this.isLoggedIn) {
      this.alertService.showError('Morate biti prijavljeni da biste vidjeli favorite.');
      this.router.navigate(['/prijava']);
      return;
    }
    this.router.navigate(['/favoriti']);
  }

  otvoriKorpu() {
    if (!this.isLoggedIn) {
      this.alertService.showError('Morate biti prijavljeni da biste vidjeli korpu.');
      this.router.navigate(['/prijava']);
      return;
    }
    this.router.navigate(['/korpa']);
  }

  ucitajFavorite() {
    if (this.isLoggedIn) {
      this.favoritService.getFavoritiProizvodi().subscribe((favoriti: number[]) => {
        this.brojFavorita = favoriti.length;
      });
    }
  }

  ucitajKorpu() {
    if (this.isLoggedIn) {
      this.korpaService.getCart().subscribe(korpa => {
        this.brojProizvodaUKorpi = korpa.proizvodi.length;
        this.ukupnaCijena = this.izracunajUkupnuCijenu(korpa.proizvodi);
      });
    }
  }
  private izracunajUkupnuCijenu(proizvodi: { proizvod: { cijena: number, popust: number }, kolicina: number }[]): number {
    return proizvodi.reduce((sum, p) => {
      let konacnaCijena = p.proizvod.cijena;

      if (p.proizvod.popust > 0) {
        konacnaCijena = p.proizvod.cijena * (1 - p.proizvod.popust / 100);
      }

      return sum + (konacnaCijena * p.kolicina);
    }, 0);
  }

  ngOnInit() {
    this.authService.authStatus$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;

      if (isLoggedIn) {
        setTimeout(() => {
          this.ucitajFavorite();
          this.ucitajKorpu();
        }, 500);
      } else {
        this.brojFavorita = 0;
        this.brojProizvodaUKorpi = 0;
        this.ukupnaCijena = 0;
      }
    });


    this.favoritService.getFavoritiCount().subscribe(count => {
      this.brojFavorita = count;
    });

    this.korpaService.getCartUpdates().subscribe(korpa => {
      this.brojProizvodaUKorpi = korpa.proizvodi.length;
      this.ukupnaCijena = this.izracunajUkupnuCijenu(korpa.proizvodi);
    });
  }



}
