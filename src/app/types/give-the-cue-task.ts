import {Candidate} from './candidate';
import {TaskTypeEnum} from './task-type.enum';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';
import {Jsonable} from './jsonable';

export class GiveTheCueTask implements Jsonable {
    id: string;
    candidates: Candidate[][];
    type: TaskTypeEnum.GIVE_THE_CUE;
    _userCue: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['', '']);
    private score$: BehaviorSubject<[number, number]> = new BehaviorSubject<[number, number]>([null, null]);
    receivedAIResponse: boolean[] = [false, false];

    constructor(candidates: Candidate[][], userCue: string[] = ['', ''], id: string='') {
        this.id = id;
        this.candidates = candidates;
        this._userCue.next(userCue);
    }

    static clone(task: GiveTheCueTask) {
        return new GiveTheCueTask(JSON.parse(JSON.stringify(task.candidates)), task._userCue.value, task.id);
    }

    static jaccard_similarity(list1: string[], list2: string[]): number {
        const intersection = list1.filter(item => list2.includes(item));
        return Number((((intersection.length) / (new Set([...list1, ...list2])).size) * 100).toFixed(0));
    }

    setScore(score: number, cueIndex = 0) {
        this.score$.next(cueIndex === 0 ? [score, this.score$.value[1]] : [this.score$.value[0], score]);
    }

    init(cueIndex=0) {
        this._userCue.next(cueIndex ? [this._userCue.value[0], ''] : ['', this._userCue.value[1]]);
        this.setScore(null, cueIndex)
        this.receivedAIResponse[cueIndex] = false;
        this.clearCandidates(cueIndex);
    }

    setUserCue(cue: string, index: number = 0) {
        this._userCue.value[index] = cue;
        this._userCue.next(this._userCue.value);
    }

    setAIAnswers(prediction: string[], cueIndex = 0) {
        if (prediction && prediction.length >= 2) {
            this.receivedAIResponse[cueIndex] = true;
            this.candidates[cueIndex].forEach((candidate: Candidate) => prediction
                .filter(image => image.toLowerCase() === candidate.name).length && (candidate.answer = true));
        } else {
            console.warn('Predictions received are not valid')
            console.warn(prediction)
        }
    }

    isTaskSolved(cueIndex = 0) {
        return this.isUserChooseCandidates(cueIndex) && this.isUserEnteredCue(cueIndex);
    }

    private isUserChooseCandidates(cueIndex) {
        const numberOfChosenCandidates = this.numberOfChosenCandidates(cueIndex);
        return numberOfChosenCandidates === 2 || numberOfChosenCandidates === 3 || ((this.candidates[0].length) > 5 ? numberOfChosenCandidates === 4 : false) ||
            ((this.candidates[0].length) === 10 ? numberOfChosenCandidates === 5 : false) || ((this.candidates[0].length) === 12 ? numberOfChosenCandidates === 6 : false);
    }

    private isUserEnteredCue(cueIndex) {
        if (cueIndex === 1) {
            return this._userCue.value[cueIndex].length > 1 && (this._userCue.value[cueIndex]?.toLowerCase() !== this._userCue.value[0]?.toLowerCase());
        }
        return this._userCue.value[cueIndex].length > 1
    }

    getHint(cueIndex=0) {
        if (this.isTaskSolved(cueIndex)) {
            return '';
        } else {
            if (!this.isUserChooseCandidates(cueIndex)) {
                if (this.candidates[0].length >= 12) {
                    return 'Please choose 2-6 candidates'
                } else if (this.candidates[0].length >= 9) {
                    return 'Please choose 2-5 candidates'
                } else if (this.candidates[0].length > 5) {
                    return 'Please choose 2-4 candidates';
                } else {
                    return 'Please choose 2-3 candidates';
                }
            } else if (cueIndex === 1 && (this._userCue.value[cueIndex]?.toLowerCase() === this._userCue.value[0]?.toLowerCase())) {
                return 'Please enter another cue, you have already entered this one.';
            } else if (this._userCue.value[cueIndex].length === 1) {
                return 'Please enter a longer cue.';
            } else {
                return 'Please enter a cue';
            }
        }
    }

    clearCandidates(cueIndex) {
        this.candidates[cueIndex].forEach((candidate: Candidate) => {
            candidate.userChoice = false;
            candidate.answer = false;
        });
    }

    numberOfChosenCandidates(cueIndex) {
        return this.candidates[cueIndex].map((candidate: Candidate) => candidate.userChoice).filter((elem) => elem).length;
    }

    getFilteredScore(cueIndex = 0): Observable<number> {
        return this.score$.pipe(map((scores: number[]) => scores[cueIndex]), filter(num => num !== null), take(1))
    }

    getUserAssociations() {
        return [
            this.candidates[0].map(candidate => candidate.userChoice).filter((elem) => elem).length,
            this.candidates[1].map(candidate => candidate.userChoice).filter((elem) => elem).length
        ]
    }

    getJSON(): object {
        return {
            ...this,
            score: this.score$.value,
            associations: this.getUserAssociations(),
            score$: undefined,
            userCue: this._userCue.value,
            receivedAIResponse: undefined,
            _userCue: undefined
        }
    }

    getPredictionFormat(cueIndex: number): object {
        const images = this.candidates[cueIndex].map((candidate) => candidate.name)
        const userAssociations = this.candidates[cueIndex].filter((candidate) => candidate.userChoice)
                .map((candidate) => candidate.name);
        const annotations: any[] = [
            {cue: this._userCue.value[cueIndex], num_associations: userAssociations.length, labels: userAssociations},
        ]
        return {images, type: 'create_mturk', annotations};
    }

    getGamePredictionFormat(cueIndex: number): object {
        const images = this.candidates[cueIndex].map((candidate) => candidate.name)
        const userAssociations = this.candidates[cueIndex].filter((candidate) => candidate.userChoice)
            .map((candidate) => candidate.name);
        return {images, type: 'create_game', cue: this._userCue.value[cueIndex], num_associations: this.numberOfChosenCandidates(cueIndex), labels: userAssociations};
    }
}