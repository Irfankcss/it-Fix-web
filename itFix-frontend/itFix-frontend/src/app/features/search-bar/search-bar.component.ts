import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LayoutService} from '../../core/services/layout.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  standalone: true,
  imports: [NgIf, FormsModule],
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchTerm: string = '';
  private searchSubject = new Subject<string>();


  @Output() searchEvent = new EventEmitter<string>();

  constructor(private route: ActivatedRoute, private router:Router) {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search']; // Postavi searchTerm iz URL-a
      }
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.searchEvent.emit(searchTerm);
    });
  }


  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  otovriKorpu() {
    this.router.navigate(['/korpa']);
  }
}
