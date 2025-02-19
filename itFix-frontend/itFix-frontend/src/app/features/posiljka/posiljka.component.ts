import { Component } from '@angular/core';
import { NarudzbaService } from '../../core/services/narudzba.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AlertService} from '../../core/services/alert.service';

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

  constructor(private narudzbaService: NarudzbaService, private alertService: AlertService) {}

  pratiNarudzbu() {
    if (!this.narudzbaId || !this.email) {
      this.alertService.showError("Molimo unesite ID narudžbe i email.");
      return;
    }

    const id = parseInt(this.narudzbaId, 10);
    if (isNaN(id)) {
      this.alertService.showError("ID mora biti broj.");
      return;
    }

    this.narudzbaService.getNarudzbaByIdAndEmail(id, this.email).subscribe({
      next: (data) => {
        this.narudzba = data;
        console.log(this.narudzba);

      },
      error: () => {
        this.narudzba = null;
        this.alertService.showError("Narudžba nije pronađena ili nemate pristup.");
      }
    });
  }
}
