import {Component, OnInit} from '@angular/core';
import {ObavijestService} from '../../core/services/obavijest.service';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule, NgFor} from '@angular/common';

@Component({
  selector: 'app-obavijesti-carousel',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule, CommonModule, NgFor] ,
  templateUrl: './obavijesti-carousel.component.html',
  styleUrl: './obavijesti-carousel.component.css'
})
export class ObavijestiCarouselComponent implements OnInit {
  obavijesti: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private obavijestService: ObavijestService) { }

  ngOnInit(): void {
    this.loadObavijesti();
  }

  loadObavijesti(): void {
    this.obavijestService.getObavijesti().subscribe({
      next: data => {
        // Pretpostavljamo da API vraća listu obavijesti u formatu:
        // { id, naslov, tekst, slikaUrl, datumObjave, datumIsteka, prioritet }
        this.obavijesti = data;
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.message || 'Greška pri učitavanju obavijesti';
        this.isLoading = false;
      }
    });
  }
}
