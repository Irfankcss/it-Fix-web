import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private navbarHeightSource = new BehaviorSubject<number>(0);
  private searchBarHeightSource = new BehaviorSubject<number>(0);

  navbarHeight$ = this.navbarHeightSource.asObservable();
  searchBarHeight$ = this.searchBarHeightSource.asObservable();
  totalPadding$ = combineLatest([this.navbarHeight$, this.searchBarHeight$]);

  setNavbarHeight(value: number) {
    this.navbarHeightSource.next(value);
  }

  setSearchBarHeight(value: number) {
    this.searchBarHeightSource.next(value);
  }
}
