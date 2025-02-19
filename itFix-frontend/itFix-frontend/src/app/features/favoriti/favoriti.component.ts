import { Component, OnInit } from '@angular/core';
import {FavoritiProizvodDto, FavoritService} from '../../core/services/favorit.service';
import {DecimalPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {CartService} from '../../core/services/cart.service';
import {Router} from '@angular/router';
import {AlertService} from '../../core/services/alert.service';
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

  constructor(private favoritService: FavoritService, private cartService: CartService, private router:Router,
              private alertService: AlertService) {}

  ngOnInit() {
    this.ucitajFavorite();
    console.log("favoriti",this.favoriti);
  }

  ucitajFavorite() {
    this.favoritService.getFavoriti().subscribe({
      next: (res) => {
        this.favoriti = res.proizvodi;
        this.loading = false;
      },
      error: (err) => {
        this.alertService.showError('Greska pri ucitavanju favorita');
        console.error(err);
        this.loading = false;
      }
    });
  }

  izbaciIzFavorita(proizvodId: number) {
    this.favoritService.removeFromFavoriti(proizvodId).subscribe({
      next: () => {
        this.favoriti = this.favoriti.filter(p => p.proizvodId !== proizvodId);
        this.alertService.showSuccess('Proizvod izbrisan iz favorita');
      },
      error: (err) => {
        this.alertService.showError('Greska pri brisanju proizvoda iz favorita');
      }
    });
  }

  dodajUKorpu(proizvodId: any) {
      this.router.navigate(['/proizvod', proizvodId]);
  }
}
