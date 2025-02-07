import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StoreComponent} from '../../store/store.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-proizvod-list',
  templateUrl: './proizvodi-list.component.html',
  styleUrls: ['./proizvodi-list.component.css'],
  standalone: true,
  imports: [FormsModule,
    CommonModule, RouterLink],
})
export class ProizvodListComponent {
  @Input() proizvodi: any[] = [];
}
