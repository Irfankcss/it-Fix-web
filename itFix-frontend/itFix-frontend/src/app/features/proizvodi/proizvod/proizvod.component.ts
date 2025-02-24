import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProizvodService} from '../../../core/services/product.service';
import {CurrencyPipe, NgIf} from '@angular/common';
import {NajnovijiProizvodiComponent} from '../../najnoviji-proizvodi/najnoviji-proizvodi.component';
import {CartService} from '../../../core/services/cart.service';
import {AlertService} from '../../../core/services/alert.service';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-proizvod',
  standalone: true,
  templateUrl: './proizvod.component.html',
  styleUrl: './proizvod.component.css',
  imports: [
    CurrencyPipe,
    NgIf,
    NajnovijiProizvodiComponent
  ]
})
export class ProizvodComponent implements OnInit {
  proizvod: any;
  brojProizvodaUKorpi: number = 0;
  ukupnaCijena: number = 0;

  constructor(
    private route: ActivatedRoute,
    private proizvodService: ProizvodService,
    private cartService: CartService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Dohvati ID iz URL-a
    if (id) {
      this.proizvodService.getProizvodById(id).subscribe({
        next: (data) => (this.proizvod = data),
        error: (err) => console.error('Greška prilikom dohvaćanja proizvoda:', err),
      });
    }
  }

  dodajuKorpu() {
    if (!this.isLoggedIn()) {
      this.alertService.showError('Morate biti prijavljeni da biste dodali proizvod u korpu!');
      return;
    }
    this.cartService.addToCart(this.proizvod, 1).subscribe({
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
}
