import { Component, OnInit } from '@angular/core';
import { Obavijest } from '../../interfaces/Obavijest';
import { ObavijestService } from '../../core/services/obavijest.service';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-obavijesti-management',
  imports: [
    DatePipe,
    NgForOf,
    FormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './obavijesti-management.component.html',
  styleUrls: ['./obavijesti-management.component.css']
})
export class ObavijestiManagementComponent implements OnInit {
  obavijesti: Obavijest[] = [];
  showEditModal: boolean = false;
  showAddModal: boolean = false;
  editObavijestData: Obavijest = {
    id: 0,
    naslov: '',
    tekst: '',
    slikaUrl: '',
    datumObjave: Date.now().toString(),
    datumIsteka: '',
    searchTerm: '',
    prioritet: 1
  };

  newObavijest: Obavijest = {
    id: 0,
    naslov: '',
    tekst: '',
    slikaUrl: '',
    datumObjave: '',
    datumIsteka: '',
    searchTerm: '',
    prioritet: 1
  };

  constructor(private obavijestService: ObavijestService) {}

  ngOnInit(): void {
    this.loadObavijesti();
  }

  loadObavijesti(): void {
    this.obavijestService.getObavijesti().subscribe({
      next: (data) => {
        this.obavijesti = data;
      },
      error: error => {
        console.error('Došlo je do greške:', error);
      }
    });
  }

  deleteObavijest(id: number): void {
    if (confirm('Jeste li sigurni da želite obrisati ovu obavijest?')) {
      this.obavijestService.deleteObavijest(id).subscribe(() => {
        this.obavijesti = this.obavijesti.filter(obavijest => obavijest.id !== id);
      });
    }
  }

  openEditModal(obavijest: Obavijest): void {
    this.editObavijestData = { ...obavijest };
    this.showEditModal = true;
  }

  updateObavijest(): void {
    if (!this.editObavijestData) return;
    this.obavijestService.editObavijest(
      this.editObavijestData.id,
      this.editObavijestData.naslov,
      this.editObavijestData.tekst,
      this.editObavijestData.slikaUrl,
      this.editObavijestData.datumObjave,
      this.editObavijestData.datumIsteka,
      this.editObavijestData.searchTerm,
      this.editObavijestData.prioritet
    ).subscribe(() => {
      this.loadObavijesti();
      this.showEditModal = false;
    });
  }

  openAddModal(): void {
    this.newObavijest = {
      id: 0,
      naslov: '',
      tekst: '',
      slikaUrl: '',
      datumObjave: '',
      datumIsteka: '',
      searchTerm: '',
      prioritet: 1
    };
    this.showAddModal = true;
  }

  addObavijest(): void {
    this.obavijestService.addObavijest(
      this.newObavijest.naslov,
      this.newObavijest.tekst,
      this.newObavijest.slikaUrl,
      this.newObavijest.datumObjave,
      this.newObavijest.datumIsteka,
      this.newObavijest.searchTerm,
      this.newObavijest.prioritet
    ).subscribe(() => {
      this.loadObavijesti();
      this.showAddModal = false;
    });
  }
}
