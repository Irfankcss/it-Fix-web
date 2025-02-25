import { Component, OnInit } from '@angular/core';
import { KategorijaService } from '../../core/services/kategorija.service';
import { Kategorija } from '../../interfaces/Kategorija';
import {NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kategorija-management',
  imports: [NgForOf, FormsModule, NgIf],
  standalone: true,
  templateUrl: './kategorija-management.component.html',
  styleUrl: './kategorija-management.component.css'
})
export class KategorijaManagementComponent implements OnInit {
  kategorije: Kategorija[] = [];
  isModalOpen = false;
  nazivKategorije = '';
  editingKategorija: Kategorija | null = null;

  constructor(private kategorijaService: KategorijaService) {}

  ngOnInit(): void {
    this.loadKategorije();
  }

  private loadKategorije() {
    this.kategorijaService.getKategorije().subscribe(kategorije => {
      this.kategorije = kategorije;
    });
  }

  deleteKategorija(kategorijaId: number) {
    if (confirm('Jeste li sigurni da želite obrisati ovu kategoriju?')) {
      this.kategorijaService.deleteKategorija(kategorijaId).subscribe(() => {
        this.kategorije = this.kategorije.filter(kategorija => kategorija.kategorijaId !== kategorijaId);
      });
    }
  }

  openModal(kategorija?: Kategorija) {
    this.isModalOpen = true;
    if (kategorija) {
      this.editingKategorija = kategorija;
      this.nazivKategorije = kategorija.naziv;
    } else {
      this.editingKategorija = null;
      this.nazivKategorije = '';
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingKategorija = null;
    this.nazivKategorije = '';
  }

  saveKategorija() {
    if (this.nazivKategorije.trim() === '') return;

    if (this.editingKategorija) {
      this.kategorijaService.editKategorija(this.editingKategorija.kategorijaId, this.nazivKategorije)
        .subscribe(() => {
          this.loadKategorije();
          this.closeModal();
        });
    } else {
      this.kategorijaService.addKategorija(this.nazivKategorije)
        .subscribe(() => {
          this.loadKategorije();
          this.closeModal();
        });
    }
  }
}
