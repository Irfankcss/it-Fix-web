import { Component } from '@angular/core';
import {InfoSekcijaComponent} from '../info-sekcija/info-sekcija.component';

@Component({
  selector: 'app-kontakt',
  imports: [
    InfoSekcijaComponent
  ],
  standalone: true,
  templateUrl: './kontakt.component.html',
  styleUrl: './kontakt.component.css'
})
export class KontaktComponent {

}
