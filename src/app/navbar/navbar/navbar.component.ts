import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {screens} from '../../types/screens';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() click: EventEmitter<screens> = new EventEmitter<any>();
  @Input() selectedTab: screens = 'beat-the-ai'
  isCollapsed: boolean = true;
  constructor() {
  }


  ngOnInit(): void {
    // this.changeDetectorRef.detectChanges();
    //
    // const body = document.getElementsByTagName('body')[0];
    // body.classList.add('index-page');
    //
    // const slider = document.getElementById('sliderRegular');

    // noUiSlider?.create(slider, {
    //   start: 40,
    //   connect: false,
    //   range: {
    //     min: 0,
    //     max: 100
    //   }
    // });

    // const slider2 = document.getElementById('sliderDouble');
    //
    // // noUiSlider?.create(slider2, {
    // //   start: [20, 60],
    // //   connect: true,
    // //   range: {
    // //     min: 0,
    // //     max: 100
    // //   }
    // // });
    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth'
    // });
  }

}
