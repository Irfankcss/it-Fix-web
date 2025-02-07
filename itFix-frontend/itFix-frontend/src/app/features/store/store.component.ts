import { Component, OnInit } from '@angular/core';
import { ProizvodService } from '../../core/services/product.service';
import { KategorijaService } from '../../core/services/kategorija.service';
import { FormsModule } from '@angular/forms';
import { ProizvodListComponent } from '../proizvodi/proizvodi-list/proizvodi-list.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-store',
  standalone: true,
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  imports: [
    FormsModule,
    ProizvodListComponent,
    CommonModule,
    SearchBarComponent
  ],
})
export class StoreComponent implements OnInit {
  proizvodi: any[] = [];
  kategorije: any[] = [];
  ukupnoProizvoda: number = 0;
  kategorijaId: number = 0;
  podkategorijaId: number = 0;
  minCijena: number = 0;
  maxCijena: number = 0;
  polovan: boolean = false;
  searchTerm: string = ''; // ✔ Dodano
  sortBy: string = 'naziv';
  sortOrder: string = 'asc';
  page: number = 1;
  pageSize: number = 10;

  constructor(private proizvodService: ProizvodService, private kategorijaService: KategorijaService) {}

  ngOnInit() {
    this.fetchKategorije();
    this.fetchProizvodi();
  }

  fetchKategorije() {
    this.kategorijaService.getKategorije().subscribe(response => {
      this.kategorije = response;
    }, error => {
      console.error("Greška pri dohvatu kategorija:", error);
    });
  }

  fetchProizvodi() {
    console.log("Šaljem searchTerm:", this.searchTerm); // 👀 Log za provjeru
    this.proizvodService.getProizvodi(
      this.kategorijaId,
      this.podkategorijaId,
      this.minCijena,
      this.maxCijena,
      this.polovan,
      this.searchTerm,
      this.sortBy,
      this.sortOrder,
      this.page,
      this.pageSize
    ).subscribe(response => {
      console.log("Dobijeni proizvodi:", response);
      this.proizvodi = response.proizvodi;
      this.ukupnoProizvoda = response.ukupno;
    }, error => {
      console.error("Greška pri dohvatu proizvoda:", error);
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

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm; // ✔ Postavljamo searchTerm
    this.fetchProizvodi(); // ✔ API sada filtrira rezultate
  }
}
