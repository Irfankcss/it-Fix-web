import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEmailService } from '../../core/services/confirm-email.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  message: string = 'Potvrđivanje emaila...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmEmailService: ConfirmEmailService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('Token na frontendu:', token);

    if (userId && token) {
      this.confirmEmailService.confirmEmail(userId, token).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.alertService.showSuccess(response.message);
            setTimeout(() => this.router.navigate(['/login']), 3000);
            this.alertService.showSuccess("Uspješno ste potvrdili email. Sada se možete prijaviti.");
          } else {
            this.alertService.showError(response.message);
          }
        },
        error: (error) => {
          console.error(error);
          this.alertService.showError("Greška prilikom potvrđivanja emaila. Pokušajte ponovo.");
        }
      });
    } else {
      this.alertService.showError("Neispravan link za potvrdu emaila!");
    }
  }
}
