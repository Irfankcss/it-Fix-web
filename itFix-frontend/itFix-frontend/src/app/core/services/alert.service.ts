import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<{ message: string, type: 'success' | 'error' } | null>(null);
  alert$ = this.alertSubject.asObservable();

  showSuccess(message: string) {
    this.alertSubject.next({ message, type: 'success' });
    this.autoHide();
  }

  showError(message: string) {
    this.alertSubject.next({ message, type: 'error' });
    this.autoHide();
  }

  private autoHide() {
    setTimeout(() => {
      this.alertSubject.next(null);
    }, 4100);
  }

}
