import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Candidate} from '../../types/candidate';
import {Subscription, timer} from 'rxjs';
import {GiveTheCueTask} from '../../types/give-the-cue-task';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ServerRequestService} from '../../services/server-request.service';
import {QualificationTask} from '../../types/qualification-task';
import {TaskTypeEnum} from '../../types/task-type.enum';
import {ExperimentModeEnum, get_experiment_mode} from '../../types/experiment-mode.enum';

@Component({
    selector: 'app-mturk-create-qualification',
    templateUrl: './mturk-create-qualification.component.html',
    styleUrls: ['./mturk-create-qualification.component.scss']
})
export class MturkCreateQualificationComponent extends QualificationTask<GiveTheCueTask> implements OnInit, OnDestroy {
    hint = ''
    date = new Date();
    answers: Map<number, Candidate> = new Map<number, Candidate>();
    gameMode = true;
    practiceMode = false;
    _submit = false;
    inProgress = false;
    timerSubscription = new Subscription()
    responseBackgroundColor = '';
    responseTextColor = '';
    requestAIResults: boolean = true;

    constructor(private router: Router,
                private activeRouter: ActivatedRoute,
                private changeDetectorRef: ChangeDetectorRef,
                private dialog: MatDialog,
                protected serverRequestService: ServerRequestService
    ) {
        super(serverRequestService, TaskTypeEnum.GIVE_THE_CUE);
        window.name = 'GVLAB'
        this.turkSubmitTo = this.activeRouter.snapshot?.queryParams?.turkSubmitTo
        this.assignmentId = this.activeRouter.snapshot?.queryParams?.assignmentId
        this.experimentMode = get_experiment_mode(this.activeRouter.snapshot.url[2].path)
        if (this.experimentMode !== ExperimentModeEnum.DEFAULT && this.activeRouter.snapshot.url[3]?.path?.toLowerCase() !== 'ai') {
            this.requestAIResults = false;
        }
        this.initQualification(this.qualificationIndex);
        console.log(this.experimentMode)
        console.log(this.turkSubmitTo)
        console.log(this.assignmentId)
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
        this.giveTheCueTask?.init();
    }

    submit(): void {
        this._submit = this.giveTheCueTask?.isTaskSolved()
        if (this._submit) {
            this.inProgress = true;
            if (!this.requestAIResults) {
                this.inProgress = false;
                this.setTask(`qualification-${this.qualificationIndex}`, this.giveTheCueTask);
            } else {
                this.showHint(`Waiting for AI prediction`, Math.pow(10, 10))
                this.giveTheCueTask.getFilteredScore().subscribe((score) => {
                    this.showAIScore(score);
                    this.inProgress = false;
                    this.setTask(`qualification-${this.qualificationIndex}`, this.giveTheCueTask);
                })
                this.serverRequestService.getAIPrediction(this.giveTheCueTask);
            }
        } else {
            this.showHint(this.giveTheCueTask?.getHint())
        }
    }

    SubmitHIT() {
        this.hitSubmitted = true;
        this.handleSubmit(this.assignmentId, this.turkSubmitTo,  {tasks: this.getJSONformat(), personalDetails: this.personalDetails})
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

