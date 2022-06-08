import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Candidate} from '../../types/candidate';
import {Subscription, timer} from 'rxjs';
import {GuessTheAssociationsTask} from '../../types/guess-the-associations-task';
import {ActivatedRoute, Router} from '@angular/router';
import {QualificationTask} from '../../types/qualification-task';
import {ServerRequestService} from '../../services/server-request.service';
import {TaskTypeEnum} from '../../types/task-type.enum';
import {get_experiment_mode} from '../../types/experiment-mode.enum';

@Component({
  selector: 'app-mturk-solve-qualification',
  templateUrl: './mturk-solve-qualification.component.html',
  styleUrls: ['./mturk-solve-qualification.component.scss']
})
export class MturkSolveQualificationComponent extends QualificationTask<GuessTheAssociationsTask> implements OnInit, OnDestroy {
  hint = ''
  date = new Date();
  answers: Map<number, Candidate> = new Map<number, Candidate>();
  _submit = false;
  timerSubscription = new Subscription()

  constructor(private router: Router,
              private activeRouter: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              protected serverRequest: ServerRequestService
  ) {
    super(serverRequest, TaskTypeEnum.GUESS_THE_ASSOCIATIONS_TASK);
    window.name = 'WinoGAViL'
    this.turkSubmitTo = this.activeRouter.snapshot?.queryParams?.turkSubmitTo
    this.assignmentId = this.activeRouter.snapshot?.queryParams?.assignmentId
    this.experimentMode = get_experiment_mode(this.activeRouter.snapshot.url[2].path)
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

  SubmitHIT() {
    this.hitSubmitted = true;
    this.handleSubmit(this.assignmentId, this.turkSubmitTo, {tasks: this.getJSONformat(), personalDetails: this.personalDetails})
  }

  submit(): void {
    this._submit = this.geussTheAssociationsTask.isTaskSolved(true)
    if (this._submit) {
      this.setTask(`qualification-${this.qualificationIndex}`, this.geussTheAssociationsTask);
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