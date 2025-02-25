import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgForOf} from '@angular/common';
import {Narudzba} from '../../interfaces/Narudzba';
import {NarudzbaService} from '../../core/services/narudzba.service';

@Component({
  selector: 'app-narudzba-management',
  imports: [
    DatePipe,
    NgForOf,
    CurrencyPipe
  ],
  standalone: true,
  templateUrl: './narudzba-management.component.html',
  styleUrl: './narudzba-management.component.css'
})
export class NarudzbaManagementComponent implements OnInit{
  narudzbe: Narudzba[] = [];
  filtriraneNarudzbe: Narudzba[] = [];
  trenutniFilter: string = 'Sve';
  constructor(private narudzbaService: NarudzbaService) {}

  ngOnInit(): void {
    this.getNarudzbe();
  }

  getNarudzbe(): void {
    this.narudzbaService.getNarudzbe().subscribe((response: any[]) => {
      this.narudzbe = response.map(narudzba => ({
        narudzbaId: narudzba.narudzbaId,
        email: narudzba.email,
        imePrezime: `${narudzba.ime} ${narudzba.prezime}`,
        brojTelefona: narudzba.brojTelefona,
        adresaGrad: `${narudzba.adresaDostave}, ${narudzba.grad}`,
        datumKreiranja: narudzba.datumKreiranja,
        ukupnaCijena: narudzba.ukupnaCijena,
        status: narudzba.status,
        napomena: narudzba.napomena,
        proizvodi: narudzba.narudzbaProizvodi.map((p: any) => ({
          naziv: p.proizvod.naziv,
          cijena: p.proizvod.cijena,
          slikaUrl: p.proizvod.slikaUrl
        }))
      }));
      this.filterNarudzbe(this.trenutniFilter);

    });
  }
  filterNarudzbe(status: string): void{
    this.trenutniFilter = status;
    if (this.trenutniFilter === 'Sve') {
        this.getNarudzbe();
        this.filtriraneNarudzbe = this.narudzbe;
    } else {
      this.filtriraneNarudzbe = this.narudzbe.filter(n => n.status === this.trenutniFilter);
    }
  }

  updateStatus(id: number, noviStatus: string): void {
    const narudzba = this.narudzbe.find(n => n.narudzbaId === id);
    if (narudzba) {
      const azuriranaNarudzba = { ...narudzba, status: noviStatus };
      this.narudzbaService.updateNarudzba(id, azuriranaNarudzba).subscribe(() => {
        narudzba.status = noviStatus;
        this.filterNarudzbe(this.trenutniFilter);

      });
    }
  }
  deleteNarudzba(id: number): void {
    if (confirm('Jeste li sigurni da želite obrisati ovu narudžbu?')) {
      this.narudzbaService.deleteNarudzba(id).subscribe(() => {
        this.narudzbe = this.narudzbe.filter(n => n.narudzbaId !== id);
        this.filterNarudzbe(this.trenutniFilter);

      });
    }
  }
}
