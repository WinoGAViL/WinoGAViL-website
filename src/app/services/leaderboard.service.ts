import {Injectable} from '@angular/core';
import {ServerRequestService} from './server-request.service';
import {UserStats} from '../types/user-stats';
import {BehaviorSubject, interval, ReplaySubject, timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class LeaderboardService {
    pollInterval = 30 * 1000;
    leaderboard: BehaviorSubject<UserStats[]> = new BehaviorSubject([])

    constructor(private requestService: ServerRequestService) {
    }

    init() {
        timer(0, this.pollInterval)
            .pipe(switchMap(some => this.requestService.getLeaderboard()))
            .subscribe((leaderboard) => this.leaderboard.next(leaderboard))
    }
}