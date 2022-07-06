import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {UserStats} from '../../types/user-stats';
import {LeaderboardService} from '../../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  isCollapsed = true;
  leaderboard$: Observable<UserStats[]>
  constructor(private leaderboardService: LeaderboardService) {
    this.leaderboard$ = this.leaderboardService.leaderboard;
  }

  ngOnInit(): void {
  }

}
