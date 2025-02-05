import { Routes } from '@angular/router';
import { ProizvodiListComponent } from './features/proizvodi/proizvodi-list/proizvodi-list.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import {ProfileComponent} from './features/profile/profile.component';
import {ObavijestiCarouselComponent} from './features/obavijesti-carousel/obavijesti-carousel.component';
import {HomeComponent} from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'proizvodi', component: ProizvodiListComponent },
  { path: 'profil', component: ProfileComponent }
];
