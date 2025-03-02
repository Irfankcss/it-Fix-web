import {Component, OnInit} from '@angular/core';
import {ObavijestService} from '../../core/services/obavijest.service';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {Obavijest} from '../../interfaces/Obavijest';

@Component({
  selector: 'app-obavijesti-carousel',
  standalone: true,
  imports: [NgbCarouselModule, HttpClientModule, CommonModule, NgFor] ,
  templateUrl: './obavijesti-carousel.component.html',
  styleUrl: './obavijesti-carousel.component.css'
})
export class ObavijestiCarouselComponent implements OnInit {
  obavijesti: Obavijest[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private obavijestService: ObavijestService, private router: Router) {}

  ngOnInit(): void {
    this.loadObavijesti();
  }

  loadObavijesti(): void {
    this.obavijestService.getObavijesti().subscribe({
      next: (data) => {
        this.obavijesti = data;
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.message || 'Greška pri učitavanju obavijesti';
        this.isLoading = false;
      }
    });
  }
  OtvoriObavjest(obv: any): void {
    if (obv.searchTerm && obv.searchTerm.trim() !== '') {
      this.router.navigate(['/prodavnica'], { queryParams: { search: obv.searchTerm } });
    }
  }
}
