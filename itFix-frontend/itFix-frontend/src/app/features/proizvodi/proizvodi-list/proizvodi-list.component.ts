import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StoreComponent} from '../../store/store.component';
import {RouterLink,Router} from '@angular/router';
import {round} from '@popperjs/core/lib/utils/math';
import {FavoritService} from '../../../core/services/favorit.service';

@Component({
  selector: 'app-proizvod-list',
  templateUrl: './proizvodi-list.component.html',
  styleUrls: ['./proizvodi-list.component.css'],
  standalone: true,
  imports: [FormsModule,
    CommonModule],
})
export class ProizvodListComponent {
  @Input() proizvodi: any[] = [];
  constructor(private router: Router, private favoritService: FavoritService) {}

  otvoriProizvod(id:number) {
    this.router.navigate(['/proizvod',id]);
  }

  dodajUFavorit(proizvodId: number, event: Event) {
    event.stopPropagation();

    this.favoritService.addToFavoriti(proizvodId).subscribe(
      () => {
        console.log('Proizvod dodan u favorite');
      },
      (error) => {
        console.error('Greška pri dodavanju u favorite', error);
      }
    );
  }
}
