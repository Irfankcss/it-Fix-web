import { Component, OnInit } from '@angular/core';
import { ProizvodService } from '../../../core/services/product.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proizvodi-list.component.html',
  styleUrls: ['./proizvodi-list.component.css']
})
export class ProizvodiListComponent implements OnInit {
  products: any[] = [];

  constructor(private proizvodiService: ProizvodService) { }

  ngOnInit() {
    this.proizvodiService.getProizvodi().subscribe(data => {
      this.products = data;
    });
  }
}
