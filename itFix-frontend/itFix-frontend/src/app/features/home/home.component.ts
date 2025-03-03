import { Component } from '@angular/core';
//import {ProizvodListComponent} from '../proizvodi/proizvodi-list/proizvodi-list.component';
import {ObavijestiCarouselComponent} from '../obavijesti-carousel/obavijesti-carousel.component';
import {NajnovijiProizvodiComponent} from '../najnoviji-proizvodi/najnoviji-proizvodi.component';
import {InfoSekcijaComponent} from '../info-sekcija/info-sekcija.component';
import {IzdvojieniProizvodiComponent} from '../izdvojieni-proizvodi/izdvojieni-proizvodi.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ObavijestiCarouselComponent,
    NajnovijiProizvodiComponent,
    InfoSekcijaComponent,
    IzdvojieniProizvodiComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
