import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {screens} from '../../types/screens';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  @Output() click: EventEmitter<screens> = new EventEmitter<any>();
  @Input() selectedTab: screens = 'beat-the-ai'
  @Input() isCollapsed: boolean = true;
  subscription: Subscription = new Subscription()
  constructor() {
    this.subscription = this.click.subscribe(() => this.isCollapsed = true)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
