import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Candidate} from '../../types/candidate';
import {Subject, Subscription, timer} from 'rxjs';
import {ServerRequestService} from '../../services/server-request.service';
import {GiveTheCueTask} from '../../types/give-the-cue-task';
import {take, takeUntil} from 'rxjs/operators';
import {MturkTask} from '../../types/mturk-task';
import {cueCalculator} from '../../types/cue-calculator';

@Component({
    selector: 'app-mturk',
    templateUrl: './mturk-create.component.html',
    styleUrls: ['./mturk-create.component.scss']
})
export class MturkCreateComponent extends MturkTask implements OnInit, OnDestroy {
    hint = ''
    date = new Date();
    answers: Map<number, Candidate> = new Map<number, Candidate>();
    _submit = false;
    timerSubscription = new Subscription()
    responseBackgroundColor = '';
    responseTextColor = '';
    cueIndex = 0;
    timerMessage = '';
    giveTheCueTask: GiveTheCueTask = null;
    delayInterval: number = 5;
    moveToNextCueManually$ = new Subject<void>();
    info: string = '';
    constructor(private router: Router,
                private activeRouter: ActivatedRoute,
                private changeDetectorRef: ChangeDetectorRef,
                private dialog: MatDialog,
                private serverRequestService: ServerRequestService) {
        super();
        window.name = 'WinoGAViL'
        this.id = this.activeRouter.snapshot.params.id
        if (this.id && typeof this.id === 'string') {
            this.serverRequestService.getGiveTheCue(this.id).subscribe((task: GiveTheCueTask) => {
                this.info = cueCalculator(task);
                this.isSixCandidates = task.candidates[0].length > 5
                this.turkSubmitTo = this.activeRouter.snapshot.queryParams.turkSubmitTo
                this.assignmentId = this.activeRouter.snapshot.queryParams.assignmentId
                console.log(this.turkSubmitTo)
                console.log(this.assignmentId)
                this.giveTheCueTask = task;
            })
        }
        console.log(this.activeRouter.snapshot)
    }

    ngOnInit() {
        this.changeDetectorRef.detectChanges();

        const body = document.getElementsByTagName('body')[0];
        body.classList.add('index-page');


        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    init() {
        this._submit = false;
        this.showHint('');
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('index-page');
    }

    submit(): void {
        this._submit = this.giveTheCueTask?.isTaskSolved(this.cueIndex)
        if (this._submit) {
            this.showHint(`Waiting for AI prediction`, Math.pow(10, 10))
            this.giveTheCueTask.getFilteredScore(this.cueIndex).subscribe((score) => {
                timer(0,1000).pipe(take(this.delayInterval), takeUntil(this.moveToNextCueManually$)).subscribe((second: number) => {
                    second++;
                    if (second < this.delayInterval) {
                        this.updateTimer(second)
                    } else if (this.cueIndex === 0) {
                        this.nextCue()
                    } else if ((this.cueIndex === 1)) {
                        this.updateTimer(null)
                        this.handleSubmit(this.assignmentId, this.turkSubmitTo, this.giveTheCueTask.getJSON())
                    }
                })
                this.showAIScore(score);
            })
            this.serverRequestService.getAIPrediction(this.giveTheCueTask, this.cueIndex);
        } else {
            this.showHint(this.giveTheCueTask?.getHint(this.cueIndex))
        }
    }

    updateTimer(seconds: number) {
        if (seconds === null) {
            this.timerMessage = ''
        } else {
            this.timerMessage = this.cueIndex === 0 ? `Move to next cue (${(this.delayInterval - seconds)}...)` : `Submit HIT (${(this.delayInterval - seconds)}...)`;
        }
    }

    nextCue() {
        this.updateTimer(null)
        this.init()
        this.cueIndex = 1
    }

    moveToNextCueManually() {
        this.moveToNextCueManually$.next();
        if (this.cueIndex === 0) {
            this.nextCue()
        } else if ((this.cueIndex === 1)) {
            this.updateTimer(null)
            this.handleSubmit(this.assignmentId, this.turkSubmitTo, this.giveTheCueTask.getJSON())
        }
    }

    showHint(hint, time: number = 3000, responseBackgroundColor = '', responseTextColor = 'black') {
        this.hint = hint;
        this.responseTextColor = responseTextColor;
        this.responseBackgroundColor = responseBackgroundColor;
        this.timerSubscription.unsubscribe();
        this.timerSubscription = timer(time).subscribe(() => {
            this.hint = ''
            this.responseBackgroundColor = '';
            this.responseTextColor = 'black';
        });
    }
}

