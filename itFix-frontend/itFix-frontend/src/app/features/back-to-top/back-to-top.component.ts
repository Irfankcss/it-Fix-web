import {Component, HostListener} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-back-to-top',
  imports: [
    NgIf
  ],
  standalone: true,
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css'
})
export class BackToTopComponent {
  showButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
