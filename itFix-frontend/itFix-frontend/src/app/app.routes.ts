import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import {ProfileComponent} from './features/profile/profile.component';
import {HomeComponent} from './features/home/home.component';
import {StoreComponent} from './features/store/store.component';
import {ProizvodComponent} from './features/proizvodi/proizvod/proizvod.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profil', component: ProfileComponent },
  {path: 'prodavnica', component : StoreComponent},
  {path: 'proizvod/:id', component:ProizvodComponent}
];
