import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Candidate} from '../../types/candidate';
import {Subscription, timer} from 'rxjs';
import {GuessTheAssociationsTask} from '../../types/guess-the-associations-task';
import {ActivatedRoute, Router} from '@angular/router';
import {ServerRequestService} from '../../services/server-request.service';
import {MturkTask} from '../../types/mturk-task';
import {solveCratePath} from '../../app-routing.module';

@Component({
    selector: 'app-mturk-solve',
    templateUrl: './mturk-solve.component.html',
    styleUrls: ['./mturk-solve.component.scss']
})
export class MturkSolveComponent extends MturkTask implements OnInit, OnDestroy {
    hint = ''
    date = new Date();
    pagination = 3;
    pagination1 = 1;
    answers: Map<number, Candidate> = new Map<number, Candidate>();
    practiceMode = false;
    _submit = false;
    // goodJobHint = 'Good Job!';
    turkSubmitTo = '';
    assignmentId = '';
    solveCreate = false;
    timerSubscription = new Subscription()
    geussTheAssociationsTask: GuessTheAssociationsTask = null

    constructor(private router: Router,
                private activeRouter: ActivatedRoute,
                private changeDetectorRef: ChangeDetectorRef,
                private serverRequestService: ServerRequestService
    ) {
        super();
        window.name = 'WinoGAViL'
        this.id = this.activeRouter.snapshot.params.id
        this.solveCreate = this.activeRouter.snapshot.routeConfig.path === solveCratePath;
        if (this.solveCreate){
            console.log('solve create')
        }
        if (this.id && typeof this.id === 'string') {
            (this.solveCreate ? this.serverRequestService.getCreateGuessTheAssociationTask(this.id) : this.serverRequestService.getGuessTheAssociationTask(this.id)).subscribe((task: GuessTheAssociationsTask) => {
                this.isSixCandidates = task.candidates.length > 5
                this.turkSubmitTo = this.activeRouter.snapshot.queryParams.turkSubmitTo
                this.assignmentId = this.activeRouter.snapshot.queryParams.assignmentId
                console.log(this.turkSubmitTo)
                console.log(this.assignmentId)
                this.geussTheAssociationsTask = task
            });
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

    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('index-page');
    }

    restartPractice() {
        this._submit = false;
        this.showHint('')
        this.geussTheAssociationsTask?.init();
    }

    submit(): void {
        this._submit = this.geussTheAssociationsTask.isTaskSolved(true)
        if (this._submit) {
            this.handleSubmit(this.assignmentId, this.turkSubmitTo, this.geussTheAssociationsTask)
        } else {
            this.showHint(this.geussTheAssociationsTask?.getHint())
        }
    }

    showHint(hint, time: number = 3000) {
        this.hint = hint;
        this.timerSubscription.unsubscribe();
        this.timerSubscription = timer(time).subscribe(() => {
            this.hint = ''
        });
    }
}
