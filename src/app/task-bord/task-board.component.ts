import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import ConfettiGenerator from 'confetti-js';
import {Candidate} from '../types/candidate';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, take} from 'rxjs/operators';
import {GuessTheAssociationsTask} from '../types/guess-the-associations-task';
import {GiveTheCueTask} from '../types/give-the-cue-task';
import {UserDashboard} from '../types/user-dashboard';

@Component({
    selector: 'app-task-board',
    templateUrl: './task-board.component.html',
    styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit, OnDestroy {
    _candidates: Candidate[] = []
    _guessAssociationTask: GuessTheAssociationsTask = null;
    _giveCueTask: GiveTheCueTask = null;
    userCue: string = '';
    isGuessAssociationsTask = true;
    confettiSettings = {target: 'confetti'};
    confetti: ConfettiGenerator;
    confettiShown = false;
    noSelection = true;
    showInfo = false;
    isSixCandidates = false;
    isTwelveCandidates = false;
    @Input() enableSelection = true;
    @Input() testMode = false;
    @Input() disableSolutionIcons = false;
    @Input() _submit = false;
    @Input() title = '';
    @Input() enablePointer = false;
    @Input() AIRequest = true;
    @Input() info: string = '';
    @Input() userDashboard: UserDashboard = null;
    _cueIndex = 0
    @Output() selected$: EventEmitter<Candidate> = new EventEmitter<Candidate>();
    @Output() logout$: EventEmitter<void> = new EventEmitter<void>();
    @Output() showDashboard$: EventEmitter<void> = new EventEmitter<void>();
    cueFormControl = new FormControl('');
    cueValueChangesSubscription = new Subscription();
    cueValueChangedSubscription = new Subscription();

    constructor(private changeDetectionRef: ChangeDetectorRef) {
    }

    @Input()
    set cueIndex(cueIndex: number) {
        this._cueIndex = cueIndex;
        this.giveCueTask = this._giveCueTask;
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.cueValueChangesSubscription.unsubscribe()
        this.cueValueChangesSubscription.unsubscribe()
    }

    init() {
        this.clearConfetti();
        if (this.isGuessAssociationsTask) {
            this.cueFormControl.setValue(this._guessAssociationTask.cue[0])
        } else {
            this._giveCueTask._userCue.pipe(take(1)).subscribe((userCues) => this.cueFormControl.setValue(userCues[this._cueIndex]))
            this.cueValueChangesSubscription.unsubscribe()
            this.cueValueChangesSubscription = this.cueFormControl.valueChanges.pipe(debounceTime(200), distinctUntilChanged(), switchMap((val) => {
                if (/^[a-zA-Z]*$/.test(val)) {
                    this._giveCueTask.setUserCue(val, this._cueIndex)
                }
                return this._giveCueTask._userCue
            })).subscribe((userCues: string[]) => {
                this.cueFormControl.setValue(userCues[this._cueIndex])
            })
        }
        this.detectChanges();
    }

    @Input()
    set giveCueTask(task: GiveTheCueTask) {
        this._giveCueTask = task;
        this._candidates = task.candidates[this._cueIndex];
        this.isGuessAssociationsTask = false;
        this.isSixCandidates = !(this._giveCueTask.candidates[0].length % 6);
        this.isTwelveCandidates = this._giveCueTask.candidates[0].length === 12
        this.init();
    }

    @Input()
    set guessTheAssociationsTask(task: GuessTheAssociationsTask) {
        this._guessAssociationTask = task;
        this._candidates = task.candidates;
        this.isGuessAssociationsTask = true;
        this.isSixCandidates = !(this._guessAssociationTask.candidates.length % 6);
        this.isTwelveCandidates = this._guessAssociationTask.candidates.length === 12
        this.init();
    }

    @Input()
    set submit(status: boolean) {
        this._submit = status;
    }

    selectCandidate(candidate: Candidate): void {
        if (this.enableSelection && !this._submit) {
            candidate.userChoice = !candidate.userChoice;
            this.noSelection = false;
            this.setConfetti();
            if ((this.isGuessAssociationsTask ? this._guessAssociationTask.isTaskSolved() : this._giveCueTask.isTaskSolved(this._cueIndex))) {
                if (!this.testMode) {
                    this.renderConfetti()
                }
            }
            this.detectChanges();
        }
    }

    setConfetti(): void {
        if (!this.confetti) {
            this.confetti = new ConfettiGenerator(this.confettiSettings);
        }
        this.clearConfetti();
    }

    renderConfetti(): void {
        if (!this.confettiShown) {
            this.confetti.render();
            this.confettiShown = true;
        }
    }

    clearConfetti(): void {
        if (this.confettiShown) {
            this.confetti.clear();
            this.confettiShown = false;
            this.confetti = new ConfettiGenerator(this.confettiSettings);
        }
    }

    toggleInfo(): void {
        this.showInfo = !this.showInfo;
        this.detectChanges();
    }

    detectChanges(): void {
        this.changeDetectionRef.markForCheck();
        this.changeDetectionRef.detectChanges();
    }

    logout(): void {
        this.logout$.emit();
    }

    showDashboard(): void {
        this.showDashboard$.emit();
    }


}
