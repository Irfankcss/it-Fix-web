import {Component, OnInit} from '@angular/core';
import {ProizvodService} from '../../core/services/product.service';
import {ProizvodListComponent} from '../proizvodi/proizvodi-list/proizvodi-list.component';
import {DecimalPipe, NgForOf, NgIf, NgOptimizedImage, SlicePipe} from '@angular/common';
import {Router} from '@angular/router';


@Component({
  selector: 'app-najnoviji-proizvodi',
  imports: [
    ProizvodListComponent,
    NgForOf,
    NgIf,
    NgOptimizedImage,
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
    console.log("pozvan");
    this.router.navigate(['/proizvod', porizvodId]);
  }
}
