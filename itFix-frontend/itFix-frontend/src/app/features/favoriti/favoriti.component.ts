import { Component, OnInit } from '@angular/core';
import {FavoritiProizvodDto, FavoritService} from '../../core/services/favorit.service';
import {DecimalPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {CartService} from '../../core/services/cart.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-favoriti',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DecimalPipe,
    SlicePipe
  ],
  templateUrl: './favoriti.component.html',
  styleUrls: ['./favoriti.component.css']
})
export class FavoritiComponent implements OnInit {
  favoriti: FavoritiProizvodDto[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private favoritService: FavoritService, private cartService: CartService, private router:Router) {}

  ngOnInit() {
    this.ucitajFavorite();
    console.log("favoriti",this.favoriti);
  }

  ucitajFavorite() {
    this.favoritService.getFavoriti().subscribe({
      next: (res) => {
        this.favoriti = res.proizvodi;
        console.log("favoriti",this.favoriti);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Neuspješno dohvaćanje favorita.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  izbaciIzFavorita(proizvodId: number) {
    this.favoritService.removeFromFavoriti(proizvodId).subscribe({
      next: () => {
        this.favoriti = this.favoriti.filter(p => p.proizvodId !== proizvodId);
      },
      error: (err) => {
        console.error('Greška pri uklanjanju proizvoda iz favorita:', err);
      }
    });
  }

  dodajUKorpu(proizvodId: any) {
    this.cartService.addToCart(proizvodId, 1).subscribe({
      next: () => {
        this.router.navigate(['/korpa']);
      },
      error: (err) => {
        console.error('Greška pri dodavanju proizvoda u korpu:', err);
      }
    })
  }
}
