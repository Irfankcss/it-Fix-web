import { Component, OnInit } from '@angular/core';
import { ProizvodService } from '../../core/services/product.service';
import { KategorijaService } from '../../core/services/kategorija.service';
import { FormsModule } from '@angular/forms';
import { ProizvodListComponent } from '../proizvodi/proizvodi-list/proizvodi-list.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-store',
  standalone: true,
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  imports: [
    FormsModule,
    ProizvodListComponent,
    CommonModule,
    MatSlider,
    MatSliderModule
  ],
})
export class StoreComponent implements OnInit {
  prikaziFiltere: boolean = false;
  proizvodi: any[] = [];
  kategorije: any[] = [];
  ukupnoProizvoda: number = 0;
  kategorijaId: number = 0;
  podkategorijaId: number = 0;
  cijena = { min: 0, max: 10000 };
  polovan: boolean = false;
  searchTerm: string = '';
  sortBy: string = 'cijena';
  sortOrder: string = 'asc';
  page: number = 1;
  pageSize: number = 10;
  odabranaKategorija: any = '';
  prikaziSveKategorije: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private proizvodService: ProizvodService,
    private kategorijaService: KategorijaService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.fetchKategorije();

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.kategorijaId = params['kategorija'] ? Number(params['kategorija']) : 0;
      this.fetchProizvodi();
    });
  }

  fetchKategorije() {
    this.kategorijaService.getKategorije().subscribe(response => {
      this.kategorije = response;
    });
  }

  fetchProizvodi() {
    this.proizvodService.getProizvodi(
      this.kategorijaId,
      this.podkategorijaId,
      this.cijena.min,
      this.cijena.max,
      this.polovan,
      this.searchTerm,
      this.sortBy,
      this.sortOrder,
      this.page,
      this.pageSize
    ).subscribe(response => {
      this.proizvodi = response.proizvodi;
      this.ukupnoProizvoda = response.ukupno;
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.fetchProizvodi();
  }

  onSortChange(sortBy: string) {
    this.sortBy = sortBy;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.fetchProizvodi();
  }

  onSortOrderChange(sortOrder: string) {
    this.sortOrder = sortOrder;
    this.fetchProizvodi();
  }

  updateRange(event: any) {
    const value = event.value;
    const mid = (this.cijena.min + this.cijena.max) / 2;

    if (value < mid) {
      this.cijena.min = value;
    } else {
      this.cijena.max = value;
    }

    this.fetchProizvodi();
  }

  updateMin(event: any) {
    this.cijena.min = event.target.value;
    this.fetchProizvodi();
  }

  updateMax(event: any) {
    this.cijena.max = event.target.value;
    this.fetchProizvodi();
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.fetchProizvodi();
  }

  ponistiKategoirje() {
    this.odabranaKategorija = '';
    this.alertService.showSuccess("Filter kategorije poništen");
    this.kategorijaId = 0;
    this.fetchProizvodi();
  }
}
