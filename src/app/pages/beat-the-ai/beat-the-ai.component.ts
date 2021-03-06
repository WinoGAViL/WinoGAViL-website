import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Candidate} from '../../types/candidate';
import {Observable, Subject, Subscription, timer} from 'rxjs';
import {ServerRequestService} from '../../services/server-request.service';
import {GiveTheCueTask} from '../../types/give-the-cue-task';
import {
    createExampleIndexIDMap,
    solveExampleIndexIDMap,
} from '../../types/task-dictionary';
import {GuessTheAssociationsTask} from '../../types/guess-the-associations-task';
import {pluck, takeUntil, tap} from 'rxjs/operators';
import {cueCalculator} from '../../types/cue-calculator';
import {beatTheAICreate, beatTheAIGame, beatTheAISolve} from '../../app-routing.module';
import {screens} from '../../types/screens';

@Component({
    selector: 'app-beat-the-ai',
    templateUrl: './beat-the-ai.component.html',
    styleUrls: ['./beat-the-ai.component.scss']
})
export class BeatTheAiComponent implements OnInit, OnDestroy {
    hint = ''
    answers: Map<number, Candidate> = new Map<number, Candidate>();
    gameMode = false;
    practiceMode = false;
    isCollapsed = true;
    _submit = false;
    goodJobHint = 'Good Job!';
    timerSubscription = new Subscription()
    isGuessAssociationsTask = null;
    exampleIndex = 1;
    responseBackgroundColor = '';
    responseTextColor = '';
    cancel$ = new Subject();
    giveTheCueTask: GiveTheCueTask;
    guessTheAssociationsTask: GuessTheAssociationsTask;
    giveTheCueInfo = '';
    selectedCandidates = 5;
    showReportForm = false;
    beatTheAIMode = false;
    candidates = [
        {value: '5', viewValue: '5'},
        {value: '6', viewValue: '6'},
        {value: '10', viewValue: '10'},
        {value: '12', viewValue: '12'},
        {value: 'random', viewValue: 'random'}
    ];

    constructor(private router: Router,
                private activeRouter: ActivatedRoute,
                private changeDetectorRef: ChangeDetectorRef,
                private dialog: MatDialog,
                private serverRequestService: ServerRequestService
    ) {

    }

    ngOnInit() {
        this.changeDetectorRef.detectChanges();
        window.name = 'WinoGAViL'
        if (this.activeRouter.snapshot.routeConfig.path === beatTheAICreate) {
            this.practice(false)
        } else if (this.activeRouter.snapshot.routeConfig.path === beatTheAISolve) {
            this.practice(true)
        }
    }

    init() {
        this.showReportForm = false;
        this.gameMode = false;
        this.practiceMode = false;
        this.isGuessAssociationsTask = null;
        this.exampleIndex = 1;
        this.initExample(1)
    }


    closeReportForm($event) {
        this.showReportForm = false;
    }

    onReportFormSubmit(details) {
        try {
            details.task = (this.isGuessAssociationsTask ? this.guessTheAssociationsTask.getJSON() : this.giveTheCueTask.getJSON());
            details.userID = '';
            this.serverRequestService.sendReportForm(details)
        } catch (error) {
            console.log('Failed to send report form')
            console.log(error)
        }
        this.showReportForm = false;
    }

    initExample(index: number) {
        this.cancel$.next();
        this._submit = false;
        this.showHint('')
        if (this.isGuessAssociationsTask) {
            this.getTaskFromServer(index).pipe(takeUntil(this.cancel$)).subscribe((task) => {
                this.guessTheAssociationsTask = task;
            })
        } else {
            this.getTaskFromServer(index).pipe(takeUntil(this.cancel$)).subscribe((task) => {
                this.giveTheCueTask = task;
                this.giveTheCueInfo = cueCalculator(task);
            })
        }
    }

    onNavbarClick(event: screens) {
        if (event === 'beat-the-ai') {
            this.init()
        } else if (event === 'explore') {
            this.init()
            this.practice(true)
        }
    }

    onCandidatesSelect(candidateOption) {
        this.selectedCandidates = candidateOption;
    }

    getQualificationId(index: number) {
        return !this.isGuessAssociationsTask ? createExampleIndexIDMap.get(index) : solveExampleIndexIDMap.get(index);
    }

    getTaskFromServer(index: number): Observable<any> {
        const id = this.getQualificationId(index);
        if (id === undefined) {
            const response$: Observable<any> = !this.isGuessAssociationsTask ? this.serverRequestService.getRandomGiveTheCue(this.selectedCandidates) : this.serverRequestService.getRandomGuessTheAssociationTask(this.selectedCandidates)
            return response$.pipe(tap((task) => !this.isGuessAssociationsTask ? createExampleIndexIDMap.set(index, task.id) : solveExampleIndexIDMap.set(index, task.id)))
        }
        return !this.isGuessAssociationsTask ? this.serverRequestService.getGiveTheCue(id, true) : this.serverRequestService.getGuessTheAssociationTask(id, true);
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('index-page');
    }

    restartPractice() {
        this._submit = false;
        this.showHint('')
        this.giveTheCueTask?.init();
        this.guessTheAssociationsTask?.init();
    }

    play(): void {
        this.router.navigateByUrl(beatTheAIGame)
    }

    submit(): void {
        this._submit = (this.isGuessAssociationsTask ? this.guessTheAssociationsTask?.isTaskSolved() : this.giveTheCueTask?.isTaskSolved())
        if (this._submit) {
            if (this.isGuessAssociationsTask) {
                this.showHint(this.goodJobHint)
            } else {
                this.showHint(`Waiting for AI prediction`, Math.pow(10, 10))
                this.giveTheCueTask.getFilteredScore().pipe(takeUntil(this.cancel$)).subscribe((score) => {
                    if (score === 100) {
                        this.showHint(`Perfect! AI Was Fooled! \n Your score: ${score}`, Math.pow(10, 10), '#e2f0d9', '#548235')
                    } else if (score !== 0) {
                        this.showHint(`AI Was almost Fooled! \n Your score: ${score}`, Math.pow(10, 10), '#fde3e4', '#f7931e')
                    } else if (score === 0) {
                        this.showHint(`You were beaten by the AI! \n Maybe next time!`, Math.pow(10, 10), '#fff2cc', '#f96c7b')
                    }
                })
                this.serverRequestService.getAIPrediction(this.giveTheCueTask)
            }
            console.log(this.isGuessAssociationsTask ? this.guessTheAssociationsTask : this.giveTheCueTask)
        } else {
            this.showHint(this.isGuessAssociationsTask ? this.guessTheAssociationsTask?.getHint() : this.giveTheCueTask?.getHint())
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

    moveLeft() {
        if (this.exampleIndex > 1) {
            this.exampleIndex--;
            this.move()
        }
    }

    moveRight() {
        this.serverRequestService.getGiveTheCueGameTask().subscribe(test => console.log(test))
        this.exampleIndex++;
        this.move()
    }

    move() {
        this.guessTheAssociationsTask?.init()
        this.giveTheCueTask?.init()
        this.initExample(this.exampleIndex)
    }

    practice(isGuessAssociationsTask: boolean): void {
        this.isGuessAssociationsTask = isGuessAssociationsTask;
        this.initExample(this.exampleIndex);
        this.gameMode = true;
        this.practiceMode = true;
    }
}
