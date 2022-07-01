import {Candidate} from './candidate';
import {Jsonable} from './jsonable';
import {TaskTypeEnum} from './task-type.enum';

export class GuessTheAssociationsTask implements Jsonable {
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

    static jaccard_similarity(list1: string[], list2: string[]): number {
        const intersection = list1.filter(item => list2.includes(item));
        return Number((((intersection.length) / (new Set([...list1, ...list2])).size) * 100).toFixed(0));
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

    getHint(game = false) {
        if (this.isTaskSolved()) {
            return '';
        } else {
            if (this.numberOfChosenCandidates() !== this.associations) {
                return 'Please choose ' + this.associations + ' candidates';
            } else if (!game) {
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

    getUserChoices() {
        return this.candidates.filter((candidate) => candidate.userChoice).map(candidate => candidate.name)
    }

    getLabels() {
        return this.candidates.filter(candidate => candidate.answer).map(candidate => candidate.name)
    }

    getSolveFormat() {
        const userChoice = this.getUserChoices();
        const labels = this.getLabels();
        return {
            association_id: this.id,
            associations: this.candidates.map(candidate => candidate.name),
            candidates: this.candidates.map(candidate => candidate.name),
            user_predictions: userChoice, // add
            labels, // add
            jaccard: GuessTheAssociationsTask.jaccard_similarity(userChoice, labels), // add
            cue: this.cue[0], // add
            type: 'solve_game'
        }
        // "association_id": 1,
        //     "candidates": ["bear", "bee", "bride", "drums", "hockey"],
        //     "labels": ["bear", "bee"],
        //     "user_predictions": ["bride", "bee"],
        //     "jaccard": 33,
        //     "cue": "RONRONRON",
        //     "type": "solve_game"
    }
}