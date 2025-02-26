import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {UserManagementComponent} from '../user-management/user-management.component';
import {KategorijaManagementComponent} from '../kategorija-management/kategorija-management.component';
import {ObavijestiManagementComponent} from '../obavijesti-management/obavijesti-management.component';
import {NarudzbaManagementComponent} from '../narudzba-management/narudzba-management.component';
import {ProizvodManagementComponent} from '../proizvod-management/proizvod-management.component';

@Component({
  selector: 'app-administration',
  imports: [
    NgIf,
    UserManagementComponent,
    KategorijaManagementComponent,
    ObavijestiManagementComponent,
    NarudzbaManagementComponent,
    ProizvodManagementComponent
  ],
  standalone: true,
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css'
})
export class AdministrationComponent {
  selectedTab: string = "users";

}
