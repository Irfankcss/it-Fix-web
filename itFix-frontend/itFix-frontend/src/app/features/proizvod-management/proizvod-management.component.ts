import { Component, OnInit } from '@angular/core';
import { Proizvod } from '../../interfaces/Proizvod';
import { ProizvodService } from '../../core/services/product.service';
import { KategorijaService } from '../../core/services/kategorija.service';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Kategorija} from '../../interfaces/Kategorija';

@Component({
  selector: 'app-proizvod-management',
  imports: [
    NgForOf,
    CurrencyPipe,
    FormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './proizvod-management.component.html',
  styleUrl: './proizvod-management.component.css'
})
export class ProizvodManagementComponent implements OnInit {
  proizvodi: Proizvod[] = [];
  kategorije: Kategorija[] = [];
  showEditModal = false;
  showAddModal = false;
  editProizvodData: Proizvod | null = null;
  newProizvod: Proizvod = this.initProizvod();

  constructor(private productService: ProizvodService, private kategorijaService: KategorijaService) {}

  ngOnInit() {
    this.loadProizvodi();
    this.loadKategorije();
  }

  loadProizvodi() {
    this.productService.getProizvodiAdmin().subscribe(response => {
      this.proizvodi = response;
    });
  }

  loadKategorije() {
    this.kategorijaService.getKategorije().subscribe(response => {
      this.kategorije = response;
    });
  }

  openEditModal(proizvod: Proizvod) {
    this.editProizvodData = { ...proizvod };
    this.showEditModal = true;
  }

  openAddModal() {
    this.newProizvod = this.initProizvod();
    this.showAddModal = true;
  }

  updateProizvod() {
    if (!this.editProizvodData) return;

    this.productService.updateProizvod(this.editProizvodData.proizvodId, this.editProizvodData).subscribe(() => {
      console.log("Proizvod uspješno ažuriran:", this.editProizvodData);
      this.showEditModal = false;
      this.loadProizvodi();
    });
  }

  addProizvod() {
    this.newProizvod.podkategorijaId = 1;

    this.productService.createProizvod(this.newProizvod).subscribe(() => {
      console.log("Proizvod uspješno dodan:", this.newProizvod);
      this.showAddModal = false;
      this.loadProizvodi(); // Osvježavanje liste proizvoda
    });
  }

  deleteProizvod(proizvodId: number) {
    if (confirm("Da li ste sigurni da želite obrisati ovaj proizvod?")) {
      this.productService.deleteProizvod(proizvodId).subscribe(() => {
        console.log("Proizvod uspješno obrisan:", proizvodId);
        this.loadProizvodi();
      });
    }
  }

  private initProizvod(): Proizvod {
    return {
      proizvodId: 0,
      naziv: '',
      opis: '',
      cijena: 0,
      cijenaSaPopustom: 0,
      slikaUrl: '',
      polovan: false,
      popust: 0,
      ocjena: null,
      naRate: false,
      brojRecenzija: 0,
      garancijaMjeseci: 0,
      kategorijaId: 0,
      podkategorijaId: 0
    };
  }
}
