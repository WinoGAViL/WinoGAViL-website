import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Candidate} from '../types/candidate';
import {Observable, of} from 'rxjs';
import {GiveTheCueTask} from '../types/give-the-cue-task';
import {GuessTheAssociationsTask} from '../types/guess-the-associations-task';
import {catchError, map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {UserStats} from '../types/user-stats';
import firebase from 'firebase';
import User = firebase.User;

// mock

function getMock(task: GiveTheCueTask): {score: number, prediction: string[]} {
    const shuffle = [...task.candidates[0]].sort(() => 0.5 - Math.random()).map(candidate => candidate.img)
    const selected = shuffle.slice(0, task.numberOfChosenCandidates(0))
    const userChoice = task.candidates[0].filter((candidate: Candidate) => candidate.userChoice).map((candidate: Candidate) => candidate.img)
    return {score: GiveTheCueTask.jaccard_similarity(selected, userChoice), prediction: selected}
}

const awsURL = 'https://gvlab-bucket.s3.amazonaws.com/';
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json'
});

function getImagePath(imgName: string) {
    // return awsURL+imgName+'.jpg';
    return imgName
}
// https://gvlabt-backend.herokuapp.com
// http://127t.0.0.1:1235
@Injectable()
export class ServerRequestService {

    constructor(private httpService: HttpClient,
                private authService: AuthService) {
    }
//        new GiveTheCueTask([response.candidates.map(img => new Candidate(img)), response.candidates.map(img => new Candidate(img))], ['', ''], response.id)
    getGiveTheCue(id, example: boolean=false): Observable<GiveTheCueTask> {
        // const url = example ? `https://gvlab-backend.herokuapp.com/task/example/create/${id}` : `https://gvlab-backend.herokuapp.com/task/mturk/create/${id}`
        const url = `https://gvlab-backend.herokuapp.com/task/mturk/create/${id}`
        return this.httpService.get<any>(url, { withCredentials: true }).pipe(map((task) => {
            return this.createNewGiveTheCueTask(task);
        }));
    }

    getRandomGiveTheCue(candidates = 5): Observable<GiveTheCueTask> {
        const url = `https://gvlab-backend.herokuapp.com/task/example/random_create/${candidates}`;
        return this.httpService.get<any>(url).pipe(map((task) => {
            return this.createNewGiveTheCueTask(task);
        }));
    }

    getGiveTheCueGameTask(candidates = 5): Observable<GiveTheCueTask> {
        const url = `https://gvlab-backend.herokuapp.com/game_random_create/${candidates}`;
        return this.httpService.get<any>(url, this.authService.getAuthOptions()).pipe(
            map((task) => {
                return this.createNewGiveTheCueTask(task);
            }), catchError(err => {
                if (err.status === 401) {
                    this.authService.userLoggedIn$.next(false)
                }
                return of(err)
            }));
    }

    getGuessTheAssociationTask(id, example: boolean=false): Observable<GuessTheAssociationsTask> {
        // const url = example ? `https://gvlab-backend.herokuapp.com/task/example/solve/${id}` : `https://gvlab-backend.herokuapp.com/task/mturk/solve/${id}`
        const url = `https://gvlab-backend.herokuapp.com/task/mturk/solve_create/${id}`
        return this.httpService.get<any>(url).pipe(map((task) => {
            return this.createNewGuessTheAssociationsTask(task);
        }));
    }

    getGuessTheAssociationGameTask(candidates = 5): Observable<GiveTheCueTask> {
        const url = `https://gvlab-backend.herokuapp.com/get_create_to_solve/${candidates}`;
        return this.httpService.get<any>(url, this.authService.getAuthOptions()).pipe(
            map((task) => {
                return this.createNewGuessTheAssociationsTask(task);
            }), catchError(err => {
                if (err.status === 401) {
                    this.authService.userLoggedIn$.next(false)
                }
                return of(err)
            }));
    }

    getRandomGuessTheAssociationTask(candidates = 5): Observable<GuessTheAssociationsTask> {
        const url = `https://gvlab-backend.herokuapp.com/task/example/random_solve/${candidates}`;
        return this.httpService.get<any>(url).pipe(map((task) => {
            return this.createNewGuessTheAssociationsTask(task);
        }));
    }

    getCreateGuessTheAssociationTask(id): Observable<GuessTheAssociationsTask> {
        const url = `https://gvlab-backend.herokuapp.com/task/mturk/solve_create/${id}`
        return this.httpService.get<any>(url).pipe(map((task) => {
            return this.createNewGuessTheAssociationsTask(task);
        }));
    }

    getAIPrediction(task: GiveTheCueTask, cueIndex=0): void {
        this.httpService.post('https://gvlab-backend.herokuapp.com/create', task.getPredictionFormat(cueIndex)).subscribe((response: any) => {
            task.setAIAnswers(response.clip_predictions, cueIndex)
            task.setScore(response.human_score, cueIndex)
        })
    }

    getAIPredictionGame(task: GiveTheCueTask, cueIndex=0): void {
        this.httpService.post('https://gvlab-backend.herokuapp.com/create_game', task.getGamePredictionFormat(cueIndex), this.authService.getAuthOptions()).subscribe((response: any) => {
            task.setAIAnswers(response.clip_predictions, cueIndex)
            task.setScore(response.human_score, cueIndex)
        })
    }
    // gvl2ab-backend.herokuapp.com
    solveGame(task: GuessTheAssociationsTask): void {
        const url = 'https://gvlab-backend.herokuapp.com/solve_game'
        this.httpService.post(url, task.getSolveFormat(), this.authService.getAuthOptions()).subscribe((response: any) => {
            console.log('Solved successfully')
        })
    }

    sendReportForm(data: object) {
        this.httpService.post('https://gvlab-backend.herokuapp.com/report', JSON.stringify(data), {headers}).subscribe((response: any) => {
            console.log('Report form was sent')
        })
    }

    createNewGuessTheAssociationsTask(task): GuessTheAssociationsTask {
        const id = task.ID === undefined ? task.id : task.ID
        return new GuessTheAssociationsTask(task.candidates.map((img, index) => new Candidate(getImagePath(img), task.candidates_original[index], task.associations.includes(img))), [task.cue], task.num_associations, id);
    }

    createNewGiveTheCueTask(task): GiveTheCueTask {
        const id = task.ID === undefined ? task.id : task.ID
        return new GiveTheCueTask([task.candidates.map((img, index) => new Candidate(getImagePath(img), task.candidates_original[index])), task.candidates.map((img, index) => new Candidate(getImagePath(img), task.candidates_original[index]))], ['', ''], id);
    }

    getLeaderboard(): Observable<UserStats[]> {
        const url = `https://gvlab-backend.herokuapp.com/leaderboard`
        return this.httpService.get<any>(url).pipe(map((leaderboard: any[]) => {
            return leaderboard.map(((serverUserDetails, index) => new UserStats(index+1, serverUserDetails?.player_username, serverUserDetails['fool-the-ai'], serverUserDetails['solvable-by-humans'], serverUserDetails['solving-existing-associations'])));
        }));
    }
}
