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
    private authService: AuthService
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
    this.router.navigate(['/favoriti']);
  }

  otvoriKorpu() {
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
      this.korpaService.getCart().subscribe((korpa) => {
        this.brojProizvodaUKorpi = korpa.proizvodi.length;
        this.ukupnaCijena = korpa.proizvodi.reduce((sum: number, p: { cijena: number }) => sum + p.cijena, 0);
      });
    }
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.ucitajFavorite();
    this.ucitajKorpu();
  }
}
