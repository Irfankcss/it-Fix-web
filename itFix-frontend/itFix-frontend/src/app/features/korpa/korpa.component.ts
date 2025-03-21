import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import { NarudzbaService } from '../../core/services/narudzba.service';
import {Router} from '@angular/router';
import {AlertService} from '../../core/services/alert.service';
import {Proizvod} from '../../interfaces/Proizvod';
import {AuthService} from '../../core/services/auth.service';

interface KorpaProizvod {
  proizvod: Proizvod;
  kolicina: number;
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

  constructor(private korpaService: CartService, private narudzbaService: NarudzbaService,
              private router: Router, private alertService: AlertService, private authService: AuthService) {}

  ngOnInit() {
    if(!this.isLoggedIn()){
      this.router.navigate(['/login']);
      this.alertService.showError("Morate biti prijavljeni da biste vidjeli korpu");
      return;
    }
    this.ucitajKorpu();
  }

  ucitajKorpu() {
    this.korpaService.getCart().subscribe(korpa => {
      if (!korpa || !korpa.proizvodi) {
        console.error("Korpa je undefined ili nema proizvode!");
        return;
      }

      this.korpaProizvodi = korpa.proizvodi.map((item: any) => ({
        proizvod: item.proizvod,
        kolicina: item.kolicina
      }));
      this.izracunajUkupno();
    });
  }


  izracunajUkupno() {
    this.ukupno = this.korpaProizvodi.reduce((sum, p) => {
      const konacnaCijena = p.proizvod.cijena * (1 - p.proizvod.popust / 100);
      return sum + konacnaCijena * p.kolicina;
    }, 0);
  }

  ukloniIzKorpe(proizvodId: number) {
    this.korpaService.removeFromCart(proizvodId).subscribe(() => {
      this.korpaProizvodi = this.korpaProizvodi.filter(p => p.proizvod.proizvodId !== proizvodId);
      this.alertService.showSuccess("Proizvod uklonjen iz korpe");
      window.location.reload();
      this.izracunajUkupno();
    });
  }

  dalje() {
    if (this.korak === 2 && !this.svaPoljaPopunjena()) {
      this.alertService.showError("Molimo popunite sva polja!");
      return;
    }

    if (this.korak < 3) this.korak++;
  }

  nazad() {
    if (this.korak > 1) this.korak--;
  }

  svaPoljaPopunjena(): boolean {
    return Object.values(this.podaciNarudzbe).every(value => value.trim() !== '');
  }

  validirajPodatke(): boolean {
    const regexImePrezime = /^[A-ZĆČĐŠŽa-zćčđšž]+(?:\s[A-ZĆČĐŠŽa-zćčđšž]+)*$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexBrojTelefona = /^[+]?[0-9\s\-\/]+$/;
    const regexGrad = /^[A-ZĆČĐŠŽa-zćčđšž\s]+$/;
    const regexAdresa = /^[A-ZĆČĐŠŽa-zćčđšž0-9\s,.-]+$/;

    if (!regexImePrezime.test(this.podaciNarudzbe.ime)) {
      this.alertService.showError("Neispravno ime");
      return false;
    }
    if (!regexImePrezime.test(this.podaciNarudzbe.prezime)) {
      this.alertService.showError("Neispravno prezime");
      return false;
    }
    if (!regexEmail.test(this.podaciNarudzbe.email)) {
      this.alertService.showError("Neispravan email");
      return false;
    }
    if (!regexBrojTelefona.test(this.podaciNarudzbe.brojTelefona)) {
      this.alertService.showError("Neispravan broj telefona");
      return false;
    }
    if (!regexGrad.test(this.podaciNarudzbe.grad)) {
      this.alertService.showError("Neispravan naziv grada");
      return false;
    }
    if (!regexAdresa.test(this.podaciNarudzbe.adresaDostave)) {
      this.alertService.showError("Neispravna adresa dostave");
      return false;
    }

    return true;
  }

  kreirajNarudzbu() {
    if (!this.svaPoljaPopunjena()) {
      this.alertService.showError("Molimo popunite sva polja sa podacima za narudžbu!");
      return;
    }
    if(!this.validirajPodatke()) {
      return;
    }

    const narudzba = {
      ...this.podaciNarudzbe,
      ukupnaCijena: this.ukupno,
      proizvodi: this.korpaProizvodi.map(p => ({
        proizvodId: p.proizvod.proizvodId,
        kolicina: p.kolicina
      }))
    };

    this.narudzbaService.kreirajNarudzbu(narudzba).subscribe(
      response => {
        this.alertService.showSuccess('Narudžba uspješno kreirana');

        this.korpaService.resetKorpa().subscribe(() => {
          this.korpaProizvodi = [];
          this.ukupno = 0;
        });
        this.podaciNarudzbe = {
          ime: '',
          prezime: '',
          email: '',
          brojTelefona: '',
          grad: '',
          adresaDostave: ''
        };
        this.router.navigate(['/narudzba', response.narudzbaId]);

      },
      error => {
        this.alertService.showError('Greška pri kreiranju narudžbe');
      }
    );
  }

  private isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
