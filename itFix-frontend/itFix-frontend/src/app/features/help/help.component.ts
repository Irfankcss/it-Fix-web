import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

@Component({
  selector: 'app-help',
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
  standalone: true,
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent implements OnInit {
  page: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.page = params.get('page');
    });
  }
}
