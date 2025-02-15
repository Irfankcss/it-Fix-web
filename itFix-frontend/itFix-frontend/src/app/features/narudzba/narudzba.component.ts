import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-narudzba',
  imports: [
    NgForOf,
    NgIf
  ],
  standalone: true,
  templateUrl: './narudzba.component.html',
  styleUrl: './narudzba.component.css'
})
export class NarudzbaComponent {
  narudzba: any;


  constructor(private route: ActivatedRoute) {
    this.narudzba = history.state.narudzba;
    console.log("Primljena narudzba: ", this.narudzba);
  }

}
