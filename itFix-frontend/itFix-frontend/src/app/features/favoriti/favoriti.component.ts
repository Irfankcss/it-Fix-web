import { Component, OnInit } from '@angular/core';
import {FavoritiProizvodDto, FavoritService} from '../../core/services/favorit.service';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
@Component({
  selector: 'app-favoriti',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DecimalPipe
  ],
  templateUrl: './favoriti.component.html',
  styleUrls: ['./favoriti.component.css']
})
export class FavoritiComponent implements OnInit {
  favoriti: FavoritiProizvodDto[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private favoritService: FavoritService) {}

  ngOnInit() {
    this.ucitajFavorite();
  }

  ucitajFavorite() {
    this.favoritService.getFavoriti().subscribe({
      next: (res) => {
        this.favoriti = res.proizvodi;
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
}
