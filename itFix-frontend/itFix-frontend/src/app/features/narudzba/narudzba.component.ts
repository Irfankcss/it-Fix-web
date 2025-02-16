import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {NarudzbaService} from '../../core/services/narudzba.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-narudzba',
  imports: [
    NgForOf,
    NgIf,
    DecimalPipe
  ],
  standalone: true,
  templateUrl: './narudzba.component.html',
  styleUrl: './narudzba.component.css'
})
export class NarudzbaComponent implements OnInit{
  narudzba: any;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.authService.getCurrentUser().subscribe(user => {
      if (id) {
        this.narudzbaService.getNarudzbaById(+id).subscribe(narudzba => {
          if (narudzba.korisnikId !== user.id) {
            this.router.navigate(['/error']); // Ako korisnik nije vlasnik, preusmjeri ga
          } else {
            this.narudzba = narudzba;
          }
        });
      }
    });
  }




  constructor(private route: ActivatedRoute, public narudzbaService:NarudzbaService, public authService:AuthService, private router:Router) {
  }

  idiNaProdavnicu() {
    this.router.navigate(['/prodavnica']);
  }
}
