import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DecimalPipe, NgForOf, NgIf, SlicePipe } from '@angular/common';
import { ProizvodService } from '../../core/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-izdvojieni-proizvodi',
  imports: [
    DecimalPipe,
    NgForOf,
    NgIf,
    SlicePipe
  ],
  standalone: true,
  templateUrl: './izdvojieni-proizvodi.component.html',
  styleUrl: './izdvojieni-proizvodi.component.css'
})
export class IzdvojieniProizvodiComponent implements OnInit {
  @ViewChild('scrollableGrid', { static: false }) scrollableGrid!: ElementRef;
  Proizvodi: any[] = [];

  constructor(private proizvodService: ProizvodService, private router: Router) {}

  ngOnInit(): void {
    this.proizvodService.getIzdvojeniProizvodi().subscribe({
      next: (data) => this.Proizvodi = data.reverse(),
      error: (err) => console.error('Greška pri dohvaćanju proizvoda:', err)
    });
  }

  otvoriProizvod(proizvodId: any) {
    this.router.navigate(['/proizvod', proizvodId]);
  }

  scrollLeft() {
    if (this.scrollableGrid?.nativeElement) {
      const scrollAmount = window.innerWidth < 768 ? 335 : 335;
      this.scrollableGrid.nativeElement.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.scrollableGrid?.nativeElement) {
      const scrollAmount = window.innerWidth < 768 ? 335 : 335;
      this.scrollableGrid.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
