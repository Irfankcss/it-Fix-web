import { Component } from '@angular/core';
import { NarudzbaService } from '../../core/services/narudzba.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-posiljka',
  templateUrl: './posiljka.component.html',
  styleUrl: './posiljka.component.css',
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ],
  standalone: true
})
export class PosiljkaComponent {
  narudzbaId: string = '';
  email: string = '';
  narudzba: any = null;
  errorMessage: string = '';

  constructor(private narudzbaService: NarudzbaService) {}

  pratiNarudzbu() {
    if (!this.narudzbaId || !this.email) {
      this.errorMessage = "Molimo unesite ID narudžbe i email.";
      return;
    }

    const id = parseInt(this.narudzbaId, 10);
    if (isNaN(id)) {
      this.errorMessage = "ID narudžbe mora biti broj.";
      return;
    }

    this.narudzbaService.getNarudzbaByIdAndEmail(id, this.email).subscribe({
      next: (data) => {
        this.narudzba = data;
        console.log(this.narudzba);
        this.errorMessage = '';
      },
      error: () => {
        this.narudzba = null;
        this.errorMessage = "Narudžba nije pronađena ili nemate pristup.";
      }
    });
  }
}
