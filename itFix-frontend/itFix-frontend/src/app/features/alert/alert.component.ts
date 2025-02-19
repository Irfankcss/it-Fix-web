import { Component } from '@angular/core';
import {AlertService} from '../../core/services/alert.service';
import {async} from 'rxjs';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  constructor(public alertService: AlertService) { }


}
