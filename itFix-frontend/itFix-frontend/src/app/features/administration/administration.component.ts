import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {UserManagementComponent} from '../user-management/user-management.component';
import {KategorijaManagementComponent} from '../kategorija-management/kategorija-management.component';
import {ObavijestiManagementComponent} from '../obavijesti-management/obavijesti-management.component';
import {NarudzbaManagementComponent} from '../narudzba-management/narudzba-management.component';
import {ProizvodManagementComponent} from '../proizvod-management/proizvod-management.component';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';

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
export class AdministrationComponent implements OnInit {
  selectedTab: string = "";
  isAdminUser: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.isAdmin().subscribe(isAdmin => {
      if (!isAdmin) {
        this.router.navigate(['/']);
      } else {
        this.isAdminUser = true;
        this.selectedTab = 'users';
      }
    });
  }
}
