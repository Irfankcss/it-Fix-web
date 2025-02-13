import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProizvodService} from '../../../core/services/product.service';
import {CurrencyPipe, NgIf} from '@angular/common';
import {NajnovijiProizvodiComponent} from '../../najnoviji-proizvodi/najnoviji-proizvodi.component';
import {CartService} from '../../../core/services/cart.service';

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

  constructor(
    private route: ActivatedRoute,
    private proizvodService: ProizvodService,
    private cartService: CartService
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
    this.cartService.addToCart(this.proizvod,1).subscribe();
    alert("Dodan u korpu")  ;
  }
}
