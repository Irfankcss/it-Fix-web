import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import { NarudzbaService } from '../../core/services/narudzba.service';

interface KorpaProizvod {
  proizvodId: number;
  naziv: string;
  cijena: number;
  kolicina: number;
  slika: string;
}

@Component({
  selector: 'app-korpa',
  standalone: true,
  imports: [
    FormsModule,

    NgIf,
    NgForOf,
    SlicePipe,
    DecimalPipe
  ],
  templateUrl: './korpa.component.html',
  styleUrls: ['./korpa.component.css']
})
export class KorpaComponent implements OnInit {
  korak: number = 1;
  korpaProizvodi: KorpaProizvod[] = [];
  ukupno: number = 0;
  podaciNarudzbe = {
    ime: '',
    prezime: '',
    email: '',
    brojTelefona: '',
    grad: '',
    adresaDostave: ''
  };
  greskaPoruka: string = '';

  constructor(private korpaService: CartService, private narudzbaService: NarudzbaService) {}

  ngOnInit() {
    this.ucitajKorpu();
  }

  ucitajKorpu() {
    this.korpaService.getCart().subscribe(korpa => {
      this.korpaProizvodi = korpa.proizvodi.map((item: any) => ({
        proizvodId: item.proizvod.proizvodId,
        naziv: item.proizvod.naziv,
        cijena: item.proizvod.cijena,
        slika: item.proizvod.slikaUrl,
        kolicina: item.kolicina
      }));
      this.izracunajUkupno();
    });
  }

  izracunajUkupno() {
    this.ukupno = this.korpaProizvodi.reduce((sum, p) => sum + p.cijena * p.kolicina, 0);
  }

  ukloniIzKorpe(proizvodId: number) {
    this.korpaService.removeFromCart(proizvodId).subscribe(() => {
      this.korpaProizvodi = this.korpaProizvodi.filter(p => p.proizvodId !== proizvodId);
      this.izracunajUkupno();
    });
  }

  dalje() {
    if (this.korak === 2 && !this.svaPoljaPopunjena()) {
      this.greskaPoruka = 'Molimo popunite sva polja!';
      return;
    }

    this.greskaPoruka = ''; // Reset poruke greške
    if (this.korak < 3) this.korak++;
  }

  nazad() {
    if (this.korak > 1) this.korak--;
  }

  svaPoljaPopunjena(): boolean {
    return Object.values(this.podaciNarudzbe).every(value => value.trim() !== '');
  }

  kreirajNarudzbu() {
    if (!this.svaPoljaPopunjena()) {
      this.greskaPoruka = 'Molimo popunite sva polja!';
      return;
    }

    const narudzba = {
      ...this.podaciNarudzbe,
      ukupnaCijena: this.ukupno,
      proizvodi: this.korpaProizvodi.map(p => ({
        proizvodId: p.proizvodId,
        kolicina: p.kolicina
      }))
    };

    this.narudzbaService.kreirajNarudzbu(narudzba).subscribe(
      response => {
        console.log('Narudžba uspješno kreirana:', response);
        alert('Narudžba je uspješno kreirana!');

        // Reset korpe i podataka
        this.korpaProizvodi = [];
        this.korak = 1;
        this.podaciNarudzbe = {
          ime: '',
          prezime: '',
          email: '',
          brojTelefona: '',
          grad: '',
          adresaDostave: ''
        };
      },
      error => {
        console.error('Greška prilikom kreiranja narudžbe:', error);
        alert('Došlo je do greške prilikom kreiranja narudžbe.');
      }
    );
  }
}
