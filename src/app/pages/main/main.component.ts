import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import noUiSlider from 'nouislider';
import {Router} from '@angular/router';
import {getGuessTheAssociationsTask} from '../../types/task-dictionary';
import {GuessTheAssociationsTask} from '../../types/guess-the-associations-task';

@Component({
    selector: 'app-main',
    templateUrl: 'main.component.html',
    styleUrls: ['./main.scss']
})
export class MainComponent implements OnInit, OnDestroy {
    task: GuessTheAssociationsTask = getGuessTheAssociationsTask('monkey-human-swing');

    constructor(private router: Router, private changeDetectorRef: ChangeDetectorRef) {
        window.name = 'WinoGAViL'
    }

    ngOnInit() {
        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('index-page');
    }

    navigateHome() {
        this.router.navigateByUrl(this.router.url);
    }
}
