import {createQualificationIndexIDMap, solveQualificationIndexIDMap} from './task-dictionary';
import {Jsonable} from './jsonable';
import {GiveTheCueTask} from './give-the-cue-task';
import {GuessTheAssociationsTask} from './guess-the-associations-task';
import {MturkTask} from './mturk-task';
import {TaskTypeEnum} from './task-type.enum';
import {ServerRequestService} from '../services/server-request.service';
import {Observable} from 'rxjs';
import {ExperimentModeEnum} from './experiment-mode.enum';
import {cueCalculator} from './cue-calculator';


export abstract class QualificationTask<T extends Jsonable> extends MturkTask {
    constructor(protected serverRequestService: ServerRequestService, type: TaskTypeEnum) {
        super();
        this.type = type;
    }
    qualificationIndex = 1;
    abstract _submit;
    giveTheCueTask: GiveTheCueTask;
    geussTheAssociationsTask: GuessTheAssociationsTask;
    tasks = new Map<string, { solved: boolean, task: T }>();
    solved = false;
    allSubmitted = false;
    hitSubmitted = false;
    type: TaskTypeEnum;
    personalDetails = null;
    skipPersonalDetails: boolean = false;
    numberOfTasks = 10;
    experimentMode: ExperimentModeEnum = ExperimentModeEnum.DEFAULT
    giveTheCueInfo: string = '';

    abstract showHint(...args);

    getQualificationId(index: number) {
        return this.type === TaskTypeEnum.GIVE_THE_CUE ? createQualificationIndexIDMap.get(index): solveQualificationIndexIDMap.get(index);
    }

    getTaskFromServer(index: number): Observable<any> {
        const id = this.getQualificationId(index);
        return this.type === TaskTypeEnum.GIVE_THE_CUE ? this.serverRequestService.getGiveTheCue(id, true) : this.serverRequestService.getGuessTheAssociationTask(id, true);
    }

    initQualification(index: number) {
        if (this.experimentMode !== ExperimentModeEnum.DEFAULT) {
            this.skipPersonalDetails = true;
        }
        if (this.tasks.has(`qualification-${index}`)) {
            const task = this.tasks.get(`qualification-${index}`);
            this.initQualificationTask(task.task, !!task.solved)
        } else {
            this.getTaskFromServer(index).subscribe((task: any) => this.initQualificationTask(task, false))
        }

    }

    // this.giveTheCueTask = getGiveTheCueTask(`qualification-${index}`) : this.geussTheAssociationsTask = getGuessTheAssociationsTask(`qualification-${index}`));
    initQualificationTask(task, solved) {
        this.isSixCandidates = this.type === TaskTypeEnum.GIVE_THE_CUE ? task.candidates[0].length > 5 : task.candidates.length > 5
        this._submit = false;
        this.showHint('')
        this.solved = solved;
        this._submit = this.solved;
        if (this.type === TaskTypeEnum.GIVE_THE_CUE) {
            this.giveTheCueTask = task;
            this.giveTheCueInfo = cueCalculator(this.giveTheCueTask);
        } else {
            this.geussTheAssociationsTask = task;
        }
    }

    setTask(cue: string, task: T) {
        if (!this.tasks.has(cue)) {
            this.tasks.set(cue, {task, solved: true});
            this.solved = true;
            this._submit = true;
            this.allSubmitted = this.tasks.size === this.numberOfTasks
        }
    }

    getJSONformat(): object[] {
        return [...this.tasks.values()].map((task) => task.task.getJSON())
    }

    moveLeft() {
        if (this.qualificationIndex > 1) {
            this.qualificationIndex--;
            this.move()
        }
    }

    moveRight() {
        if (this.qualificationIndex < this.numberOfTasks ) {
            this.qualificationIndex++;
            this.move()
        }
    }

    move() {
        this.initQualification(this.qualificationIndex)
    }

    receivePersonalDetails(personalDetails: object) {
        this.personalDetails = personalDetails;
    }
}