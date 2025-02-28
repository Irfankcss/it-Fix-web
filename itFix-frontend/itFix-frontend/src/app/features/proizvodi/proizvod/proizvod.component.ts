import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProizvodService} from '../../../core/services/product.service';
import {CurrencyPipe, NgIf, NgStyle} from '@angular/common';
import {NajnovijiProizvodiComponent} from '../../najnoviji-proizvodi/najnoviji-proizvodi.component';
import {CartService} from '../../../core/services/cart.service';
import {AlertService} from '../../../core/services/alert.service';
import {AuthService} from '../../../core/services/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-proizvod',
  standalone: true,
  templateUrl: './proizvod.component.html',
  styleUrl: './proizvod.component.css',
  imports: [
    CurrencyPipe,
    NgIf,
    NajnovijiProizvodiComponent,
    FormsModule,
    NgStyle
  ]
})
export class ProizvodComponent implements OnInit {
  proizvod: any;
  brojProizvodaUKorpi: number = 0;
  ukupnaCijena: number = 0;
  kolicina: number = 1;
  prikaziOpis: boolean=true;

  constructor(
    private route: ActivatedRoute,
    private proizvodService: ProizvodService,
    private cartService: CartService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.proizvodService.getProizvodById(id).subscribe({
        next: (data) => (this.proizvod = data),

        error: (err) => console.error('Greška prilikom dohvaćanja proizvoda:', err),
      });
    }

  }

  dodajUKorpu(proizvod:any, kolicina: number) {
    if (!this.isLoggedIn()) {
      this.alertService.showError('Morate biti prijavljeni da biste dodali proizvod u korpu!');
      return;
    }
    this.cartService.addToCart(this.proizvod, kolicina).subscribe({
      next: () => {
        this.alertService.showSuccess('Proizvod dodan u korpu!');
        this.cartService.getCart().subscribe();
        this.azurirajKorpu();
      },
      error: () => {
        this.alertService.showError('Greška prilikom dodavanja u korpu!');
      }
    });
  }

  private azurirajKorpu() {
    this.cartService.getCart().subscribe(korpa => {
      this.brojProizvodaUKorpi = korpa.proizvodi.length;
      this.ukupnaCijena = korpa.proizvodi.reduce((sum: number, p: { cijena: number }) => sum + p.cijena, 0);
    });
  }


  private isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  smanjiKolicinu() {
    this.kolicina--;
  }

  povecajKolicinu() {
    this.kolicina++;
  }
  prikaziZoom(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const zoomDiv = target.querySelector('.zoom-slike') as HTMLElement;
    const imgElement = target.querySelector('img') as HTMLImageElement;

    if (zoomDiv && imgElement) {
      const { offsetX, offsetY } = event;
      const width = imgElement.offsetWidth;
      const height = imgElement.offsetHeight;

      const posX = (offsetX / width) * 100;
      const posY = (offsetY / height) * 100;

      zoomDiv.style.backgroundPosition = `${posX}% ${posY}%`;
      zoomDiv.style.display = 'block';
    }
  }

  sakrijZoom() {
    const zoomDiv = document.querySelector('.zoom-slike') as HTMLElement;
    if (zoomDiv) zoomDiv.style.display = 'none';
  }


}
