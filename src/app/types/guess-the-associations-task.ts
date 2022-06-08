import {Candidate} from './candidate';
import {Jsonable} from './jsonable';
import {TaskTypeEnum} from './task-type.enum';

export class GuessTheAssociationsTask implements Jsonable{
    id: string = '';
    type: TaskTypeEnum = TaskTypeEnum.GUESS_THE_ASSOCIATIONS_TASK;
    candidates: Candidate[];
    cue: string[];
    associations: number;

    constructor(candidates: Candidate[], cue: string[] = [''], associations: number = 0, id = '') {
        this.id = id;
        this.candidates = candidates;
        this.cue = cue;
        this.associations = associations;
    }


    static clone(task: GuessTheAssociationsTask) {
        return new GuessTheAssociationsTask(JSON.parse(JSON.stringify(task.candidates)), task.cue, task.associations, task.id)
    }


    init() {
        this.clearCandidates()
    }

    isTaskSolved(mturk = false) {
        if (mturk) {
            return this.numberOfChosenCandidates() === this.associations;
        }
        return !this.candidates.map((candidate: Candidate) => candidate.userChoice === candidate.answer).includes(false)
    }

    getHint() {
        if (this.isTaskSolved()) {
            return '';
        } else {
            if (this.numberOfChosenCandidates() !== this.associations) {
                return 'Please choose ' + this.associations + ' candidates';
            } else {
                return 'Candidates should be associated with the word ' + this.cue[0];
            }
        }
    }

    clearCandidates() {
        this.candidates.forEach((candidate: Candidate) => candidate.userChoice = false);
    }

    numberOfChosenCandidates() {
        return this.candidates.map((candidate: Candidate) => candidate.userChoice).filter((elem) => elem).length;
    }

    getUUID() {
        return this.candidates.map(candidate => candidate.img).sort().join('-') + this.cue.join('-');
    }

    getJSON() {
        return {...this};
    }
}