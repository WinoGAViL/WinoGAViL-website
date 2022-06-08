import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {screens} from '../../types/screens';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isCollapsed: boolean = false;
  @Output() onClick: EventEmitter<screens> = new EventEmitter<any>();
  @Input() selectedTab: screens = 'beat-the-ai'
  constructor() {
  }


  ngOnInit(): void {
  }

}
