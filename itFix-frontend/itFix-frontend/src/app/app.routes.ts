import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import {ProfileComponent} from './features/profile/profile.component';
import {HomeComponent} from './features/home/home.component';
import {StoreComponent} from './features/store/store.component';
import {ProizvodComponent} from './features/proizvodi/proizvod/proizvod.component';
import {PosiljkaComponent} from './features/posiljka/posiljka.component';
import {KontaktComponent} from './features/kontakt/kontakt.component';
import {KorpaComponent} from './features/korpa/korpa.component';
import {NarudzbaComponent} from './features/narudzba/narudzba.component';
import {FavoritiComponent} from './features/favoriti/favoriti.component';
import {ConfirmEmailComponent} from './features/confirm-email/confirm-email.component';
import {AdministrationComponent} from './features/administration/administration.component';
import {HelpComponent} from './features/help/help.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profil', component: ProfileComponent },
  { path: 'prodavnica', component: StoreComponent },
  { path: 'narudzba/:id', component: NarudzbaComponent, data: { renderMode: 'ssr' } },
  { path: 'proizvod/:id', component: ProizvodComponent, data: { renderMode: 'ssr' } },
  { path: 'pracenje-posiljke', component: PosiljkaComponent },
  { path: 'kontakt', component: KontaktComponent },
  { path: 'korpa', component: KorpaComponent },
  { path: 'favoriti', component: FavoritiComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'admin-dashboard', component: AdministrationComponent },
  { path: 'help/:page', component: HelpComponent },
  { path: '**', redirectTo: 'login' }
];

