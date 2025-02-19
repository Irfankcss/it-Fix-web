import {Component, OnInit} from '@angular/core';
import {ProizvodService} from '../../core/services/product.service';
import {DecimalPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {Router} from '@angular/router';


@Component({
  selector: 'app-najnoviji-proizvodi',
  imports: [
    NgForOf,
    NgIf,
    SlicePipe,
    DecimalPipe
  ],
  standalone: true,
  templateUrl: './najnoviji-proizvodi.component.html',
  styleUrl: './najnoviji-proizvodi.component.css'
})
export class NajnovijiProizvodiComponent implements OnInit {
  najnovijiProizvodi: any[] = [];
  constructor(private proizvodService: ProizvodService, private router: Router) {
  }
  ngOnInit(): void {
    this.proizvodService.getNajnovijiProizvodi().subscribe({
      next: (data) => this.najnovijiProizvodi = data,
      error: (err) => console.error('Greška pri dohvaćanju proizvoda:', err)
    });
  }

  otvoriProizvod(porizvodId: any) {
    this.router.navigate(['/proizvod', porizvodId]);
  }
}
