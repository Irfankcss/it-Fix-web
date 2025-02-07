import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProizvodService} from '../../../core/services/product.service';
import {CurrencyPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-proizvod',
  standalone: true,
  templateUrl: './proizvod.component.html',
  styleUrl: './proizvod.component.css',
  imports: [
    CurrencyPipe,
    NgIf
  ]
})
export class ProizvodComponent implements OnInit {
  proizvod: any;

  constructor(
    private route: ActivatedRoute,
    private proizvodService: ProizvodService
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
}
