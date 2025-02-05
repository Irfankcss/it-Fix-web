import { Component } from '@angular/core';
import {ProizvodiListComponent} from '../proizvodi/proizvodi-list/proizvodi-list.component';
import {ObavijestiCarouselComponent} from '../obavijesti-carousel/obavijesti-carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ObavijestiCarouselComponent,
    ProizvodiListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
